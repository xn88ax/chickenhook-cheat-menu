ALTER TABLE public.profiles ADD COLUMN member_number integer;
CREATE SEQUENCE public.profiles_member_number_seq START 1;
WITH ordered AS (
  SELECT id, row_number() OVER (ORDER BY created_at, id) AS rn FROM public.profiles
)
UPDATE public.profiles p SET member_number = o.rn FROM ordered o WHERE p.id = o.id;
SELECT setval('public.profiles_member_number_seq', (SELECT COALESCE(MAX(member_number), 0) + 1 FROM public.profiles), false);
ALTER TABLE public.profiles ALTER COLUMN member_number SET DEFAULT nextval('public.profiles_member_number_seq');
ALTER TABLE public.profiles ALTER COLUMN member_number SET NOT NULL;
CREATE UNIQUE INDEX profiles_member_number_key ON public.profiles (member_number);