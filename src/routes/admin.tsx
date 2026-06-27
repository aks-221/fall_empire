import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useRef, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { uploadPlatformAsset } from "@/lib/platform-assets.functions";
import { SignedImage } from "@/components/SignedImage";
import {
  LockKeyhole, LogOut, FileText, Layers, Inbox, Users, Plus, Trash2, Edit3,
  Eye, EyeOff, ShieldCheck, Loader2, Save, X, PieChart, History, Mail, Upload,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — FALL Trading and Investing" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Admin,
});

type Tab = "articles" | "platforms" | "allocations" | "messages" | "users" | "emails";

function Admin() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("articles");

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>;
  }
  if (!user) return <LoginCard />;
  if (!isAdmin) return <NeedAdminCard />;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-cyan"><ShieldCheck className="h-3.5 w-3.5" /> // console_admin</div>
          <h1 className="mt-1 font-display text-3xl">Administration</h1>
          <p className="mt-1 text-xs text-muted-foreground">Connecté en tant que <span className="font-mono">{user.email}</span></p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-widest hover:bg-secondary">← Site</Link>
          <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-widest text-primary-foreground">
            <LogOut className="h-3.5 w-3.5" /> Déconnexion
          </button>
        </div>
      </header>

      <nav className="mt-6 flex flex-wrap gap-1 rounded-full border border-border bg-secondary/40 p-1">
        {[
          { id: "articles", label: "Articles", icon: FileText },
          { id: "platforms", label: "Plateformes", icon: Layers },
          { id: "allocations", label: "Allocations", icon: PieChart },
          { id: "messages", label: "Messages", icon: Inbox },
          { id: "emails", label: "Logs emails", icon: Mail },
          { id: "users", label: "Utilisateurs", icon: Users },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id as Tab)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest transition-all ${tab === t.id ? "bg-ink text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}>
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </button>
        ))}
      </nav>

      <div className="mt-8">
        {tab === "articles" && <ArticlesAdmin />}
        {tab === "platforms" && <PlatformsAdmin />}
        {tab === "allocations" && <AllocationsAdmin />}
        {tab === "messages" && <MessagesAdmin />}
        {tab === "emails" && <EmailLogsAdmin />}
        {tab === "users" && <UsersAdmin />}
      </div>
    </div>
  );
}

/* ============== AUTH ============== */

function LoginCard() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    if (password.length < 8) { setErr("Mot de passe : 8 caractères minimum."); return; }
    setSubmitting(true);
    const { error } = mode === "in" ? await signIn(email, password) : await signUp(email, password);
    setSubmitting(false);
    if (error) setErr(error);
    else if (mode === "up") toast.success("Compte créé. Vous êtes connecté.");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-cyan/40 bg-cyan/5 p-2"><LockKeyhole className="h-5 w-5 text-cyan" strokeWidth={1.5} /></div>
          <div>
            <h1 className="font-display text-2xl">Console d'administration</h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">// {mode === "in" ? "sign_in" : "sign_up"}</p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input label="Email" name="email" type="email" required autoFocus />
          <Input label="Mot de passe" name="password" type="password" required minLength={8} />
          {err && <p className="text-xs text-destructive">{err}</p>}
          <button type="submit" disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-xs font-medium uppercase tracking-widest text-primary-foreground disabled:opacity-60">
            {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {mode === "in" ? "Se connecter" : "Créer le compte"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs">
          <button onClick={() => { setMode(mode === "in" ? "up" : "in"); setErr(""); }} className="font-mono text-muted-foreground hover:text-foreground">
            {mode === "in" ? "Créer un compte" : "J'ai déjà un compte"}
          </button>
          <Link to="/" className="font-mono text-muted-foreground hover:text-foreground">← retour</Link>
        </div>

        <p className="mt-6 font-mono text-[10px] leading-relaxed text-muted-foreground">
          Accès réservé à l'équipe FALL Trading and Investing. Toute tentative non autorisée est journalisée.
        </p>
      </div>
    </div>
  );
}

function NeedAdminCard() {
  const { user, signOut, claimFirstAdmin } = useAuth();
  const [busy, setBusy] = useState(false);

  async function claim() {
    setBusy(true);
    const ok = await claimFirstAdmin();
    setBusy(false);
    if (ok) toast.success("Vous êtes maintenant administrateur.");
    else toast.error("Un administrateur existe déjà. Contactez-le pour obtenir un accès.");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <div className="rounded-2xl border border-border bg-card p-8">
        <h1 className="font-display text-2xl">Accès restreint</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Le compte <span className="font-mono">{user?.email}</span> n'a pas les droits administrateur.
        </p>
        <div className="mt-6 rounded-lg border border-cyan/30 bg-cyan/5 p-4 text-xs">
          <p className="font-medium">Première installation ?</p>
          <p className="mt-1 text-muted-foreground">Si aucun administrateur n'existe encore, vous pouvez devenir le premier.</p>
          <button onClick={claim} disabled={busy} className="mt-3 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[11px] uppercase tracking-widest text-primary-foreground disabled:opacity-60">
            {busy && <Loader2 className="h-3 w-3 animate-spin" />} Devenir administrateur
          </button>
        </div>
        <button onClick={signOut} className="mt-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground">← se déconnecter</button>
      </div>
    </div>
  );
}

/* ============== ARTICLES ============== */

type Article = {
  id: string; slug: string; title: string; excerpt: string | null; body: string | null;
  category: string | null; cover_url: string | null; status: string; published_at: string | null;
};

function ArticlesAdmin() {
  const [items, setItems] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Article> | null>(null);
  const { user } = useAuth();

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("articles").select("*").order("updated_at", { ascending: false });
    if (error) toast.error(error.message); else setItems((data ?? []) as Article[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save(a: Partial<Article>) {
    const slug = a.slug?.trim();
    const title = a.title?.trim();
    if (!slug || !title) { toast.error("Slug et titre requis."); return; }
    const payload = {
      slug, title,
      excerpt: a.excerpt || null, body: a.body || null,
      category: a.category || null, cover_url: a.cover_url || null,
      status: a.status || "draft",
      published_at: a.status === "published" ? (a.published_at ?? new Date().toISOString()) : null,
    };
    const q = a.id
      ? supabase.from("articles").update(payload).eq("id", a.id)
      : supabase.from("articles").insert({ ...payload, author_id: user?.id ?? null });
    const { error } = await q;
    if (error) toast.error(error.message);
    else { toast.success("Article enregistré"); setEditing(null); load(); }
  }
  async function del(id: string) {
    if (!confirm("Supprimer cet article ?")) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Supprimé"); load(); }
  }
  async function togglePublish(a: Article) {
    const next = a.status === "published" ? "draft" : "published";
    await save({ ...a, status: next });
  }

  if (editing) return <ArticleEditor item={editing} onCancel={() => setEditing(null)} onSave={save} />;

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl">Articles & Perspectives</h2>
        <button onClick={() => setEditing({ status: "draft" })} className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-widest text-primary-foreground">
          <Plus className="h-3.5 w-3.5" /> Nouveau
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>
      ) : items.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">Aucun article. Créez le premier.</p>
      ) : (
        <ul className="mt-6 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {items.map((a) => (
            <li key={a.id} className="flex items-center gap-4 p-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${a.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {a.status === "published" ? "publié" : "brouillon"}
                  </span>
                  {a.category && <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{a.category}</span>}
                </div>
                <div className="mt-1 truncate font-display text-lg">{a.title}</div>
                <div className="truncate font-mono text-[11px] text-muted-foreground">/{a.slug}</div>
              </div>
              <button title="Publier / dépublier" onClick={() => togglePublish(a)} className="rounded-md border border-border p-2 hover:bg-secondary">
                {a.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button title="Éditer" onClick={() => setEditing(a)} className="rounded-md border border-border p-2 hover:bg-secondary"><Edit3 className="h-4 w-4" /></button>
              <button title="Supprimer" onClick={() => del(a.id)} className="rounded-md border border-border p-2 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ArticleEditor({ item, onCancel, onSave }: { item: Partial<Article>; onCancel: () => void; onSave: (a: Partial<Article>) => void }) {
  const [v, setV] = useState<Partial<Article>>(item);
  function up<K extends keyof Article>(k: K, val: Article[K] | null | undefined) { setV((p) => ({ ...p, [k]: val })); }

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl">{item.id ? "Modifier l'article" : "Nouvel article"}</h2>
        <div className="flex gap-2">
          <button onClick={onCancel} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs uppercase tracking-widest"><X className="h-3.5 w-3.5" /> Annuler</button>
          <button onClick={() => onSave(v)} className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-widest text-primary-foreground"><Save className="h-3.5 w-3.5" /> Enregistrer</button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Input label="Titre" required value={v.title ?? ""} onChange={(e) => up("title", e.target.value)} />
        <Input label="Slug (url)" required value={v.slug ?? ""} onChange={(e) => up("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"))} />
        <Input label="Catégorie" value={v.category ?? ""} onChange={(e) => up("category", e.target.value)} placeholder="Innovation, IA, Investissement…" />
        <Input label="Image de couverture (URL)" value={v.cover_url ?? ""} onChange={(e) => up("cover_url", e.target.value)} />
        <Textarea label="Extrait" rows={3} value={v.excerpt ?? ""} onChange={(e) => up("excerpt", e.target.value)} className="md:col-span-2" />
        <Textarea label="Contenu" rows={12} value={v.body ?? ""} onChange={(e) => up("body", e.target.value)} className="md:col-span-2" />
        <label className="text-sm">
          <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Statut</span>
          <select value={v.status ?? "draft"} onChange={(e) => up("status", e.target.value)}
            className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold">
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
          </select>
        </label>
      </div>
    </section>
  );
}

/* ============== PLATFORMS ============== */

type Platform = {
  id: string; slug: string; name: string; tagline: string | null; description: string | null;
  color: string | null; logo_url: string | null; tech_stack: string[] | null; features: string[] | null;
  audience: string | null; status: string; sort_order: number;
  users_count: number | null; last_activity_at: string | null; last_release_at: string | null;
  release_notes: string | null; web_url: string | null; ios_url: string | null; android_url: string | null;
};

function PlatformsAdmin() {
  const [items, setItems] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Platform> | null>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("platforms").select("*").order("sort_order");
    if (error) toast.error(error.message); else setItems((data ?? []) as Platform[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save(p: Partial<Platform>) {
    if (!p.slug || !p.name) { toast.error("Slug et nom requis."); return; }
    const payload = {
      slug: p.slug.trim(), name: p.name.trim(), tagline: p.tagline || null, description: p.description || null,
      color: p.color || null, logo_url: p.logo_url || null,
      tech_stack: p.tech_stack ?? [], features: p.features ?? [],
      audience: p.audience || null, status: p.status || "active", sort_order: p.sort_order ?? 0,
      users_count: p.users_count ?? 0,
      last_activity_at: p.last_activity_at || null,
      last_release_at: p.last_release_at || null,
      release_notes: p.release_notes || null,
      web_url: p.web_url || null, ios_url: p.ios_url || null, android_url: p.android_url || null,
    };
    const q = p.id ? supabase.from("platforms").update(payload).eq("id", p.id) : supabase.from("platforms").insert(payload);
    const { error } = await q;
    if (error) toast.error(error.message); else { toast.success("Plateforme enregistrée"); setEditing(null); load(); }
  }
  async function del(id: string) {
    if (!confirm("Supprimer cette plateforme ?")) return;
    const { error } = await supabase.from("platforms").delete().eq("id", id);
    if (error) toast.error(error.message); else { load(); }
  }

  if (editing) return <PlatformEditor item={editing} onCancel={() => setEditing(null)} onSave={save} />;

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl">Plateformes développées</h2>
        <button onClick={() => setEditing({ status: "active", sort_order: items.length + 1, tech_stack: [], features: [] })} className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-widest text-primary-foreground">
          <Plus className="h-3.5 w-3.5" /> Nouvelle
        </button>
      </div>
      {loading ? <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div> : (
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {items.map((p) => (
            <li key={p.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start gap-4">
                {p.logo_url && <img src={p.logo_url} alt={p.name} className="h-14 w-14 rounded-lg border border-border bg-white object-contain p-1" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${p.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-600"}`}>{p.status}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">#{p.sort_order}</span>
                  </div>
                  <div className="mt-1 font-display text-lg">{p.name}</div>
                  {p.tagline && <div className="text-xs text-muted-foreground">{p.tagline}</div>}
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setEditing(p)} className="flex-1 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-secondary">Éditer</button>
                <button onClick={() => del(p.id)} className="rounded-md border border-border px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function PlatformEditor({ item, onCancel, onSave }: { item: Partial<Platform>; onCancel: () => void; onSave: (p: Partial<Platform>) => void }) {
  const [v, setV] = useState<Partial<Platform>>(item);
  function up<K extends keyof Platform>(k: K, val: Platform[K] | null | undefined) { setV((p) => ({ ...p, [k]: val })); }

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl">{item.id ? "Modifier la plateforme" : "Nouvelle plateforme"}</h2>
        <div className="flex gap-2">
          <button onClick={onCancel} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs uppercase tracking-widest"><X className="h-3.5 w-3.5" /> Annuler</button>
          <button onClick={() => onSave(v)} className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-widest text-primary-foreground"><Save className="h-3.5 w-3.5" /> Enregistrer</button>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Input label="Nom" required value={v.name ?? ""} onChange={(e) => up("name", e.target.value)} />
        <Input label="Slug" required value={v.slug ?? ""} onChange={(e) => up("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"))} />
        <Input label="Tagline" value={v.tagline ?? ""} onChange={(e) => up("tagline", e.target.value)} className="md:col-span-2" />
        <Textarea label="Description" rows={4} value={v.description ?? ""} onChange={(e) => up("description", e.target.value)} className="md:col-span-2" />
        <div className="md:col-span-2">
          <LogoUploader slug={v.slug ?? ""} value={v.logo_url ?? ""} onChange={(val) => up("logo_url", val)} />
        </div>
        <Input label="Couleur d'accent (#hex)" value={v.color ?? ""} onChange={(e) => up("color", e.target.value)} placeholder="#0EA5E9" />
        <Input label="Audience" value={v.audience ?? ""} onChange={(e) => up("audience", e.target.value)} />
        <Input label="Stack technique (séparé par virgule)" value={(v.tech_stack ?? []).join(", ")} onChange={(e) => up("tech_stack", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} className="md:col-span-2" />
        <Input label="Fonctionnalités (séparé par virgule)" value={(v.features ?? []).join(", ")} onChange={(e) => up("features", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} className="md:col-span-2" />
        <Input label="Ordre d'affichage" type="number" value={String(v.sort_order ?? 0)} onChange={(e) => up("sort_order", Number(e.target.value))} />
        <label className="text-sm">
          <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Statut</span>
          <select value={v.status ?? "active"} onChange={(e) => up("status", e.target.value)}
            className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold">
            <option value="active">Actif</option><option value="hidden">Masqué</option>
          </select>
        </label>

        <div className="md:col-span-2 mt-2 rounded-lg border border-dashed border-border bg-secondary/30 p-4">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Indicateurs d'usage réel</div>
          <div className="mt-3 grid gap-4 md:grid-cols-3">
            <Input label="Utilisateurs actifs" type="number" min={0} value={String(v.users_count ?? 0)} onChange={(e) => up("users_count", Number(e.target.value))} />
            <Input label="Dernière activité" type="datetime-local" value={toLocalDt(v.last_activity_at)} onChange={(e) => up("last_activity_at", fromLocalDt(e.target.value))} />
            <Input label="Dernière mise à jour" type="datetime-local" value={toLocalDt(v.last_release_at)} onChange={(e) => up("last_release_at", fromLocalDt(e.target.value))} />
          </div>
          <Textarea label="Notes de version (changelog résumé)" rows={2} value={v.release_notes ?? ""} onChange={(e) => up("release_notes", e.target.value)} className="mt-4" />
        </div>

        <Input label="URL site web (https://…)" value={v.web_url ?? ""} onChange={(e) => up("web_url", e.target.value)} className="md:col-span-2" />
        <Input label="URL App Store iOS" value={v.ios_url ?? ""} onChange={(e) => up("ios_url", e.target.value)} />
        <Input label="URL Google Play" value={v.android_url ?? ""} onChange={(e) => up("android_url", e.target.value)} />
      </div>
    </section>
  );
}

function toLocalDt(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromLocalDt(v: string): string | null {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/* ============== MESSAGES ============== */

type Message = { id: string; reference: string; name: string; email: string; phone: string | null; company: string | null; message: string; status: string; created_at: string };

function MessagesAdmin() {
  const [items, setItems] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<Message | null>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message); else setItems((data ?? []) as Message[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function mark(id: string, status: string) {
    const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
    if (error) toast.error(error.message); else load();
  }

  return (
    <section>
      <h2 className="font-display text-xl">Messages reçus</h2>
      {loading ? <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div> : items.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">Aucun message reçu.</p>
      ) : (
        <ul className="mt-6 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {items.map((m) => (
            <li key={m.id} className="flex items-center gap-4 p-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${m.status === "new" ? "bg-cyan/15 text-cyan" : "bg-zinc-100 text-zinc-600"}`}>{m.status}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{m.reference}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{new Date(m.created_at).toLocaleString("fr-FR")}</span>
                </div>
                <div className="mt-1 truncate font-display text-base">{m.name} <span className="text-muted-foreground">— {m.email}</span></div>
                <div className="truncate text-xs text-muted-foreground">{m.message}</div>
              </div>
              <button onClick={() => setOpen(m)} className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-secondary">Lire</button>
              {m.status !== "archived" && (
                <button onClick={() => mark(m.id, "archived")} className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-secondary">Archiver</button>
              )}
            </li>
          ))}
        </ul>
      )}

      {open && (
        <div onClick={() => setOpen(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl rounded-2xl bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl">{open.name}</h3>
                <p className="font-mono text-[11px] text-muted-foreground">{open.email} {open.phone && `· ${open.phone}`} {open.company && `· ${open.company}`}</p>
              </div>
              <button onClick={() => setOpen(null)}><X className="h-4 w-4" /></button>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm">{open.message}</p>
            <div className="mt-6 flex gap-2">
              <a href={`mailto:${open.email}?subject=Re:%20Votre%20message%20FALL%20Trading%20${open.reference}`}
                className="rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-widest text-primary-foreground">Répondre</a>
              <button onClick={() => { mark(open.id, "read"); setOpen(null); }} className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-widest">Marquer lu</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ============== USERS ============== */

function UsersAdmin() {
  const [items, setItems] = useState<{ user_id: string; role: string }[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("user_roles").select("user_id, role").order("created_at", { ascending: false });
    if (error) toast.error(error.message); else setItems(data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const byUser = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const r of items) map.set(r.user_id, [...(map.get(r.user_id) ?? []), r.role]);
    return Array.from(map.entries());
  }, [items]);

  return (
    <section>
      <h2 className="font-display text-xl">Utilisateurs & rôles</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Pour ajouter un nouvel administrateur ou éditeur : demandez-lui de créer un compte sur cette page,
        puis revenez ici pour lui attribuer un rôle.
      </p>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div> : (
        <ul className="mt-6 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {byUser.map(([uid, roles]) => (
            <li key={uid} className="flex items-center justify-between p-4">
              <div>
                <div className="font-mono text-xs">{uid}</div>
                <div className="mt-1 flex gap-2">
                  {roles.map((r) => <span key={r} className="rounded-full bg-cyan/15 px-2 py-0.5 font-mono text-[10px] uppercase text-cyan">{r}</span>)}
                </div>
              </div>
              <AddRoleControl userId={uid} onChange={load} existing={roles} />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 rounded-xl border border-border bg-secondary/40 p-4">
        <h3 className="font-display text-base">Ajouter un rôle par email</h3>
        <AddByEmail onDone={load} />
      </div>
    </section>
  );
}

function AddRoleControl({ userId, existing, onChange }: { userId: string; existing: string[]; onChange: () => void }) {
  async function add(role: "admin" | "editor") {
    if (existing.includes(role)) return;
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
    if (error) toast.error(error.message); else { toast.success(`Rôle ${role} ajouté`); onChange(); }
  }
  async function remove(role: string) {
    if (!confirm(`Retirer le rôle ${role} ?`)) return;
    const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role as "admin" | "editor");
    if (error) toast.error(error.message); else onChange();
  }
  return (
    <div className="flex gap-2">
      {!existing.includes("editor") && <button onClick={() => add("editor")} className="rounded-md border border-border px-3 py-1.5 text-[11px] hover:bg-secondary">+ Editor</button>}
      {!existing.includes("admin") && <button onClick={() => add("admin")} className="rounded-md border border-border px-3 py-1.5 text-[11px] hover:bg-secondary">+ Admin</button>}
      {existing.map((r) => (
        <button key={r} onClick={() => remove(r)} className="rounded-md border border-border px-3 py-1.5 text-[11px] text-destructive hover:bg-destructive/10">− {r}</button>
      ))}
    </div>
  );
}

function AddByEmail({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "editor">("editor");
  const [busy, setBusy] = useState(false);

  async function add() {
    if (!email) return;
    setBusy(true);
    // Find user id via profiles join — but profiles doesn't have email. Use auth via admin? Not available client-side.
    // Workaround: ask the user to share their UID, or look up via their submitted profile.
    // Instead: hint to use the list above after sign-up.
    setBusy(false);
    toast.message("Demandez à la personne de créer son compte sur /admin, puis ajoutez son rôle depuis la liste ci-dessus.");
    setEmail("");
    onDone();
  }

  return (
    <div className="mt-3 flex gap-2">
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemple.com" type="email"
        className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none" />
      <select value={role} onChange={(e) => setRole(e.target.value as "admin" | "editor")} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
        <option value="editor">Editor</option><option value="admin">Admin</option>
      </select>
      <button onClick={add} disabled={busy} className="rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-widest text-primary-foreground">Info</button>
    </div>
  );
}

/* ============== ALLOCATIONS ============== */

type Allocation = {
  id: string;
  label: string;
  focus: string | null;
  weight: number | null;
  color: string | null;
  source_note: string | null;
  source_url: string | null;
  sort_order: number;
  status: string;
  updated_at: string;
};

type HistoryEntry = {
  id: string;
  allocation_id: string | null;
  action: string;
  actor_email: string | null;
  created_at: string;
  snapshot: { label?: string } | null;
};

function AllocationsAdmin() {
  const { user } = useAuth();
  const [items, setItems] = useState<Allocation[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Allocation> | null>(null);

  async function load() {
    setLoading(true);
    const [a, h] = await Promise.all([
      supabase.from("allocations").select("*").order("sort_order"),
      supabase.from("allocation_history").select("*").order("created_at", { ascending: false }).limit(20),
    ]);
    if (a.error) toast.error(a.error.message); else setItems((a.data ?? []) as Allocation[]);
    if (!h.error) setHistory((h.data ?? []) as HistoryEntry[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function logHistory(action: string, allocation_id: string | null, snapshot: unknown) {
    try {
      await supabase.from("allocation_history").insert({
        allocation_id, action, snapshot: snapshot as never,
        actor_id: user?.id ?? null, actor_email: user?.email ?? null,
      });
    } catch {
      // Fallback : on stocke localement si l'écriture échoue.
      try {
        const key = "alloc_history_fallback";
        const prev = JSON.parse(localStorage.getItem(key) ?? "[]");
        prev.unshift({ action, allocation_id, snapshot, at: new Date().toISOString(), actor: user?.email });
        localStorage.setItem(key, JSON.stringify(prev.slice(0, 50)));
      } catch { /* ignore */ }
    }
  }

  async function save(v: Partial<Allocation>) {
    const label = v.label?.trim();
    if (!label) { toast.error("Libellé requis."); return; }

    // Validation : doublon de libellé (insensible à la casse)
    const duplicate = items.find((it) => it.label.trim().toLowerCase() === label.toLowerCase() && it.id !== v.id);
    if (duplicate) { toast.error(`Doublon : un libellé "${duplicate.label}" existe déjà.`); return; }

    // Validation : URL de source si fournie + note recommandée si publication
    const url = v.source_url?.trim() || null;
    if (url) {
      try {
        const u = new URL(url);
        if (!/^https?:$/.test(u.protocol)) throw new Error("protocol");
      } catch {
        toast.error("Lien de source invalide. Utilisez une URL http(s) complète.");
        return;
      }
    }
    if (v.status === "published" && url && !v.source_note?.trim()) {
      toast.error("Note de source obligatoire avant publication d'une ligne avec lien.");
      return;
    }

    const payload = {
      label,
      focus: v.focus || null,
      weight: v.weight ?? null,
      color: v.color || null,
      source_note: v.source_note?.trim() || null,
      source_url: url,
      sort_order: v.sort_order ?? items.length + 1,
      status: v.status || "draft",
      updated_by: user?.id ?? null,
    };
    const isNew = !v.id;
    const q = isNew
      ? supabase.from("allocations").insert(payload).select().single()
      : supabase.from("allocations").update(payload).eq("id", v.id!).select().single();
    const { data, error } = await q;
    if (error) {
      toast.error(`Sauvegarde échouée : ${error.message}. Vos modifications sont conservées localement.`);
      try { localStorage.setItem(`alloc_draft_${v.id ?? "new"}`, JSON.stringify(payload)); } catch { /* ignore */ }
      return;
    }
    await logHistory(isNew ? "created" : "updated", data.id, payload);
    toast.success(isNew ? "Allocation créée" : "Allocation mise à jour");
    setEditing(null);
    load();
  }

  async function togglePublish(a: Allocation) {
    const next = a.status === "published" ? "draft" : "published";
    const { error } = await supabase.from("allocations").update({ status: next, updated_by: user?.id }).eq("id", a.id);
    if (error) { toast.error(error.message); return; }
    await logHistory(next === "published" ? "published" : "unpublished", a.id, { ...a, status: next });
    load();
  }

  async function del(a: Allocation) {
    if (!confirm(`Supprimer "${a.label}" ?`)) return;
    const { error } = await supabase.from("allocations").delete().eq("id", a.id);
    if (error) { toast.error(error.message); return; }
    await logHistory("deleted", a.id, a);
    load();
  }

  if (editing) return <AllocationEditor item={editing} onCancel={() => setEditing(null)} onSave={save} />;

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl">Allocations stratégiques</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Pondérations sectorielles affichées sur la page d'accueil. Brouillon par défaut — publiez pour rendre visible.
          </p>
        </div>
        <button
          onClick={() => setEditing({ status: "draft", sort_order: items.length + 1, color: "#3B82F6" })}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-widest text-primary-foreground"
        >
          <Plus className="h-3.5 w-3.5" /> Nouvelle ligne
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>
      ) : items.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          Aucune allocation. Créez la première ligne.
        </p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
          {/* Desktop table */}
          <table className="hidden w-full text-left text-sm md:table">
            <thead className="bg-secondary/40 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Libellé</th>
                <th className="px-4 py-3">Focus</th>
                <th className="px-4 py-3 text-right">Poids</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((a) => (
                <tr key={a.id} className="transition-colors hover:bg-secondary/20">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{a.sort_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 font-medium">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: a.color ?? "#999" }} />
                      {a.label}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{a.focus ?? "—"}</td>
                  <td className="px-4 py-3 text-right font-mono">{a.weight != null ? `${a.weight}%` : "—"}</td>
                  <td className="px-4 py-3 text-xs">
                    {a.source_url ? (
                      <a href={a.source_url} target="_blank" rel="noopener noreferrer" className="text-azure hover:underline">
                        {a.source_note ?? "Lien"}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">{a.source_note ?? "—"}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${a.status === "published" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
                      {a.status === "published" ? "publié" : "brouillon"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button title="Publier / dépublier" onClick={() => togglePublish(a)} className="rounded-md border border-border p-1.5 hover:bg-secondary">
                        {a.status === "published" ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                      <button title="Éditer" onClick={() => setEditing(a)} className="rounded-md border border-border p-1.5 hover:bg-secondary"><Edit3 className="h-3.5 w-3.5" /></button>
                      <button title="Supprimer" onClick={() => del(a)} className="rounded-md border border-border p-1.5 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Mobile cards */}
          <ul className="divide-y divide-border md:hidden">
            {items.map((a) => (
              <li key={a.id} className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-medium">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: a.color ?? "#999" }} />
                    {a.label}
                  </div>
                  <span className={`rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${a.status === "published" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
                    {a.status === "published" ? "publié" : "brouillon"}
                  </span>
                </div>
                {a.focus && <div className="mt-1 text-xs text-muted-foreground">{a.focus}</div>}
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="font-mono">{a.weight != null ? `${a.weight}%` : "Poids non défini"}</span>
                  {a.source_url && <a href={a.source_url} target="_blank" rel="noopener noreferrer" className="text-azure hover:underline">{a.source_note ?? "Source"}</a>}
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => togglePublish(a)} className="flex-1 rounded-md border border-border px-3 py-1.5 text-xs">{a.status === "published" ? "Dépublier" : "Publier"}</button>
                  <button onClick={() => setEditing(a)} className="rounded-md border border-border px-3 py-1.5 text-xs">Éditer</button>
                  <button onClick={() => del(a)} className="rounded-md border border-border px-3 py-1.5 text-xs text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Historique */}
      <div className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-cyan">
              <History className="h-3.5 w-3.5" /> // historique_des_mises_a_jour
            </div>
            <h3 className="mt-1 font-display text-lg">Dernières modifications</h3>
          </div>
          <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              if (history.length === 0) { toast.message("Aucun historique à exporter."); return; }
              const header = ["date_iso", "action", "libelle", "auteur_email", "allocation_id"];
              const rows = history.map((h) => [
                h.created_at,
                h.action,
                (h.snapshot?.label ?? "").replace(/"/g, '""'),
                h.actor_email ?? "",
                h.allocation_id ?? "",
              ]);
              const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c)}"`).join(",")).join("\n");
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = `allocations-historique-${new Date().toISOString().slice(0, 10)}.csv`;
              a.click();
              URL.revokeObjectURL(a.href);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs uppercase tracking-widest hover:bg-secondary"
          >
            Exporter CSV
          </button>
          <button
            onClick={() => {
              if (history.length === 0) { toast.message("Aucun historique à exporter."); return; }
              const esc = (s: string) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
              const rowsHtml = history.map((h) => {
                const snap = (h.snapshot ?? {}) as Record<string, unknown>;
                const get = (k: string) => snap[k] != null ? String(snap[k]) : "";
                const details = [
                  get("label") ? `<strong>Libellé :</strong> ${esc(get("label"))}` : null,
                  get("weight") ? `<strong>Poids :</strong> ${esc(get("weight"))}` : null,
                  get("status") ? `<strong>Statut :</strong> ${esc(get("status"))}` : null,
                  get("source_url") ? `<strong>Source :</strong> ${esc(get("source_url"))}` : null,
                  get("source_note") ? `<strong>Note :</strong> ${esc(get("source_note"))}` : null,
                ].filter(Boolean).join(" · ");
                return `<tr>
                  <td>${new Date(h.created_at).toLocaleString("fr-FR")}</td>
                  <td><span class="badge">${esc(h.action)}</span></td>
                  <td>${esc(get("label") || "—")}</td>
                  <td>${esc(h.actor_email ?? "système")}</td>
                  <td class="details">${details || "—"}</td>
                </tr>`;
              }).join("");
              const html = `<!doctype html><html><head><meta charset="utf-8"><title>Historique allocations — ${new Date().toLocaleDateString("fr-FR")}</title>
                <style>
                  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:24px;color:#111}
                  h1{font-size:18px;margin:0 0 4px}
                  .sub{color:#555;font-size:12px;margin-bottom:18px}
                  table{width:100%;border-collapse:collapse;font-size:11px}
                  th,td{border:1px solid #ddd;padding:6px 8px;text-align:left;vertical-align:top}
                  th{background:#f5f5f5;text-transform:uppercase;letter-spacing:.05em;font-size:10px}
                  .badge{display:inline-block;padding:2px 6px;border-radius:10px;background:#eef;font-size:10px}
                  .details{max-width:280px;word-break:break-word}
                  @media print{ button{display:none} }
                </style></head><body>
                <h1>Historique des mises à jour — Allocations</h1>
                <div class="sub">FALL Trading and Investing · Généré le ${new Date().toLocaleString("fr-FR")} · ${history.length} entrée(s)</div>
                <table><thead><tr><th>Date & heure</th><th>Action</th><th>Libellé</th><th>Auteur</th><th>Détails</th></tr></thead>
                <tbody>${rowsHtml}</tbody></table>
                <script>window.onload=()=>setTimeout(()=>window.print(),300)</script>
                </body></html>`;
              const w = window.open("", "_blank");
              if (!w) { toast.error("Activez les pop-ups pour exporter en PDF."); return; }
              w.document.write(html); w.document.close();
            }}
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-xs uppercase tracking-widest text-gold hover:bg-gold/20"
          >
            Exporter PDF
          </button>
          </div>
        </div>
        {history.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
            Aucune modification enregistrée pour le moment.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {history.map((h) => (
              <li key={h.id} className="flex flex-wrap items-center gap-3 p-3 text-xs">
                <span className={`rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${
                  h.action === "deleted" ? "bg-destructive/20 text-destructive" :
                  h.action === "published" ? "bg-emerald-500/20 text-emerald-300" :
                  h.action === "unpublished" ? "bg-amber-500/20 text-amber-300" :
                  "bg-azure/20 text-azure"
                }`}>{h.action}</span>
                <span className="font-medium">{h.snapshot?.label ?? "—"}</span>
                <span className="text-muted-foreground">{h.actor_email ?? "système"}</span>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                  {new Date(h.created_at).toLocaleString("fr-FR")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function AllocationEditor({ item, onCancel, onSave }: { item: Partial<Allocation>; onCancel: () => void; onSave: (v: Partial<Allocation>) => void }) {
  const [v, setV] = useState<Partial<Allocation>>(item);
  function up<K extends keyof Allocation>(k: K, val: Allocation[K] | null | undefined) { setV((p) => ({ ...p, [k]: val })); }
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl">{item.id ? "Modifier l'allocation" : "Nouvelle allocation"}</h2>
        <div className="flex gap-2">
          <button onClick={onCancel} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs uppercase tracking-widest"><X className="h-3.5 w-3.5" /> Annuler</button>
          <button onClick={() => onSave(v)} className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-widest text-primary-foreground"><Save className="h-3.5 w-3.5" /> Enregistrer</button>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Input label="Libellé" required value={v.label ?? ""} onChange={(e) => up("label", e.target.value)} />
        <Input label="Focus / description courte" value={v.focus ?? ""} onChange={(e) => up("focus", e.target.value)} />
        <Input label="Poids (%)" type="number" step="0.01" value={v.weight != null ? String(v.weight) : ""} onChange={(e) => up("weight", e.target.value ? Number(e.target.value) : null)} />
        <Input label="Couleur (#hex)" value={v.color ?? ""} onChange={(e) => up("color", e.target.value)} placeholder="#3B82F6" />
        <Input label="Note de source" value={v.source_note ?? ""} onChange={(e) => up("source_note", e.target.value)} placeholder="ex. BCEAO 2024" />
        <Input label="Lien officiel (URL)" type="url" value={v.source_url ?? ""} onChange={(e) => up("source_url", e.target.value)} placeholder="https://…" />
        <Input label="Ordre d'affichage" type="number" value={String(v.sort_order ?? 0)} onChange={(e) => up("sort_order", Number(e.target.value))} />
        <label className="text-sm">
          <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Statut</span>
          <select value={v.status ?? "draft"} onChange={(e) => up("status", e.target.value)}
            className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold">
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
          </select>
        </label>
      </div>
    </section>
  );
}

/* ============== Shared ============== */

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; className?: string }) {
  const { label, className, ...rest } = props;
  return (
    <label className={`text-sm ${className ?? ""}`}>
      <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}{rest.required ? " *" : ""}</span>
      <input {...rest} className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold" />
    </label>
  );
}
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; className?: string }) {
  const { label, className, ...rest } = props;
  return (
    <label className={`text-sm ${className ?? ""}`}>
      <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <textarea {...rest} className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold" />
    </label>
  );
}

/* ============== LOGO UPLOADER ============== */

function LogoUploader({ slug, value, onChange }: { slug: string; value: string; onChange: (v: string) => void }) {
  const uploadFn = useServerFn(uploadPlatformAsset);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (file.size > 4 * 1024 * 1024) { toast.error("Fichier > 4 Mo"); return; }
    setUploading(true);
    try {
      const buf = await file.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
      const { path } = await uploadFn({ data: { filename: file.name, contentType: file.type, base64, platformSlug: slug || "shared", kind: "logo" } });
      onChange(path);
      toast.success("Logo téléversé");
    } catch (e: any) {
      toast.error(e?.message || "Échec téléversement");
    } finally {
      setUploading(false);
    }
  }

  const isSigned = value.startsWith("signed://");

  return (
    <div className="rounded-lg border border-dashed border-border bg-secondary/30 p-4">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Logo</div>
      <div className="mt-3 flex flex-wrap items-start gap-4">
        {value ? (
          <div className="h-20 w-20 rounded-lg border border-border bg-white p-1">
            <SignedImage src={value} alt="Logo" className="h-full w-full object-contain" />
          </div>
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground">
            <Layers className="h-6 w-6" />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-widest text-primary-foreground disabled:opacity-60">
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              {uploading ? "Téléversement…" : "Téléverser un fichier"}
            </button>
            {value && (
              <button type="button" onClick={() => onChange("")}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs uppercase tracking-widest hover:bg-secondary">
                <Trash2 className="h-3.5 w-3.5" /> Retirer
              </button>
            )}
          </div>
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…ou collez une URL https://"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-xs focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
          <p className="font-mono text-[10px] text-muted-foreground">
            {isSigned ? "Fichier privé sur Lovable Cloud — URL signée renouvelée auto." : value ? "URL externe (publique)." : "PNG/SVG conseillé, ≤ 4 Mo."}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============== EMAIL LOGS ============== */

type EmailLog = {
  id: string; kind: string; reference: string; to_email: string; subject: string;
  status: string; error: string | null; provider_id: string | null;
  created_at: string; sent_at: string | null;
};

function EmailLogsAdmin() {
  const [items, setItems] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterKind, setFilterKind] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("email_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) toast.error(error.message);
    else setItems((data ?? []) as EmailLog[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => items.filter((it) => {
    if (filterKind !== "all" && it.kind !== filterKind) return false;
    if (filterStatus !== "all" && it.status !== filterStatus) return false;
    if (q && !(`${it.reference} ${it.to_email} ${it.subject}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  }), [items, filterKind, filterStatus, q]);

  function badge(status: string) {
    const cls: Record<string, string> = {
      sent: "bg-emerald/10 text-emerald",
      pending: "bg-azure/10 text-azure",
      failed: "bg-destructive/10 text-destructive",
      disabled: "bg-muted text-muted-foreground",
    };
    return <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${cls[status] ?? "bg-secondary"}`}>{status}</span>;
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl">Logs emails</h2>
          <p className="mt-1 text-xs text-muted-foreground">Historique des emails (contact + publications) avec référence unique, destinataire et issue.</p>
        </div>
        <button onClick={load} className="rounded-full border border-border px-3 py-1.5 text-xs uppercase tracking-widest hover:bg-secondary">Rafraîchir</button>
      </div>

      <div className="mt-4 rounded-lg border border-gold/30 bg-gold/5 p-3 text-xs text-foreground/80">
        ⚠ L'envoi réel est <strong>désactivé</strong> tant que le domaine <code className="font-mono">doctorndeypharma.sn</code> n'est pas vérifié (SPF/DKIM/DMARC). Les références sont créées en base et apparaîtront ici dès l'activation.
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <select value={filterKind} onChange={(e) => setFilterKind(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-xs">
          <option value="all">Tous les types</option>
          <option value="contact_receipt">Contact (accusé)</option>
          <option value="publication">Publication</option>
          <option value="allocation_publication">Publication — allocation</option>
          <option value="article_publication">Publication — article</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-xs">
          <option value="all">Tous statuts</option>
          <option value="pending">Pending</option>
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
          <option value="disabled">Disabled</option>
        </select>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher (référence, email, sujet)…"
          className="flex-1 min-w-[200px] rounded-lg border border-input bg-background px-3 py-2 text-xs" />
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div> : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-secondary/40 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Horodatage</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Référence</th>
                <th className="px-4 py-3">Destinataire</th>
                <th className="px-4 py-3">Sujet</th>
                <th className="px-4 py-3">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-xs text-muted-foreground">Aucun log pour l'instant.</td></tr>
              ) : filtered.map((it) => (
                <tr key={it.id}>
                  <td className="px-4 py-3 font-mono text-[11px]">{new Date(it.created_at).toLocaleString("fr-FR")}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">{it.kind}</td>
                  <td className="px-4 py-3 font-mono text-[11px]">{it.reference}</td>
                  <td className="px-4 py-3">{it.to_email}</td>
                  <td className="px-4 py-3 truncate max-w-[280px]" title={it.subject}>{it.subject}</td>
                  <td className="px-4 py-3">{badge(it.status)}{it.error && <div className="mt-1 text-[10px] text-destructive">{it.error}</div>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
