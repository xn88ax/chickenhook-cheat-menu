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

export const AVATAR_DECORATIONS = [
  { id: "none", label: "Brak" },
  { id: "energy", label: "Pierścień energii" },
  { id: "flames", label: "Płomienie" },
  { id: "pixels", label: "Piksele" },
  { id: "crown", label: "Korona" },
  { id: "chicken", label: "Kurczak" },
  { id: "img-chicken-nugget", label: "Nugget", img: "/__l5e/assets-v1/79e10545-3d8b-447d-819c-9dc6ec7984f1/deco-chicken_nugget.png" },
  { id: "img-fire", label: "Ogień", img: "/__l5e/assets-v1/ee617942-7f6b-4f09-a578-d7efe58425c9/deco-fire.png" },
  { id: "img-sakura", label: "Sakura", img: "/__l5e/assets-v1/35c44e4d-c34b-42bd-bf8a-5db120a43a0f/deco-sakura.png" },
  { id: "img-cat-ears", label: "Kocie uszy", img: "/__l5e/assets-v1/2cbd8ff9-45d1-4039-8789-a851e7b2a918/deco-cat_ears.png" },
  { id: "img-skull", label: "Czaszka", img: "/__l5e/assets-v1/44b73b18-08ea-4a40-8c6c-484658b6884c/deco-skull_medallion.png" },
  { id: "img-rage", label: "Rage", img: "/__l5e/assets-v1/fef9926f-8ae9-4b65-89a0-859f3f852c6a/deco-rage_red.png" },
  { id: "img-oni", label: "Maska oni", img: "/__l5e/assets-v1/f79015b1-e9e7-4421-b892-35c8b4e250b8/deco-oni_mask.png" },
  { id: "img-laurel", label: "Wieniec", img: "/__l5e/assets-v1/2918f967-5bc7-421a-918e-b3933796dcc7/deco-gold_laurel_wreath.png" },
  { id: "img-hood", label: "Kaptur", img: "/__l5e/assets-v1/76dbbb12-744f-4536-87ef-66d20fd05365/deco-hood_dark.png" },
  { id: "img-sabers", label: "Miecze świetlne", img: "/__l5e/assets-v1/593940a0-f534-4680-80bc-c72b8b5cc35f/deco-lightsabers_blue_and_red.png" },
  { id: "img-dragon-balls", label: "Smocze kule", img: "/__l5e/assets-v1/b8e538a0-b4aa-4e19-a8bd-f1e2b923cf92/deco-dragon_balls.png" },
  { id: "img-phoenix", label: "Feniks", img: "/__l5e/assets-v1/717c913d-30d9-4d42-807b-173c5d1b4745/deco-phoenix.png" },
  { id: "img-stardust", label: "Gwiezdny pył", img: "/__l5e/assets-v1/cd9d3282-309f-4dd4-9042-dc679906f255/deco-stardust.png" },
  { id: "img-duck", label: "Kaczka", img: "/__l5e/assets-v1/6f8fbd08-50be-4b6e-b9a9-829b9b75855b/deco-a_duck.png" },
  { id: "img-egg", label: "Jajko sadzone", img: "/__l5e/assets-v1/f376741a-9ea2-4159-8d8b-485e8680a552/deco-fried_egg.png" },
  { id: "img-glitch", label: "Glitch", img: "/__l5e/assets-v1/7fce1810-9f39-4f8d-a0bc-d02d7c71f680/deco-glitch.png" },
  { id: "img-neon-hoodie", label: "Neonowa bluza", img: "/__l5e/assets-v1/f4a6612b-4a46-48d8-b3d5-76655a481195/deco-neon_cat_hoodie.png" },
  { id: "img-angry", label: "Wściekły", img: "/__l5e/assets-v1/0ecaae36-9907-4e0c-af1f-2b13842c3444/deco-angry.png" },
] as const;

export const PROFILE_EFFECTS = [
  { id: "none", label: "Brak" },
  { id: "sparks", label: "Iskry" },
  { id: "petals", label: "Płatki" },
  { id: "lightning", label: "Wyładowania" },
  { id: "glitch", label: "Glitch" },
  { id: "confetti", label: "Konfetti" },
] as const;

export const NAMEPLATES = [
  { id: "none", label: "Brak" },
  { id: "neon", label: "Neon" },
  { id: "glitch", label: "Glitch" },
  { id: "hologram", label: "Hologram" },
  { id: "fire", label: "Ogień" },
] as const;

function allowedId<const T extends readonly { id: string }[]>(items: T, id: string | null | undefined) {
  return items.find((item) => item.id === id)?.id ?? items[0].id;
}

export function avatarDecoration(id: string | null | undefined) {
  return allowedId(AVATAR_DECORATIONS, id);
}

export function avatarDecorationImg(id: string | null | undefined) {
  const item = AVATAR_DECORATIONS.find((d) => d.id === id);
  return item && "img" in item ? item.img : null;
}

export function profileEffect(id: string | null | undefined) {
  return allowedId(PROFILE_EFFECTS, id);
}

export function nameplate(id: string | null | undefined) {
  return allowedId(NAMEPLATES, id);
}

export type NameEffectId = (typeof NAME_EFFECTS)[number]["id"];

export function nameEffect(id: string | null | undefined): NameEffectId {
  return (NAME_EFFECTS.find((e) => e.id === id)?.id ?? "solid") as NameEffectId;
}

/** Zmienne CSS dla klasy `nick-fx-*`. */
export function nickVars(accent: string | null | undefined, accent2: string | null | undefined) {
  return {
    ["--nick-1" as string]: accentColor(accent),
    ["--nick-2" as string]: secondAccent(accent2, accent),
  } as Record<string, string>;
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
