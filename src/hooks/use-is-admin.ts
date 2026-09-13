import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

/** True when the signed-in user has the admin role. */
export function useIsAdmin() {
  const { user } = useAuth();

  const { data } = useQuery({
    enabled: !!user,
    queryKey: ["is-admin", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .in("role", ["admin", "owner"])
        .limit(1)
        .maybeSingle();
      if (error) return false;
      return !!data;
    },
    staleTime: 60_000,
  });

  return { isAdmin: !!data, user };
}

/** True when the signed-in user has the owner role. */
export function useIsOwner() {
  const { user } = useAuth();

  const { data } = useQuery({
    enabled: !!user,
    queryKey: ["is-owner", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .eq("role", "owner")
        .limit(1)
        .maybeSingle();
      if (error) return false;
      return !!data;
    },
    staleTime: 60_000,
  });

  return { isOwner: !!data, user };
}
