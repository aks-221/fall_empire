import { Globe, Smartphone, Apple, ExternalLink } from "lucide-react";

export type Platform = {
  kind: "web" | "android" | "ios";
  label: string;
  url?: string;
  note?: string;
};

export function PlatformsBlock({
  appName,
  logoUrl,
  color = "#0EA5E9",
  platforms,
}: {
  appName: string;
  logoUrl?: string;
  color?: string;
  platforms: Platform[];
}) {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.24em]" style={{ color }}>// plateformes_disponibles</div>
            <h2 className="mt-2 font-display text-2xl">Sur quelles plateformes utiliser {appName} ?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Une seule expérience, plusieurs supports — choisissez celui qui vous convient.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {platforms.map((p) => {
            const Icon = p.kind === "web" ? Globe : p.kind === "ios" ? Apple : Smartphone;
            const subtitle = p.kind === "web" ? "Site web · Navigateur" : p.kind === "ios" ? "Application mobile · iOS" : "Application mobile · Android";
            const content = (
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border" style={{ background: `${color}12` }}>
                    {logoUrl ? <img src={logoUrl} alt="" className="h-7 w-7 object-contain" /> : <Icon className="h-5 w-5" style={{ color }} />}
                  </div>
                  <div>
                    <div className="font-display text-base leading-tight">{p.label}</div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{subtitle}</div>
                  </div>
                </div>
                {p.note && <p className="text-xs text-muted-foreground">{p.note}</p>}
                <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs">
                  <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    <Icon className="h-3 w-3" /> {p.kind}
                  </span>
                  {p.url ? (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest" style={{ color }}>
                      ouvrir <ExternalLink className="h-3 w-3" />
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">sur demande</span>
                  )}
                </div>
              </div>
            );
            return p.url ? (
              <a key={p.kind + p.label} href={p.url} target="_blank" rel="noreferrer" className="block">{content}</a>
            ) : (
              <div key={p.kind + p.label}>{content}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
