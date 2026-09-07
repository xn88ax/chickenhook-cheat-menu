import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

/** Fałszywy licznik graczy online — skacze losowo co kilka sekund. */
export function OnlineCounter() {
  const [count, setCount] = useState(47);
  const [peak, setPeak] = useState(63);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => {
        const next = Math.min(68, Math.max(38, c + Math.round((Math.random() - 0.5) * 9)));
        setPeak((p) => Math.max(p, next));
        return next;
      });
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 text-xs">
      <span className="flex items-center gap-2">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-2 animate-ping rounded-full bg-primary/70" />
          <span className="relative inline-flex size-2 rounded-full bg-primary" />
        </span>
        <strong className="text-sm font-bold text-foreground tabular-nums">{count}</strong>
        <span className="text-muted-foreground">użytkowników gra teraz z ChickenHook</span>
      </span>
      <span className="flex items-center gap-2 text-muted-foreground">
        <Activity className="size-3.5 text-primary" />
        Szczyt dzisiaj: <strong className="text-foreground tabular-nums">{peak}</strong>
      </span>
      <span className="text-muted-foreground">
        W kolejce po invite: <strong className="gs-gold">nadal Ty</strong>
      </span>
    </div>
  );
}
