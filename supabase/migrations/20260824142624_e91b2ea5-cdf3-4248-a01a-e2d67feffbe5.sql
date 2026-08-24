REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO service_role;