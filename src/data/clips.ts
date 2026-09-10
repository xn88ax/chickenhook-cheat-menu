import type { PreviewKind } from "@/components/feature-preview";

/**
 * Prawdziwe nagrania pokazujące działanie modułu.
 * Klucz = rodzaj podglądu, wartość = bezpośredni adres pliku mp4/webm.
 * Brak wpisu (albo puste) = na stronie pokazujemy "Brak nagrania".
 */
export const clipVideos: Partial<Record<PreviewKind, string>> = {
  // np. noclip: "https://cdn.example.com/csgo/noclip.mp4",
};

/** Losowe filmy z kanału youtube.com/@ksiazulo jako klipy do funkcji. */
export const clipYoutube: Partial<Record<PreviewKind, string>> = {
  noclip: "0gtzdFMy0d0",
  god: "3X-WJM2RYvo",
  bhop: "52y3FntRtB0",
  aim: "9a1-oBhttqo",
  trigger: "AfLUwMCCBGU",
  esp: "JZL9ddTF4LY",
  skins: "S6I5RnfvskU",
  movement: "Y5gadJE3YWc",
  misc: "dmrU6iSq4uI",
  teleport: "h1E-Ti_mWBo",
  crash: "pQrILbrmbTo",
  speed: "tRs9UswCijc",
  money: "zMowx68Ta-I",
  voice: "dmrU6iSq4uI",
  customskin: "S6I5RnfvskU",
  radio: "tRs9UswCijc",
};

export function getClipVideo(kind: PreviewKind): string | null {
  const url = clipVideos[kind];
  return url && url.trim().length > 0 ? url : null;
}

export function getClipYoutube(kind: PreviewKind): string | null {
  const id = clipYoutube[kind];
  return id && id.trim().length > 0 ? id : null;
}
