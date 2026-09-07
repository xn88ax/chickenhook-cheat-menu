GRANT INSERT ON public.shouts TO anon;

CREATE POLICY "shouts_insert_guest" ON public.shouts
FOR INSERT TO anon
WITH CHECK (user_id IS NULL AND length(text) > 0 AND length(text) <= 300 AND length(nick) > 0 AND length(nick) <= 32);

CREATE POLICY "shouts_delete_admin" ON public.shouts
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));