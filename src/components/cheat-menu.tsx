import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Check,
  ChevronDown,
  Eye,
  Flame,
  Gauge,
  Lock,
  Puzzle,
  Save,
  Search,
  Settings2,
  Shield,
  Sparkles,
  User,
  Wand2,
  Zap,
} from "lucide-react";

import { features, type Feature } from "@/data/features";
import { fallbackMenuConfig, menuOptions, type MenuControl } from "@/data/menu-options";
import { cn } from "@/lib/utils";

// ===== Struktura jak na screenie gamesense: sekcje -> pozycje w sidebarze =====

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

const SECTIONS = [
  { name: "Celowanie", icon: Flame },
  { name: "Wizualizacje", icon: Eye },
  { name: "Ruch", icon: Zap },
  { name: "Exploity", icon: Shield },
  { name: "Inne", icon: Sparkles },
] as const;


// ===== Kontrolki w stylu gamesense =====

function GsSwitch({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-3.5 w-7 shrink-0 items-center rounded-full transition-colors duration-200",
        on ? "bg-menugreen/25" : "bg-secondary",
      )}
    >
      <span
        className={cn(
          "absolute h-2.5 w-2.5 rounded-full transition-all duration-200",
          on ? "left-[15px] bg-menugreen shadow-[0_0_10px_2px_var(--color-menugreen)]" : "left-[3px] bg-muted-foreground/60",
        )}
      />
    </span>
  );
}

function GsSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: number;
  onChange: (v: number) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <div className="text-xs text-foreground/80">{label}</div>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        className="mt-1 flex h-7 w-full items-center justify-between rounded-sm border border-border bg-background/70 px-2 text-xs transition-colors hover:border-menugreen/50"
      >
        <span className="gs-glow truncate text-menugreen">{options[value] ?? options[0]}</span>
        <ChevronDown
          className={cn("size-3 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-sm border border-border bg-card shadow-lg"
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
                  "block w-full px-2 py-1.5 text-left text-xs transition-colors hover:bg-secondary",
                  i === value ? "text-menugreen" : "text-foreground/80",
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


function GsSlider({
  label,
  value,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="text-xs text-foreground/80">{label}</div>
      <div className="mt-2 flex items-center gap-2">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          aria-label={label}
          onChange={(e) => onChange(Number(e.target.value))}
          className="gs-range h-0.5 flex-1 cursor-pointer appearance-none rounded-full"
          style={{
            background: `linear-gradient(to right, var(--color-menugreen) 0%, var(--color-menugreen) ${value}%, var(--border) ${value}%, var(--border) 100%)`,
          }}
        />
        <span className="w-10 text-right text-[11px] tabular-nums text-muted-foreground">
          {value}
          {unit ?? ""}
        </span>
      </div>
    </div>
  );
}

function GsStepper({
  value,
  onChange,
}: {
  value: number;
  onChange?: (v: number) => void;
}) {
  return (
    <span className="inline-flex items-center rounded-sm border border-border bg-background/70 text-[11px]">
      <button
        type="button"
        aria-label="Mniej"
        onClick={() => onChange?.(Math.max(0, value - 1))}
        className="px-1.5 text-muted-foreground transition-colors hover:text-menugreen"
      >
        ‹
      </button>
      <span className="min-w-6 text-center tabular-nums text-foreground/80">{value}</span>
      <button
        type="button"
        aria-label="Więcej"
        onClick={() => onChange?.(value + 1)}
        className="px-1.5 text-muted-foreground transition-colors hover:text-menugreen"
      >
        ›
      </button>
    </span>
  );
}

function GsKey({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-foreground/80">{label}</span>
      <span className="rounded-sm border border-border bg-background/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide gs-glow text-menugreen">
        {value}
      </span>
    </div>
  );
}

// ===== Główny komponent =====

export function CheatMenu() {
  const [selected, setSelected] = useState<Feature>(
    features.find((f) => f.slug === "robot-celu") ?? features[0],
  );
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    "robot-celu": true,
    wizualizacje: true,
    "kroliczy-skok": true,
  });
  const [sliders, setSliders] = useState<Record<string, number>>({});
  const [selects, setSelects] = useState<Record<string, number>>({});


  const bySection = useMemo(() => {
    const map = new Map<string, Feature[]>();
    for (const s of SECTIONS) map.set(s.name, []);
    for (const f of features) map.get(GROUPS[f.slug] ?? "Inne")?.push(f);
    return map;
  }, []);

  const cfg = settingsFor(selected);
  const activeCount = Object.values(enabled).filter(Boolean).length;
  const isOn = !!enabled[selected.slug];

  return (
    <div className="overflow-hidden rounded-md border border-border bg-card/95 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.8)]">
      {/* Pasek tytułu — CHICKENHOOK + Save + ikony */}
      <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-3 py-2">
        <span className="text-sm font-extrabold tracking-wide">
          CHICKEN<span className="gs-glow text-menugreen">HOOK</span>
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-background/60 px-2.5 py-1 text-[11px] font-semibold text-foreground/90 transition-colors hover:border-menugreen/50"
          >
            <Save className="size-3 text-muted-foreground" />
            Zapisz
          </button>
          {[Puzzle, Settings2, Search].map((Icon, i) => (
            <button
              key={i}
              type="button"
              className="grid size-7 place-items-center rounded-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-menugreen"
            >
              <Icon className="size-3.5" />
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-[190px_1fr]">
        {/* Sidebar sekcji */}
        <div className="flex flex-col border-b border-border bg-secondary/25 md:border-b-0 md:border-r">
          <div className="max-h-[120px] flex-1 overflow-y-auto p-1.5 md:max-h-none">
            {SECTIONS.map((s) => {
              const items = bySection.get(s.name) ?? [];
              if (!items.length) return null;
              return (
                <div key={s.name} className="mb-1">
                  <div className="flex items-center gap-1.5 px-2 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    <s.icon className="size-3 gs-glow text-menugreen" />
                    {s.name}
                  </div>
                  {items.map((f) => {
                    const on = !!enabled[f.slug];
                    const active = selected.slug === f.slug;
                    return (
                      <button
                        key={f.slug}
                        type="button"
                        onClick={() => setSelected(f)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-xs transition-colors",
                          active
                            ? "bg-menugreen/15 text-foreground"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                        )}
                      >
                        {on ? (
                          <Check className="size-3.5 shrink-0 gs-glow text-menugreen" />
                        ) : (
                          <span className="size-3.5 shrink-0" />
                        )}
                        <span className="flex-1 truncate">{f.title}</span>
                        {f.restricted && <Lock className="gs-gold size-3 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Profil użytkownika jak w rogu gamesense */}
          <div className="flex items-center gap-2 border-t border-border p-2">
            <span className="grid size-7 place-items-center rounded-sm bg-menugreen/15">
              <User className="size-4 gs-glow text-menugreen" />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-xs font-semibold">Adam Kurczak</span>
              <span className="block text-[10px] text-muted-foreground">Til: 27.08.2026 24:00</span>
            </span>
          </div>
        </div>

        {/* Panel konfiguracji — dwie kolumny jak na screenie */}
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold">{selected.title}</h3>
            <span className="text-[11px] text-muted-foreground">
              {activeCount} aktywnych modułów · INS = menu
            </span>
          </div>

          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {/* Kolumna 1 */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground/80">{cfg.toggles[0].label}</span>
                <button
                  type="button"
                  aria-label={`Przełącz ${selected.title}`}
                  onClick={() => setEnabled((p) => ({ ...p, [selected.slug]: !isOn }))}
                >
                  <GsSwitch on={isOn} />
                </button>
              </div>
              <GsSelect
                label={cfg.selects[0].label}
                options={cfg.selects[0].options}
                value={selects[`${selected.slug}-0`] ?? cfg.selects[0].value}
                onChange={(v) => setSelects((p) => ({ ...p, [`${selected.slug}-0`]: v }))}
              />
              <GsSelect
                label={cfg.selects[1].label}
                options={cfg.selects[1].options}
                value={selects[`${selected.slug}-1`] ?? cfg.selects[1].value}
                onChange={(v) => setSelects((p) => ({ ...p, [`${selected.slug}-1`]: v }))}
              />

              <GsSlider
                label={cfg.sliders[0].label}
                value={sliders[`${selected.slug}-1`] ?? cfg.sliders[0].value}
                onChange={(v) => setSliders((p) => ({ ...p, [`${selected.slug}-1`]: v }))}
              />
              <GsSlider
                label={cfg.sliders[1].label}
                value={sliders[`${selected.slug}-2`] ?? cfg.sliders[1].value}
                onChange={(v) => setSliders((p) => ({ ...p, [`${selected.slug}-2`]: v }))}
              />
            </div>

            {/* Kolumna 2 */}
            <div className="space-y-3.5">
              <GsSelect
                label={cfg.selects[2].label}
                options={cfg.selects[2].options}
                value={selects[`${selected.slug}-2`] ?? cfg.selects[2].value}
                onChange={(v) => setSelects((p) => ({ ...p, [`${selected.slug}-2`]: v }))}
              />

              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground/80">{cfg.toggles[1].label}</span>
                <GsSwitch on={cfg.toggles[1].on} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground/80">{cfg.toggles[2].label}</span>
                <GsSwitch on={cfg.toggles[2].on} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground/80">Limit porcji</span>
                <GsStepper value={cfg.stepper} />
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-foreground/80">
                  <Gauge className="size-3 text-muted-foreground" />
                  Prędkość animacji
                </span>
                <span className="text-[11px] gs-glow text-menugreen">2.0</span>
              </div>
            </div>
          </div>

          <p className="mt-4 border-t border-border pt-3 text-[11px] leading-relaxed text-muted-foreground">
            {selected.desc}
          </p>

          {selected.restricted && (
            <Link
              to="/podanie"
              search={{ modul: selected.slug }}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-sm border border-menugreen/40 bg-menugreen/10 px-3 py-2 text-[11px] font-bold uppercase tracking-wide gs-glow text-menugreen transition-colors hover:bg-menugreen/20"
            >
              <Lock className="size-3" />
              Elite — złóż podanie
            </Link>
          )}
          <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Wand2 className="size-3" />
            ChickenHook.ru © 2016–2026 · Build 4.12.0 · Alpha
          </div>
        </div>
      </div>
    </div>
  );
}
