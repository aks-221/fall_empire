import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/fall-logo.jpeg";
import { MapPin, Phone, Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-navy-deep text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <img src={logoAsset} alt="FALL" className="h-12 w-12 rounded-full ring-1 ring-gold/60" />
              <div>
                <div className="font-display text-xl text-white">FALL Trading & Investing</div>
                <div className="text-xs uppercase tracking-[0.2em] text-gold/90">Renaissance de l'empire FALL</div>
              </div>
            </div>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-slate-300">
              Entreprise sénégalaise dédiée à l'investissement, au commerce international et aux solutions
              technologiques pour accélérer la transformation numérique en Afrique.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-200">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>Tally Boumack N°4185, Pikine, Dakar, Sénégal</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span className="flex flex-wrap gap-x-3 gap-y-1">
                  <a href="tel:+221710466060" className="hover:text-gold">+221 71 046 60 60</a>
                  <a href="tel:+221710468787" className="hover:text-gold">+221 71 046 87 87</a>
                  <a href="tel:+221776626603" className="hover:text-gold">+221 77 662 66 03</a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a href="mailto:contact@falltradingandinvesting.com" className="hover:text-gold">
                  contact@falltradingandinvesting.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-[0.2em] text-gold">Navigation</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              <li><Link to="/" className="hover:text-gold">Accueil</Link></li>
              <li><Link to="/a-propos" className="hover:text-gold">À propos</Link></li>
              <li><Link to="/services" className="hover:text-gold">Services</Link></li>
              <li><Link to="/applications" className="hover:text-gold">Applications</Link></li>
              <li><Link to="/investissement" className="hover:text-gold">Investissement</Link></li>
              <li><Link to="/actualites" className="hover:text-gold">Perspectives</Link></li>
              <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-[0.2em] text-gold">Légal</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              <li><Link to="/mentions-legales" className="hover:text-gold">Mentions légales</Link></li>
              <li><Link to="/confidentialite" className="hover:text-gold">Politique de confidentialité</Link></li>
              <li><Link to="/cgu" className="hover:text-gold">Conditions d'utilisation</Link></li>
            </ul>
            <div className="mt-6 text-xs text-slate-400">
              NINEA 009697072<br />RCCM SN.DKR.2022.A.29659
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-400 md:flex-row">
          <div className="font-mono">© {new Date().getFullYear()} FALL Trading and Investing · v1.0.0</div>
          <div className="flex items-center gap-3">
            <span>Dakar · Sénégal</span>
            <Link to="/admin" aria-label="Administration" className="text-slate-600 hover:text-gold">·</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
