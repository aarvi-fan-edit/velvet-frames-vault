-- Replace the SECURITY DEFINER helper with inline, allow-list based checks.
DROP POLICY IF EXISTS "Admins can read the allow-list" ON public.admin_emails;
DROP POLICY IF EXISTS "Admins can delete photos" ON public.photos;
DROP POLICY IF EXISTS "Admins can update photos" ON public.photos;
DROP POLICY IF EXISTS "Admins can insert photos" ON public.photos;
DROP POLICY IF EXISTS "Admins can delete photo files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update photo files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read photo files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload photo files" ON storage.objects;

CREATE POLICY "Admins can read the allow-list"
ON public.admin_emails FOR SELECT TO authenticated
USING (lower(email) = lower((auth.jwt() ->> 'email')));

CREATE POLICY "Admins can insert photos"
ON public.photos FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_emails a WHERE lower(a.email) = lower((auth.jwt() ->> 'email'))));

CREATE POLICY "Admins can update photos"
ON public.photos FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.admin_emails a WHERE lower(a.email) = lower((auth.jwt() ->> 'email'))))
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_emails a WHERE lower(a.email) = lower((auth.jwt() ->> 'email'))));

CREATE POLICY "Admins can delete photos"
ON public.photos FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.admin_emails a WHERE lower(a.email) = lower((auth.jwt() ->> 'email'))));

CREATE POLICY "Admins can read photo files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'photos' AND EXISTS (SELECT 1 FROM public.admin_emails a WHERE lower(a.email) = lower((auth.jwt() ->> 'email'))));

CREATE POLICY "Admins can upload photo files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'photos' AND EXISTS (SELECT 1 FROM public.admin_emails a WHERE lower(a.email) = lower((auth.jwt() ->> 'email'))));

CREATE POLICY "Admins can update photo files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'photos' AND EXISTS (SELECT 1 FROM public.admin_emails a WHERE lower(a.email) = lower((auth.jwt() ->> 'email'))))
WITH CHECK (bucket_id = 'photos' AND EXISTS (SELECT 1 FROM public.admin_emails a WHERE lower(a.email) = lower((auth.jwt() ->> 'email'))));

CREATE POLICY "Admins can delete photo files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'photos' AND EXISTS (SELECT 1 FROM public.admin_emails a WHERE lower(a.email) = lower((auth.jwt() ->> 'email'))));

DROP FUNCTION IF EXISTS public.is_admin(uuid);