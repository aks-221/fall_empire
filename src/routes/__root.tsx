import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { AuthProvider } from "../hooks/useAuth";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="font-display text-7xl text-gradient-ai">404</h1>
          <h2 className="mt-4 font-display text-2xl">Page introuvable</h2>
          <p className="mt-2 text-sm text-muted-foreground">Cette page n'existe pas ou a été déplacée.</p>
          <Link to="/" className="mt-6 inline-flex rounded-full bg-ink px-5 py-2.5 text-xs uppercase tracking-widest text-primary-foreground">Retour accueil</Link>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl">Cette page n'a pas pu être chargée</h1>
        <p className="mt-2 text-sm text-muted-foreground">Une erreur est survenue. Réessayez ou retournez à l'accueil.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-full bg-ink px-5 py-2.5 text-xs uppercase tracking-widest text-primary-foreground">Réessayer</button>
          <a href="/" className="rounded-full border border-border px-5 py-2.5 text-xs uppercase tracking-widest">Accueil</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FALL Trading and Investing — Investissement, Tech & IA au Sénégal" },
      { name: "description", content: "Société sénégalaise d'investissement, de commerce international et de développement de plateformes mobiles enrichies à l'intelligence artificielle." },
      { name: "author", content: "FALL Trading and Investing" },
      { name: "theme-color", content: "#0b1020" },
      { property: "og:title", content: "FALL Trading and Investing" },
      { property: "og:description", content: "Investissement · Commerce international · Applications mobiles & IA" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__l5e/assets-v1/6ecc63fd-af59-4f48-97d9-9e7b0b94f659/fall-logo.jpeg" },
      { rel: "icon", href: "/__l5e/assets-v1/6ecc63fd-af59-4f48-97d9-9e7b0b94f659/fall-logo.jpeg", type: "image/jpeg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">
            <Outlet />
          </main>
          <SiteFooter />
          <Toaster position="top-right" richColors closeButton />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}
