
-- Admin notification email (single source of truth)
CREATE OR REPLACE FUNCTION public.notify_admin_email() RETURNS text
LANGUAGE sql IMMUTABLE AS $$ SELECT 'contact@doctorndeypharma.sn'::text $$;

-- ===== Contact receipt =====
CREATE OR REPLACE FUNCTION public.tg_enqueue_contact_receipt()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- Accusé pour l'expéditeur
  INSERT INTO public.email_logs (kind, reference, to_email, subject, status, metadata)
  VALUES (
    'contact_receipt', NEW.reference, NEW.email,
    'Votre message a bien été reçu — réf ' || NEW.reference,
    'disabled',
    jsonb_build_object('name', NEW.name, 'company', NEW.company, 'message', NEW.message)
  );
  -- Notification équipe
  INSERT INTO public.email_logs (kind, reference, to_email, subject, status, metadata)
  VALUES (
    'contact_receipt', NEW.reference, public.notify_admin_email(),
    '[Contact] ' || NEW.name || ' — réf ' || NEW.reference,
    'disabled',
    jsonb_build_object('name', NEW.name, 'email', NEW.email, 'phone', NEW.phone, 'company', NEW.company, 'message', NEW.message)
  );
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS tg_contact_messages_receipt ON public.contact_messages;
CREATE TRIGGER tg_contact_messages_receipt
AFTER INSERT ON public.contact_messages
FOR EACH ROW EXECUTE FUNCTION public.tg_enqueue_contact_receipt();

-- ===== Publication: platforms =====
CREATE OR REPLACE FUNCTION public.tg_enqueue_platform_publication()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'published' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO public.email_logs (kind, reference, to_email, subject, status, metadata)
    VALUES (
      'publication',
      'PLT-' || substr(NEW.id::text, 1, 8) || '-' || to_char(now(), 'YYYYMMDDHH24MISS'),
      public.notify_admin_email(),
      '[Publication] Plateforme — ' || NEW.name,
      'disabled',
      jsonb_build_object('platform_id', NEW.id, 'slug', NEW.slug, 'name', NEW.name, 'tagline', NEW.tagline)
    );
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS tg_platforms_publication ON public.platforms;
CREATE TRIGGER tg_platforms_publication
AFTER INSERT OR UPDATE OF status ON public.platforms
FOR EACH ROW EXECUTE FUNCTION public.tg_enqueue_platform_publication();

-- ===== Publication: articles =====
CREATE OR REPLACE FUNCTION public.tg_enqueue_article_publication()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'published' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO public.email_logs (kind, reference, to_email, subject, status, metadata)
    VALUES (
      'article_publication',
      'ART-' || substr(NEW.id::text, 1, 8) || '-' || to_char(now(), 'YYYYMMDDHH24MISS'),
      public.notify_admin_email(),
      '[Publication] Article — ' || NEW.title,
      'disabled',
      jsonb_build_object('article_id', NEW.id, 'slug', NEW.slug, 'title', NEW.title, 'category', NEW.category)
    );
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS tg_articles_publication ON public.articles;
CREATE TRIGGER tg_articles_publication
AFTER INSERT OR UPDATE OF status ON public.articles
FOR EACH ROW EXECUTE FUNCTION public.tg_enqueue_article_publication();

-- ===== Publication: allocations =====
CREATE OR REPLACE FUNCTION public.tg_enqueue_allocation_publication()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'published' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO public.email_logs (kind, reference, to_email, subject, status, metadata)
    VALUES (
      'allocation_publication',
      'ALL-' || substr(NEW.id::text, 1, 8) || '-' || to_char(now(), 'YYYYMMDDHH24MISS'),
      public.notify_admin_email(),
      '[Publication] Allocation — ' || NEW.label,
      'disabled',
      jsonb_build_object('allocation_id', NEW.id, 'label', NEW.label, 'weight', NEW.weight, 'focus', NEW.focus)
    );
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS tg_allocations_publication ON public.allocations;
CREATE TRIGGER tg_allocations_publication
AFTER INSERT OR UPDATE OF status ON public.allocations
FOR EACH ROW EXECUTE FUNCTION public.tg_enqueue_allocation_publication();
