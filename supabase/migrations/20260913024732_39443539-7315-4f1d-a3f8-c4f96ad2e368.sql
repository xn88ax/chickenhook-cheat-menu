CREATE TABLE public.role_styles (
  role app_role PRIMARY KEY,
  color text NOT NULL DEFAULT '#e11d2e',
  glitter boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.role_styles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.role_styles TO authenticated;
GRANT ALL ON public.role_styles TO service_role;

ALTER TABLE public.role_styles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "role_styles_public_read" ON public.role_styles FOR SELECT USING (true);
CREATE POLICY "role_styles_admin_insert" ON public.role_styles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'owner'::app_role));
CREATE POLICY "role_styles_admin_update" ON public.role_styles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'owner'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'owner'::app_role));

CREATE TRIGGER update_role_styles_updated_at BEFORE UPDATE ON public.role_styles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.role_styles (role, color, glitter) VALUES
  ('owner', '#e11d2e', true),
  ('admin', '#f59e0b', true),
  ('moderator', '#22c55e', false),
  ('user', '#94a3b8', false);