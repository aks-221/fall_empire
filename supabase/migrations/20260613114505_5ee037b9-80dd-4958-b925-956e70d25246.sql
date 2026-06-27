
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS search_tsv tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('french', coalesce(title,'')), 'A') ||
    setweight(to_tsvector('french', coalesce(category,'')), 'B') ||
    setweight(to_tsvector('french', coalesce(excerpt,'')), 'B') ||
    setweight(to_tsvector('french', coalesce(body,'')), 'C')
  ) STORED;

CREATE INDEX IF NOT EXISTS articles_search_tsv_idx ON public.articles USING gin (search_tsv);
CREATE INDEX IF NOT EXISTS articles_published_idx ON public.articles (status, published_at DESC) WHERE status = 'published';

CREATE OR REPLACE FUNCTION public.search_articles(_query text, _limit int DEFAULT 20)
RETURNS TABLE (
  id uuid, slug text, title text, excerpt text, category text,
  cover_url text, published_at timestamptz, rank real
)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT a.id, a.slug, a.title, a.excerpt, a.category, a.cover_url, a.published_at,
         ts_rank(a.search_tsv, websearch_to_tsquery('french', _query)) AS rank
  FROM public.articles a
  WHERE a.status = 'published'
    AND (_query = '' OR a.search_tsv @@ websearch_to_tsquery('french', _query))
  ORDER BY (CASE WHEN _query = '' THEN 0 ELSE ts_rank(a.search_tsv, websearch_to_tsquery('french', _query)) END) DESC,
           a.published_at DESC NULLS LAST
  LIMIT GREATEST(1, LEAST(_limit, 50))
$$;

GRANT EXECUTE ON FUNCTION public.search_articles(text, int) TO anon, authenticated;
