import { useEffect, useState } from "react";

import { banWaves, plDate } from "@/data/community";

export function BanFeed() {
  const [count, setCount] = useState(4);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => (c >= banWaves.length ? 4 : c + 1));
    }, 4200);
    return () => clearInterval(id);
  }, []);

  const visible = banWaves.slice(0, count).slice(-8).reverse();

  return (
    <div>
      <div className="h-[280px] overflow-y-auto px-4 py-3" aria-live="polite">
        {visible.map((w) => (
          <p key={w.date + w.cheat} className="grid grid-cols-[76px_1fr] gap-2 border-b border-border/50 py-2 text-xs last:border-0">
            <span className="tabular-nums text-[var(--text-subtle)]">{plDate(w.date)}</span>
            <span><span className="font-semibold">{w.cheat}</span><span className="block truncate text-muted-foreground">{w.accounts.toLocaleString("pl-PL")} kont · {w.note}</span></span>
          </p>
        ))}
      </div>
      <p className="grid grid-cols-[76px_1fr] gap-2 border-t border-border px-4 py-2.5 text-xs">
        <span className="text-[var(--text-subtle)]">dzisiaj</span>
        <span className="font-semibold"><span className="mr-2 inline-block size-2 rounded-full bg-[var(--status-ok)]" />ChickenHook <span className="font-normal text-muted-foreground">· undetected, 412 dni</span></span>
      </p>
    </div>
  );
}
