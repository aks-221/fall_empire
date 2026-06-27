import { Link } from "@tanstack/react-router";
import { useState } from "react";
import logoAsset from "@/assets/fall-logo.jpeg";
import { Menu, X } from "lucide-react";

const nav = [
  { to: "/", label: "Accueil" },
  { to: "/a-propos", label: "À propos" },
  { to: "/services", label: "Services" },
  { to: "/applications", label: "Applications" },
  { to: "/investissement", label: "Investissement" },
  { to: "/actualites", label: "Perspectives" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src={logoAsset} alt="FALL Trading and Investing" className="h-11 w-11 rounded-full object-cover ring-1 ring-gold/50" />
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold tracking-wide">FALL</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Trading & Investing</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "rounded-md px-3 py-2 text-sm text-foreground bg-secondary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/contact"
          className="hidden rounded-full bg-ink px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-primary-foreground transition-transform hover:scale-[1.02] lg:inline-block"
        >
          Démarrer
        </Link>
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-secondary">
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
