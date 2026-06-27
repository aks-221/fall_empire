import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/cgu")({
  head: () => ({
    meta: [
      { title: "Conditions générales d'utilisation — FALL Trading and Investing" },
      { name: "description", content: "Conditions générales d'utilisation des sites et applications de FALL Trading and Investing." },
      { property: "og:title", content: "Conditions générales d'utilisation" },
      { property: "og:description", content: "Modalités d'utilisation de nos services numériques." },
    ],
  }),
  component: CGU,
});

function CGU() {
  return (
    <div>
      <PageHeader eyebrow="Légal" title="Conditions générales d'utilisation" />
      <article className="mx-auto max-w-3xl px-6 py-16 text-sm leading-relaxed">
        <h2 className="font-display text-2xl">1. Objet</h2>
        <p className="mt-2">Les présentes conditions régissent l'utilisation des sites et applications publiés
          par FALL TRADING AND INVESTING.</p>

        <h2 className="mt-8 font-display text-2xl">2. Accès au service</h2>
        <p className="mt-2">L'accès est ouvert à toute personne disposant d'un accès Internet. Les coûts liés à
          cet accès restent à la charge de l'utilisateur.</p>

        <h2 className="mt-8 font-display text-2xl">3. Utilisation conforme</h2>
        <p className="mt-2">L'utilisateur s'engage à utiliser les services de manière conforme à la loi et à ne
          pas porter atteinte aux droits de tiers.</p>

        <h2 className="mt-8 font-display text-2xl">4. Compte utilisateur</h2>
        <p className="mt-2">Pour certains services, la création d'un compte est requise. L'utilisateur est
          responsable de la confidentialité de ses identifiants.</p>

        <h2 className="mt-8 font-display text-2xl">5. Propriété intellectuelle</h2>
        <p className="mt-2">Tous les contenus restent la propriété de FALL TRADING AND INVESTING ou de ses
          partenaires.</p>

        <h2 className="mt-8 font-display text-2xl">6. Modification</h2>
        <p className="mt-2">Les présentes CGU peuvent être modifiées à tout moment. La version applicable est
          celle en ligne au jour de l'utilisation.</p>

        <h2 className="mt-8 font-display text-2xl">7. Droit applicable</h2>
        <p className="mt-2">Les présentes conditions sont soumises au droit sénégalais. Tout litige relèvera
          des tribunaux compétents de Dakar.</p>
      </article>
    </div>
  );
}
