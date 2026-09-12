CREATE TABLE public.user_bans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text NOT NULL DEFAULT '',
  banned_until timestamp with time zone,
  banned_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.user_bans TO authenticated;
GRANT ALL ON public.user_bans TO service_role;

ALTER TABLE public.user_bans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read bans" ON public.user_bans FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'owner'));

CREATE POLICY "bans_service_only" ON public.user_bans FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX user_bans_user_id_idx ON public.user_bans (user_id);

CREATE TRIGGER update_user_bans_updated_at BEFORE UPDATE ON public.user_bans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();