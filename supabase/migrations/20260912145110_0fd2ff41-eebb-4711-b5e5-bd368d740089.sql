ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS bio text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS banner_url text,
  ADD COLUMN IF NOT EXISTS accent text NOT NULL DEFAULT 'red',
  ADD COLUMN IF NOT EXISTS views integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.bump_profile_view(_username text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v integer;
BEGIN
  UPDATE public.profiles SET views = views + 1
  WHERE lower(username) = lower(_username)
  RETURNING views INTO v;
  RETURN COALESCE(v, 0);
END;
$$;

GRANT EXECUTE ON FUNCTION public.bump_profile_view(text) TO anon, authenticated;

DROP POLICY IF EXISTS shouts_insert_guest ON public.shouts;
CREATE POLICY shouts_insert_guest ON public.shouts FOR INSERT TO anon
WITH CHECK (
  user_id IS NULL
  AND length(text) > 0 AND length(text) <= 300
  AND nick ~ '^gosc_[0-9]{4}$'
);