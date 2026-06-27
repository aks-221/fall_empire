import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — FALL Trading and Investing" },
      { name: "description", content: "FALL Trading and Investing : entreprise sénégalaise fondée par Ousmane Fall, immatriculée au RCCM. Mission, vision et informations légales." },
      { property: "og:title", content: "À propos — FALL Trading and Investing" },
      { property: "og:description", content: "Découvrez l'entreprise FALL Trading and Investing, sa mission et ses informations légales." },
    ],
  }),
  component: About,
});

const legal: [string, string][] = [
  ["Raison sociale", "FALL TRADING AND INVESTING"],
  ["Dirigeant", "Ousmane Fall"],
  ["NINEA", "009697072"],
  ["RCCM", "SN.DKR.2022.A.29659"],
  ["Date de création", "06 septembre 2022"],
  ["Date d'immatriculation", "19 septembre 2022"],
  ["Statut juridique", "Entreprise Individuelle"],
  ["Adresse", "Tally Boumack N°4185, Pikine, Dakar, Sénégal"],
  ["Téléphones", "+221 71 046 60 60 · +221 71 046 87 87 · +221 77 662 66 03"],
];

function About() {
  return (
    <div>
      <PageHeader
        eyebrow="À propos"
        title={<>Qui sommes‑<span className="italic text-gradient-gold">nous ?</span></>}
        lead="FALL Trading and Investing est une entreprise individuelle sénégalaise fondée par Ousmane Fall, immatriculée au Registre du Commerce et du Crédit Mobilier du Sénégal."
      />

      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl">Notre mission</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Depuis sa création, l'entreprise accompagne les particuliers, les entreprises et les organisations
              dans leurs projets commerciaux, technologiques et d'investissement.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Notre mission : développer des solutions innovantes qui accélèrent la transformation numérique
              et économique en Afrique.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl">Notre vision</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Un développement économique durable repose sur l'innovation, la technologie, l'investissement
              productif, l'entrepreneuriat et la souveraineté numérique africaine.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Notre ambition est de devenir un acteur reconnu dans les secteurs de l'investissement et des
              technologies numériques.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-[11px] uppercase tracking-[0.22em] text-gold">Informations légales</div>
          <h2 className="mt-2 font-display text-4xl">Identité de l'entreprise</h2>
          <dl className="mt-10 overflow-hidden rounded-2xl border border-border bg-card">
            {legal.map(([k, v], i) => (
              <div key={k} className={`grid grid-cols-1 gap-2 px-6 py-5 sm:grid-cols-[200px_1fr] ${i !== legal.length - 1 ? "border-b border-border" : ""}`}>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">{k}</dt>
                <dd className="text-sm">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
