import { useState } from "react";
import { Ban } from "lucide-react";

import { opps, plDate } from "@/data/community";
import { Button } from "@/components/ui/button";

export function OppList() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? opps : opps.slice(0, 5);
  return (
    <div>
    <div className="max-h-[28rem] overflow-auto">
      <table className="w-full min-w-[36rem] text-xs">
        <thead className="sticky top-0 z-10 bg-card">
          <tr className="border-b border-border text-left uppercase tracking-[0.08em] text-muted-foreground">
            <th className="px-4 py-2 font-bold">#</th>
            <th className="px-4 py-2 font-bold">Opp</th>
            <th className="px-4 py-2 font-bold">Powód bana</th>
            <th className="px-4 py-2 font-bold">Zbanował</th>
            <th className="px-4 py-2 font-bold">Data</th>
            <th className="px-4 py-2 font-bold">Wygaśnięcie</th>
            <th className="px-4 py-2 font-bold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {visible.map((o, i) => (
            <tr key={o.nick} className="odd:bg-background/20">
              <td className="px-4 py-2 text-muted-foreground tabular-nums">{i + 1}</td>
              <td className="px-4 py-2 font-bold">{o.nick}</td>
              <td className="px-4 py-2">{o.reason}</td>
              <td className="px-4 py-2 text-muted-foreground">{o.bannedBy}</td>
              <td className="px-4 py-2 text-muted-foreground tabular-nums">{plDate(o.date)}</td>
              <td className="px-4 py-2 text-muted-foreground">{o.duration}</td>
              <td className="px-4 py-2">
                <span className="inline-flex items-center gap-1 font-bold text-primary">
                  <Ban className="size-3" />
                  ZBANOWANY
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-2.5">
      <p className="text-[10px] text-muted-foreground">
        Rejestr banów forumowych chickenhook.wtf. Nicki są zmyślone (parodia), powody niestety też — realne byłyby nudniejsze.
      </p>
      <Button variant="outline" size="sm" onClick={() => setExpanded((v) => !v)}>{expanded ? "Pokaż mniej" : `Pełna lista (${opps.length})`}</Button>
      </div>
    </div>
  );
}
