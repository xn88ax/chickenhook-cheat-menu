import { Check, X } from "lucide-react";

const rivals = ["ChickenHook", "Skeet", "Onetap", "Aimware"] as const;

const rows: { label: string; values: (boolean | string)[]; note?: string }[] = [
  { label: "Undetected od 412 dni", values: [true, false, false, false] },
  { label: "Support odpisuje w 12 sekund", values: [true, false, false, false] },
  { label: "Menu, które da się zrozumieć", values: [true, false, true, false] },
  { label: "Aimbot z regulacją chrupkości", values: [true, false, false, false] },
  { label: "Sponsor z branży fast food", values: [true, false, false, false] },
  { label: "Cena w złotówkach", values: [true, false, false, false] },
  { label: "Konfigi od Magdy Gessler", values: [true, false, false, false] },
  { label: "Banów w 2026", values: ["0", "412", "289", "176"] },
  { label: "Liczba użytkowników", values: ["6 albo 7", "dużo", "mniej", "coraz mniej"] },
];

export function CompetitorTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[34rem] text-xs">
        <thead>
          <tr className="border-b border-border text-left uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-2 font-bold">Kategoria</th>
            {rivals.map((r) => (
              <th
                key={r}
                className={`px-4 py-2 font-bold ${r === "ChickenHook" ? "gs-lime" : ""}`}
              >
                {r}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr key={row.label}>
              <td className="px-4 py-2 text-muted-foreground">{row.label}</td>
              {row.values.map((v, i) => (
                <td key={i} className="px-4 py-2">
                  {typeof v === "string" ? (
                    <span className={i === 0 ? "font-bold gs-green" : "text-muted-foreground"}>
                      {v}
                    </span>
                  ) : v ? (
                    <Check className="size-4 gs-green" />
                  ) : (
                    <X className="size-4 text-muted-foreground" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
        Tabela w 100% obiektywna, sporządzona przez dział marketingu ChickenHook. Parodia.
      </p>
    </div>
  );
}
