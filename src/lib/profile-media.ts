import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

export const PROFILE_BUCKET = "profiles";

export const ACCENTS = [
  { id: "red", label: "Kurczak czerwony", color: "#e11d2e" },
  { id: "amber", label: "Panierka", color: "#f59e0b" },
  { id: "green", label: "Undetected", color: "#22c55e" },
  { id: "blue", label: "Loader blue", color: "#3b82f6" },
  { id: "violet", label: "HvH violet", color: "#8b5cf6" },
] as const;

const HEX = /^#[0-9a-fA-F]{6}$/;

/** Zwraca kolor: gotowy preset albo własny hex (#rrggbb). */
export function accentColor(id: string | null | undefined) {
  if (id && HEX.test(id)) return id.toLowerCase();
  return ACCENTS.find((a) => a.id === id)?.color ?? ACCENTS[0].color;
}

export function isCustomAccent(id: string | null | undefined) {
  return !!id && HEX.test(id);
}

export const PROFILE_THEMES = [
  { id: "nocny", label: "Nocny kurnik" },
  { id: "grafit", label: "Grafit" },
  { id: "neon", label: "Neon HvH" },
  { id: "panierka", label: "Panierka (jasny)" },
] as const;

export type ProfileThemeId = (typeof PROFILE_THEMES)[number]["id"];

export function profileTheme(id: string | null | undefined): ProfileThemeId {
  return (PROFILE_THEMES.find((t) => t.id === id)?.id ?? "nocny") as ProfileThemeId;
}


/** Private bucket → short-lived signed URL, cached by react-query. */
export function useProfileMedia(path: string | null | undefined) {
  const { data } = useQuery({
    enabled: !!path,
    queryKey: ["profile-media", path],
    staleTime: 30 * 60_000,
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from(PROFILE_BUCKET)
        .createSignedUrl(path!, 60 * 60);
      if (error) return null;
      return data?.signedUrl ?? null;
    },
  });
  return data ?? null;
}

export async function uploadProfileMedia(
  userId: string,
  kind: "avatar" | "banner",
  file: File,
) {
  const ext = (file.name.split(".").pop() ?? "png").toLowerCase().slice(0, 5);
  const path = `${userId}/${kind}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from(PROFILE_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: true, contentType: file.type });
  if (error) throw error;
  return path;
}
