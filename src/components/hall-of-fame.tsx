import { Medal } from "lucide-react";

import { fraggers } from "@/data/community";

const medalColor = ["gs-gold", "text-muted-foreground", "gs-lime"];

export function HallOfFame() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[36rem] text-xs">
        <thead>
          <tr className="border-b border-border text-left uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-2 font-bold">#</th>
            <th className="px-4 py-2 font-bold">Gracz</th>
            <th className="px-4 py-2 font-bold">HS%</th>
            <th className="px-4 py-2 font-bold">K/D</th>
            <th className="px-4 py-2 font-bold">ELO</th>
            <th className="px-4 py-2 font-bold">Banów</th>
            <th className="px-4 py-2 font-bold">Plan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {fraggers.map((f, i) => (
            <tr key={f.nick}>
              <td className="px-4 py-2">
                {i < 3 ? (
                  <Medal className={`size-4 ${medalColor[i]}`} />
                ) : (
                  <span className="text-muted-foreground tabular-nums">{i + 1}</span>
                )}
              </td>
              <td className="px-4 py-2 font-bold">{f.nick}</td>
              <td className="px-4 py-2 gs-lime tabular-nums">{f.hs}</td>
              <td className="px-4 py-2 tabular-nums">{f.kd}</td>
              <td className="px-4 py-2 tabular-nums">{f.elo}</td>
              <td className="px-4 py-2 gs-green font-bold">0</td>
              <td className="px-4 py-2 text-muted-foreground">{f.plan}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
