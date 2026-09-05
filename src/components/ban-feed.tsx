import { useEffect, useState } from "react";
import { ShieldCheck, Skull } from "lucide-react";

import { banFeedLines } from "@/data/community";

type Entry = { id: number; text: string };

let seq = 0;

export function BanFeed() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    setEntries(banFeedLines.slice(0, 4).map((text) => ({ id: ++seq, text })));
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setEntries((e) =>
        [
          {
            id: ++seq,
            text: banFeedLines[Math.floor(Math.random() * banFeedLines.length)] as string,
          },
          ...e,
        ].slice(0, 8),
      );
    }, 4200);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <div className="divide-y divide-border" aria-live="polite">
        {entries.map((e) => (
          <p key={e.id} className="flex items-start gap-2 px-4 py-2 text-xs">
            <Skull className="mt-0.5 size-3.5 shrink-0 text-primary" />
            <span className="text-muted-foreground">{e.text}</span>
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
