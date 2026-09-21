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

/** Drugi kolor profilu (do gradientów i efektów nicku). */
export function secondAccent(id: string | null | undefined, fallbackFrom?: string | null) {
  if (id && HEX.test(id)) return id.toLowerCase();
  const preset = ACCENTS.find((a) => a.id === id)?.color;
  if (preset) return preset;
  // domyślnie: fiolet albo drugi z presetów, żeby gradient nie był płaski
  const main = accentColor(fallbackFrom);
  return main === "#8b5cf6" ? "#3b82f6" : "#8b5cf6";
}

export const BG_MODES = [
  { id: "solid", label: "Jednolity kolor" },
  { id: "gradient", label: "Gradient" },
] as const;

export const BG_ANGLES = [
  { id: "down", label: "Z góry na dół" },
  { id: "diagonal", label: "Po skosie" },
  { id: "radial", label: "Promieniście" },
] as const;

export function bgMode(id: string | null | undefined) {
  return BG_MODES.find((m) => m.id === id)?.id ?? "solid";
}

export function bgAngle(id: string | null | undefined) {
  return BG_ANGLES.find((a) => a.id === id)?.id ?? "down";
}

/** Gotowa wartość CSS `background` dla tła profilu. */
export function profileBackground(
  mode: string | null | undefined,
  angle: string | null | undefined,
  accent: string | null | undefined,
  accent2: string | null | undefined,
) {
  const c1 = accentColor(accent);
  const c2 = secondAccent(accent2, accent);
  if (bgMode(mode) !== "gradient") {
    return `radial-gradient(closest-side, color-mix(in oklab, ${c1} 45%, transparent), transparent)`;
  }
  switch (bgAngle(angle)) {
    case "diagonal":
      return `linear-gradient(135deg, ${c1}, ${c2})`;
    case "radial":
      return `radial-gradient(circle at 50% 30%, ${c2}, ${c1})`;
    default:
      return `linear-gradient(to bottom, ${c2}, ${c1})`;
  }
}

export const NAME_EFFECTS = [
  { id: "solid", label: "Solid" },
  { id: "gradient", label: "Gradient" },
  { id: "neon", label: "Neon" },
  { id: "toon", label: "Toon" },
  { id: "pop", label: "Pop" },
  { id: "gummy", label: "Gummy" },
  { id: "prism", label: "Prism" },
] as const;

export type NameEffectId = (typeof NAME_EFFECTS)[number]["id"];

export function nameEffect(id: string | null | undefined): NameEffectId {
  return (NAME_EFFECTS.find((e) => e.id === id)?.id ?? "solid") as NameEffectId;
}

/** Zmienne CSS dla klasy `nick-fx-*`. */
export function nickVars(accent: string | null | undefined, accent2: string | null | undefined) {
  return {
    ["--nick-1" as string]: accentColor(accent),
    ["--nick-2" as string]: secondAccent(accent2, accent),
  } as React.CSSProperties;
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
