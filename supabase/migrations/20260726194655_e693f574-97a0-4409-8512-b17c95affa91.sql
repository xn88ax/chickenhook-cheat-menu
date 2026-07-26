CREATE TABLE public.invite_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  note text NOT NULL DEFAULT '',
  used_by uuid,
  used_at timestamp with time zone,
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT ALL ON public.invite_codes TO service_role;

ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invite_codes_service_only"
ON public.invite_codes
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_invite_codes_updated_at
BEFORE UPDATE ON public.invite_codes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.invite_codes (code, note) VALUES
  ('CHICKEN-ALPHA-2026', 'startowy'),
  ('CHICKEN-BRAVO-2026', 'startowy'),
  ('CHICKEN-CRISPY-2026', 'startowy'),
  ('CHICKEN-DELTA-2026', 'startowy'),
  ('CHICKEN-ECHO-2026', 'startowy');