CREATE OR REPLACE FUNCTION public.enforce_username_change_policy()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.username IS DISTINCT FROM OLD.username
     AND auth.uid() IS NOT NULL
     AND NOT (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'owner'::app_role))
  THEN
    RAISE EXCEPTION 'Nick moze zmienic tylko administrator.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_username_lock ON public.profiles;
CREATE TRIGGER profiles_username_lock
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.enforce_username_change_policy();