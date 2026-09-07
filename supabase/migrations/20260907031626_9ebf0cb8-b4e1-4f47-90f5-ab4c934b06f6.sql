ALTER TABLE public.shouts ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

DROP POLICY IF EXISTS "Anyone can post shouts" ON public.shouts;
DROP POLICY IF EXISTS "Anyone can read shouts" ON public.shouts;

GRANT SELECT ON public.shouts TO anon;
GRANT SELECT, INSERT, DELETE ON public.shouts TO authenticated;
GRANT ALL ON public.shouts TO service_role;

CREATE POLICY "shouts_public_read" ON public.shouts FOR SELECT USING (true);
CREATE POLICY "shouts_insert_own" ON public.shouts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "shouts_delete_own" ON public.shouts FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS shouts_created_at_idx ON public.shouts (created_at DESC);