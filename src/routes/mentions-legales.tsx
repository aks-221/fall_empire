import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales — FALL Trading and Investing" },
      { name: "description", content: "Mentions légales de FALL Trading and Investing : éditeur, hébergeur, propriété intellectuelle." },
      { property: "og:title", content: "Mentions légales — FALL Trading and Investing" },
      { property: "og:description", content: "Informations légales de FALL Trading and Investing." },
    ],
  }),
  component: Legal,
});

function Legal() {
  return (
    <div>
      <PageHeader eyebrow="Légal" title="Mentions légales" />
      <article className="mx-auto max-w-3xl px-6 py-16 prose prose-neutral">
        <h2 className="font-display text-2xl">Éditeur du site</h2>
        <p>FALL TRADING AND INVESTING — Entreprise Individuelle de droit sénégalais.</p>
        <ul className="mt-3 space-y-1 text-sm">
          <li>Dirigeant : Ousmane Fall</li>
          <li>NINEA : 009697072</li>
          <li>RCCM : SN.DKR.2022.A.29659</li>
          <li>Création : 06 septembre 2022 — Immatriculation : 19 septembre 2022</li>
          <li>Adresse : Tally Boumack N°4185, Pikine, Dakar, Sénégal</li>
          <li>Téléphones : +221 71 046 60 60 · +221 71 046 87 87 · +221 77 662 66 03</li>
          <li>Email : contact@falltradingandinvesting.com</li>
        </ul>

        <h2 className="mt-10 font-display text-2xl">Propriété intellectuelle</h2>
        <p className="mt-3 text-sm leading-relaxed">L'ensemble des éléments figurant sur le site (textes, images, logos, marques, vidéos)
          sont la propriété exclusive de FALL TRADING AND INVESTING ou de leurs ayants droit. Toute reproduction,
          représentation ou diffusion sans autorisation préalable est interdite.</p>

        <h2 className="mt-10 font-display text-2xl">Hébergement</h2>
        <p className="mt-3 text-sm leading-relaxed">Le site est hébergé par un prestataire d'infrastructure cloud
          conforme aux exigences de sécurité et de disponibilité requises.</p>

        <h2 className="mt-10 font-display text-2xl">Responsabilité</h2>
        <p className="mt-3 text-sm leading-relaxed">FALL TRADING AND INVESTING met tout en œuvre pour assurer
          l'exactitude des informations publiées, sans pour autant garantir l'absence d'erreurs ou d'omissions.</p>
      </article>
    </div>
  );
}
