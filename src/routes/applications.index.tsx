import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SignedImage } from "@/components/SignedImage";
import ndey from "@/assets/ndey-pharma.png";
import life from "@/assets/life-estudiantin.png";
import sama from "@/assets/samamenu.png";

const fallbackLogo: Record<string, string> = {
  "ndey-pharma": ndey,
  "life-estudiantin": life,
  "samamenu": sama,
};

export const Route = createFileRoute("/applications/")({
  head: () => ({
    meta: [
      { title: "Applications & Plateformes — FALL Trading and Investing" },
      { name: "description", content: "Doctor NDEY Pharma, Life Estudiantin et SamaMenu — plateformes mobiles développées par FALL Trading and Investing." },
      { property: "og:title", content: "Nos plateformes web & mobiles" },
      { property: "og:description", content: "Santé, vie étudiante et restauration — nos applications numériques." },
    ],
  }),
  component: AppsList,
});

function formatUsers(n: number | null | undefined): string {
  if (n == null || n <= 0) return "À publier";
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}
function formatRel(iso: string | null | undefined): string {
  if (!iso) return "À renseigner";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const diff = Date.now() - d.getTime();
  const day = 86400000;
  if (diff < day) return "aujourd'hui";
  if (diff < 2 * day) return "hier";
  if (diff < 7 * day) return `il y a ${Math.floor(diff / day)} j`;
  if (diff < 30 * day) return `il y a ${Math.floor(diff / (7 * day))} sem.`;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function AppsList() {
  const { data, isLoading } = useQuery({
    queryKey: ["platforms", "active"],
    queryFn: async () => {
      const { data, error } = await supabase.from("platforms").select("*").eq("status", "active").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div>
      <PageHeader
        eyebrow="// applications_deployees"
        title={<>Plateformes <span className="italic text-gradient-ai">web & mobiles</span></>}
        lead="Des produits réellement déployés, conçus et opérés depuis Dakar, pour transformer les usages en santé, éducation et restauration."
      />

      <section className="mx-auto max-w-7xl px-6 pb-20">
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-6 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible">
            {(data ?? []).map((p) => {
              const route = `/applications/${p.slug}`;
              const logo = p.logo_url || fallbackLogo[p.slug] || "";
              const color = p.color || "#0EA5E9";
              return (
                <a key={p.id} href={route}
                  className="group flex w-[280px] shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-2xl md:w-auto"
                  style={{ borderColor: undefined }}
                >
                  <div className="flex h-40 items-center justify-center p-6" style={{ background: `linear-gradient(135deg, ${color}18, ${color}05)` }}>
                    {logo && <SignedImage src={logo} alt={p.name} className="max-h-full max-w-full object-contain" fallback={fallbackLogo[p.slug]} />}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color }}>{p.tagline ?? "Plateforme"}</div>
                    <h3 className="mt-1.5 font-display text-xl leading-tight">{p.name}</h3>
                    {p.description && <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{p.description}</p>}

                    <dl className="mt-4 grid grid-cols-2 gap-2 rounded-lg border border-border bg-secondary/40 p-3 text-[11px]">
                      <div>
                        <dt className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Utilisateurs</dt>
                        <dd className="mt-0.5 font-display text-base text-foreground">{formatUsers((p as any).users_count)}</dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Dernière activité</dt>
                        <dd className="mt-0.5 text-foreground/90">{formatRel((p as any).last_activity_at)}</dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Dernière mise à jour</dt>
                        <dd className="mt-0.5 text-foreground/90">{formatRel((p as any).last_release_at)}</dd>
                      </div>
                    </dl>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(p.tech_stack ?? []).slice(0, 4).map((t: string) => (
                        <span key={t} className="rounded border border-border bg-secondary/60 px-1.5 py-0.5 font-mono text-[9px] text-foreground/70">{t}</span>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-border pt-3 font-mono text-[10px] uppercase tracking-widest">
                      <span className="text-muted-foreground">{p.audience ? p.audience.split(",")[0] : "Découvrir"}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color }} />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        <p className="mt-8 text-center font-mono text-[11px] text-muted-foreground">
          → plateformes utilisées au quotidien · Dakar · 2022–{new Date().getFullYear()}
        </p>

        <div className="mt-16 grid gap-4 rounded-2xl border border-cyan/30 bg-gradient-to-br from-cyan/5 to-violet/5 p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan">// ia_native</div>
            <h3 className="mt-2 font-display text-2xl">Nos applications intègrent l'intelligence artificielle</h3>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">OCR d'ordonnances, recommandations contextuelles, automatisation des flux opérationnels — l'IA n'est pas un module séparé, elle est tissée dans chaque produit que nous concevons.</p>
          </div>
          <Link to="/contact" className="rounded-full bg-ink px-6 py-3 text-xs uppercase tracking-widest text-primary-foreground">Discuter d'un projet</Link>
        </div>
      </section>
    </div>
  );
}
