import type { PreviewKind } from "@/components/feature-preview";

/**
 * Prawdziwe nagrania z CS:GO pokazujące działanie modułu.
 * Klucz = rodzaj podglądu, wartość = bezpośredni adres pliku mp4/webm.
 * Brak wpisu (albo puste) = na stronie pokazujemy "Brak nagrania".
 */
export const clipVideos: Partial<Record<PreviewKind, string>> = {
  // np. noclip: "https://cdn.example.com/csgo/noclip.mp4",
};

export function getClipVideo(kind: PreviewKind): string | null {
  const url = clipVideos[kind];
  return url && url.trim().length > 0 ? url : null;
}
