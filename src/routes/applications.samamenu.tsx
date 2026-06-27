import { createFileRoute } from "@tanstack/react-router";
import sama from "@/assets/samamenu.png";
import { ExternalLink, Utensils, ShoppingBag, LayoutDashboard } from "lucide-react";
import { PlatformsBlock } from "@/components/PlatformsBlock";

export const Route = createFileRoute("/applications/samamenu")({
  head: () => ({
    meta: [
      { title: "SamaMenu — Mettre votre restaurant en ligne au Sénégal" },
      { name: "description", content: "SamaMenu est la solution la plus simple pour mettre votre restaurant en ligne au Sénégal : menus, commandes, gestion d'établissement." },
      { property: "og:title", content: "SamaMenu" },
      { property: "og:description", content: "La solution la plus simple pour mettre votre restaurant en ligne au Sénégal." },
      { property: "og:image", content: sama },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "SamaMenu" },
      { name: "twitter:description", content: "Mettre votre restaurant en ligne, simplement." },
      { name: "twitter:image", content: sama },
    ],
  }),
  component: SamaPage,
});

function SamaPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-orange-950/10 via-background to-background">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-gold">Restauration</div>
            <h1 className="mt-3 font-display text-5xl leading-tight sm:text-6xl">Sama<span className="italic text-gradient-gold">Menu</span></h1>
            <p className="mt-4 text-base text-muted-foreground">La solution la plus simple pour mettre votre restaurant en ligne au Sénégal.</p>
            <p className="mt-6 max-w-xl leading-relaxed text-foreground/80">
              Plateforme numérique de restauration permettant la consultation des menus, la prise de
              commandes et la gestion complète des établissements de restauration.
            </p>
            <a href="https://samamenu.com" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs uppercase tracking-widest text-primary-foreground">
              samamenu.com <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <div className="flex justify-center">
            <div className="rounded-3xl border border-orange-900/20 bg-[#1a1411] p-12 shadow-xl">
              <img src={sama} alt="SamaMenu" className="max-h-72 object-contain" />
            </div>
          </div>
        </div>
      </section>

      <PlatformsBlock
        appName="SamaMenu"
        logoUrl={sama}
        color="#F97316"
        platforms={[
          { kind: "web", label: "samamenu.com", url: "https://samamenu.com", note: "Tableau de bord restaurateur et menus en ligne pour clients." },
          { kind: "android", label: "Application Android", note: "APK disponible sur demande pour les restaurants partenaires." },
          { kind: "ios", label: "Application iOS", note: "Version TestFlight pour pilotes à Dakar." },
        ]}
      />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Utensils, title: "Menus en ligne", desc: "Présentez vos plats avec des photos, prix et descriptions élégantes." },
            { icon: ShoppingBag, title: "Commandes simplifiées", desc: "Vos clients commandent en quelques clics — sur place, à emporter ou en livraison." },
            { icon: LayoutDashboard, title: "Gestion centralisée", desc: "Pilotez votre établissement, vos équipes et vos ventes depuis un seul tableau de bord." },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-border bg-card p-8">
              <c.icon className="h-7 w-7 text-gold" strokeWidth={1.4} />
              <h3 className="mt-6 font-display text-2xl">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
