import { createFileRoute } from "@tanstack/react-router";
import { computeBrvmSnapshot } from "@/lib/brvm.functions";

export const Route = createFileRoute("/api/public/hooks/brvm-poll")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Soft check: require apikey header (publishable key) to discourage casual abuse.
        const apikey = request.headers.get("apikey") || request.headers.get("x-api-key");
        const expected = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (expected && apikey !== expected) {
          return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
        }
        const snap = await computeBrvmSnapshot();
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin.from("brvm_snapshots").insert({
          source: snap.source,
          fetched_at: snap.fetched_at,
          message: snap.message,
          quotes: snap.quotes,
          reference_url: snap.reference_url,
        });
        if (error) {
          return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
        }
        return new Response(JSON.stringify({ ok: true, source: snap.source, fetched_at: snap.fetched_at }), { headers: { "Content-Type": "application/json" } });
      },
      GET: async () => new Response(JSON.stringify({ ok: true, hint: "POST with apikey header" }), { headers: { "Content-Type": "application/json" } }),
    },
  },
});
