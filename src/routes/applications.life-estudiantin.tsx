import { createFileRoute } from "@tanstack/react-router";
import life from "@/assets/life-estudiantin.png";
import { ExternalLink } from "lucide-react";
import { PlatformsBlock } from "@/components/PlatformsBlock";

export const Route = createFileRoute("/applications/life-estudiantin")({
  head: () => ({
    meta: [
      { title: "Life Estudiantin — La vie étudiante à Dakar" },
      { name: "description", content: "Life Estudiantin connecte étudiants, vendeurs, livreurs, recruteurs et entrepreneurs au sein d'un même écosystème numérique à Dakar." },
      { property: "og:title", content: "Life Estudiantin" },
      { property: "og:description", content: "Au service de la vie étudiante à Dakar." },
      { property: "og:image", content: life },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Life Estudiantin" },
      { name: "twitter:description", content: "Au service de la vie étudiante à Dakar." },
      { name: "twitter:image", content: life },
    ],
  }),
  component: LifePage,
});

const services = [
  "Informations universitaires",
  "Ressources pédagogiques",
  "Orientation académique & professionnelle",
  "Actualités étudiantes",
  "Achat et vente entre étudiants",
  "Recherche d'emplois, stages et opportunités",
  "Recrutement de profils étudiants",
  "Recherche de logements et colocations",
  "Services de livraison",
  "Promotion d'événements et d'activités",
  "Mise en avant de services étudiants",
  "Création & gestion de boutiques en ligne",
];

function LifePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-blue-950/10 via-background to-amber-50/30">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-gold">Vie étudiante</div>
            <h1 className="mt-3 font-display text-5xl leading-tight sm:text-6xl">Life <span className="italic text-gradient-gold">Estudiantin</span></h1>
            <p className="mt-4 text-base text-muted-foreground italic">Au service de la vie étudiante à Dakar.</p>
            <p className="mt-6 max-w-xl leading-relaxed text-foreground/80">
              Plateforme numérique dédiée à la vie étudiante à Dakar. Life Estudiantin connecte étudiants,
              vendeurs, livreurs, recruteurs, marketeurs et entrepreneurs au sein d'un même écosystème afin
              de faciliter l'accès aux opportunités, aux services, à l'emploi, au commerce et à
              l'accompagnement académique.
            </p>
            <a href="https://lifestudiantin.com" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs uppercase tracking-widest text-primary-foreground">
              lifestudiantin.com <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <div className="flex justify-center">
            <div className="rounded-3xl border border-blue-900/20 bg-white p-6 shadow-xl">
              <img src={life} alt="Life Estudiantin" className="max-h-96 rounded-2xl object-contain" />
            </div>
          </div>
        </div>
      </section>

      <PlatformsBlock
        appName="Life Estudiantin"
        logoUrl={life}
        color="#0EA5E9"
        platforms={[
          { kind: "web", label: "lifestudiantin.com", url: "https://lifestudiantin.com", note: "Plateforme web pour étudiants, recruteurs et vendeurs." },
          { kind: "android", label: "Application Android", note: "APK fourni sur demande — soumission Play Store programmée." },
          { kind: "ios", label: "Application iOS", note: "Build TestFlight pour campus pilotes à Dakar." },
        ]}
      />


      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-[11px] uppercase tracking-[0.22em] text-gold">Services & fonctionnalités</div>
        <h2 className="mt-2 font-display text-4xl">Un écosystème complet</h2>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s} className="bg-card p-6 text-sm">{s}</div>
          ))}
        </div>
      </section>

      <section className="bg-ink py-20 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="text-[11px] uppercase tracking-[0.22em] text-gold">Mission</div>
          <p className="mt-4 font-display text-3xl leading-snug">
            Créer un espace numérique unique qui accompagne les étudiants dans leur parcours académique,
            professionnel et entrepreneurial — tout en favorisant les échanges au sein de la communauté
            étudiante de Dakar.
          </p>
        </div>
      </section>
    </div>
  );
}
