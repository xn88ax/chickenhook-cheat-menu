DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;

CREATE POLICY "Owner manages roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'owner'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'owner'::app_role));