ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS accent_2 text,
  ADD COLUMN IF NOT EXISTS bg_mode text NOT NULL DEFAULT 'solid',
  ADD COLUMN IF NOT EXISTS bg_angle text NOT NULL DEFAULT 'down',
  ADD COLUMN IF NOT EXISTS name_effect text NOT NULL DEFAULT 'solid';