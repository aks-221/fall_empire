import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Banknote, Globe2, Smartphone, Cpu, Cloud, Wrench, Shuffle, Rocket } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — FALL Trading and Investing" },
      { name: "description", content: "Investissement, commerce international, développement d'applications mobiles, IA, cloud et transformation digitale au Sénégal." },
      { property: "og:title", content: "Nos services — FALL Trading and Investing" },
      { property: "og:description", content: "Investissement, commerce, applications mobiles, IA et solutions cloud." },
    ],
  }),
  component: Services,
});

const domaines = [
  {
    icon: Banknote,
    title: "Investissement",
    items: ["Technologies numériques", "Commerce électronique", "Solutions SaaS", "Intelligence artificielle", "Agriculture numérique", "Santé digitale"],
  },
  {
    icon: Globe2,
    title: "Commerce & Import-Export",
    items: ["Commerce général", "Distribution", "Négoce international", "Importation", "Exportation", "Intermédiation commerciale"],
  },
  {
    icon: Smartphone,
    title: "Applications Mobiles",
    items: ["Android", "iOS (iPhone & iPad)", "Tablettes", "Plateformes Web", "Flutter / React Native", "Node.js · Firebase · IA"],
  },
];

const tech = [
  { icon: Smartphone, title: "Applications mobiles" },
  { icon: Cpu, title: "Intelligence artificielle" },
  { icon: Cloud, title: "Solutions cloud" },
  { icon: Shuffle, title: "Automatisation des processus" },
  { icon: Wrench, title: "Maintenance informatique" },
  { icon: Rocket, title: "Transformation digitale" },
];

function Services() {
  return (
    <div>
      <PageHeader
        eyebrow="Nos domaines d'activités"
        title={<>Trois métiers,<br /><span className="italic text-gradient-gold">une seule exigence</span>.</>}
        lead="De l'investissement productif au développement d'applications mobiles, FALL Trading and Investing accompagne ses partenaires à chaque étape."
      />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {domaines.map((d, i) => (
            <div key={d.title} className="rounded-2xl border border-border bg-card p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <d.icon strokeWidth={1.4} />
                </div>
                <div className="font-display text-xs uppercase tracking-[0.22em] text-muted-foreground">0{i + 1}</div>
              </div>
              <h3 className="mt-6 font-display text-3xl">{d.title}</h3>
              <ul className="mt-6 space-y-2">
                {d.items.map((it) => (
                  <li key={it} className="flex items-start gap-3 text-sm text-foreground/80">
                    <span className="mt-2 h-1 w-3 bg-gold" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink py-20 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-[11px] uppercase tracking-[0.22em] text-gold">Services technologiques</div>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl">Une stack moderne, déployée à l'échelle</h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {tech.map((t) => (
              <div key={t.title} className="flex items-center gap-4 bg-ink p-8">
                <t.icon className="h-6 w-6 text-gold" strokeWidth={1.4} />
                <div className="font-display text-xl">{t.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-[11px] uppercase tracking-[0.22em] text-gold">Pourquoi nous choisir</div>
        <h2 className="mt-2 font-display text-4xl">Quatre raisons, simples et claires</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Expertise", "Une maîtrise des technologies modernes."],
            ["Innovation", "Des solutions adaptées aux besoins actuels du marché."],
            ["Fiabilité", "Une entreprise légalement enregistrée au Sénégal."],
            ["Accompagnement", "Un suivi personnalisé de chaque projet."],
          ].map(([t, d], i) => (
            <div key={t} className="rounded-2xl border border-border p-6">
              <div className="font-display text-3xl text-gold/70">0{i + 1}</div>
              <div className="mt-3 font-display text-xl">{t}</div>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
