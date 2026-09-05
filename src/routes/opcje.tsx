import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Lock, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { CheatMenu } from "@/components/cheat-menu";
import { FeaturePreview } from "@/components/feature-preview";
import { features as options } from "@/data/features";
import { GsPanel, GsShell } from "@/components/gs-shell";


export const Route = createFileRoute("/opcje")({
  head: () => ({
    meta: [
      { title: "Opcje cheata — ChickenHook.ru | CS2" },
      {
        name: "description",
        content:
          "Pełna lista opcji ChickenHook: brak klipu, tryb boga, króliczy skok, robot celu, robot spustu, wizualizacje, zmieniacz skórek, ruch i różne.",
      },
      { property: "og:title", content: "Opcje cheata — ChickenHook.ru" },
      {
        property: "og:description",
        content:
          "Brak klipu, tryb boga, króliczy skok, robot celu, robot spustu, wizualizacje, zmieniacz skórek, ruch i różne.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Opcje,
});
const GROUPS: Record<string, string> = {
  "robot-celu": "Celowanie",
  "robot-spustu": "Celowanie",
  wizualizacje: "Wizualizacje",
  "zmieniacz-skorek": "Wizualizacje",
  ruch: "Ruch",
  "kroliczy-skok": "Ruch",
  przyspieszenie: "Ruch",
  "brak-klipu": "Ruch",
  "tryb-boga": "Exploity",
  teleport: "Exploity",
  "awaria-serwera": "Exploity",
  "glitch-kasy": "Exploity",
  rozne: "Inne",
};

const TABS = ["Wszystkie", "Celowanie", "Wizualizacje", "Ruch", "Exploity", "Inne"] as const;

function Opcje() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Wszystkie");
  const [q, setQ] = useState("");
  const [onlyElite, setOnlyElite] = useState(false);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return options.filter((o) => {
      const group = GROUPS[o.slug] ?? "Inne";
      if (tab !== "Wszystkie" && group !== tab) return false;
      if (onlyElite && !o.restricted) return false;
      if (needle && !`${o.title} ${o.desc}`.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [tab, q, onlyElite]);

  return (
    <GsShell crumbs={[{ label: "Funkcje" }]}>
      <main className="mx-auto max-w-6xl space-y-4 px-5 py-4">
        <p className="gs-banner px-4 py-2.5 text-center text-xs font-bold">
          Wszystkie moduły ChickenHook — build 4.12.0
        </p>

        <GsPanel title="Menu cheata">
          <div className="p-4">
            <CheatMenu />
          </div>
        </GsPanel>

        <GsPanel title="Lista modułów">
        <div className="p-4">


        <div className="flex flex-col gap-4 border-b border-border/60 pb-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {TABS.map((t) => {
              const count =
                t === "Wszystkie"
                  ? options.length
                  : options.filter((o) => (GROUPS[o.slug] ?? "Inne") === t).length;
              const active = tab === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`rounded-sm px-3 py-2 text-xs font-bold uppercase tracking-wide transition-all duration-200 ${
                    active
                      ? "bucket-gradient text-primary-foreground shadow-[var(--shadow-bucket)]"
                      : "border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {t}
                  <span className="ml-1.5 opacity-60">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyElite((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-sm px-3 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                onlyElite
                  ? "border border-primary/60 bg-primary/20 text-primary"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Lock className="size-3.5" />
              Elite
            </button>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Szukaj funkcji…"
                className="w-full rounded-sm border border-border bg-background/60 py-2 pl-9 pr-8 text-sm outline-none transition-colors focus:border-primary/60 md:w-56"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => setQ("")}
                  aria-label="Wyczyść"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {filtered.length} / {options.length} modułów
        </p>

        <div className="mt-8 divide-y divide-border/60">
          {filtered.map((o) => (
            <article key={o.slug} className="grid gap-8 py-12 md:grid-cols-[1.1fr_1fr]">
              <div>
                <div className="flex items-center gap-3">
                  <o.icon className="size-7 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    {GROUPS[o.slug] ?? "Inne"}
                  </span>
                  {o.restricted && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
                      <Lock className="size-3" />
                      Elite + podanie
                    </span>
                  )}
                </div>
                <h2 className="mt-4 text-display text-4xl uppercase leading-none">{o.title}</h2>
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
                  {o.long}
                </p>
                <ul className="mt-5 space-y-2">
                  {o.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                {o.restricted && (
                  <Link
                    to="/podanie"
                    search={{ modul: o.slug }}
                    className="mt-5 inline-block text-xs font-bold uppercase tracking-wide text-primary underline-offset-4 hover:underline"
                  >
                    Złóż podanie o dostęp
                  </Link>
                )}
              </div>

              <div className="preview-open self-center">
                <FeaturePreview kind={o.preview} />
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-display text-2xl uppercase">Brak wyników</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Zmień filtr albo wpisz inną frazę.
            </p>
          </div>
        )}



        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            to="/"
            hash="menu"
            className="rounded-sm bucket-gradient px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-bucket)] transition-transform hover:-translate-y-0.5"
          >
            Zobacz cennik
          </Link>
          <Link
            to="/"
            className="rounded-sm border border-border px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-foreground transition-colors hover:bg-secondary"
          >
            Wróć na start
          </Link>
        </div>
        </div>
        </GsPanel>
      </main>
    </GsShell>

  );
}
