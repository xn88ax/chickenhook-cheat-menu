import { useEffect, useState } from "react";
import { X } from "lucide-react";

const CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const STORAGE_KEY = "chickenhook-chicken-mode";

/** Konami code (↑↑↓↓←→←→BA) włącza „tryb kurczaka" na całej stronie. */
export function Konami() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") setActive(true);
    } catch {
      /* brak dostępu do pamięci — nie szkodzi */
    }
  }, []);

  useEffect(() => {
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === CODE[pos]) {
        pos += 1;
        if (pos === CODE.length) {
          pos = 0;
          setActive(true);
        }
      } else {
        pos = key === CODE[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("chicken-mode", active);
    try {
      if (active) localStorage.setItem(STORAGE_KEY, "1");
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, [active]);

  if (!active) return null;

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <span
            key={i}
            className="chicken-fly absolute text-2xl"
            style={{
              left: `${(i * 8.3 + 3) % 100}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${7 + (i % 5)}s`,
            }}
          >
            🐔
          </span>
        ))}
      </div>
      <div className="fixed bottom-4 left-1/2 z-[61] flex -translate-x-1/2 items-center gap-3 border border-border bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wide">
        <span className="gs-gold">🐔 Tryb kurczaka aktywny</span>
        <button
          type="button"
          onClick={() => setActive(false)}
          aria-label="Wyłącz tryb kurczaka"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    </>
  );
}
