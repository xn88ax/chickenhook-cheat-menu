import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  Save,
  Search,
  Settings,
  TriangleAlert,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

/* ---------------------------------- types --------------------------------- */

type Row =
  | { kind: "toggle"; id: string; label: string; warn?: boolean; def?: boolean }
  | {
      kind: "select";
      id: string;
      label: string;
      options: string[];
      def?: number;
    }
  | {
      kind: "slider";
      id: string;
      label: string;
      min: number;
      max: number;
      def: number;
      unit?: string;
    }
  | { kind: "dual"; id: string; label: string; a: number; b: number }
  | { kind: "key"; id: string; label: string; value: string }
  | { kind: "grid"; id: string; items: { id: string; label: string }[] };

type Section = { id: string; title: string; rows: Row[] };

const SECTIONS: Section[] = [
  {
    id: "celowanie",
    title: "Celowanie",
    rows: [
      { kind: "toggle", id: "aim", label: "Włącz aimbota", def: true },
      {
        kind: "select",
        id: "aim-mode",
        label: "Tryb",
        options: ["Wsparcie (legit)", "Semi", "Pełny kurczak"],
      },
      {
        kind: "select",
        id: "aim-bone",
        label: "Kość docelowa",
        options: ["Głowa", "Klatka", "Losowo", "Babcia z sklepu"],
      },
      { kind: "slider", id: "fov", label: "FOV", min: 0, max: 90, def: 24, unit: "°" },
      { kind: "slider", id: "smooth", label: "Wygładzanie", min: 0, max: 100, def: 62 },
      {
        kind: "slider",
        id: "mindmg",
        label: "Min. obrażenia",
        min: 0,
        max: 100,
        def: 40,
        unit: " HP",
      },
      { kind: "dual", id: "rcs", label: "RCS Y / RCS X", a: 85, b: 70 },
      { kind: "key", id: "aim-key", label: "Klawisz aimbota", value: "MOUSE5" },
      {
        kind: "grid",
        id: "aim-grid",
        items: [
          { id: "autoshot", label: "Auto strzał" },
          { id: "ignoreflash", label: "Ignoruj oślepionych" },
          { id: "antiaim", label: "Anti-aim" },
          { id: "fakelag", label: "Fake lag" },
          { id: "fakeduck", label: "Fake duck" },
          { id: "silent", label: "Silent aim" },
          { id: "forceacc", label: "Force accuracy" },
          { id: "mama", label: "Strzelaj tylko gdy mama patrzy" },
        ],
      },
    ],
  },
  {
    id: "wizualizacje",
    title: "Wizualizacje",
    rows: [
      { kind: "toggle", id: "esp", label: "Wizualizacje", def: true },
      { kind: "toggle", id: "skins", label: "Zmieniacz skórek" },
      { kind: "toggle", id: "customskin", label: "Custom skin" },
      {
        kind: "select",
        id: "esp-style",
        label: "Styl ESP",
        options: ["Box + szkielet", "Tylko szkielet", "Chams kurczak"],
      },
    ],
  },
  {
    id: "ruch",
    title: "Ruch",
    rows: [
      { kind: "toggle", id: "noclip", label: "Noclip", warn: true },
      { kind: "toggle", id: "bhop", label: "Króliczy skok", def: true },
      { kind: "toggle", id: "move", label: "Ruch" },
      { kind: "toggle", id: "speed", label: "Przyspieszenie" },
    ],
  },
  {
    id: "exploity",
    title: "Exploity",
    rows: [
      { kind: "toggle", id: "god", label: "Tryb boga", warn: true },
      { kind: "toggle", id: "tp", label: "Teleport", warn: true },
      { kind: "toggle", id: "crash", label: "Awaria serwera", warn: true },
      { kind: "toggle", id: "money", label: "Glitch kasy", warn: true },
      { kind: "toggle", id: "2pac", label: "2PACALYPSE 2.3", warn: true },
      { kind: "toggle", id: "jam", label: "Zacinka broni wroga", warn: true },
      { kind: "toggle", id: "cars", label: "Spawner pojazdów", warn: true },
      { kind: "toggle", id: "kfc", label: "Pyszne.pl – KFC", warn: true },
    ],
  },
  {
    id: "inne",
    title: "Inne",
    rows: [
      { kind: "toggle", id: "voice", label: "Czat głosowy" },
      { kind: "toggle", id: "radio", label: "Radio" },
      { kind: "toggle", id: "strazak", label: "Auto strażak", def: true },
      { kind: "toggle", id: "flash", label: "Auto flash" },
      { kind: "toggle", id: "nade", label: "Nade helper" },
      { kind: "toggle", id: "plant", label: "Auto plant" },
      { kind: "toggle", id: "resolver", label: "Kurczak resolver" },
      { kind: "toggle", id: "babcia", label: "Auto headshot na babci z sklepu" },
      { kind: "slider", id: "szacunek", label: "Szacunek do przeciwnika", min: 0, max: 100, def: 0, unit: "%" },
    ],
  },
];

const PRESETS: Record<string, { on: string[]; off: string[] }> = {
  Legit: {
    on: ["aim", "esp", "bhop"],
    off: ["antiaim", "fakelag", "silent", "noclip", "god", "crash", "2pac"],
  },
  Semi: {
    on: ["aim", "esp", "bhop", "autoshot", "silent"],
    off: ["noclip", "crash", "2pac", "kfc"],
  },
  Rage: {
    on: ["aim", "esp", "autoshot", "silent", "antiaim", "fakelag", "fakeduck", "forceacc", "resolver"],
    off: ["mama"],
  },
  KFC: {
    on: ["kfc", "radio", "mama", "babcia", "cars"],
    off: ["antiaim", "silent", "forceacc"],
  },
};

const DEFAULT_TOGGLES = (() => {
  const map: Record<string, boolean> = {};
  for (const s of SECTIONS)
    for (const r of s.rows) {
      if (r.kind === "toggle") map[r.id] = Boolean(r.def);
      if (r.kind === "grid") for (const i of r.items) map[i.id] = false;
    }
  return map;
})();

const DEFAULT_SLIDERS = (() => {
  const map: Record<string, number> = {};
  for (const s of SECTIONS)
    for (const r of s.rows) {
      if (r.kind === "slider") map[r.id] = r.def;
      if (r.kind === "dual") {
        map[`${r.id}-y`] = r.a;
        map[`${r.id}-x`] = r.b;
      }
    }
  return map;
})();

/* -------------------------------- controls -------------------------------- */

function Pill({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={cn(
        "relative h-[14px] w-[26px] shrink-0 rounded-full border transition-colors",
        on
          ? "border-ovl-accent/70 bg-ovl-accent/30 shadow-[0_0_8px_0_var(--color-ovl-accent)]"
          : "border-border bg-secondary",
      )}
    >
      <span
        className={cn(
          "absolute top-[2px] size-2 rounded-full transition-all",
          on ? "left-[13px] bg-ovl-accent" : "left-[2px] bg-muted-foreground/70",
        )}
      />
    </button>
  );
}

function Thin({
  value,
  min,
  max,
  onChange,
  className,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  className?: string;
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={cn("ovl-range", className)}
    />
  );
}

function Compact({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: number;
  onChange: (v: number) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        className="flex h-[22px] w-[132px] items-center justify-between gap-1 rounded-md border border-border bg-background/70 px-2 text-[11px] text-foreground/90 transition-colors hover:border-ovl-accent/60"
      >
        <span className="truncate">{options[value] ?? options[0]}</span>
        <ChevronDown className={cn("size-3 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-30 mt-1 w-[150px] overflow-hidden rounded-md border border-border bg-ovl-panel shadow-xl"
        >
          {options.map((o, i) => (
            <li key={o}>
              <button
                type="button"
                role="option"
                aria-selected={i === value}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(i);
                  setOpen(false);
                }}
                className={cn(
                  "block w-full px-2 py-1 text-left text-[11px] transition-colors hover:bg-secondary",
                  i === value ? "text-ovl-accent" : "text-foreground/85",
                )}
              >
                {o}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------- main panel ------------------------------- */

export function OverlayMenu() {
  const [hidden, setHidden] = useState(false);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({ celowanie: true });
  const [toggles, setToggles] = useState<Record<string, boolean>>(DEFAULT_TOGGLES);
  const [sliders, setSliders] = useState<Record<string, number>>(DEFAULT_SLIDERS);
  const [preset, setPreset] = useState<string | null>(null);
  const [selects, setSelects] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setHidden(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const needle = q.trim().toLowerCase();
  const activeCount = useMemo(
    () => Object.values(toggles).filter(Boolean).length,
    [toggles],
  );

  const matches = (label: string) => !needle || label.toLowerCase().includes(needle);

  const visible = useMemo(
    () =>
      SECTIONS.map((s) => {
        const rows = s.rows
          .map((r) => {
            if (r.kind === "grid") {
              const items = r.items.filter((i) => matches(i.label));
              return items.length ? { ...r, items } : null;
            }
            return matches(r.label) ? r : null;
          })
          .filter(Boolean) as Row[];
        return { ...s, rows };
      }).filter((s) => s.rows.length > 0),
    [needle],
  );

  const applyPreset = (name: string) => {
    const p = PRESETS[name];
    if (!p) return;
    setToggles((t) => {
      const next = { ...t };
      for (const id of p.on) next[id] = true;
      for (const id of p.off) next[id] = false;
      return next;
    });
    setPreset(name);
    showToast(`Preset ${name} załadowany`);
  };

  if (hidden) {
    return (
      <div className="flex justify-center py-8">
        <button
          type="button"
          onClick={() => setHidden(false)}
          className="rounded-md border border-border bg-ovl-panel px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-foreground/80 transition-colors hover:border-ovl-accent/60"
        >
          INS — otwórz menu
        </button>
      </div>
    );
  }

  return (
    <div className="ovl-stage relative flex justify-center overflow-hidden rounded-lg p-4 sm:p-6">
      <div className="ovl-panel relative z-10 flex h-[720px] w-full max-w-[880px] flex-col overflow-hidden rounded-[10px] border border-border/80 bg-ovl-panel/95 font-sans">
        {/* top bar */}
        <header className="flex h-10 shrink-0 items-center gap-3 border-b border-border/70 px-3">
          <span className="select-none text-[13px] font-bold uppercase tracking-tight">
            <span className="text-foreground">CHICKEN</span>
            <span className="text-ovl-accent">HOOK</span>
          </span>
          <div className="relative mx-auto w-full max-w-[320px]">
            <Search className="pointer-events-none absolute left-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Szukaj opcji… / INS = menu"
              className="h-[24px] w-full rounded-md border border-border bg-background/70 pl-7 pr-2 text-[11px] outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-ovl-accent/60"
            />
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => showToast("Zapisano w chmurze kurczaka")}
              className="inline-flex h-[24px] items-center gap-1 rounded-md border border-border px-2 text-[10px] font-bold uppercase tracking-wide text-foreground/85 transition-colors hover:border-ovl-accent/60 hover:text-foreground"
            >
              <Save className="size-3" />
              Zapisz
            </button>
            <button
              type="button"
              aria-label="Presety"
              onClick={() => showToast("Presety: Legit / Semi / Rage / KFC")}
              className="grid size-[24px] place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-ovl-accent/60 hover:text-foreground"
            >
              <Settings className="size-3" />
            </button>
            <button
              type="button"
              aria-label="Zamknij"
              onClick={() => setHidden(true)}
              className="grid size-[24px] place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-ovl-accent/60 hover:text-ovl-accent"
            >
              <X className="size-3" />
            </button>
          </div>
        </header>

        {/* status strip */}
        <div className="flex h-[30px] shrink-0 items-center gap-2 border-b border-border/70 bg-background/40 px-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {activeCount} aktywne moduły
          </span>
          <div className="ml-auto flex items-center gap-1">
            {Object.keys(PRESETS).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => applyPreset(p)}
                className={cn(
                  "rounded-full border px-2 py-[2px] text-[10px] font-bold uppercase tracking-wide transition-colors",
                  preset === p
                    ? "border-ovl-accent/70 bg-ovl-accent/20 text-ovl-accent"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2">
          {visible.map((s) => {
            const expanded = needle ? true : Boolean(open[s.id]);
            const sectionActive = s.rows.reduce((n, r) => {
              if (r.kind === "toggle") return n + (toggles[r.id] ? 1 : 0);
              if (r.kind === "grid")
                return n + r.items.filter((i) => toggles[i.id]).length;
              return n;
            }, 0);
            return (
              <section key={s.id} className="mb-1.5 rounded-md border border-border/70 bg-background/30">
                <button
                  type="button"
                  onClick={() => setOpen((o) => ({ ...o, [s.id]: !o[s.id] }))}
                  aria-expanded={expanded}
                  className="flex h-[32px] w-full items-center gap-2 px-2.5 text-left"
                >
                  <ChevronDown
                    className={cn(
                      "size-3 text-muted-foreground transition-transform",
                      expanded ? "" : "-rotate-90",
                    )}
                  />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-foreground">
                    {s.title}
                  </span>
                  {sectionActive > 0 && (
                    <span className="rounded-full bg-ovl-accent/20 px-1.5 text-[9px] font-bold text-ovl-accent">
                      {sectionActive}
                    </span>
                  )}
                </button>

                {expanded && (
                  <div className="border-t border-border/60 px-2.5 py-1.5">
                    {s.rows.map((r) => {
                      if (r.kind === "grid") {
                        return (
                          <div key={r.id} className="mt-1 grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                            {r.items.map((i) => (
                              <div
                                key={i.id}
                                className="flex h-[26px] items-center justify-between gap-2"
                              >
                                <span
                                  title={i.label}
                                  className="truncate text-[11px] text-foreground/85"
                                >
                                  {i.label}
                                </span>
                                <Pill
                                  on={Boolean(toggles[i.id])}
                                  onClick={() =>
                                    setToggles((t) => ({ ...t, [i.id]: !t[i.id] }))
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        );
                      }

                      return (
                        <div
                          key={r.id}
                          className="flex h-[32px] items-center justify-between gap-3"
                        >
                          <span
                            title={r.label}
                            className="flex min-w-0 items-center gap-1.5 truncate text-[11px] text-foreground/85"
                          >
                            {r.kind === "toggle" && r.warn && (
                              <TriangleAlert className="size-3 shrink-0 text-amber-500" />
                            )}
                            {r.label}
                          </span>

                          {r.kind === "toggle" && (
                            <Pill
                              on={Boolean(toggles[r.id])}
                              onClick={() =>
                                setToggles((t) => ({ ...t, [r.id]: !t[r.id] }))
                              }
                            />
                          )}

                          {r.kind === "select" && (
                            <Compact
                              options={r.options}
                              value={selects[r.id] ?? r.def ?? 0}
                              onChange={(v) => setSelects((s2) => ({ ...s2, [r.id]: v }))}
                            />
                          )}

                          {r.kind === "slider" && (
                            <div className="flex shrink-0 items-center gap-2">
                              <Thin
                                min={r.min}
                                max={r.max}
                                value={sliders[r.id] ?? r.def}
                                onChange={(v) => setSliders((s2) => ({ ...s2, [r.id]: v }))}
                                className="w-[132px]"
                              />
                              <span className="w-[42px] text-right text-[10px] tabular-nums text-ovl-accent">
                                {sliders[r.id] ?? r.def}
                                {r.unit ?? ""}
                              </span>
                            </div>
                          )}

                          {r.kind === "dual" && (
                            <div className="flex shrink-0 items-center gap-2">
                              {(["y", "x"] as const).map((axis) => (
                                <div key={axis} className="flex items-center gap-1">
                                  <Thin
                                    min={0}
                                    max={100}
                                    value={sliders[`${r.id}-${axis}`] ?? 0}
                                    onChange={(v) =>
                                      setSliders((s2) => ({ ...s2, [`${r.id}-${axis}`]: v }))
                                    }
                                    className="w-[58px]"
                                  />
                                  <span className="w-[30px] text-right text-[10px] tabular-nums text-ovl-accent">
                                    {sliders[`${r.id}-${axis}`] ?? 0}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {r.kind === "key" && (
                            <span className="rounded-md border border-border bg-background/70 px-2 py-[2px] text-[10px] font-bold tracking-wide text-foreground/90">
                              {r.value}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}

          {visible.length === 0 && (
            <p className="py-8 text-center text-[11px] text-muted-foreground">
              Brak opcji dla „{q}”.
            </p>
          )}
        </div>

        {/* hint bar */}
        <div className="shrink-0 border-t border-border/70 bg-background/40 px-3 py-1.5">
          <p className="truncate text-[10px] text-muted-foreground">
            Aimbot koryguje kąt w stronę wybranej kości. Im niższy smooth, tym szybszy,
            ale mniej naturalny ruch.
          </p>
        </div>

        {/* footer */}
        <footer className="flex h-[26px] shrink-0 items-center justify-between gap-2 border-t border-border/70 px-3">
          <span className="truncate text-[9px] uppercase tracking-widest text-muted-foreground">
            chickenhook.wtf · 2018–2026 · Build 4-chkn · Alpha
          </span>
          <span className="shrink-0 rounded-full border border-border px-2 py-[1px] text-[9px] text-foreground/80">
            Adam Kurczak · Ttl 27.08.2026 24:00
          </span>
        </footer>

        {toast && (
          <div
            role="status"
            className="pointer-events-none absolute bottom-12 left-1/2 -translate-x-1/2 rounded-md border border-ovl-accent/60 bg-ovl-bg/95 px-3 py-1.5 text-[11px] text-foreground shadow-[0_0_20px_0_color-mix(in_oklab,var(--color-ovl-accent)_35%,transparent)]"
          >
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
