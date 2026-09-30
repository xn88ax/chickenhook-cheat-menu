import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

import { subscribeOnlineCount } from "@/lib/presence";

/** Prawdziwy licznik osób online — Realtime Presence (goście + zalogowani). */
export function OnlineCounter() {
  const [count, setCount] = useState(0);
  const [peak, setPeak] = useState(0);

  useEffect(() => {
    return subscribeOnlineCount((n) => {
      setCount(n);
      setPeak((p) => Math.max(p, n));
    });
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 text-xs">
      <span className="flex items-center gap-2">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-2 animate-ping rounded-full bg-primary/70" />
          <span className="relative inline-flex size-2 rounded-full bg-primary" />
        </span>
        <strong className="text-sm font-bold text-foreground tabular-nums">{count}</strong>
        <span className="text-muted-foreground">{count === 1 ? "osoba jest" : "osób jest"} teraz na stronie</span>
      </span>
      <span className="flex items-center gap-2 text-muted-foreground">
        <Activity className="size-3.5 text-primary" />
        Szczyt sesji: <strong className="text-foreground tabular-nums">{peak}</strong>
      </span>
      <span className="text-muted-foreground">
        W kolejce po invite: <strong className="gs-gold">nadal Ty</strong>
      </span>
    </div>
  );
}
