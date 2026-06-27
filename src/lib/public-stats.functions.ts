import { createServerFn } from "@tanstack/react-start";

export type PublicStats = {
  platforms_count: number;
  total_users: number;
  articles_count: number;
  last_publication_at: string | null;
};

export const getPublicStats = createServerFn({ method: "GET" })
  .inputValidator((data?: Record<string, never>) => data ?? {})
  .handler(async (): Promise<PublicStats> => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

      const [platformsRes, articlesRes, lastPlatformRes, lastArticleRes] = await Promise.all([
        supabaseAdmin.from("platforms").select("id, users_count", { count: "exact" }).eq("status", "active"),
        supabaseAdmin.from("articles").select("id", { count: "exact", head: true }).eq("status", "published"),
        supabaseAdmin.from("platforms").select("last_release_at").eq("status", "active").order("last_release_at", { ascending: false, nullsFirst: false }).limit(1).maybeSingle(),
        supabaseAdmin.from("articles").select("published_at").eq("status", "published").order("published_at", { ascending: false, nullsFirst: false }).limit(1).maybeSingle(),
      ]);

      const platforms = platformsRes.data ?? [];
      const total_users = platforms.reduce((acc, p: { users_count: number | null }) => acc + (p.users_count ?? 0), 0);

      const candidates = [lastPlatformRes.data?.last_release_at, lastArticleRes.data?.published_at]
        .filter((v): v is string => !!v)
        .sort()
        .reverse();

      return {
        platforms_count: platformsRes.count ?? platforms.length,
        total_users,
        articles_count: articlesRes.count ?? 0,
        last_publication_at: candidates[0] ?? null,
      };
    } catch {
      return { platforms_count: 0, total_users: 0, articles_count: 0, last_publication_at: null };
    }
  });

export type SitemapData = {
  platform_slugs: string[];
  article_slugs: { slug: string; published_at: string | null }[];
};

export const getSitemapData = createServerFn({ method: "GET" })
  .inputValidator((data?: Record<string, never>) => data ?? {})
  .handler(async (): Promise<SitemapData> => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const [pRes, aRes] = await Promise.all([
        supabaseAdmin.from("platforms").select("slug").eq("status", "active"),
        supabaseAdmin.from("articles").select("slug, published_at").eq("status", "published"),
      ]);
      return {
        platform_slugs: (pRes.data ?? []).map((r: { slug: string }) => r.slug),
        article_slugs: (aRes.data ?? []).map((r: { slug: string; published_at: string | null }) => ({ slug: r.slug, published_at: r.published_at })),
      };
    } catch {
      return { platform_slugs: [], article_slugs: [] };
    }
  });
