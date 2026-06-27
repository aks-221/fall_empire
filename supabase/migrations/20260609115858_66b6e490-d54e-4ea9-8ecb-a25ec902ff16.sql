
CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE existing_count INT;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT COUNT(*) INTO existing_count FROM public.user_roles WHERE role = 'admin';
  IF existing_count > 0 THEN RETURN FALSE; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'admin') ON CONFLICT DO NOTHING;
  RETURN TRUE;
END; $$;
REVOKE EXECUTE ON FUNCTION public.claim_first_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;
