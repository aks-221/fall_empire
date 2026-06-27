
CREATE TABLE public.allocations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  focus TEXT,
  weight NUMERIC(5,2),
  color TEXT,
  source_note TEXT,
  source_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.allocations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.allocations TO authenticated;
GRANT ALL ON public.allocations TO service_role;

ALTER TABLE public.allocations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published allocations"
  ON public.allocations FOR SELECT
  USING (status = 'published' OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins and editors can insert allocations"
  ON public.allocations FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins and editors can update allocations"
  ON public.allocations FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins can delete allocations"
  ON public.allocations FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER tg_allocations_updated_at
  BEFORE UPDATE ON public.allocations
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- History log
CREATE TABLE public.allocation_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  allocation_id UUID REFERENCES public.allocations(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('created','updated','published','unpublished','deleted')),
  snapshot JSONB,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.allocation_history TO authenticated;
GRANT ALL ON public.allocation_history TO service_role;

ALTER TABLE public.allocation_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and editors can read history"
  ON public.allocation_history FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins and editors can insert history"
  ON public.allocation_history FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Seed initial allocations from current static list
INSERT INTO public.allocations (label, focus, color, sort_order, status, source_note, source_url) VALUES
  ('Technologie & IA', 'Modèles, OCR, NLP, plateformes', '#3B82F6', 1, 'published', 'Métiers internes FALL Trading', 'https://www.brvm.org'),
  ('Santé digitale', 'Doctor NDEY Pharma · OCR ordonnances', '#34D399', 2, 'published', 'Produit live NDEY Pharma', NULL),
  ('EdTech', 'Life Estudiantin · vie universitaire', '#A78BFA', 3, 'published', 'Produit live Life Estudiantin', NULL),
  ('FoodTech & services', 'SamaMenu · QR menus, paiement', '#E2B044', 4, 'published', 'Produit live SamaMenu', NULL),
  ('Commerce international', 'Import, export, négoce UEMOA', '#60A5FA', 5, 'published', 'Zone BCEAO / UEMOA', 'https://www.bceao.int');
