import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRight, Loader2, Search, X } from "lucide-react";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/actualites/")({
  head: () => ({
    meta: [
      { title: "Perspectives — FALL Trading and Investing" },
      { name: "description", content: "Nos convictions sur l'innovation, l'IA, l'investissement et l'entrepreneuriat en Afrique." },
      { property: "og:title", content: "Perspectives — FALL Trading and Investing" },
      { property: "og:description", content: "Innovation, IA, investissement — nos convictions." },
    ],
  }),
  component: Perspectives,
});

type Article = {
  id: string; slug: string; title: string; excerpt: string | null;
  category: string | null; cover_url: string | null; published_at: string | null;
};

function Perspectives() {
  const [q, setQ] = useState("");
  const trimmed = q.trim();

  const list = useQuery({
    queryKey: ["articles", "published"],
    queryFn: async (): Promise<Article[]> => {
      const { data, error } = await supabase
        .from("articles")
        .select("id, slug, title, excerpt, category, cover_url, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Article[];
    },
  });

  const search = useQuery({
    queryKey: ["articles", "search", trimmed],
    enabled: trimmed.length >= 2,
    queryFn: async (): Promise<Article[]> => {
      const { data, error } = await supabase.rpc("search_articles", { _query: trimmed, _limit: 30 });
      if (error) throw error;
      return (data ?? []) as Article[];
    },
  });

  const items = trimmed.length >= 2 ? (search.data ?? []) : (list.data ?? []);
  const loading = trimmed.length >= 2 ? search.isLoading : list.isLoading;

  const categories = useMemo(() => {
    const set = new Set<string>();
    (list.data ?? []).forEach((a) => { if (a.category) set.add(a.category); });
    return Array.from(set);
  }, [list.data]);

  return (
    <div>
      <PageHeader
        eyebrow="// perspectives"
        title={<>Nos <span className="italic text-gradient-ai">convictions</span></>}
        lead="Innovation, intelligence artificielle, investissement et entrepreneuriat en Afrique. Une lecture de fond, mise à jour par notre équipe éditoriale."
      />

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher dans les perspectives…"
              className="w-full rounded-full border border-input bg-background py-2.5 pl-10 pr-9 text-sm focus:border-gold focus:outline-none"
              aria-label="Recherche d'articles"
            />
            {q && (
              <button onClick={() => setQ("")} aria-label="Effacer" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-secondary">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {categories.slice(0, 6).map((c) => (
                <button key={c} onClick={() => setQ(c)}
                  className="rounded-full border border-border bg-secondary/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {trimmed.length >= 2 && !loading && (
          <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {items.length} résultat{items.length > 1 ? "s" : ""} pour <span className="text-foreground">« {trimmed} »</span>
          </p>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
            {trimmed.length >= 2 ? "Aucun article ne correspond à cette recherche." : "Les premières publications arrivent très prochainement."}
          </div>
        ) : (
          <div className="space-y-px overflow-hidden rounded-2xl border border-border bg-border">
            {items.map((a, idx) => (
              <Link to="/actualites/$slug" params={{ slug: a.slug }} key={a.id}
                className="group block bg-card p-8 transition-colors hover:bg-secondary/70 sm:p-10">
                <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-cyan/30 bg-cyan/5 font-mono text-xs text-cyan">
                    #{String(idx + 1).padStart(2, "0")}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
                      <span>{a.category ?? "Insight"}</span>
                      {a.published_at && <span className="text-muted-foreground">· {new Date(a.published_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}</span>}
                    </div>
                    <h3 className="mt-2 font-display text-2xl leading-tight sm:text-3xl">{a.title}</h3>
                    {a.excerpt && <p className="mt-3 text-sm leading-relaxed text-foreground/75 sm:text-base">{a.excerpt}</p>}
                    <div className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-foreground/60 group-hover:text-gold">
                      Lire <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
