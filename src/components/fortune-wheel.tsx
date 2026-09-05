import { useState } from "react";
import { Gift } from "lucide-react";

const prizes = [
  "1 dzień Elite",
  "nic",
  "config od proa",
  "ban (żart)",
  "kubełek skrzydełek",
  "nic, ale ładnie",
  "10% zniżki (wygasła)",
  "invite dla kolegi",
];

export function FortuneWheel() {
  const [angle, setAngle] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [used, setUsed] = useState(false);

  const spin = () => {
    if (spinning || used) return;
    const index = Math.floor(Math.random() * prizes.length);
    const per = 360 / prizes.length;
    const target = 360 * 5 + (360 - index * per - per / 2);
    setSpinning(true);
    setResult(null);
    setAngle((a) => a + target);
    setTimeout(() => {
      setResult(prizes[index] as string);
      setSpinning(false);
      setUsed(true);
    }, 3400);
  };

  const per = 360 / prizes.length;

  return (
    <div className="flex flex-col items-center gap-4 px-4 py-4 sm:flex-row sm:items-start">
      <div className="relative shrink-0">
        <div className="absolute left-1/2 top-0 z-10 size-0 -translate-x-1/2 border-x-[6px] border-t-[10px] border-x-transparent border-t-primary" />
        <div
          className="size-48 rounded-full border-2 border-border transition-transform duration-[3200ms] ease-out"
          style={{
            transform: `rotate(${angle}deg)`,
            background: `conic-gradient(${prizes
              .map(
                (_, i) =>
                  `${i % 2 ? "oklch(0.24 0.02 260)" : "oklch(0.34 0.12 26)"} ${i * per}deg ${
                    (i + 1) * per
                  }deg`,
              )
              .join(", ")})`,
          }}
        />
        <div className="pointer-events-none absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-border bg-background text-[10px] font-bold uppercase">
          Kurnik
        </div>
      </div>

      <div className="min-w-0 flex-1 text-xs">
        <p className="text-muted-foreground">
          Jedno kręcenie na wejście. Nagrody są niematerialne, jak nasza polityka zwrotów.
        </p>
        <button type="button" onClick={spin} disabled={spinning || used} className="gs-action mt-3">
          <Gift className="size-3.5" />
          {spinning ? "Kręci się…" : used ? "Wróć za 24 h" : "Zakręć kołem"}
        </button>

        {result && (
          <div className="mt-3 border border-border bg-secondary p-3">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Wygrałeś</p>
            <p className="mt-0.5 text-sm font-bold gs-lime">{result}</p>
            <p className="mt-1 text-muted-foreground">
              Zrzut ekranu wyślij na support, a admin odpisze „gratulacje" i nic nie zrobi.
            </p>
          </div>
        )}

        <ul className="mt-4 grid grid-cols-2 gap-1 text-[11px] text-muted-foreground">
          {prizes.map((p) => (
            <li key={p} className="truncate">
              · {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
