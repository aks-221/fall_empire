import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { getBrvmSnapshot, getBrvmHistory } from "@/lib/brvm.functions";
import { PageHeader } from "@/components/PageHeader";
import { Activity, ExternalLink, RefreshCw, AlertTriangle, CheckCircle2, Search } from "lucide-react";

export const Route = createFileRoute("/donnees-brvm")({
  head: () => ({
    meta: [
      { title: "Données BRVM — Source & horodatage · FALL Trading and Investing" },
      { name: "description", content: "Origine, horodatage et statut live/fallback des données boursières BRVM affichées sur le site. Liens officiels cliquables." },
      { property: "og:title", content: "Données BRVM — transparence" },
      { property: "og:description", content: "Source, statut et horodatage des données BRVM." },
    ],
  }),
  component: DonneesBrvm,
});

function DonneesBrvm() {
  const brvmFn = useServerFn(getBrvmSnapshot);
  const histFn = useServerFn(getBrvmHistory);
  const q = useQuery({
    queryKey: ["brvm-snapshot", "live"],
    queryFn: () => brvmFn({ data: {} }),
    refetchInterval: 5 * 60_000,
    refetchOnWindowFocus: true,
    staleTime: 60_000,
  });
  const h = useQuery({
    queryKey: ["brvm-history"],
    queryFn: () => histFn({ data: { limit: 20 } }),
    refetchInterval: 5 * 60_000,
    staleTime: 60_000,
  });

  const snap = q.data;
  const source = snap?.source ?? "fallback";
  const isLive = source === "live";

  const [filter, setFilter] = useState("");
  const filteredQuotes = useMemo(() => {
    const all = snap?.quotes ?? [];
    const f = filter.trim().toLowerCase();
    if (!f) return all;
    return all.filter((q) => `${q.sym} ${q.name} ${q.sector}`.toLowerCase().includes(f));
  }, [snap, filter]);

  return (
    <div>
      <PageHeader
        eyebrow="// donnees_brvm"
        title={<>Données BRVM — <span className="italic text-gradient-ai">transparence & sources</span></>}
        lead="Origine, horodatage et statut de la connexion à la Bourse Régionale des Valeurs Mobilières (UEMOA). Tous les liens officiels sont cliquables."
      />

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="glass-strong grid gap-4 rounded-2xl border border-border p-6 md:grid-cols-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Statut</div>
            <div className="mt-1.5 flex items-center gap-2">
              {isLive ? (
                <><CheckCircle2 className="h-4 w-4 text-emerald" /> <span className="font-display text-base text-emerald">Live</span></>
              ) : (
                <><AlertTriangle className="h-4 w-4 text-gold" /> <span className="font-display text-base text-gold">Fallback</span></>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{snap?.message ?? "Chargement…"}</p>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Dernière vérification</div>
            <div className="mt-1.5 font-mono text-sm text-foreground">
              {snap ? new Date(snap.fetched_at).toLocaleString("fr-FR") : "—"}
            </div>
            <button
              onClick={() => { q.refetch(); h.refetch(); }}
              className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-[11px] uppercase tracking-widest hover:bg-secondary"
            >
              <RefreshCw className={`h-3 w-3 ${q.isFetching ? "animate-spin" : ""}`} /> Rafraîchir
            </button>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Polling serveur</div>
            <div className="mt-1.5 flex items-center gap-2 font-mono text-sm">
              <Activity className="h-3.5 w-3.5 text-azure" /> 5 minutes (pg_cron)
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Snapshots persistés en base.</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl">Sociétés sénégalaises cotées — référence</h2>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filtrer (symbole, nom, secteur)…"
                className="rounded-full border border-input bg-background py-1.5 pl-9 pr-3 text-xs focus:border-gold focus:outline-none" />
            </div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <tr><th className="py-2 pr-4">Symbole</th><th className="py-2 pr-4">Société</th><th className="py-2 pr-4">Secteur</th><th className="py-2 text-right">Cours BRVM</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredQuotes.length === 0 ? (
                  <tr><td colSpan={4} className="py-4 text-center text-xs text-muted-foreground">Aucune valeur ne correspond.</td></tr>
                ) : filteredQuotes.map((quote) => (
                  <tr key={quote.sym}>
                    <td className="py-2 pr-4 font-mono">{quote.sym}</td>
                    <td className="py-2 pr-4 font-medium">{quote.name}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{quote.sector}</td>
                    <td className="py-2 text-right">
                      <a href={snap?.reference_url ?? "https://www.brvm.org"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-azure hover:underline">
                        voir <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl">Historique des snapshots</h2>
          <p className="mt-1 text-xs text-muted-foreground">Les 20 dernières tentatives de connexion à la BRVM persistées par le serveur.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <tr><th className="py-2 pr-4">Horodatage</th><th className="py-2 pr-4">Statut</th><th className="py-2">Message</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(h.data ?? []).length === 0 ? (
                  <tr><td colSpan={3} className="py-4 text-xs text-muted-foreground">Aucun snapshot en base pour l'instant. Le polling serveur (pg_cron) démarre à la prochaine fenêtre de 5 minutes.</td></tr>
                ) : (
                  (h.data ?? []).map((row) => (
                    <tr key={row.id}>
                      <td className="py-2 pr-4 font-mono text-xs">{new Date(row.fetched_at).toLocaleString("fr-FR")}</td>
                      <td className="py-2 pr-4">
                        {row.source === "live" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-emerald"><CheckCircle2 className="h-3 w-3" /> live</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-gold"><AlertTriangle className="h-3 w-3" /> fallback</span>
                        )}
                      </td>
                      <td className="py-2 text-xs text-muted-foreground">{row.message}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl">Sources officielles</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a className="text-azure hover:underline" href="https://www.brvm.org" target="_blank" rel="noopener noreferrer">BRVM — Bourse Régionale des Valeurs Mobilières</a></li>
            <li><a className="text-azure hover:underline" href="https://www.brvm.org/fr/cours-actions/officiel" target="_blank" rel="noopener noreferrer">BRVM — cours officiels</a></li>
            <li><a className="text-azure hover:underline" href="https://www.brvm.org/fr/societes-cotees/liste" target="_blank" rel="noopener noreferrer">BRVM — liste des sociétés cotées</a></li>
            <li><a className="text-azure hover:underline" href="https://www.bceao.int" target="_blank" rel="noopener noreferrer">BCEAO — Banque Centrale des États de l'Afrique de l'Ouest</a></li>
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            La BRVM ne publie pas d'API JSON publique temps réel. En l'absence d'une telle source, le site affiche la liste de référence vérifiée ;
            l'horodatage indique la dernière tentative de connexion au site officiel.
          </p>
        </div>
      </section>
    </div>
  );
}
