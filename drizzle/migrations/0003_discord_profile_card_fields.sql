ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS display_name text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'online',
  ADD COLUMN IF NOT EXISTS name_font text NOT NULL DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS profile_frame text NOT NULL DEFAULT 'none';