import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Lock, Power } from "lucide-react";

import { FeaturePreview } from "@/components/feature-preview";
import { features, type Feature } from "@/data/features";
import { cn } from "@/lib/utils";

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

const CATEGORIES = ["Celowanie", "Wizualizacje", "Ruch", "Exploity", "Inne"] as const;

const KEYS = ["INS", "F1", "F2", "F3", "V", "X", "C", "MOUSE4", "MOUSE5", "ALT", "SHIFT", "G", "B"];

function Switch({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors duration-200",
        on
          ? "border-primary/70 bg-primary/30 shadow-[0_0_12px_-2px_hsl(var(--primary))]"
          : "border-border bg-background/60",
      )}
    >
      <span
        className={cn(
          "absolute h-3.5 w-3.5 rounded-full transition-all duration-200",
          on ? "left-[18px] bg-primary" : "left-[3px] bg-muted-foreground",
        )}
      />
    </span>
  );
}

function Slider({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
        {label}
        <span className="text-primary">
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-1 w-full cursor-pointer appearance-none rounded bg-border accent-primary"
      />
    </label>
  );
}

export function CheatMenu() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("Celowanie");
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    "robot-celu": true,
    wizualizacje: true,
  });
  const [sliders, setSliders] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<Feature>(
    features.find((f) => f.slug === "robot-celu") ?? features[0],
  );

  const list = useMemo(
    () => features.filter((f) => (GROUPS[f.slug] ?? "Inne") === cat),
    [cat],
  );

  const activeCount = Object.values(enabled).filter(Boolean).length;
  const s1 = sliders[`${selected.slug}-1`] ?? 45;
  const s2 = sliders[`${selected.slug}-2`] ?? 70;
  const isOn = !!enabled[selected.slug];

  return (
    <div className="glass overflow-hidden rounded-xl border">
      {/* Pasek tytułu */}
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <Power className={cn("size-4", activeCount ? "text-primary" : "text-muted-foreground")} />
          <span className="text-display text-lg tracking-wide">
            Chicken<span className="text-primary">Hook</span> Menu
          </span>
          <span className="rounded-xl border border-border px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
            v4.2.1
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {activeCount} aktywnych · INS = menu
        </span>
      </div>

      <div className="grid md:grid-cols-[160px_1fr_260px]">
        {/* Kategorie */}
        <div className="flex gap-1 overflow-x-auto border-b border-border/60 p-2 md:flex-col md:overflow-visible md:border-b-0 md:border-r">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={cn(
                "whitespace-nowrap rounded-xl px-3 py-2 text-left text-xs font-bold uppercase tracking-wide transition-colors",
                cat === c
                  ? "bg-secondary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Lista funkcji */}
        <div className="max-h-[420px] overflow-y-auto p-2">
          {list.map((f) => {
            const on = !!enabled[f.slug];
            return (
              <div
                key={f.slug}
                role="button"
                tabIndex={0}
                onClick={() => setSelected(f)}
                onKeyDown={(e) => e.key === "Enter" && setSelected(f)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
                  selected.slug === f.slug ? "bg-secondary" : "hover:bg-secondary/60",
                )}
              >
                <button
                  type="button"
                  aria-label={`Przełącz ${f.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(f);
                    setEnabled((p) => ({ ...p, [f.slug]: !p[f.slug] }));
                  }}
                >
                  <Switch on={on} />
                </button>
                <f.icon className={cn("size-4", on ? "text-primary" : "text-muted-foreground")} />
                <span
                  className={cn(
                    "flex-1 text-sm font-semibold",
                    on ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {f.title}
                </span>
                {f.restricted && <Lock className="size-3.5 text-primary" />}
                <span className="rounded-xl border border-border px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                  {KEYS[features.indexOf(f) % KEYS.length]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Panel szczegółów */}
        <div className="border-t border-border/60 p-4 md:border-l md:border-t-0">
          <FeaturePreview kind={selected.preview} />
          <h3 className="mt-4 text-display text-2xl leading-none">{selected.title}</h3>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{selected.desc}</p>

          <div className="mt-4 space-y-3">
            <Slider
              label="Czułość"
              value={s1}
              suffix="%"
              onChange={(v) => setSliders((p) => ({ ...p, [`${selected.slug}-1`]: v }))}
            />
            <Slider
              label="Siła"
              value={s2}
              suffix="%"
              onChange={(v) => setSliders((p) => ({ ...p, [`${selected.slug}-2`]: v }))}
            />
          </div>

          <ul className="mt-4 space-y-1.5">
            {selected.bullets.slice(0, 3).map((b) => (
              <li key={b} className="flex items-start gap-2 text-xs text-muted-foreground">
                <Check className="mt-0.5 size-3 shrink-0 text-primary" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          {selected.restricted ? (
            <Link
              to="/podanie"
              search={{ modul: selected.slug }}
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-primary/60 bg-primary/10 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-primary"
            >
              <Lock className="size-3" />
              Elite — złóż podanie
            </Link>
          ) : (
            <button
              type="button"
              onClick={() =>
                setEnabled((p) => ({ ...p, [selected.slug]: !p[selected.slug] }))
              }
              className={cn(
                "mt-4 w-full rounded-xl px-3 py-2 text-[11px] font-bold uppercase tracking-wide transition-colors",
                isOn
                  ? "bg-secondary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {isOn ? "Wyłącz moduł" : "Włącz moduł"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
