import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Cherry, Coins, Play, RotateCw } from "lucide-react";

import { GsPanel, GsShell } from "@/components/gs-shell";

export const Route = createFileRoute("/slots")({
  head: () => ({
    meta: [
      { title: "ExactPlay Spin — automaty | ChickenHook.wtf" },
      {
        name: "description",
        content:
          "ExactPlay Spin — parodystyczne automaty kurnika. Kręć bębnami, zgarniaj wirtualne żetony. Zero prawdziwej kasy, sto procent beki.",
      },
      { property: "og:title", content: "ExactPlay Spin — automaty ChickenHook.wtf" },
      {
        property: "og:description",
        content: "Wirtualne żetony, prawdziwa beka. Zakręć bębnami kurnika.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Slots,
});

const SYMBOLS = ["🐔", "🍗", "🥚", "🍒", "💎", "7️⃣", "🐍"] as const;
const SPIN_COST = 10;

const PAYTABLE: { combo: string; label: string; mult: number }[] = [
  { combo: "🐔🐔🐔", label: "Potrójny kurczak", mult: 50 },
  { combo: "7️⃣7️⃣7️⃣", label: "Siódemki", mult: 30 },
  { combo: "💎💎💎", label: "Diamenty", mult: 20 },
  { combo: "🐍🐍🐍", label: "Skeet wykryty", mult: 0 },
];

function evalSpin(reels: string[]): { win: number; note: string } {
  const [a, b, c] = reels as [string, string, string];
  if (a === "🐍" && b === "🐍" && c === "🐍")
    return { win: 0, note: "Skeet wykryty — VAC wciąga żetony." };
  if (a === b && b === c) {
    const row = PAYTABLE.find((p) => p.combo === `${a}${b}${c}`);
    const mult = row?.mult ?? 8;
    return { win: SPIN_COST * mult, note: `${row?.label ?? "Trzy w linii"} — x${mult}!` };
  }
  if (a === b || b === c || a === c) return { win: SPIN_COST * 2, note: "Para — x2." };
  return { win: 0, note: "Pudło. Kurczak nie płaci." };
}

const DEMO_GAMES = [
  { id: "vs20sweetbonanza", title: "Sweet Bonanza" },
  { id: "vs20gates", title: "Gates of Olympus" },
  { id: "vs20doghouse", title: "The Dog House" },
  { id: "vs10bbbonanza", title: "Big Bass Bonanza" },
  { id: "vs25wolfgold", title: "Wolf Gold" },
  { id: "vs20sugarrush", title: "Sugar Rush" },
] as const;

function demoUrl(gameSymbol: string) {
  return `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=pl&cur=PLN&gameSymbol=${gameSymbol}&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99`;
}

function DemoSlots() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <GsPanel title="Prawdziwe demo — Pragmatic Play">
      <div className="space-y-4 px-4 py-4">
        <p className="text-xs text-muted-foreground">
          Oficjalne wersje demo od Pragmatic Play — grasz za wirtualne kredyty, bez depozytu i bez
          rejestracji. Wybierz grę:
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {DEMO_GAMES.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setActive(active === g.id ? null : g.id)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                active === g.id
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-background/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Play className="size-3.5 shrink-0 text-primary" />
              {g.title}
            </button>
          ))}
        </div>

        {active && (
          <div className="overflow-hidden rounded-lg border border-border bg-background">
            <div className="flex items-center justify-between border-b border-border px-3 py-2 text-xs">
              <span className="font-semibold">
                {DEMO_GAMES.find((g) => g.id === active)?.title}
              </span>
              <span className="text-muted-foreground">Tryb demo · kredyty wirtualne</span>
            </div>
            <iframe
              key={active}
              src={demoUrl(active)}
              title={DEMO_GAMES.find((g) => g.id === active)?.title ?? "Demo slot"}
              className="h-[560px] w-full"
              allow="autoplay; fullscreen"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </GsPanel>
  );
}

function Slots() {
  const [reels, setReels] = useState<string[]>(["🐔", "🍗", "🥚"]);
  const [credits, setCredits] = useState(1000);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState("Postaw 10 żetonów i kręć. Wszystko wirtualne.");
  const [lastWin, setLastWin] = useState(0);
  const timers = useRef<ReturnType<typeof setInterval>[]>([]);

  const spin = () => {
    if (spinning) return;
    if (credits < SPIN_COST) {
      setMessage("Brak żetonów. Odśwież stronę — bank kurnika zawsze daje kredyt.");
      return;
    }
    setSpinning(true);
    setLastWin(0);
    setCredits((c) => c - SPIN_COST);
    setMessage("Bębny kręcą się…");

    const finals = Array.from(
      { length: 3 },
      () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)] as string,
    );

    timers.current = finals.map((final, i) =>
      setInterval(() => {
        setReels((r) => {
          const next = [...r];
          next[i] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)] as string;
          return next;
        });
      }, 80 + i * 30),
    );

    finals.forEach((final, i) => {
      setTimeout(() => {
        clearInterval(timers.current[i]!);
        setReels((r) => {
          const next = [...r];
          next[i] = final;
          return next;
        });
        if (i === 2) {
          const { win, note } = evalSpin(finals);
          setLastWin(win);
          if (win > 0) setCredits((c) => c + win);
          setMessage(note);
          setSpinning(false);
        }
      }, 900 + i * 500);
    });
  };

  return (
    <GsShell crumbs={[{ label: "Slots" }]}>
      <main className="mx-auto max-w-4xl space-y-4 px-5 py-4">
        <p className="gs-banner px-4 py-2.5 text-center text-xs font-bold">
          ExactPlay Spin — automaty kurnika · 100% wirtualne żetony · 0% prawdziwej kasy
        </p>

        <h1 className="sr-only">ExactPlay Spin — automaty</h1>

        <DemoSlots />

        <GsPanel title="ExactPlay Spin · Pragmatic Kurczak">
          <div className="flex flex-col items-center gap-5 px-4 py-6">
            <div className="flex items-center gap-3">
              {reels.map((s, i) => (
                <div
                  key={i}
                  className={`flex size-20 items-center justify-center rounded-lg border-2 bg-background text-4xl sm:size-24 sm:text-5xl ${
                    spinning ? "border-border" : lastWin > 0 ? "border-primary" : "border-border"
                  }`}
                >
                  {s}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1.5">
                <Coins className="size-3.5 text-primary" />
                <span className="font-bold">{credits}</span>
                <span className="text-muted-foreground">żetonów</span>
              </span>
              {lastWin > 0 && (
                <span className="font-bold gs-lime">+{lastWin} żetonów</span>
              )}
            </div>

            <button
              type="button"
              onClick={spin}
              disabled={spinning}
              className="gs-action"
            >
              <RotateCw className={`size-3.5 ${spinning ? "animate-spin" : ""}`} />
              {spinning ? "Kręci się…" : `Zakręć (${SPIN_COST} żetonów)`}
            </button>

            <p className="text-center text-xs text-muted-foreground">{message}</p>
          </div>
        </GsPanel>

        <GsPanel title="Tabela wypłat">
          <ul className="divide-y divide-border text-xs">
            {PAYTABLE.map((p) => (
              <li key={p.combo} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-base tracking-widest">{p.combo}</span>
                <span className="text-muted-foreground">{p.label}</span>
                <span className={`font-bold ${p.mult > 0 ? "gs-lime" : "text-primary"}`}>
                  {p.mult > 0 ? `x${p.mult}` : "VAC"}
                </span>
              </li>
            ))}
            <li className="flex items-center justify-between px-4 py-2.5">
              <span className="text-muted-foreground">Dowolna para</span>
              <span />
              <span className="font-bold gs-lime">x2</span>
            </li>
          </ul>
        </GsPanel>

        <GsPanel title="Regulamin kurnika">
          <div className="space-y-2 px-4 py-4 text-xs text-muted-foreground">
            <p className="flex items-start gap-2">
              <Cherry className="mt-0.5 size-3.5 shrink-0 text-primary" />
              Żetony są wirtualne i nie da się ich wymienić na nic — jak dropy z case'ów.
            </p>
            <p className="flex items-start gap-2">
              <Cherry className="mt-0.5 size-3.5 shrink-0 text-primary" />
              To parodia automatów. Prawdziwy hazard zabiera więcej niż VAC.
            </p>
            <p className="flex items-start gap-2">
              <Cherry className="mt-0.5 size-3.5 shrink-0 text-primary" />
              Szansa na potrójnego kurczaka jest taka sama jak na unbana z skeeta.
            </p>
          </div>
        </GsPanel>
      </main>
    </GsShell>
  );
}
