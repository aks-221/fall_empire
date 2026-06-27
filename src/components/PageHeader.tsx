import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, lead, children }: { eyebrow?: string; title: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
      </div>
      <div className="mx-auto max-w-5xl px-6 py-20 text-center">
        {eyebrow && <div className="text-[11px] uppercase tracking-[0.24em] text-gold">{eyebrow}</div>}
        <h1 className="mt-3 font-display text-4xl leading-tight sm:text-6xl">{title}</h1>
        {lead && <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">{lead}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
