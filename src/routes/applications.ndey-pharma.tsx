import { createFileRoute } from "@tanstack/react-router";
import ndey from "@/assets/ndey-pharma.png";
import { ExternalLink } from "lucide-react";
import { PlatformsBlock } from "@/components/PlatformsBlock";

export const Route = createFileRoute("/applications/ndey-pharma")({
  head: () => ({
    meta: [
      { title: "Doctor NDEY Pharma — Plateforme numérique de santé" },
      { name: "description", content: "Doctor NDEY Pharma digitalise la gestion pharmaceutique au Sénégal : patients, pharmacies, livreurs et ARP réunis sur une seule plateforme." },
      { property: "og:title", content: "Doctor NDEY Pharma" },
      { property: "og:description", content: "Managing my pharmacy in my pocket — plateforme santé numérique." },
      { property: "og:image", content: ndey },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Doctor NDEY Pharma" },
      { name: "twitter:description", content: "Managing my pharmacy in my pocket." },
      { name: "twitter:image", content: ndey },
    ],
  }),
  component: NdeyPage,
});

const sections = [
  {
    title: "Pour les patients",
    items: [
      "Recherche intelligente de médicaments",
      "Scan et envoi d'ordonnances manuscrites ou numériques",
      "Lecture OCR et analyse par IA des prescriptions",
      "Envoi d'ordonnances à plusieurs pharmacies",
      "Consultation des pharmacies disposant des médicaments",
      "Achat et paiement en ligne",
      "Livraison à domicile",
      "Suivi des commandes en temps réel",
      "Carnet de santé électronique",
      "Gestion des allergies et antécédents médicaux",
      "Messagerie et appels intégrés avec les pharmacies",
    ],
  },
  {
    title: "Pour les pharmacies",
    items: [
      "Gestion complète des médicaments",
      "Gestion des stocks et inventaires",
      "Gestion des lots et dates de péremption",
      "Ordonnancier électronique automatisé",
      "Gestion des patients et fournisseurs",
      "Gestion des employés et des accès",
      "Facturation et caisse",
      "Impression de reçus avec logo de la pharmacie",
      "Localisation des médicaments dans l'officine",
      "Import auto des factures fournisseurs (PDF/Excel)",
      "OCR intelligent pour l'intégration des stocks",
      "Tableaux de bord et statistiques",
    ],
  },
  {
    title: "Pour les livreurs",
    items: [
      "Réception des missions de livraison",
      "Géolocalisation GPS",
      "Suivi des commandes",
      "Validation des livraisons",
      "Historique des courses",
      "Communication sécurisée avec patients et pharmacies",
    ],
  },
  {
    title: "Pour l'ARP",
    items: [
      "Tableau de bord réglementaire dédié",
      "Vérification des licences d'exploitation",
      "Vérification des NINEA et RCCM",
      "Contrôle des ordonnanciers électroniques",
      "Suivi des pharmacies enregistrées",
      "Suivi des patients et livreurs actifs",
      "Notifications réglementaires",
      "Outils de traçabilité et d'audit",
      "Communication directe avec les pharmacies",
    ],
  },
];

function NdeyPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-emerald-950/10 via-background to-background">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-gold">Santé digitale</div>
            <h1 className="mt-3 font-display text-5xl leading-tight sm:text-6xl">Doctor NDEY <span className="italic text-gradient-gold">Pharma</span></h1>
            <p className="mt-4 text-base text-muted-foreground">Managing my pharmacy in my pocket.</p>
            <p className="mt-6 max-w-xl leading-relaxed text-foreground/80">
              Plateforme numérique de santé qui connecte patients, pharmacies, livreurs et autorités
              réglementaires à travers un site web et une application mobile. Elle digitalise la gestion
              pharmaceutique, facilite l'accès aux médicaments et améliore la traçabilité du circuit du
              médicament, en conformité avec l'Agence Sénégalaise de Réglementation Pharmaceutique (ARP).
            </p>
            <a href="https://doctorndeypharma.sn" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs uppercase tracking-widest text-primary-foreground">
              doctorndeypharma.sn <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <div className="flex justify-center">
            <div className="rounded-3xl border border-emerald-900/20 bg-white p-10 shadow-xl">
              <img src={ndey} alt="Doctor NDEY Pharma" className="max-h-80 object-contain" />
            </div>
          </div>
        </div>
      </section>

      <PlatformsBlock
        appName="Doctor NDEY Pharma"
        logoUrl={ndey}
        color="#10B981"
        platforms={[
          { kind: "web", label: "doctorndeypharma.sn", url: "https://doctorndeypharma.sn", note: "Accès patients, pharmacies, livreurs et ARP depuis tout navigateur." },
          { kind: "android", label: "Application Android", note: "Distribution via APK signé sur demande — Play Store en cours de publication." },
          { kind: "ios", label: "Application iOS", note: "Build TestFlight disponible pour les pharmacies partenaires." },
        ]}
      />


      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-[11px] uppercase tracking-[0.22em] text-gold">Fonctionnalités</div>
        <h2 className="mt-2 font-display text-4xl">Une plateforme, quatre publics</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {sections.map((s) => (
            <div key={s.title} className="rounded-2xl border border-border bg-card p-8">
              <h3 className="font-display text-2xl">{s.title}</h3>
              <ul className="mt-5 space-y-2">
                {s.items.map((it) => (
                  <li key={it} className="flex items-start gap-3 text-sm">
                    <span className="mt-2 h-1 w-3 shrink-0 bg-gold" />
                    <span className="text-foreground/85">{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl">Gestion des fournisseurs</h2>
            <p className="mt-3 text-sm text-muted-foreground">Intégrations natives avec les grossistes locaux et internationaux.</p>
            <ul className="mt-6 grid grid-cols-2 gap-3">
              {["Duopharm", "Ubipharm", "Sodipharm", "Laborex", "Import PDF & Excel", "OCR intelligent", "Entrée auto en stock", "Archivage numérique"].map((x) => (
                <li key={x} className="rounded-lg border border-border bg-card px-4 py-3 text-sm">{x}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl">Produits gérés</h2>
            <p className="mt-3 text-sm text-muted-foreground">Couverture complète des références d'une officine moderne.</p>
            <ul className="mt-6 space-y-2">
              {["Médicaments", "Produits parapharmaceutiques", "Cosmétiques adultes & bébés", "Produits d'hygiène", "Nutrition & compléments alimentaires", "Matériel médical"].map((x) => (
                <li key={x} className="flex items-start gap-3 text-sm"><span className="mt-2 h-1 w-3 bg-gold" />{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="text-[11px] uppercase tracking-[0.22em] text-gold">Vision</div>
        <p className="mt-4 font-display text-3xl leading-snug">
          Devenir la plateforme nationale de référence pour la gestion pharmaceutique numérique au Sénégal,
          en renforçant l'accès aux médicaments, la sécurité sanitaire et la modernisation du secteur.
        </p>
      </section>
    </div>
  );
}
