
-- Enum des rôles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_self_read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_self_update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_self_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- user_roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role security definer
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "roles_self_read" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "roles_admin_all" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- handle_new_user trigger to auto-create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- articles
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT,
  category TEXT,
  cover_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.articles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "articles_public_read" ON public.articles FOR SELECT TO anon, authenticated USING (status = 'published' OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY "articles_admin_write" ON public.articles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')) WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE TRIGGER articles_updated BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- platforms
CREATE TABLE public.platforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  color TEXT,
  logo_url TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  audience TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','hidden')),
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.platforms TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.platforms TO authenticated;
GRANT ALL ON public.platforms TO service_role;
ALTER TABLE public.platforms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "platforms_public_read" ON public.platforms FOR SELECT TO anon, authenticated USING (status = 'active' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "platforms_admin_write" ON public.platforms FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER platforms_updated BEFORE UPDATE ON public.platforms FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- contact_messages
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL UNIQUE DEFAULT upper(substr(gen_random_uuid()::text, 1, 8)),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','read','archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contact_insert_anyone" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (
  length(name) BETWEEN 2 AND 200 AND
  length(email) BETWEEN 5 AND 255 AND
  email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND
  length(message) BETWEEN 10 AND 5000
);
CREATE POLICY "contact_admin_read" ON public.contact_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "contact_admin_update" ON public.contact_messages FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "contact_admin_delete" ON public.contact_messages FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Seed platforms
INSERT INTO public.platforms (slug, name, tagline, description, color, tech_stack, features, audience, sort_order) VALUES
('ndey-pharma', 'Doctor NDEY Pharma', 'Pharmacie intelligente & OCR ordonnances', 'Application mobile dédiée aux professionnels de santé et patients : recherche de médicaments, OCR d''ordonnances, géolocalisation des pharmacies de garde.', '#0EA5E9', ARRAY['Flutter','Supabase','OCR/IA','Google Maps'], ARRAY['Recherche médicaments','OCR ordonnances','Pharmacies de garde','Carte interactive'], 'Patients, pharmaciens, professionnels de santé', 1),
('life-estudiantin', 'Life Estudiantin', 'L''écosystème de l''étudiant africain', 'Plateforme dédiée à la vie étudiante : bourses, logement, événements, opportunités professionnelles et networking académique.', '#8B5CF6', ARRAY['Flutter','Supabase','IA','Notifications push'], ARRAY['Bourses & financements','Logement étudiant','Événements campus','Réseau alumni'], 'Étudiants, universités, partenaires académiques', 2),
('samamenu', 'SamaMenu', 'La restauration digitale du Sénégal', 'Marketplace mobile reliant restaurants, livreurs et clients : commande en ligne, paiement mobile, suivi en temps réel.', '#F59E0B', ARRAY['Flutter','Supabase','Paiement mobile','Realtime'], ARRAY['Commande restaurants','Livraison temps réel','Paiement Wave/OM','Programme fidélité'], 'Restaurants, livreurs, consommateurs', 3);

-- Seed articles
INSERT INTO public.articles (slug, title, excerpt, body, category, status, published_at) VALUES
('souverainete-numerique-afrique', 'Souveraineté numérique : l''Afrique doit posséder ses données', 'Pourquoi la prochaine décennie économique africaine se jouera dans des datacenters locaux et des plateformes maîtrisées de bout en bout.', 'L''économie de la donnée redéfinit les rapports de force. Pour FALL Trading and Investing, la souveraineté numérique n''est pas un slogan : c''est la condition d''une croissance durable...', 'Souveraineté', 'published', now()),
('ia-pme-senegalaises', 'L''IA appliquée aux PME sénégalaises', 'Comment l''intelligence artificielle transforme déjà la gestion, le marketing et la relation client des entreprises locales.', 'Loin des hype-cycles, l''IA générative et l''automatisation intelligente offrent un effet de levier tangible aux PME ouest-africaines...', 'Intelligence Artificielle', 'published', now()),
('investir-dans-la-tech-africaine', 'Investir dans la tech africaine : nos convictions', 'Thèses d''investissement, secteurs prioritaires et critères de sélection des startups que nous accompagnons.', 'Notre conviction est claire : l''Afrique de l''Ouest est un terrain d''innovation sous-capitalisé...', 'Investissement', 'published', now());
