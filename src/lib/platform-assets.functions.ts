import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const BUCKET = "platform-assets";

async function assertStaff(ctx: { supabase: any; userId: string }) {
  const { data: isAdmin } = await ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role: "admin" });
  if (isAdmin) return;
  const { data: isEditor } = await ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role: "editor" });
  if (!isEditor) throw new Error("Forbidden");
}

/** Upload a base64-encoded file to platform-assets. Returns the stored path. */
export const uploadPlatformAsset = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { filename: string; contentType: string; base64: string; platformSlug?: string; kind?: "logo" | "cover" }) => input)
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const ext = (data.filename.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5);
    const folder = (data.platformSlug || "shared").replace(/[^a-z0-9-]/gi, "-").toLowerCase();
    const kind = data.kind || "logo";
    const path = `${folder}/${kind}-${Date.now()}.${ext || "bin"}`;
    const bin = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, bin, {
      contentType: data.contentType || "application/octet-stream",
      upsert: false,
    });
    if (error) throw new Error(error.message);
    return { path: `signed://${path}` };
  });

/** Get a fresh signed URL for an asset path (signed:// prefix optional). */
export const getSignedAssetUrl = createServerFn({ method: "POST" })
  .inputValidator((input: { path: string; expiresIn?: number }) => input)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const clean = data.path.replace(/^signed:\/\//, "");
    const expiresIn = Math.min(Math.max(data.expiresIn ?? 3600, 60), 7 * 24 * 3600);
    const { data: signed, error } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(clean, expiresIn);
    if (error || !signed) throw new Error(error?.message || "signed url failed");
    return { url: signed.signedUrl, expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString() };
  });
