const REMEMBER_KEY = "chickenhook.remember-session";

export function isRememberSession(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(REMEMBER_KEY) !== "0";
}

export function setRememberSession(remember: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0");
}

function clearSupabaseSession() {
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith("sb-") && key.endsWith("-auth-token")) keys.push(key);
    }
    keys.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}

/**
 * Sesja jest zapamiętywana domyślnie (localStorage + auto refresh tokenu).
 * Gdy użytkownik odznaczy "Zapamiętaj mnie", czyścimy token przy zamknięciu karty.
 */
export function installSessionPersistence() {
  if (typeof window === "undefined") return () => {};
  const onHide = () => {
    if (!isRememberSession()) clearSupabaseSession();
  };
  window.addEventListener("pagehide", onHide);
  return () => window.removeEventListener("pagehide", onHide);
}
