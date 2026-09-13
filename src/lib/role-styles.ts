import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

export type RoleStyle = { role: string; color: string; glitter: boolean };

export const ROLE_ORDER = ["owner", "admin", "moderator", "user"] as const;

export const DEFAULT_ROLE_STYLES: Record<string, RoleStyle> = {
  owner: { role: "owner", color: "#e11d2e", glitter: true },
  admin: { role: "admin", color: "#f59e0b", glitter: true },
  moderator: { role: "moderator", color: "#22c55e", glitter: false },
  user: { role: "user", color: "#94a3b8", glitter: false },
};

export function useRoleStyles() {
  const { data } = useQuery({
    queryKey: ["role-styles"],
    staleTime: 60_000,
    queryFn: async () => {
      const { data } = await supabase.from("role_styles").select("role,color,glitter");
      const map: Record<string, RoleStyle> = { ...DEFAULT_ROLE_STYLES };
      for (const row of data ?? []) {
        map[row.role] = { role: row.role, color: row.color, glitter: row.glitter };
      }
      return map;
    },
  });
  return data ?? DEFAULT_ROLE_STYLES;
}

export function mainRoleOf(roles: string[]) {
  return ROLE_ORDER.find((role) => roles.includes(role)) ?? roles[0];
}
