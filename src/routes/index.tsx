import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import logo from "@/assets/fall-logo.jpeg";
import ndey from "@/assets/ndey-pharma.png";
import life from "@/assets/life-estudiantin.png";
import sama from "@/assets/samamenu.png";
import { supabase } from "@/integrations/supabase/client";
import { getBrvmSnapshot } from "@/lib/brvm.functions";
import { getPublicStats } from "@/lib/public-stats.functions";
import {
  ArrowUpRight,
  Banknote, Globe2, Smartphone, Sparkles, Building2, Cpu,
  TrendingUp, Activity, ShieldCheck, Brain, Zap, BarChart3, Users, FileText, Layers, Clock,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FALL Trading and Investing — Investissement, Tech & IA · Dakar" },
      { name: "description", content: "Investissement, commerce international et applications mobiles enrichies à l'IA. Renaissance de l'empire FALL, Royaume du DAMEL-TEEÑ." },
      { property: "og:title", content: "FALL Trading and Investing" },
      { property: "og:description", content: "Salle des marchés × AI lab — Investir, bâtir et coder l'Afrique de demain." },
    ],
  }),
  component: Home,
});

// Entreprises sénégalaises cotées à la Bourse Régionale des Valeurs Mobilières (BRVM, UEMOA)
// Source officielle : https://www.brvm.org — section "Sociétés cotées".
// Les cotations en direct doivent être consultées sur brvm.org (pas d'API publique gratuite temps réel).
const senegaleseListings = [
  { sym: "SNTS", name: "Sonatel", sector: "Télécommunications" },
  { sym: "BOAS", name: "Bank of Africa Sénégal", sector: "Finance · Banque" },
  { sym: "TTLS", name: "Total Sénégal", sector: "Énergie · Distribution" },
  { sym: "SDSC", name: "Sodisn / Distribution Sénégal", sector: "Distribution" },
  { sym: "ICCC", name: "SICC · Industries Chimiques", sector: "Industrie" },
  { sym: "CBIBF", name: "Crédit du Sénégal", sector: "Finance" },
];

const ticker = [
  { sym: "BRVM Composite", tag: "Indice global UEMOA", note: "8 pays" },
  { sym: "BRVM 30", tag: "Top capitalisation", note: "UEMOA" },
  { sym: "BRVM Prestige", tag: "Indice qualité", note: "UEMOA" },
  ...senegaleseListings.map((s) => ({ sym: s.sym, tag: `${s.name} · ${s.sector}`, note: "Sénégal" })),
  { sym: "FX · XOF/EUR", tag: "Parité fixe", note: "1 € = 655,957 F CFA" },
];

// Indicateurs vérifiables — pas de chiffres simulés
const kpis = [
  { label: "Siège", value: "Dakar", unit: "Sénégal", note: "Pikine · Tally Boumack 4185", icon: Globe2 },
  { label: "Établie", value: "2022", unit: "RCCM SN.DKR.A.29659", note: "NINEA 009697072", icon: Building2 },
  { label: "Plateformes opérationnelles", value: "3", unit: "applications réelles", note: "NDEY · LIFE · SAMA", icon: Smartphone },
  { label: "Domaines d'expertise", value: "4", unit: "métiers", note: "Capital · Tech · IA · Négoce", icon: Brain },
];

const services = [
  { icon: Banknote, title: "Investissement", desc: "Capital, conseil et accompagnement d'initiatives à fort potentiel en Afrique." },
  { icon: Globe2, title: "Commerce international", desc: "Import, export, négoce et intermédiation à l'échelle continentale." },
  { icon: Smartphone, title: "Applications mobiles", desc: "iOS, Android et Web — Flutter, React Native, Node.js, Supabase." },
  { icon: Cpu, title: "Intelligence artificielle", desc: "OCR, NLP, recommandation et automatisation des processus métier." },
  { icon: Building2, title: "Transformation digitale", desc: "Modernisation des opérations et souveraineté numérique africaine." },
  { icon: Sparkles, title: "Solutions cloud", desc: "Infrastructures fiables, sécurisées et prêtes à l'échelle." },
];

// Secteurs d'intervention par défaut (utilisés en fallback si la table allocations est vide).
const allocationFallback = [
  { id: "tech", label: "Technologie & IA", focus: "Modèles, OCR, NLP, plateformes", color: "#3B82F6", weight: null as number | null, source_note: null as string | null, source_url: null as string | null },
  { id: "sante", label: "Santé digitale", focus: "Doctor NDEY Pharma · OCR ordonnances", color: "#34D399", weight: null, source_note: null, source_url: null },
  { id: "edu", label: "EdTech", focus: "Life Estudiantin · vie universitaire", color: "#A78BFA", weight: null, source_note: null, source_url: null },
  { id: "food", label: "FoodTech & services", focus: "SamaMenu · QR menus, paiement", color: "#E2B044", weight: null, source_note: null, source_url: null },
  { id: "trade", label: "Commerce international", focus: "Import, export, négoce UEMOA", color: "#60A5FA", weight: null, source_note: null, source_url: null },
];

const platforms = [
  { name: "Doctor NDEY Pharma", tag: "Santé · OCR · IA", img: ndey, to: "/applications/ndey-pharma", desc: "OCR d'ordonnances et identification automatique des médicaments." },
  { name: "Life Estudiantin", tag: "EdTech · Communauté", img: life, to: "/applications/life-estudiantin", desc: "L'écosystème complet de la vie étudiante au Sénégal." },
  { name: "SamaMenu", tag: "FoodTech · QR", img: sama, to: "/applications/samamenu", desc: "Menus digitaux, commande à table et paiement intégré." },
];

// Repères sectoriels publics (sources publiques : BRVM, GSMA, OMS, UNESCO)
const signals = [
  { tag: "BRVM · UEMOA", text: "La BRVM regroupe 8 pays de l'UEMOA et plus de 45 sociétés cotées — porte d'entrée régionale pour le capital.", source: "Source : brvm.org", href: "https://www.brvm.org" },
  { tag: "Télécoms · GSMA", text: "L'Afrique subsaharienne dépasse 50 % de pénétration mobile unique.", source: "Source : GSMA Mobile Economy", href: "https://www.gsma.com/mobileeconomy/sub-saharan-africa/" },
  { tag: "Santé · OMS", text: "Accès aux médicaments et traçabilité : priorités sanitaires en Afrique de l'Ouest.", source: "Source : OMS Afrique", href: "https://www.afro.who.int/" },
  { tag: "Éducation · UNESCO", text: "Forte croissance du nombre d'étudiants dans le supérieur en zone UEMOA — besoin marqué de services numériques.", source: "Source : UNESCO UIS", href: "https://uis.unesco.org/" },
];

type PublishedAllocation = {
  id: string;
  label: string;
  focus: string | null;
  weight: number | null;
  color: string | null;
  source_note: string | null;
  source_url: string | null;
  updated_at: string;
};

function usePublishedAllocations() {
  const [items, setItems] = useState<PublishedAllocation[] | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("allocations")
        .select("id,label,focus,weight,color,source_note,source_url,updated_at")
        .eq("status", "published")
        .order("sort_order");
      if (cancelled) return;
      if (error) { setError(error.message); setItems(null); return; }
      setItems(data as PublishedAllocation[]);
      if (data && data.length > 0) {
        const max = data.reduce((a, b) => (a.updated_at > b.updated_at ? a : b));
        setLastUpdated(max.updated_at);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const list = items && items.length > 0
    ? items
    : allocationFallback.map((a) => ({ ...a, updated_at: new Date().toISOString() }));
  return { list, lastUpdated, error, isFallback: !items || items.length === 0 };
}

function Home() {
  const { list: allocation, lastUpdated, isFallback } = usePublishedAllocations();
  const brvmFn = useServerFn(getBrvmSnapshot);
  const brvm = useQuery({
    queryKey: ["brvm-snapshot"],
    queryFn: () => brvmFn({ data: {} }),
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
    staleTime: 30_000,
  });
  const brvmFetchedAt = brvm.data?.fetched_at ?? new Date().toISOString();
  const brvmSource = brvm.data?.source ?? "fallback";

  return (
    <div className="text-foreground">
      {/* TICKER BAR — BRVM (UEMOA) · symboles officiels */}
      <div className="border-y border-border bg-navy-deep/60 backdrop-blur">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border/60 px-6 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 text-gold">
            <span className={`h-1.5 w-1.5 rounded-full ${brvmSource === "live" ? "bg-emerald animate-pulse" : "bg-gold"}`} /> BRVM · UEMOA
          </span>
          <span>Bourse Régionale des Valeurs Mobilières</span>
          <span className="text-foreground/60">· dernière vérification {new Date(brvmFetchedAt).toLocaleString("fr-FR")}</span>
          <span className={`normal-case tracking-normal ${brvmSource === "live" ? "text-emerald" : "text-foreground/50"}`}>
            {brvmSource === "live" ? "(source BRVM joignable)" : "(fallback — pas d'API JSON publique BRVM)"}
          </span>
          <a href="/donnees-brvm" className="ml-auto text-azure hover:underline">détails & sources →</a>
        </div>
        <div className="flex overflow-hidden whitespace-nowrap py-2.5">
          <div className="animate-marquee flex shrink-0 gap-10 pl-10 font-mono text-[11px] uppercase tracking-widest">
            {[...ticker, ...ticker].map((t, i) => (
              <span key={i} className="inline-flex items-center gap-2">
                <span className="text-foreground">{t.sym}</span>
                <span className="text-muted-foreground">{t.tag}</span>
                <span className="text-gold">· {t.note}</span>
                <span className="text-border">/</span>
              </span>
            ))}
          </div>
        </div>
      </div>



      {/* HERO — salle des marchés + sceau royal */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid">
          <div className="absolute -top-32 left-1/4 h-[500px] w-[700px] rounded-full bg-azure/20 blur-3xl" />
          <div className="absolute top-20 right-0 h-[400px] w-[500px] rounded-full bg-violet/20 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.2fr_0.8fr] lg:pt-24">
          {/* LEFT — content */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-azure/40 bg-azure/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] text-azure">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-azure opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-azure" />
              </span>
              Live · Dakar · Investissement · IA
            </div>

            <h1 className="mt-6 font-display text-5xl leading-[1.04] sm:text-6xl lg:text-7xl">
              Investir, bâtir et coder<br />
              <span className="text-gradient-ai italic">l'Afrique de demain</span>.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              FALL Trading and Investing opère à l'intersection du <span className="text-foreground">capital</span>,
              du <span className="text-foreground">commerce international</span> et de
              l'<span className="text-foreground">intelligence artificielle</span> —
              pour transformer durablement l'économie du continent.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/investissement" className="group inline-flex items-center gap-2 rounded-full gradient-azure px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-white shadow-lg shadow-azure/30 transition-transform hover:scale-[1.02]">
                Thèses d'investissement <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link to="/applications" className="inline-flex items-center gap-2 rounded-full border border-gold/60 bg-gold/10 px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-gold hover:bg-gold/20">
                Nos plateformes
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] hover:bg-white/10">
                Nous contacter
              </Link>
            </div>

            {/* KPI mini cards — données vérifiables (siège, RCCM, plateformes) */}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {kpis.map((k) => (
                <div key={k.label} className="glass rounded-xl p-3.5">
                  <div className="flex items-center justify-between">
                    <k.icon className="h-4 w-4 text-azure" strokeWidth={1.6} />
                    <span className="font-mono text-[9px] uppercase tracking-widest text-gold/80">{k.unit}</span>
                  </div>
                  <div className="mt-2 font-display text-2xl leading-none">{k.value}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">{k.label}</div>
                  <div className="mt-1 text-[10px] text-foreground/60">{k.note}</div>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT — sceau royal + panneau IA */}
          <div className="relative">
            {/* royal seal */}
            <div className="relative mx-auto aspect-square w-full max-w-md">
              <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-gold/30" />
              <div className="absolute inset-6 animate-spin-slow rounded-full border border-azure/20 [animation-direction:reverse]" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/25 via-azure/10 to-transparent blur-2xl" />
              <div className="relative flex h-full w-full items-center justify-center">
                <div className="relative h-[78%] w-[78%] overflow-hidden rounded-full border border-gold/40 bg-navy-deep ring-gold-soft">
                  <img src={logo} alt="Logo Fall Empire" className="h-full w-full object-cover" />
                  <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-azure/10 via-transparent to-gold/10" />
                </div>
              </div>
              {/* royal badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-gold/50 bg-navy/95 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-gold backdrop-blur">
                Royaume du DAMEL-TEEÑ
              </div>
              {/* floating chips */}
              <div className="glass absolute -left-4 top-6 hidden rounded-lg px-3 py-2 sm:block">
                <div className="font-mono text-[9px] uppercase tracking-widest text-azure">// model_v3</div>
                <div className="font-display text-sm">OCR pharma</div>
              </div>
              <div className="glass absolute -right-4 bottom-16 hidden rounded-lg px-3 py-2 sm:block">
                <div className="font-mono text-[9px] uppercase tracking-widest text-violet">// secteur</div>
                <div className="font-display text-sm">EdTech · Sénégal</div>
              </div>
            </div>

            {/* Veille sectorielle — repères publics, pas de signaux fictifs */}
            <div className="glass-strong mt-8 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-violet">
                  <Brain className="h-3.5 w-3.5" /> // veille_sectorielle
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">sources publiques</span>
              </div>
              <ul className="mt-3 space-y-2.5">
                {signals.slice(0, 3).map((s) => (
                  <li key={s.text} className="border-l border-gold/40 pl-3">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-gold">{s.tag}</div>
                    <div className="mt-0.5 text-xs leading-relaxed text-foreground/90">{s.text}</div>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="mt-0.5 inline-block font-mono text-[10px] text-azure hover:underline">{s.source} →</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <PublicStatsStrip />

      {/* BRVM — Entreprises sénégalaises cotées */}
      <section className="border-b border-border bg-navy-deep/40">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">// brvm · senegal</div>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">Entreprises sénégalaises cotées à la BRVM</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Données de référence basées sur la liste publique des sociétés cotées à la Bourse Régionale des Valeurs Mobilières (UEMOA).
                Les cotations en direct sont disponibles sur le site officiel de la BRVM.
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 text-right font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>Dernière vérification : {new Date(brvmFetchedAt).toLocaleString("fr-FR")}</span>
              <span className={brvmSource === "live" ? "text-emerald normal-case tracking-normal" : "normal-case tracking-normal"}>
                {brvmSource === "live" ? "Source BRVM joignable" : "Mode fallback — données de référence"}
              </span>
              <a href="https://www.brvm.org/fr/cours-actions/officiel" target="_blank" rel="noopener noreferrer" className="text-azure hover:underline normal-case tracking-normal">brvm.org · cours officiels →</a>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-border glass-strong">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.04] font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Symbole</th>
                  <th className="px-4 py-3">Société</th>
                  <th className="px-4 py-3">Secteur</th>
                  <th className="px-4 py-3 text-right">Référence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {senegaleseListings.map((s) => (
                  <tr key={s.sym} className="transition-colors hover:bg-white/[0.03]">
                    <td className="px-4 py-3 font-mono text-foreground">{s.sym}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{s.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.sector}</td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={`https://www.brvm.org/fr/cours-actions/officiel`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-azure hover:underline text-xs"
                      >cours BRVM →</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Source : <a href="https://www.brvm.org/fr/societes-cotees/liste" target="_blank" rel="noopener noreferrer" className="text-azure hover:underline">BRVM — liste des sociétés cotées</a>.
            En cas d'indisponibilité du flux temps réel, ce tableau sert de référence statique vérifiable.
          </p>
        </div>
      </section>


      <section className="border-y border-border bg-navy/60">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-16 lg:grid-cols-[1fr_1.3fr]">
          {/* Secteurs */}
          <div className="glass-strong rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">// secteurs_d_intervention</div>
                <h3 className="mt-1 font-display text-2xl">Nos secteurs</h3>
              </div>
              <BarChart3 className="h-5 w-5 text-gold" />
            </div>
            <ul className="mt-6 space-y-3">
              {allocation.map((a) => (
                <li key={a.id} className="flex items-start gap-3 rounded-lg border border-border/60 bg-white/[0.02] p-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: a.color ?? "#999" }} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="text-sm font-medium text-foreground">{a.label}</div>
                      {a.weight != null && <div className="font-mono text-xs text-gold">{a.weight}%</div>}
                    </div>
                    <div className="text-xs text-muted-foreground">{a.focus}</div>
                    {a.source_url && (
                      <a href={a.source_url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block font-mono text-[10px] text-azure hover:underline">
                        {a.source_note ?? "Source"} →
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-4 font-mono text-[10px] uppercase tracking-widest">
              <div><div className="text-muted-foreground">Horizon</div><div className="mt-1 font-display text-base normal-case tracking-normal text-foreground">Long terme</div></div>
              <div><div className="text-muted-foreground">Zone</div><div className="mt-1 font-display text-base normal-case tracking-normal text-foreground">UEMOA</div></div>
              <div><div className="text-muted-foreground">Stade</div><div className="mt-1 font-display text-base normal-case tracking-normal text-foreground">Early stage</div></div>
            </div>
            <p className="mt-4 text-[11px] text-muted-foreground">
              {isFallback
                ? "Affichage par défaut — connectez-vous à l'admin pour éditer les allocations."
                : `Mise à jour : ${lastUpdated ? new Date(lastUpdated).toLocaleString("fr-FR") : "—"}.`}
              {" "}Cadre régional : <a href="https://www.brvm.org" target="_blank" rel="noopener noreferrer" className="text-azure hover:underline">BRVM</a>,{" "}
              <a href="https://www.bceao.int" target="_blank" rel="noopener noreferrer" className="text-azure hover:underline">BCEAO</a>.
            </p>
          </div>


          {/* Thèses */}
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-azure">// theses_d_investissement</div>
            <h3 className="mt-1 font-display text-3xl sm:text-4xl">Là où nous plaçons notre conviction</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { icon: Brain, title: "IA souveraine africaine", desc: "Modèles, OCR et NLP entraînés pour les usages locaux." },
                { icon: ShieldCheck, title: "Souveraineté numérique", desc: "Infrastructure, données et identité maîtrisées." },
                { icon: TrendingUp, title: "Adoption mobile-first", desc: "Le mobile comme porte d'entrée du commerce et des services." },
                { icon: Zap, title: "Économie réelle digitalisée", desc: "Santé, éducation, restauration, distribution, logistique." },
              ].map((t) => (
                <div key={t.title} className="glass group rounded-xl p-4 transition-colors hover:bg-white/10">
                  <div className="flex items-center gap-2">
                    <t.icon className="h-4 w-4 text-gold" strokeWidth={1.6} />
                    <div className="font-display text-lg">{t.title}</div>
                  </div>
                  <div className="mt-2 text-xs leading-relaxed text-muted-foreground">{t.desc}</div>
                </div>
              ))}
            </div>
            <Link to="/investissement" className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-azure hover:text-foreground">
              Lire les thèses complètes <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">// nos_metiers</div>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl">Six métiers, une ambition</h2>
          </div>
          <Link to="/services" className="text-sm text-azure underline-offset-4 hover:underline">Voir tous les services →</Link>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <div key={s.title} className="group relative bg-card p-8 transition-colors hover:bg-secondary">
              <div className="flex items-center justify-between">
                <s.icon className="h-7 w-7 text-gold" strokeWidth={1.4} />
                <span className="font-mono text-[10px] text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="mt-6 font-display text-2xl">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PLATFORMS — trading-card style */}
      <section className="relative overflow-hidden border-y border-border bg-navy-deep py-24">
        <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-50" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold">// nos_realisations</div>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl">Nos applications réelles</h2>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                Disponibles sur le <span className="text-foreground">web</span> et en <span className="text-foreground">application mobile</span> —
                trois produits que vous pouvez utiliser dès aujourd'hui : santé, vie étudiante et restauration au Sénégal.
              </p>
            </div>
            <Link to="/applications" className="rounded-full border border-gold/40 px-5 py-2.5 text-xs uppercase tracking-widest text-gold hover:bg-gold/10">
              Voir toutes les plateformes →
            </Link>
          </div>

          <div className="mt-10 flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-3 md:gap-5 md:overflow-visible">
            {platforms.map((p) => (
              <Link
                key={p.name}
                to={p.to}
                className="group relative flex w-[280px] shrink-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-4 transition-all hover:-translate-y-1 hover:border-gold/50 md:w-auto"
              >
                <div className="relative flex h-32 items-center justify-center overflow-hidden rounded-lg bg-white">
                  <img src={p.img} alt={p.name} className="max-h-24 object-contain" loading="lazy" />
                  <div className="absolute right-2 top-2 rounded-full bg-emerald/15 px-2 py-0.5 font-mono text-[10px] text-emerald">
                    application réelle
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-gold">
                  <span className="h-1 w-1 rounded-full bg-gold" />{p.tag}
                </div>
                <h3 className="mt-1 font-display text-lg leading-tight">{p.name}</h3>
                <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{p.desc}</p>
                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 font-mono text-[10px] text-gold/80">
                  <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> Web · Mobile</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PERSPECTIVES — repères sectoriels publics */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet">// perspectives_sectorielles</div>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl">Repères publics<br />sur l'<span className="italic text-gradient-ai">économie numérique</span> ouest-africaine</h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Synthèse de sources publiques reconnues — BRVM, GSMA, OMS, UNESCO — pour situer nos investissements
              dans le marché réel, sans projection spéculative.
            </p>
            <Link to="/actualites" className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-azure hover:text-foreground">
              Lire nos perspectives <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {signals.map((s) => (
              <div key={s.text} className="glass flex items-start gap-4 rounded-xl p-4">
                <Sparkles className="mt-1 h-4 w-4 shrink-0 text-violet" />
                <div className="flex-1">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-gold">{s.tag}</div>
                  <div className="mt-0.5 text-sm text-foreground">{s.text}</div>
                  <div className="mt-1 font-mono text-[10px] text-muted-foreground">{s.source}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* VISION + heritage */}
      <section className="relative border-t border-border bg-navy/70">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-2">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">// notre_heritage</div>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl leading-tight">
              Un empire bâti sur le<br />commerce et la <span className="italic text-gradient-gold">connaissance</span>.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
              FALL Trading and Investing s'inscrit dans la lignée du Royaume du DAMEL-TEEÑ —
              une renaissance moderne qui marie tradition, capital et technologie pour bâtir
              une souveraineté numérique africaine.
            </p>
          </div>
          <ul className="space-y-3">
            {["Innovation", "Technologie", "Investissement productif", "Entrepreneuriat", "Souveraineté numérique africaine"].map((p, i) => (
              <li key={p} className="flex items-baseline gap-6 rounded-lg border border-border bg-card/40 px-5 py-4 transition-colors hover:border-gold/40 hover:bg-card/70">
                <span className="font-display text-3xl text-gold/70">0{i + 1}</span>
                <span className="font-display text-xl">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-navy via-navy-deep to-navy p-12">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-azure/20 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h3 className="font-display text-3xl sm:text-4xl">Vous avez un projet ? Parlons‑en.</h3>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">Investissement, application mobile ou solution IA sur‑mesure — notre équipe vous répond sous 48 heures.</p>
            </div>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full gradient-azure px-7 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-white shadow-lg shadow-azure/30">
              Démarrer un projet <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function formatRelShort(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const day = 86400000;
  if (diff < day) return "aujourd'hui";
  if (diff < 2 * day) return "hier";
  if (diff < 7 * day) return `il y a ${Math.floor(diff / day)} j`;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function PublicStatsStrip() {
  const statsFn = useServerFn(getPublicStats);
  const { data } = useQuery({
    queryKey: ["public-stats"],
    queryFn: () => statsFn({ data: {} }),
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
  });
  const items = [
    { icon: Layers, label: "Plateformes en production", value: String(data?.platforms_count ?? "—") },
    { icon: Users, label: "Utilisateurs actifs", value: data?.total_users ? data.total_users.toLocaleString("fr-FR") : "—" },
    { icon: FileText, label: "Articles publiés", value: String(data?.articles_count ?? "—") },
    { icon: Clock, label: "Dernière mise à jour", value: formatRelShort(data?.last_publication_at ?? null) },
  ];
  return (
    <section className="border-b border-border bg-navy/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden border-x border-border bg-border sm:grid-cols-4">
        {items.map((it) => (
          <div key={it.label} className="bg-card p-6">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              <it.icon className="h-3.5 w-3.5 text-gold" />
              <span className="truncate">{it.label}</span>
            </div>
            <div className="mt-2 font-display text-2xl text-foreground sm:text-3xl">{it.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

