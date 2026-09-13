ALTER TABLE public.profiles
  ADD COLUMN link_1 text,
  ADD COLUMN link_2 text,
  ADD COLUMN link_3 text;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_link_1_http CHECK (link_1 IS NULL OR link_1 ~ '^https?://[^[:space:]]+$'),
  ADD CONSTRAINT profiles_link_2_http CHECK (link_2 IS NULL OR link_2 ~ '^https?://[^[:space:]]+$'),
  ADD CONSTRAINT profiles_link_3_http CHECK (link_3 IS NULL OR link_3 ~ '^https?://[^[:space:]]+$');