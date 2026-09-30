import { Link } from "@tanstack/react-router";
import { ChevronDown, Save, Search, Settings, X } from "lucide-react";
import { useMemo, useState } from "react";

import type { GameControl, GameMenuConfig } from "@/data/game-menu-data";
import { cn } from "@/lib/utils";

const GAMES = [
  { label: "CS2", to: "/cs" },
  { label: "League of Legends", to: "/lol" },
  { label: "Fortnite", to: "/fortnite" },
] as const;

export function GameTabs({ active }: { active: "cs" | "lol" | "fortnite" }) {
  return (
    <nav className="grid grid-cols-3 overflow-hidden rounded-md border border-border bg-card/80" aria-label="Wybór gry">
      {GAMES.map((game) => {
        const selected = game.to === `/${active}`;
        return (
          <Link key={game.to} to={game.to} className={cn("flex min-h-10 items-center justify-center border-r border-border px-2 text-center text-[11px] font-bold uppercase transition-colors last:border-r-0 sm:text-xs", selected ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
            {game.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={onClick} className={cn("relative h-4 w-8 shrink-0 rounded-full border transition-colors", on ? "border-primary/60 bg-primary/25" : "border-border bg-secondary")}><span className={cn("absolute top-0.5 size-2.5 rounded-full transition-all", on ? "left-[17px] bg-primary shadow-[0_0_9px_var(--primary)]" : "left-0.5 bg-muted-foreground")} /></button>;
}

function Control({ control, enabled, setEnabled, values, setValues }: { control: GameControl; enabled: Record<string, boolean>; setEnabled: React.Dispatch<React.SetStateAction<Record<string, boolean>>>; values: Record<string, number>; setValues: React.Dispatch<React.SetStateAction<Record<string, number>>> }) {
  if (control.kind === "toggle") {
    const on = enabled[control.id] ?? Boolean(control.defaultOn);
    return <div className="flex min-h-8 items-center justify-between gap-3"><span className={cn("text-[11px] text-foreground/85", control.warning && "text-amber-400")}>{control.label}</span><Toggle label={control.label} on={on} onClick={() => setEnabled((state) => ({ ...state, [control.id]: !on }))} /></div>;
  }
  if (control.kind === "slider") {
    const value = values[control.id] ?? control.value;
    return <div className="py-1"><div className="mb-1 flex items-center justify-between text-[11px]"><span className="text-foreground/85">{control.label}</span><span className="tabular-nums text-primary">{value}{control.unit}</span></div><input aria-label={control.label} type="range" min={control.min} max={control.max} value={value} onChange={(event) => setValues((state) => ({ ...state, [control.id]: Number(event.target.value) }))} className="gs-range h-0.5 w-full cursor-pointer appearance-none" style={{ background: `linear-gradient(to right,var(--primary) 0%,var(--primary) ${((value-control.min)/(control.max-control.min))*100}%,var(--border) ${((value-control.min)/(control.max-control.min))*100}%,var(--border) 100%)` }} /></div>;
  }
  if (control.kind === "select") {
    const value = values[control.id] ?? control.value ?? 0;
    return <label className="flex min-h-9 items-center justify-between gap-3 text-[11px] text-foreground/85"><span>{control.label}</span><select aria-label={control.label} value={value} onChange={(event) => setValues((state) => ({ ...state, [control.id]: Number(event.target.value) }))} className="h-6 max-w-[52%] rounded-sm border border-border bg-background px-1.5 text-[10px] text-primary outline-none focus:border-primary/60">{control.options.map((option, index) => <option key={option} value={index}>{option}</option>)}</select></label>;
  }
  return <div className="flex min-h-8 items-center justify-between gap-3 text-[11px]"><span className="text-foreground/85">{control.label}</span><span className="rounded-sm border border-border bg-background px-2 py-0.5 font-bold text-primary">{control.value}</span></div>;
}

export function GameMenu({ config }: { config: GameMenuConfig }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>(() => Object.fromEntries(config.sections.map((section, index) => [section.id, index === 0])));
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const [values, setValues] = useState<Record<string, number>>({});
  const [preset, setPreset] = useState("Legit");
  const [toast, setToast] = useState("");
  const needle = query.trim().toLocaleLowerCase("pl");
  const sections = useMemo(() => config.sections.map((section) => ({ ...section, controls: section.controls.filter((control) => !needle || `${section.title} ${control.label}`.toLocaleLowerCase("pl").includes(needle)) })).filter((section) => section.controls.length), [config, needle]);
  const active = config.sections.flatMap((section) => section.controls).filter((control) => control.kind === "toggle" && (enabled[control.id] ?? Boolean(control.defaultOn))).length;

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 1800); };
  return (
    <div className="relative flex h-[min(720px,calc(100vh-150px))] min-h-[560px] w-full flex-col overflow-hidden rounded-[10px] border border-border/80 bg-ovl-panel/95 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.8)]">
      <header className="flex min-h-10 shrink-0 flex-wrap items-center gap-2 border-b border-border/70 px-3 py-1.5">
        <span className="shrink-0 text-[13px] font-bold uppercase"><span className="text-foreground">CHICKEN</span><span className="text-primary">HOOK</span><span className="ml-2 text-[9px] text-muted-foreground">{config.game}</span></span>
        <label className="relative ml-auto w-full sm:w-[260px]"><Search className="pointer-events-none absolute left-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Szukaj opcji…" className="h-6 w-full rounded-md border border-border bg-background/70 pl-7 pr-7 text-[11px] outline-none focus:border-primary/60" />{query && <button type="button" aria-label="Wyczyść wyszukiwanie" onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"><X className="size-3" /></button>}</label>
        <button type="button" onClick={() => notify("Konfiguracja zapisana")} className="inline-flex h-6 items-center gap-1 rounded-md border border-border px-2 text-[10px] font-bold uppercase hover:border-primary/60"><Save className="size-3" /> Zapisz</button>
        <button type="button" aria-label="Ustawienia" onClick={() => notify("Ustawienia ChickenHook")} className="grid size-6 place-items-center rounded-md border border-border text-muted-foreground hover:border-primary/60 hover:text-primary"><Settings className="size-3" /></button>
      </header>
      <div className="flex min-h-[34px] shrink-0 flex-wrap items-center gap-2 border-b border-border/70 bg-background/40 px-3 py-1"><span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{active} aktywne moduły</span><div className="ml-auto flex gap-1">{["Legit", "Rage", "Kurnik"].map((name) => <button key={name} type="button" onClick={() => { setPreset(name); notify(`Preset ${name} wczytany`); }} className={cn("rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase", preset === name ? "border-primary/70 bg-primary/20 text-primary" : "border-border text-muted-foreground hover:text-foreground")}>{name}</button>)}</div></div>
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2">
        {sections.map((section) => {
          const expanded = needle ? true : Boolean(open[section.id]);
          const count = section.controls.filter((control) => control.kind === "toggle" && (enabled[control.id] ?? Boolean(control.defaultOn))).length;
          return <section key={section.id} className="mb-1.5 rounded-md border border-border/70 bg-background/30"><button type="button" onClick={() => setOpen((state) => ({ ...state, [section.id]: !expanded }))} aria-expanded={expanded} className="flex h-9 w-full items-center gap-2 px-2.5 text-left"><ChevronDown className={cn("size-3 text-muted-foreground transition-transform", !expanded && "-rotate-90")} /><section.icon className="size-3.5 text-primary" /><span className="flex-1 text-[11px] font-bold uppercase tracking-widest">{section.title}</span>{count > 0 && <span className="rounded-full bg-primary/20 px-1.5 text-[9px] font-bold text-primary">{count}</span>}</button>{expanded && <div className="grid border-t border-border/60 px-2.5 py-1 sm:grid-cols-2 sm:gap-x-6">{section.controls.map((control) => <Control key={control.id} control={control} enabled={enabled} setEnabled={setEnabled} values={values} setValues={setValues} />)}</div>}</section>;
        })}
        {!sections.length && <p className="py-10 text-center text-xs text-muted-foreground">Brak opcji dla „{query}”.</p>}
      </div>
      <div className="shrink-0 border-t border-border/70 bg-background/40 px-3 py-1.5 text-[10px] text-muted-foreground">{config.tagline} · wszystkie ustawienia są demonstracyjne</div>
      <footer className="flex h-7 shrink-0 items-center justify-between gap-2 border-t border-border/70 px-3"><span className="truncate text-[9px] uppercase tracking-widest text-muted-foreground">chickenhook.wtf · 2018–2026 · Build {config.build} · Alpha</span><span className="shrink-0 rounded-full border border-border px-2 py-px text-[9px]">Adam Kurczak · Ttl 27.08.2026 24:00</span></footer>
      {toast && <div role="status" className="absolute bottom-12 left-1/2 -translate-x-1/2 rounded-md border border-primary/60 bg-background/95 px-3 py-1.5 text-[11px] text-foreground shadow-lg">{toast}</div>}
    </div>
  );
}
