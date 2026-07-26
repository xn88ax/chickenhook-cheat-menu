CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_public_read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.forum_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  section TEXT NOT NULL DEFAULT 'Forum',
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.forum_categories TO anon;
GRANT SELECT ON public.forum_categories TO authenticated;
GRANT ALL ON public.forum_categories TO service_role;
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_public_read" ON public.forum_categories FOR SELECT USING (true);

CREATE TABLE public.forum_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.forum_categories ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.forum_threads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.forum_threads TO authenticated;
GRANT ALL ON public.forum_threads TO service_role;
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "threads_public_read" ON public.forum_threads FOR SELECT USING (true);
CREATE POLICY "threads_insert_own" ON public.forum_threads FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "threads_update_own" ON public.forum_threads FOR UPDATE TO authenticated USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "threads_delete_own" ON public.forum_threads FOR DELETE TO authenticated USING (auth.uid() = author_id);

CREATE TABLE public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.forum_threads ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.forum_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.forum_posts TO authenticated;
GRANT ALL ON public.forum_posts TO service_role;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts_public_read" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "posts_insert_own" ON public.forum_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "posts_update_own" ON public.forum_posts FOR UPDATE TO authenticated USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "posts_delete_own" ON public.forum_posts FOR DELETE TO authenticated USING (auth.uid() = author_id);

CREATE INDEX idx_threads_category ON public.forum_threads (category_id, created_at DESC);
CREATE INDEX idx_posts_thread ON public.forum_posts (thread_id, created_at);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1), 'kurczak')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO public.forum_categories (slug, name, description, section, position) VALUES
  ('ogloszenia', 'Ogłoszenia i changelogi', 'Nowe buildy, patche i przerwy techniczne.', 'ChickenHook — informacje', 1),
  ('bezpieczenstwo', 'Status bezpieczeństwa', 'Detekcje, dobre praktyki i zgłoszenia od użytkowników.', 'ChickenHook — informacje', 2),
  ('pomoc', 'Pomoc techniczna', 'Loader nie startuje? Tu znajdziesz rozwiązanie.', 'Wsparcie i konfiguracja', 3),
  ('configi', 'Configi i presety', 'Gotowe ustawienia aim, ESP i HvH od społeczności.', 'Wsparcie i konfiguracja', 4),
  ('hvh', 'HvH i highlighty', 'Klipy, fragmovie i wojny na ragebotach.', 'Społeczność', 5),
  ('offtopic', 'Off-topic', 'Kurczaki, memy i wszystko poza CS2.', 'Społeczność', 6);