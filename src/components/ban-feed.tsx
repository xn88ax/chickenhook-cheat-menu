import { useEffect, useState } from "react";
import { ShieldCheck, Skull } from "lucide-react";

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
      <div className="divide-y divide-border" aria-live="polite">
        {visible.map((w) => (
          <p key={w.date + w.cheat} className="flex items-start gap-2 px-4 py-2 text-xs">
            <Skull className="mt-0.5 size-3.5 shrink-0 text-primary" />
            <span className="tabular-nums text-muted-foreground">{plDate(w.date)}</span>
            <span className="flex-1">
              <span className="font-bold">{w.cheat}</span>{" "}
              <span className="text-muted-foreground">
                — {w.accounts.toLocaleString("pl-PL")} kont, {w.note}
              </span>
            </span>
          </p>
        ))}
      </div>
      <p className="flex items-center gap-2 border-t border-border bg-secondary px-4 py-2.5 text-xs font-bold">
        <ShieldCheck className="size-4 gs-green" />
        ChickenHook — <span className="gs-green">undetected</span>
        <span className="ml-auto text-[10px] font-normal text-muted-foreground">
          412 dni bez wykrycia
        </span>
      </p>
    </div>
  );
}
