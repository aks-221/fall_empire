import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité — FALL Trading and Investing" },
      { name: "description", content: "Politique de confidentialité et de traitement des données personnelles de FALL Trading and Investing." },
      { property: "og:title", content: "Politique de confidentialité — FALL Trading and Investing" },
      { property: "og:description", content: "Comment nous collectons, utilisons et protégeons vos données personnelles." },
    ],
  }),
  component: Priv,
});

function Priv() {
  return (
    <div>
      <PageHeader eyebrow="Légal" title="Politique de confidentialité" />
      <article className="mx-auto max-w-3xl px-6 py-16 text-sm leading-relaxed">
        <p>FALL TRADING AND INVESTING attache une importance fondamentale au respect de la vie privée des
          utilisateurs de ses sites et applications.</p>

        <h2 className="mt-8 font-display text-2xl">1. Données collectées</h2>
        <p className="mt-2">Nous collectons uniquement les données strictement nécessaires au fonctionnement de
          nos services : identification, contact, données de navigation et données fournies via nos
          formulaires.</p>

        <h2 className="mt-8 font-display text-2xl">2. Finalités</h2>
        <p className="mt-2">Vos données sont utilisées pour répondre à vos demandes, améliorer nos services et
          respecter nos obligations légales.</p>

        <h2 className="mt-8 font-display text-2xl">3. Conservation</h2>
        <p className="mt-2">Les données sont conservées pendant la durée nécessaire aux finalités décrites,
          conformément à la réglementation applicable.</p>

        <h2 className="mt-8 font-display text-2xl">4. Vos droits</h2>
        <p className="mt-2">Vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition
          au traitement de vos données. Pour exercer ces droits : contact@falltradingandinvesting.com.</p>

        <h2 className="mt-8 font-display text-2xl">5. Sécurité</h2>
        <p className="mt-2">Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour
          protéger vos données contre tout accès non autorisé.</p>

        <h2 className="mt-8 font-display text-2xl">6. Cookies</h2>
        <p className="mt-2">Nos sites utilisent des cookies strictement nécessaires au fonctionnement et, le cas
          échéant, des cookies de mesure d'audience anonymes.</p>
      </article>
    </div>
  );
}
