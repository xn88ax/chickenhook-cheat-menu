import { useState } from "react";
import { Copy, RefreshCw } from "lucide-react";

const prefixes = ["legit", "rage", "hvh", "faceit", "premier", "kurczak", "smaczny"];
const middles = ["mm", "onetap", "silent", "crispy", "panierka", "godmode", "clean"];
const suffixes = ["2026", "final", "final2", "v9", "ostateczny", "notmine", "leaked"];

const flavour = [
  "Aim pachnie jak świeża panierka.",
  "Config przetestowany na 3 meczach i jednym kubełku.",
  "Ustawienia zatwierdzone przez Grzegorza z supportu.",
  "Idealny na późne Premiery, gdy ręce już nie słuchają.",
  "Ostrożnie: przy tym smoothie wyglądasz podejrzanie dobrze.",
  "Zrobiony w 4 minuty, działa lepiej niż powinien.",
];

function rand(min: number, max: number, step = 1) {
  const steps = Math.floor((max - min) / step) + 1;
  return +(min + Math.floor(Math.random() * steps) * step).toFixed(2);
}

function pick<T>(a: readonly T[]): T {
  return a[Math.floor(Math.random() * a.length)] as T;
}

type Cfg = { name: string; note: string; lines: string[] };

function makeConfig(): Cfg {
  const lines = [
    `// wygenerowane przez ChickenHook config generator`,
    `aim_fov ${rand(1, 35)}`,
    `aim_smooth ${rand(2, 45)}`,
    `aim_bone "${pick(["glowa", "klatka", "najblizsza", "co popadnie"])}"`,
    `rcs_strength ${rand(40, 100, 5)}`,
    `trigger_delay_ms ${rand(0, 180, 10)}`,
    `esp_mode "${pick(["skeleton", "box + hp", "chams", "wszystko naraz"])}"`,
    `bhop_chance ${rand(60, 100, 5)}`,
    `chicken_mode ${pick([0, 1])}`,
    `panierka_intensity ${rand(1, 11)}`,
    `sv_cheats 1 // zawsze na koniec, tradycja`,
  ];
  return {
    name: `${pick(prefixes)}-${pick(middles)}-${pick(suffixes)}.cfg`,
    note: pick(flavour),
    lines,
  };
}

export function ConfigGenerator() {
  const [cfg, setCfg] = useState<Cfg | null>(null);
  const [copied, setCopied] = useState(false);

  return (
    <div className="px-4 py-3">
      <p className="text-xs text-muted-foreground">
        Losujemy nazwę pliku i zestaw ustawień. Nic z tego nie działa w prawdziwej grze — to
        parodia, ale nazwy plików wychodzą przekonujące.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setCfg(makeConfig());
            setCopied(false);
          }}
          className="gs-action"
        >
          <RefreshCw className="size-3.5" />
          {cfg ? "Losuj jeszcze raz" : "Wygeneruj config"}
        </button>
        {cfg && (
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard?.writeText(cfg.lines.join("\n"));
              setCopied(true);
            }}
            className="border border-border px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
          >
            <Copy className="mr-1.5 inline size-3.5" />
            {copied ? "Skopiowane" : "Kopiuj plik"}
          </button>
        )}
      </div>

      {cfg && (
        <div className="mt-4 border border-border">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-secondary px-3 py-2">
            <span className="text-xs font-bold gs-lime">{cfg.name}</span>
            <span className="text-[10px] text-muted-foreground">{cfg.note}</span>
          </div>
          <pre className="overflow-x-auto px-3 py-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
            {cfg.lines.join("\n")}
          </pre>
        </div>
      )}
    </div>
  );
}
