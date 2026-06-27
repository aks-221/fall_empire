import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/actualites/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Perspective — FALL Trading and Investing` },
      { name: "description", content: `Lecture FALL Trading and Investing — ${params.slug}` },
    ],
  }),
  component: Article,
  errorComponent: ({ error }) => <div className="mx-auto max-w-3xl p-10 text-center"><p>{error.message}</p></div>,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-display text-4xl">Article introuvable</h1>
      <Link to="/actualites" className="mt-6 inline-block font-mono text-xs uppercase tracking-widest text-gold">← Toutes les perspectives</Link>
    </div>
  ),
});

function Article() {
  const { slug } = Route.useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data;
    },
  });

  if (isLoading) return <div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>;
  if (error || !data) return null;

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <Link to="/actualites" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-gold">
        <ArrowLeft className="h-3.5 w-3.5" /> Perspectives
      </Link>
      <div className="mt-8 font-mono text-[10px] uppercase tracking-[0.24em] text-gold">{data.category}</div>
      <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{data.title}</h1>
      {data.excerpt && <p className="mt-5 text-lg text-muted-foreground">{data.excerpt}</p>}
      {data.cover_url && (
        <img src={data.cover_url} alt={data.title} className="mt-8 w-full rounded-2xl border border-border" loading="lazy" />
      )}
      <div className="prose prose-neutral mt-10 max-w-none whitespace-pre-wrap text-base leading-relaxed text-foreground/85">
        {data.body}
      </div>
    </article>
  );
}
