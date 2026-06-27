
REVOKE EXECUTE ON FUNCTION public.tg_enqueue_contact_receipt() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_enqueue_platform_publication() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_enqueue_article_publication() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_enqueue_allocation_publication() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_admin_email() FROM PUBLIC, anon, authenticated;
