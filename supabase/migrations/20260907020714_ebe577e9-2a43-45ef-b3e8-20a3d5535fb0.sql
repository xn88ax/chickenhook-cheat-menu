CREATE TABLE public.shouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nick TEXT NOT NULL CHECK (char_length(nick) BETWEEN 2 AND 24),
  text TEXT NOT NULL CHECK (char_length(text) BETWEEN 1 AND 200),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX shouts_created_at_idx ON public.shouts (created_at DESC);

GRANT SELECT, INSERT ON public.shouts TO anon;
GRANT SELECT, INSERT ON public.shouts TO authenticated;
GRANT ALL ON public.shouts TO service_role;

ALTER TABLE public.shouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read shouts" ON public.shouts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can post shouts" ON public.shouts FOR INSERT TO anon, authenticated WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.shouts;
ALTER TABLE public.shouts REPLICA IDENTITY FULL;

INSERT INTO public.shouts (nick, text, created_at) VALUES
  ('Kurczak_200iq', 'witamy w kurniku, pisz smialo', now() - interval '9 minutes'),
  ('bhop_bolek', 'config od proa ktos ma?', now() - interval '6 minutes'),
  ('SkrzydelkoPL', 'aim dzisiaj smakuje, 42 fragi na premier', now() - interval '4 minutes'),
  ('GesslerFan1998', 'invite pls, placze', now() - interval '1 minute');