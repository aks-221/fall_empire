
-- Enum statut email
DO $$ BEGIN
  CREATE TYPE public.email_kind AS ENUM ('contact_receipt', 'publication', 'allocation_publication', 'article_publication');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.email_status AS ENUM ('pending', 'sent', 'failed', 'disabled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- email_logs
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind public.email_kind NOT NULL,
  reference TEXT NOT NULL,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status public.email_status NOT NULL DEFAULT 'pending',
  error TEXT,
  provider_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS email_logs_created_at_idx ON public.email_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS email_logs_reference_idx ON public.email_logs (reference);

GRANT SELECT ON public.email_logs TO authenticated;
GRANT ALL ON public.email_logs TO service_role;

ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "email_logs_read_staff" ON public.email_logs;
CREATE POLICY "email_logs_read_staff" ON public.email_logs
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- brvm_snapshots
CREATE TABLE IF NOT EXISTS public.brvm_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL CHECK (source IN ('live','fallback')),
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  message TEXT NOT NULL,
  quotes JSONB NOT NULL DEFAULT '[]'::jsonb,
  reference_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS brvm_snapshots_fetched_at_idx ON public.brvm_snapshots (fetched_at DESC);

GRANT SELECT ON public.brvm_snapshots TO anon, authenticated;
GRANT ALL ON public.brvm_snapshots TO service_role;

ALTER TABLE public.brvm_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "brvm_snapshots_public_read" ON public.brvm_snapshots;
CREATE POLICY "brvm_snapshots_public_read" ON public.brvm_snapshots
  FOR SELECT TO anon, authenticated USING (true);

-- Storage policies for platform-assets bucket (admin/editor only via signed URLs)
DROP POLICY IF EXISTS "platform_assets_staff_all" ON storage.objects;
CREATE POLICY "platform_assets_staff_all" ON storage.objects
  FOR ALL TO authenticated
  USING (
    bucket_id = 'platform-assets'
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  )
  WITH CHECK (
    bucket_id = 'platform-assets'
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  );
