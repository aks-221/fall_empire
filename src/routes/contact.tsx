import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { useState } from "react";
import { MapPin, Phone, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — FALL Trading and Investing" },
      { name: "description", content: "Contactez FALL Trading and Investing à Dakar, Sénégal. Téléphone, email et formulaire de contact." },
      { property: "og:title", content: "Contact — FALL Trading and Investing" },
      { property: "og:description", content: "Parlons de votre projet. Nous répondons sous 48 heures." },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(200),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Message trop court (10 caractères min)").max(5000),
});

function Contact() {
  const [sent, setSent] = useState<{ ref: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const values = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      company: String(fd.get("company") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[String(i.path[0])] = i.message;
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .insert({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        company: parsed.data.company || null,
        message: parsed.data.message,
      })
      .select("reference")
      .single();
    setSubmitting(false);
    if (error || !data) {
      toast.error("Impossible d'envoyer le message. Réessayez ou écrivez-nous à contact@falltradingandinvesting.com.");
      return;
    }
    setSent({ ref: data.reference });
    toast.success("Message bien reçu !");
  }

  return (
    <div>
      <PageHeader
        eyebrow="// contact"
        title={<>Parlons de votre <span className="italic text-gradient-ai">projet</span></>}
        lead="Notre équipe vous répond sous 48 heures. Vous pouvez aussi nous joindre directement par téléphone ou email."
      />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <aside className="space-y-8">
            <div>
              <MapPin className="h-6 w-6 text-gold" />
              <h3 className="mt-3 font-display text-xl">Adresse</h3>
              <p className="mt-1 text-sm text-muted-foreground">Tally Boumack N°4185<br />Pikine, Dakar, Sénégal</p>
            </div>
            <div>
              <Phone className="h-6 w-6 text-gold" />
              <h3 className="mt-3 font-display text-xl">Téléphones</h3>
              <ul className="mt-1 space-y-1 text-sm">
                <li><a href="tel:+221710466060" className="text-foreground hover:text-gold">+221 71 046 60 60</a></li>
                <li><a href="tel:+221710468787" className="text-foreground hover:text-gold">+221 71 046 87 87</a></li>
                <li><a href="tel:+221776626603" className="text-foreground hover:text-gold">+221 77 662 66 03</a></li>
              </ul>
            </div>
            <div>
              <Mail className="h-6 w-6 text-gold" />
              <h3 className="mt-3 font-display text-xl">Email</h3>
              <p className="mt-1 text-sm">
                <a href="mailto:contact@falltradingandinvesting.com" className="text-foreground hover:text-gold">
                  contact@falltradingandinvesting.com
                </a>
              </p>
            </div>

            <div className="rounded-lg border border-border bg-secondary/40 p-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
              <div className="text-gold">// disponibilite</div>
              Lun – Ven : 09h – 18h GMT<br />Sam : 10h – 14h GMT
            </div>
          </aside>

          <form noValidate onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-8 sm:p-10">
            {sent ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="mx-auto h-14 w-14 text-cyan" strokeWidth={1.4} />
                <div className="mt-4 font-display text-3xl">Message reçu</div>
                <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                  Merci ! Notre équipe vous répond sous 48 heures à l'adresse email indiquée.
                  Conservez votre référence pour le suivi.
                </p>
                <div className="mt-6 inline-block rounded-lg border border-border bg-secondary/50 px-4 py-2 font-mono text-[11px] text-muted-foreground">
                  ref: {sent.ref}
                </div>
                <div className="mt-6">
                  <button onClick={() => setSent(null)} type="button" className="font-mono text-[11px] text-muted-foreground underline-offset-4 hover:underline">Envoyer un autre message</button>
                </div>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Nom" name="name" required error={errors.name} />
                <Field label="Entreprise" name="company" error={errors.company} />
                <Field label="Email" name="email" type="email" required error={errors.email} />
                <Field label="Téléphone" name="phone" type="tel" error={errors.phone} />
                <label className="text-sm sm:col-span-2">
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Message *</span>
                  <textarea
                    required rows={6} name="message"
                    aria-invalid={!!errors.message}
                    className={`mt-2 w-full rounded-lg border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-1 ${errors.message ? "border-destructive focus:border-destructive focus:ring-destructive" : "border-input focus:border-gold focus:ring-gold"}`}
                  />
                  {errors.message && <span className="mt-1 block text-xs text-destructive">{errors.message}</span>}
                </label>
                <div className="sm:col-span-2">
                  <button type="submit" disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-60">
                    {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    {submitting ? "Envoi en cours…" : "Envoyer le message"}
                  </button>
                  <p className="mt-3 font-mono text-[10px] text-muted-foreground">
                    Vos données sont enregistrées de manière sécurisée et utilisées uniquement pour vous recontacter.
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}

function Field({ label, name, type = "text", required, error }: { label: string; name: string; type?: string; required?: boolean; error?: string }) {
  return (
    <label className="text-sm">
      <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}{required ? " *" : ""}</span>
      <input
        required={required} type={type} name={name}
        aria-invalid={!!error}
        className={`mt-2 w-full rounded-lg border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-1 ${error ? "border-destructive focus:border-destructive focus:ring-destructive" : "border-input focus:border-gold focus:ring-gold"}`}
      />
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
