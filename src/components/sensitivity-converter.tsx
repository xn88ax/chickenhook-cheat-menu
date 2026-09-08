import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const games = [
  { name: "CS 1.6 / CS:S", factor: 1 },
  { name: "CS2", factor: 1 },
  { name: "Valorant", factor: 0.314 },
  { name: "Overwatch 2", factor: 3.333 },
  { name: "Apex Legends", factor: 3.333 },
  { name: "Rainbow Six Siege", factor: 3.84 },
  { name: "Fortnite", factor: 3.333 },
  { name: "Call of Duty", factor: 3.333 },
];

export function SensitivityConverter() {
  const [sens, setSens] = useState<string>("2.5");
  const [from, setFrom] = useState(games[2].name);
  const [to, setTo] = useState(games[1].name);

  const fromGame = games.find((g) => g.name === from)!;
  const toGame = games.find((g) => g.name === to)!;
  const value = parseFloat(sens) || 0;
  const converted = value ? ((value / fromGame.factor) * toGame.factor).toFixed(4) : "0";

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs">Z gry</Label>
          <select
            className="h-9 w-full rounded-md border border-border bg-background px-2 text-xs outline-none focus:ring-1 focus:ring-primary"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          >
            {games.map((g) => (
              <option key={g.name} value={g.name}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Do gry</Label>
          <select
            className="h-9 w-full rounded-md border border-border bg-background px-2 text-xs outline-none focus:ring-1 focus:ring-primary"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          >
            {games.map((g) => (
              <option key={g.name} value={g.name}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-2">
          <Label className="text-xs">Twoja sensitivity</Label>
          <Input
            type="number"
            step="0.01"
            value={sens}
            onChange={(e) => setSens(e.target.value)}
            className="h-9 text-xs"
          />
        </div>
        <Button variant="outline" size="sm" className="h-9 px-3 text-xs" onClick={swap}>
          Zamień
        </Button>
      </div>

      <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
        <div className="text-xs text-muted-foreground">Wynik w {toGame.name}</div>
        <div className="mt-1 font-display text-2xl text-primary">{converted}</div>
      </div>

      <p className="text-[10px] leading-relaxed text-muted-foreground">
        Przelicznik bazuje na przybliżonych współczynnikach DPI/sens. Nie zastępuje prawdziwego feelu, ale daje dobry punkt wyjścia.
      </p>
    </div>
  );
}
