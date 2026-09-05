import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ScanLine } from "lucide-react";

const steps = [
  "Łączę się z serwerami Valve…",
  "Sprawdzam pliki gry (0 z 4 812)…",
  "Analizuję historię meczów…",
  "Szukam zgłoszeń od kolegów z drużyny…",
  "Usypiam anti-cheat kołysanką…",
  "Podmieniam sygnaturę loadera na kurczaka…",
  "Finalizuję raport bezpieczeństwa…",
];

export function VacScanner() {
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => timer.current && clearInterval(timer.current), []);

  const start = () => {
    setRunning(true);
    setDone(false);
    setProgress(0);
    timer.current && clearInterval(timer.current);
    timer.current = setInterval(() => {
      setProgress((p) => {
        const next = p + 2 + Math.random() * 5;
        if (next >= 100) {
          timer.current && clearInterval(timer.current);
          setRunning(false);
          setDone(true);
          return 100;
        }
        return next;
      });
    }, 110);
  };

  const stepIndex = Math.min(steps.length - 1, Math.floor((progress / 100) * steps.length));

  return (
    <div className="px-4 py-3">
      <p className="text-xs text-muted-foreground">
        Skaner sprawdza, czy Twoje konto jest bezpieczne. Wynik znasz z góry, ale pasek postępu
        robi swoje.
      </p>

      <button type="button" onClick={start} disabled={running} className="gs-action mt-3">
        <ScanLine className="size-3.5" />
        {running ? "Skanuję…" : done ? "Skanuj ponownie" : "Sprawdź, czy jesteś bezpieczny"}
      </button>

      {(running || done) && (
        <div className="mt-4 border border-border p-3">
          <div className="h-2 w-full overflow-hidden border border-border bg-background">
            <div
              className="h-full bucket-gradient transition-[width] duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 font-mono text-[11px] text-muted-foreground" aria-live="polite">
            {done ? "Raport gotowy." : steps[stepIndex]}
          </p>

          {done && (
            <div className="mt-3 flex items-start gap-3 border border-border bg-secondary p-3">
              <CheckCircle2 className="mt-0.5 size-6 shrink-0 gs-green" />
              <div className="text-xs">
                <p className="text-sm font-bold gs-green">0% ryzyka — Valve śpi</p>
                <p className="mt-1 text-muted-foreground">
                  Twoje konto jest bezpieczniejsze niż konto, które nigdy nie grało w CS2.
                  Wykryte zagrożenia: 0. Wykryte skrzydełka: 12.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
