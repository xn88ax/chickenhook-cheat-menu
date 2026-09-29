ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_decoration text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS profile_effect text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS nameplate text NOT NULL DEFAULT 'none';