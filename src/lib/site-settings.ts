import { useCallback, useEffect, useState } from "react";

const KEY = "chickenhook.site-settings";

export type SiteSettings = {
  /** Animowane tło (GIF) */
  background: boolean;
  /** Siła tła 5–60 (%) */
  backgroundStrength: number;
  /** Animacje i przejścia */
  animations: boolean;
  /** Easter eggi (klawisz „a”, adam kurczak) */
  easterEggs: boolean;
  /** Kompaktowy odstęp na stronach */
  compact: boolean;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  background: true,
  backgroundStrength: 16,
  animations: true,
  easterEggs: true,
  compact: false,
};

export function readSettings(): SiteSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<SiteSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function applySettings(s: SiteSettings) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.siteBg = s.background ? "on" : "off";
  root.dataset.siteAnim = s.animations ? "on" : "off";
  root.dataset.siteCompact = s.compact ? "on" : "off";
  root.style.setProperty("--site-bg-opacity", String(s.backgroundStrength / 100));
}

export function saveSettings(s: SiteSettings) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* brak pamięci — nie szkodzi */
  }
  applySettings(s);
  window.dispatchEvent(new CustomEvent("chickenhook:settings", { detail: s }));
}

/** Czy easter eggi są włączone (czytane synchronicznie w handlerach klawiatury). */
export function easterEggsEnabled() {
  return readSettings().easterEggs;
}

/** Hook z bieżącymi ustawieniami strony + setterem. */
export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const current = readSettings();
    setSettings(current);
    applySettings(current);
    const onChange = (e: Event) => setSettings((e as CustomEvent<SiteSettings>).detail);
    window.addEventListener("chickenhook:settings", onChange);
    return () => window.removeEventListener("chickenhook:settings", onChange);
  }, []);

  const update = useCallback((patch: Partial<SiteSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    saveSettings(DEFAULT_SETTINGS);
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return { settings, update, reset };
}
