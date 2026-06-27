import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/investissement")({
  head: () => ({
    meta: [
      { title: "Investissement — FALL Trading and Investing" },
      { name: "description", content: "Nous accompagnons les initiatives à fort potentiel en technologies, e-commerce, SaaS, IA, agritech et santé digitale." },
      { property: "og:title", content: "Investissement — FALL Trading and Investing" },
      { property: "og:description", content: "Capital, conseil et accompagnement d'initiatives à fort potentiel en Afrique." },
    ],
  }),
  component: Invest,
});

const verticals = [
  ["Technologies numériques", "Logiciels, infrastructures et plateformes prêtes à l'échelle."],
  ["Commerce électronique", "Marketplaces et expériences d'achat nouvelle génération."],
  ["Solutions SaaS", "Outils métier en abonnement, du PME au grand compte."],
  ["Intelligence artificielle", "Automatisation, OCR, analyse, IA générative appliquée."],
  ["Agriculture numérique", "Tech pour la productivité et la traçabilité agricole."],
  ["Santé digitale", "Plateformes patient, officines, régulation et logistique."],
];

function Invest() {
  return (
    <div>
      <PageHeader
        eyebrow="Investissement"
        title={<>Accompagner ceux qui <span className="italic text-gradient-gold">bâtissent l'Afrique</span></>}
        lead="Nous investissons capital, expertise et réseau au service d'initiatives qui répondent à des besoins réels et défendent la souveraineté numérique africaine."
      />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {verticals.map(([t, d], i) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-8">
              <div className="font-display text-3xl text-gold/70">0{i + 1}</div>
              <h3 className="mt-3 font-display text-2xl">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-gold/30 bg-secondary/40 p-10">
          <h2 className="font-display text-3xl">Vous portez un projet ?</h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Présentez‑nous votre vision. Nous étudions chaque dossier avec attention et revenons vers vous
            sous 10 jours ouvrés.
          </p>
          <Link to="/contact" className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-xs uppercase tracking-widest text-primary-foreground">
            Soumettre un projet
          </Link>
        </div>
      </section>
    </div>
  );
}
