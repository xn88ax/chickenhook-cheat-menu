import { Ban } from "lucide-react";

import { opps, plDate } from "@/data/community";

export function OppList() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[36rem] text-xs">
        <thead>
          <tr className="border-b border-border text-left uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-2 font-bold">#</th>
            <th className="px-4 py-2 font-bold">Opp</th>
            <th className="px-4 py-2 font-bold">Cheat</th>
            <th className="px-4 py-2 font-bold">Powód bana</th>
            <th className="px-4 py-2 font-bold">Data</th>
            <th className="px-4 py-2 font-bold">Fala</th>
            <th className="px-4 py-2 font-bold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {opps.map((o, i) => (
            <tr key={o.nick}>
              <td className="px-4 py-2 text-muted-foreground tabular-nums">{i + 1}</td>
              <td className="px-4 py-2 font-bold">{o.nick}</td>
              <td className="px-4 py-2 text-muted-foreground">{o.cheat}</td>
              <td className="px-4 py-2">{o.reason}</td>
              <td className="px-4 py-2 text-muted-foreground tabular-nums">{plDate(o.date)}</td>
              <td className="px-4 py-2 text-muted-foreground">{o.wave}</td>
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
      <p className="border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
        Nicki są zmyślone (parodia), ale fale banów lecą po tej samej osi czasu co feed. Żaden z nich nie grał na ChickenHook.
      </p>
    </div>
  );
}
