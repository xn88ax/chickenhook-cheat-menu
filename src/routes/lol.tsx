import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { GsPanel, GsShell } from "@/components/gs-shell";

export const Route = createFileRoute("/lol")({
  head: () => ({
    meta: [
      { title: "ChickenHook dla League of Legends — chickenhook.wtf" },
      {
        name: "description",
        content:
          "ChickenHook wchodzi na Rift: auto-dodge, script orbwalker, zasięgi wież i auto-smite. Kurczak w każdej linii.",
      },
      { property: "og:title", content: "ChickenHook dla League of Legends" },
      { property: "og:description", content: "Kurnik wchodzi na Summoner's Rift. Zero banów, zero honoru." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LolPage,
});

const modules = [
  ["Orbwalker", "Idealny kite: atak, ruch, atak — szybciej niż Faker po trzech kawach."],
  ["Auto-dodge", "Unika skillshotów Morgany, Blitza i Ezreala. Nie unika flame'u na czacie."],
  ["Auto-smite", "Baron, smok i Grzyb Teemo — zabierane w ostatniej klatce."],
  ["Zasięgi wież", "Okręgi zasięgu wież i ultów wroga, żebyś wiedział, gdzie nie wchodzić (i tak wejdziesz)."],
  ["Wardy wroga", "Pokazuje ukryte wardy i Shaco, który stoi w krzaku od 12 minuty."],
  ["Timery", "Czasy odnowienia flasha, smoka, barona i czasu do FF15."],
  ["Auto /mute all", "Włącza się w sekundzie ładowania. Najpopularniejszy moduł w wersji LoL."],
  ["Kurczak skin", "Każdy champion wygląda jak Anivia, ale z KFC."],
];

const champs = ["Yasuo", "Teemo", "Anivia", "Master Yi", "Kalista", "Azir"];

function LolPage() {
  const [opts, setOpts] = useState<Record<string, boolean>>({ Orbwalker: true, "Auto /mute all": true });
  const [champ, setChamp] = useState(champs[0]);

  return (
    <GsShell crumbs={[{ label: "League of Legends" }]}>
      <main className="mx-auto max-w-4xl space-y-4 px-5 py-4">
        <p className="gs-banner px-4 py-2.5 text-center text-xs font-bold">
          chickenhook.wtf × League of Legends — build 4.chkn-lol · Alpha
        </p>

        <GsPanel title="Kurnik wchodzi na Rift">
          <div className="space-y-2 px-4 py-4 text-xs leading-relaxed text-muted-foreground">
            <h1 className="text-sm font-bold text-foreground">ChickenHook dla League of Legends</h1>
            <p>
              Po latach w CS2 kurczak postanowił spróbować czegoś jeszcze bardziej toksycznego.
              Wersja LoL działa na każdej linii, każdym serwerze (EUNE, EUW i nawet PBE) i w
              każdym elo od Żelaza do „rodzice wyłączyli mi internet".
            </p>
            <p className="text-foreground">Status: <span className="font-bold text-primary">undetected przez Vanguard</span> (Vanguard nas jeszcze nie znalazł, bo szuka nas w złej grze).</p>
          </div>
        </GsPanel>

        <GsPanel title="Moduły">
          <ul className="divide-y divide-border">
            {modules.map(([name, desc]) => (
              <li key={name} className="flex items-start gap-3 px-4 py-2.5">
                <input
                  type="checkbox"
                  className="mt-0.5 accent-primary"
                  checked={!!opts[name]}
                  onChange={(e) => setOpts((o) => ({ ...o, [name]: e.target.checked }))}
                  aria-label={name}
                />
                <div>
                  <p className="text-xs font-semibold text-foreground">{name}</p>
                  <p className="text-[11px] text-muted-foreground">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </GsPanel>

        <GsPanel title="Profil championa">
          <div className="space-y-3 px-4 py-4">
            <div className="flex flex-wrap gap-1.5">
              {champs.map((c) => (
                <button
                  key={c}
                  onClick={() => setChamp(c)}
                  className={`rounded-md border px-2.5 py-1 text-xs ${c === champ ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
                >
                  {c}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Wybrany: <span className="font-bold text-foreground">{champ}</span> —{" "}
              {champ === "Yasuo" ? "0/10 gwarantowane, cheat tego nie naprawi." : "profil załadowany, powodzenia w solo q."}
            </p>
          </div>
        </GsPanel>
      </main>
    </GsShell>
  );
}
