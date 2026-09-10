import { useMemo, useState } from "react";
import glitchKasynoAsset from "@/assets/glitch-kasyno.gif.asset.json";
import twoPacAsset from "@/assets/2pac.png.asset.json";

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

import ctModel from "@/assets/ct-model.png.asset.json";
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
  "custom-skin": "Wizualizacje",
  "czat-glosowy": "Inne",
  radio: "Inne",
  "2pacalypse": "Exploity",
  "pyszne-kfc": "Inne",
  "auto-strazak": "Inne",
  "auto-flash": "Inne",
  "nade-helper": "Inne",
  "auto-plant": "Inne",
  "spawner-pojazdow": "Inne",
  "zacinka-broni": "Exploity",

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

// ===== Animowany podgląd (jak okno "Preview" w grze) =====

function GsPreviewPanel({ slug }: { slug: string }) {
  return (
    <div className="mb-4 max-w-[320px] overflow-hidden rounded-sm border border-border bg-background/60">
      <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-2 py-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/80">
          Podgląd
        </span>
        <Settings2 className="size-3 text-muted-foreground" />
      </div>

      <div className="chkn-preview-grid relative h-[240px] overflow-hidden">
        {slug === "custom-skin" && (
          <>
            <div className="absolute left-2 top-2 space-y-1 text-[9px] font-bold uppercase tracking-wide">
              <span className="flex items-center gap-1.5 text-foreground/80">
                <span className="size-2 bg-menugreen" /> CT
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2 bg-foreground/30" /> T
              </span>
            </div>
            <div className="chkn-model-light absolute inset-0 bg-[radial-gradient(220px_180px_at_50%_20%,var(--color-menugreen),transparent_70%)] opacity-20" />
            <img
              src={ctModel.url}
              alt="Podgląd modelu postaci z własną skórką"
              loading="lazy"
              width={640}
              height={1024}
              className="chkn-model absolute bottom-2 left-1/2 h-[210px] w-auto -translate-x-1/2"
            />
          </>
        )}

        {slug === "czat-glosowy" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] gs-glow text-menugreen">
              Mikrofon aktywny
            </span>
            <div className="flex h-16 items-center gap-1">
              {Array.from({ length: 28 }).map((_, i) => (
                <span
                  key={i}
                  className="chkn-wave w-1 rounded-full bg-menugreen"
                  style={{
                    height: `${14 + ((i * 13) % 44)}px`,
                    animationDelay: `${(i % 7) * 90}ms`,
                  }}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">Barwa: kurczak · opóźnienie 12 ms</span>
          </div>
        )}

        {slug === "radio" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/80">
              xn88ax — kurnik tape
            </span>
            <div className="flex h-16 items-end gap-1.5">
              {Array.from({ length: 22 }).map((_, i) => (
                <span
                  key={i}
                  className="chkn-eq-bar w-1.5 rounded-sm bg-menugreen"
                  style={{
                    height: `${18 + ((i * 17) % 42)}px`,
                    animationDelay: `${(i % 9) * 80}ms`,
                  }}
                />
              ))}
            </div>
            <div className="h-0.5 w-40 overflow-hidden rounded bg-border">
              <span className="chkn-model-light block h-full w-1/3 bg-menugreen" />
            </div>
          </div>
        )}

        {slug === "2pacalypse" && <TwoPacalypsePanel />}

        {slug === "pyszne-kfc" && <PysznePanel />}

        {slug === "glitch-kasy" && (
          <>
            <div className="absolute inset-0 z-10 bg-black/40" />
            <img
              src={glitchKasynoAsset.url}
              alt=""
              className="absolute inset-0 z-0 h-full w-full object-cover opacity-50"
            />
            <div className="absolute left-3 top-3 z-20 text-[11px] font-bold text-primary">$16000</div>
          </>
        )}
      </div>
    </div>
  );
}

function TwoPacalypsePanel() {
  const [ip, setIp] = useState("64.231.75.201");
  const [port, setPort] = useState("80");
  const [firing, setFiring] = useState(false);
  const [bots, setBots] = useState(22);

  return (
    <div className="chkn-2pac absolute inset-0 flex flex-col bg-black font-mono text-[#39ff14]">
      <div className="flex items-center justify-between border-b border-[#39ff14]/40 bg-black px-2 py-1 text-[9px] uppercase tracking-widest">
        <span className="truncate text-[#39ff14]/80">C:\Windows\System32\2PACALYPSE 2.3.exe</span>
        <span className="text-[#39ff14]/60">- □ ✕</span>
      </div>
      <div className="relative flex-1 px-3 pt-2">
        <div className="text-center text-[13px] font-bold tracking-wider">
          2PACALYPSE 2.3
          <span className="ml-2 text-[9px] font-normal text-[#39ff14]/70">-Coded by Moneymack</span>
        </div>
        <div className="absolute right-2 top-8 max-w-[110px] text-right text-[8px] leading-tight text-[#39ff14]/80">
          r.i.p 2pac<br />u were the meanin<br />of lyfe -moneymack
        </div>
        <div className="mt-4 flex items-center gap-2 text-[10px]">
          <label className="font-bold">IP:</label>
          <input
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            className="h-5 w-[110px] rounded-none border border-[#39ff14]/60 bg-black px-1 text-[10px] text-[#39ff14] outline-none focus:border-[#39ff14]"
          />
          <label className="ml-2 font-bold">Port:</label>
          <input
            value={port}
            onChange={(e) => setPort(e.target.value)}
            className="h-5 w-[44px] rounded-none border border-[#39ff14]/60 bg-black px-1 text-[10px] text-[#39ff14] outline-none focus:border-[#39ff14]"
          />
        </div>
        <div className="mt-3 flex justify-start pl-6">
          <button
            type="button"
            onClick={() => {
              setFiring(true);
              setBots((b) => b + Math.floor(Math.random() * 7) + 1);
              window.setTimeout(() => setFiring(false), 900);
            }}
            className={cn(
              "rounded-[14px] border-2 border-[#39ff14] px-6 py-1 text-[16px] font-black tracking-widest transition-all",
              firing ? "chkn-2pac-fire bg-[#39ff14] text-black" : "text-[#39ff14] hover:bg-[#39ff14]/10",
            )}
          >
            DDoS Niggas
          </button>
        </div>
        <img
          src={twoPacAsset.url}
          alt="2Pac"
          className="pointer-events-none absolute bottom-0 right-1 h-[62%] w-auto select-none object-contain"
        />
      </div>

    </div>
  );
}

const KFC_CATEGORIES: { cat: string; items: { name: string; price: number; from?: boolean }[] }[] = [
  {
    cat: "Wyróżnione",
    items: [
      { name: "Kubełek 15 Strips", price: 65.72, from: true },
      { name: "Kubełek 15 Hot Wings", price: 49.72, from: true },
      { name: "Qurrito Grande", price: 29.99 },
      { name: "Grander Burger", price: 29.99 },
      { name: "Twister", price: 23.99 },
    ],
  },
  {
    cat: "Doritos Loaded",
    items: [
      { name: "Loaded Doritos & Bubble Tea by Yoshi", price: 35.74, from: true },
      { name: "Loaded Doritos & Bubble Tea by Czarek", price: 35.74, from: true },
      { name: "Loaded Doritos Tex-Mex & Bubble Tea", price: 37.74, from: true },
      { name: "Loaded Doritos Extra Spicy & Bubble Tea", price: 37.74, from: true },
      { name: "Loaded Doritos by Yoshi", price: 27.99 },
      { name: "Loaded Doritos by Czarek", price: 27.99 },
      { name: "Loaded Doritos Tex-Mex", price: 29.99 },
      { name: "Loaded Doritos Extra Spicy", price: 29.99 },
      { name: "Loaded Doritos Extra Spicy & Napój", price: 34.99 },
      { name: "Loaded Doritos Tex-Mex & Napój", price: 34.99 },
    ],
  },
  {
    cat: "KUBEŁKI",
    items: [
      { name: "Kubełek 15 Hot Wings", price: 49.72, from: true },
      { name: "Kubełek 30 Hot Wings", price: 85.72, from: true },
      { name: "Kubełek 50 Hot Wings", price: 105.72, from: true },
      { name: "Kubełek 11 Hot Wings / 11 Strips", price: 69.72, from: true },
      { name: "Kubełek Strips&Bites dla 2 osób", price: 51.72, from: true },
      { name: "Kubełek Strips&Bites dla 4 osób", price: 79.72, from: true },
      { name: "Kubełek 15 Strips", price: 65.72, from: true },
      { name: "Kubełek 30 Strips", price: 95.72, from: true },
    ],
  },
  {
    cat: "Popcorn Chicken",
    items: [
      { name: "Popcorn Chicken Mały", price: 15.99 },
      { name: "Popcorn Chicken Duży", price: 24.99 },
      { name: "Popcorn Chicken & Napój", price: 29.99 },
      { name: "Popcorn Chicken Box", price: 34.99, from: true },
    ],
  },
  {
    cat: "WRAPY",
    items: [
      { name: "Twister", price: 23.99 },
      { name: "Twister Spicy", price: 23.99 },
      { name: "Qurrito Grande", price: 29.99 },
      { name: "Qurrito Grande Spicy", price: 29.99 },
      { name: "Wrap Original", price: 19.99 },
      { name: "Wrap Hot", price: 19.99 },
    ],
  },
  {
    cat: "BURGERY",
    items: [
      { name: "Grander Burger", price: 29.99 },
      { name: "Grander Burger Spicy", price: 29.99 },
      { name: "Zinger Burger", price: 25.99 },
      { name: "Zinger Burger Cheese", price: 27.99 },
      { name: "Kanapka Kentucky BBQ", price: 26.99 },
      { name: "Burger Klasyczny", price: 17.99 },
      { name: "Cheeseburger", price: 14.99 },
    ],
  },
  {
    cat: "BIG BOXY",
    items: [
      { name: "Big Box Grander", price: 44.99, from: true },
      { name: "Big Box Zinger", price: 41.99, from: true },
      { name: "Big Box Strips", price: 42.99, from: true },
      { name: "Big Box Hot Wings", price: 41.99, from: true },
    ],
  },
  {
    cat: "ZESTAWY",
    items: [
      { name: "Zestaw Twister", price: 33.99, from: true },
      { name: "Zestaw Zinger Burger", price: 35.99, from: true },
      { name: "Zestaw Grander Burger", price: 39.99, from: true },
      { name: "Zestaw 5 Strips", price: 37.99, from: true },
      { name: "Zestaw 9 Hot Wings", price: 36.99, from: true },
    ],
  },
  {
    cat: "POKÉ BOWL",
    items: [
      { name: "Poké Bowl Strips", price: 32.99 },
      { name: "Poké Bowl Popcorn Chicken", price: 31.99 },
      { name: "Poké Bowl Vege", price: 28.99 },
    ],
  },
  {
    cat: "SHAKES DELUXE & BUBBLE TEA",
    items: [
      { name: "Shake Deluxe Oreo", price: 18.99 },
      { name: "Shake Deluxe Truskawkowy", price: 17.99 },
      { name: "Shake Deluxe Czekoladowy", price: 17.99 },
      { name: "Bubble Tea Mango 300 ml", price: 13.99 },
      { name: "Bubble Tea Truskawka 300 ml", price: 13.99 },
    ],
  },
  {
    cat: "DODATKI",
    items: [
      { name: "Frytki Małe", price: 9.99 },
      { name: "Frytki Duże", price: 13.99 },
      { name: "Frytki z serem", price: 16.99 },
      { name: "Surówka Coleslaw Mała", price: 9.99 },
      { name: "Surówka Coleslaw Duża", price: 14.99 },
      { name: "Kukurydza", price: 9.49 },
      { name: "Sos (do wyboru)", price: 3.49 },
    ],
  },
  {
    cat: "KAWAŁKI KURCZAKA",
    items: [
      { name: "Hot Wings 5 szt.", price: 18.99 },
      { name: "Hot Wings 9 szt.", price: 27.99 },
      { name: "Strips 3 szt.", price: 19.99 },
      { name: "Strips 5 szt.", price: 29.99 },
      { name: "Kawałki kurczaka 2 szt.", price: 21.99 },
      { name: "Kawałki kurczaka 4 szt.", price: 38.99 },
    ],
  },
  {
    cat: "NAPOJE",
    items: [
      { name: "Pepsi 0,4 l", price: 9.49 },
      { name: "Pepsi Max 0,4 l", price: 9.49 },
      { name: "Mirinda 0,4 l", price: 9.49 },
      { name: "7up 0,4 l", price: 9.49 },
      { name: "Lipton Ice Tea 0,4 l", price: 9.99 },
      { name: "Woda niegazowana 0,5 l", price: 7.49 },
      { name: "Kawa Americano", price: 10.99 },
    ],
  },
  {
    cat: "LODY I DESERY",
    items: [
      { name: "Sundae z sosem", price: 11.99 },
      { name: "Lody w wafelku", price: 7.99 },
      { name: "Ciastko czekoladowe", price: 8.99 },
      { name: "Muffin", price: 9.99 },
    ],
  },
];

const KFC_MENU = KFC_CATEGORIES.flatMap((c) => c.items);

const FREE_DELIVERY = 39;

function PysznePanel() {
  const [cart, setCart] = useState<Record<string, number>>({ Twister: 1 });
  const [sent, setSent] = useState(false);
  const [cat, setCat] = useState(KFC_CATEGORIES[0]!.cat);
  const [query, setQuery] = useState("");

  const total = KFC_MENU.reduce((sum, it) => sum + (cart[it.name] ?? 0) * it.price, 0);
  const items = Object.values(cart).reduce((a, b) => a + b, 0);
  const progress = Math.min(100, (total / FREE_DELIVERY) * 100);
  const active = KFC_CATEGORIES.find((c) => c.cat === cat) ?? KFC_CATEGORIES[0]!;
  const q = query.trim().toLowerCase();
  const shown = q
    ? KFC_MENU.filter((it) => it.name.toLowerCase().includes(q))
    : active.items;

  const add = (name: string, delta: number) =>
    setCart((p) => {
      const next = Math.max(0, (p[name] ?? 0) + delta);
      const copy = { ...p };
      if (next === 0) delete copy[name];
      else copy[name] = next;
      return copy;
    });

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-[#f7f4f0] font-sans text-[#313131]">
      {/* pasek jak na pyszne.pl */}
      <div className="flex items-center justify-between border-b border-black/10 bg-white px-2 py-1">
        <span className="flex items-center gap-1">
          <span className="grid h-4 w-4 place-items-center rounded-[3px] bg-[#ff8000] text-[8px] font-black text-white">
            P
          </span>
          <span className="text-[11px] font-extrabold tracking-tight text-[#ff8000]">
            Pyszne<span className="text-[#313131]">.pl</span>
          </span>
        </span>
        <span className="text-[9px] text-black/50">Dostawa · 25–35 min</span>
      </div>

      {/* nagłówek restauracji */}
      <div className="relative border-b border-black/10 bg-[#e4002b] px-2 pb-1.5 pt-1.5">
        <div className="flex items-center gap-1.5">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-[3px] bg-white text-[7px] font-black leading-none text-[#e4002b]">
            KFC
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[11px] font-extrabold text-white">KFC, Korona</span>
            <span className="block text-[8px] text-white/80">
              ★ 4 (180+) · Dostarczone przez Pyszne.pl
            </span>
          </span>
        </div>
        <div className="mt-1.5 flex items-center gap-1 rounded-full bg-white px-2 py-[3px]">
          <span className="text-[9px] text-black/40">⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="KFC, Korona"
            className="min-w-0 flex-1 bg-transparent text-[9px] text-[#313131] outline-none placeholder:text-black/35"
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* lista kategorii */}
        <div className="w-[92px] shrink-0 overflow-y-auto border-r border-black/10 bg-[#f7f4f0] py-1">
          {KFC_CATEGORIES.map((c) => (
            <button
              key={c.cat}
              type="button"
              onClick={() => {
                setCat(c.cat);
                setQuery("");
              }}
              className={`flex w-full items-center gap-1 border-l-2 px-1.5 py-[5px] text-left text-[9px] leading-tight transition-colors ${
                c.cat === cat && !q
                  ? "border-[#ff8000] font-bold text-[#313131]"
                  : "border-transparent text-black/60 hover:text-[#313131]"
              }`}
            >
              <span className="truncate">{c.cat}</span>
            </button>
          ))}
        </div>

        {/* pozycje menu jako karty */}
        <div className="min-w-0 flex-1 overflow-y-auto px-2 py-1.5">
          <h4 className="mb-1 text-[11px] font-extrabold text-[#313131]">
            {q ? `Wyniki: „${query}”` : active.cat}
          </h4>
          <div className="space-y-1.5">
            {shown.map((it) => {
              const qty = cart[it.name] ?? 0;
              return (
                <div
                  key={`${active.cat}-${it.name}`}
                  className="flex items-stretch gap-2 rounded-md border border-black/10 bg-white p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[7px] font-bold uppercase tracking-wide text-black/40">
                      {q ? "KFC" : active.cat}
                    </span>
                    <span className="block truncate text-[10px] font-bold text-[#313131]">
                      {it.name}
                    </span>
                    <span className="mt-[2px] block text-[9px] text-black/60">
                      {it.from ? "od " : ""}
                      <span className="font-bold text-[#313131]">
                        {it.price.toFixed(2).replace(".", ",")} zł
                      </span>
                    </span>
                  </span>
                  <span className="h-11 w-11 shrink-0 rounded-md bg-[#f0ece7]" aria-hidden />
                  <span className="flex flex-col items-center justify-center gap-[2px]">
                    {qty > 0 && (
                      <button
                        type="button"
                        aria-label={`Usuń ${it.name}`}
                        onClick={() => add(it.name, -1)}
                        className="grid h-4 w-4 place-items-center rounded-full border border-[#ff8000] text-[10px] font-bold leading-none text-[#ff8000]"
                      >
                        −
                      </button>
                    )}
                    {qty > 0 && (
                      <span className="text-[9px] font-bold tabular-nums">{qty}</span>
                    )}
                    <button
                      type="button"
                      aria-label={`Dodaj ${it.name}`}
                      onClick={() => add(it.name, 1)}
                      className="grid h-4 w-4 place-items-center rounded-full border border-[#ff8000] text-[10px] font-bold leading-none text-[#ff8000] hover:bg-[#ff8000] hover:text-white"
                    >
                      +
                    </button>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* koszyk */}
      <div className="border-t border-black/10 bg-white px-2 py-1.5">
        <div className="h-1 overflow-hidden rounded-full bg-black/10">
          <span
            className="block h-full bg-[#ff8000] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between text-[9px] text-black/60">
          <span>
            {total >= FREE_DELIVERY
              ? "Dostawa darmowa"
              : `Jeszcze ${(FREE_DELIVERY - total).toFixed(2).replace(".", ",")} zł do darmowej dostawy`}
          </span>
          <span className="font-bold tabular-nums text-[#313131]">
            {total.toFixed(2).replace(".", ",")} zł
          </span>
        </div>
        <button
          type="button"
          disabled={items === 0}
          onClick={() => {
            setSent(true);
            window.setTimeout(() => setSent(false), 2200);
          }}
          className="mt-1.5 w-full rounded-full bg-[#ff8000] py-1 text-[10px] font-extrabold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {sent ? "Zamówione — kurier w drodze" : `Przejdź do koszyka (${items})`}
        </button>
      </div>
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
  const [nums, setNums] = useState<Record<string, number>>({});
  const [switches, setSwitches] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [closed, setClosed] = useState<Record<string, boolean>>({});

  const bySection = useMemo(() => {
    const map = new Map<string, Feature[]>();
    const q = query.trim().toLowerCase();
    for (const s of SECTIONS) map.set(s.name, []);
    for (const f of features) {
      if (q && !f.title.toLowerCase().includes(q)) continue;
      map.get(GROUPS[f.slug] ?? "Inne")?.push(f);
    }
    for (const s of SECTIONS) {
      map.get(s.name)?.sort((a, b) => a.title.localeCompare(b.title, "pl"));
    }
    return map;
  }, [query]);

  const cfg = menuOptions[selected.slug] ?? fallbackMenuConfig;
  const activeCount = Object.values(enabled).filter(Boolean).length;
  const isOn = !!enabled[selected.slug];

  const renderControl = (c: MenuControl, col: "l" | "r", i: number) => {
    const key = `${selected.slug}-${col}${i}`;
    const master = col === "l" && i === 0 && c.kind === "toggle";

    switch (c.kind) {
      case "toggle": {
        const on = master ? isOn : (switches[key] ?? !!c.on);
        return (
          <div key={key} className="flex items-center justify-between gap-3">
            <span className="text-xs text-foreground/80">{c.label}</span>
            <button
              type="button"
              aria-label={`Przełącz: ${c.label}`}
              aria-pressed={on}
              onClick={() =>
                master
                  ? setEnabled((p) => ({ ...p, [selected.slug]: !isOn }))
                  : setSwitches((p) => ({ ...p, [key]: !on }))
              }
            >
              <GsSwitch on={on} />
            </button>
          </div>
        );
      }
      case "select":
        return (
          <GsSelect
            key={key}
            label={c.label}
            options={c.options}
            value={nums[key] ?? c.value ?? 0}
            onChange={(v) => setNums((p) => ({ ...p, [key]: v }))}
          />
        );
      case "slider":
        return (
          <GsSlider
            key={key}
            label={c.label}
            unit={c.unit}
            value={nums[key] ?? c.value}
            onChange={(v) => setNums((p) => ({ ...p, [key]: v }))}
          />
        );
      case "stepper":
        return (
          <div key={key} className="flex items-center justify-between gap-3">
            <span className="text-xs text-foreground/80">{c.label}</span>
            <GsStepper
              value={nums[key] ?? c.value}
              onChange={(v) => setNums((p) => ({ ...p, [key]: v }))}
            />
          </div>
        );
      case "key":
        return <GsKey key={key} label={c.label} value={c.value} />;
      case "text":
        return (
          <div key={key}>
            <div className="text-xs text-foreground/80">{c.label}</div>
            <input
              type="text"
              defaultValue={c.value}
              placeholder={c.placeholder}
              aria-label={c.label}
              className="mt-1 h-7 w-full rounded-sm border border-border bg-background/70 px-2 font-mono text-xs text-menugreen outline-none transition-colors focus:border-menugreen/60"
            />
          </div>
        );
    }
  };



  return (
    <div className="overflow-hidden rounded-md border border-border bg-card/95 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.8)]">
      {/* Pasek tytułu — ClickGUI */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-secondary/40 px-3 py-2">
        <span className="text-sm font-extrabold tracking-wide">
          CHICKEN<span className="gs-glow text-menugreen">HOOK</span>
          <span className="ml-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            ClickGUI
          </span>
        </span>
        <div className="flex items-center gap-1.5">
          <label className="flex h-7 items-center gap-1.5 rounded-sm border border-border bg-background/60 px-2">
            <Search className="size-3 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Szukaj funkcji…"
              aria-label="Szukaj funkcji"
              className="w-[130px] bg-transparent text-[11px] outline-none placeholder:text-muted-foreground"
            />
          </label>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-background/60 px-2.5 py-1 text-[11px] font-semibold text-foreground/90 transition-colors hover:border-menugreen/50"
          >
            <Save className="size-3 text-muted-foreground" />
            Zapisz
          </button>
          {[Puzzle, Settings2].map((Icon, i) => (
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

      <div className="grid lg:grid-cols-[440px_1fr]">
        {/* Kolumna okienek kategorii — jak ClickGUI Wursta */}
        <div className="border-b border-border bg-background/30 p-2.5 lg:border-b-0 lg:border-r">
          <div className="columns-1 gap-2.5 sm:columns-2 [&>*]:mb-2.5">
            {SECTIONS.map((s) => {
              const items = bySection.get(s.name) ?? [];
              if (!items.length) return null;
              const isClosed = !!closed[s.name];
              const onCount = items.filter((f) => enabled[f.slug]).length;
              return (
                <div
                  key={s.name}
                  className="break-inside-avoid overflow-hidden rounded-sm border border-menugreen/25 bg-card/70 shadow-[0_10px_24px_-16px_rgba(0,0,0,0.9)]"
                >
                  <button
                    type="button"
                    onClick={() => setClosed((p) => ({ ...p, [s.name]: !isClosed }))}
                    aria-expanded={!isClosed}
                    className="flex w-full items-center gap-1.5 border-b border-menugreen/25 bg-menugreen/15 px-2 py-1.5 text-left"
                  >
                    <s.icon className="size-3 gs-glow text-menugreen" />
                    <span className="flex-1 text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/90">
                      {s.name}
                    </span>
                    <span className="text-[10px] tabular-nums text-muted-foreground">
                      {onCount}/{items.length}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-3 text-muted-foreground transition-transform",
                        isClosed && "-rotate-90",
                      )}
                    />
                  </button>
                  {!isClosed && (
                    <div className="p-1">
                      {items.map((f) => {
                        const on = !!enabled[f.slug];
                        const active = selected.slug === f.slug;
                        return (
                          <div
                            key={f.slug}
                            className={cn(
                              "flex items-center gap-1.5 rounded-sm px-1.5 py-1 transition-colors",
                              active ? "bg-menugreen/15" : "hover:bg-secondary/70",
                            )}
                          >
                            <button
                              type="button"
                              aria-label={`Włącz: ${f.title}`}
                              aria-pressed={on}
                              onClick={() =>
                                setEnabled((p) => ({ ...p, [f.slug]: !p[f.slug] }))
                              }
                              className={cn(
                                "grid size-3.5 shrink-0 place-items-center rounded-[2px] border transition-colors",
                                on
                                  ? "border-menugreen bg-menugreen/80 text-background shadow-[0_0_8px_1px_var(--color-menugreen)]"
                                  : "border-border bg-background/70",
                              )}
                            >
                              {on && <Check className="size-2.5" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelected(f);
                                setOpenSettings(true);
                              }}
                              title="Otwórz ustawienia"
                              className={cn(
                                "flex-1 truncate text-left text-[11px] transition-colors",
                                on ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                              )}
                            >
                              {f.title}
                            </button>
                            <button
                              type="button"
                              aria-label={`Ustawienia: ${f.title}`}
                              onClick={() => {
                                setSelected(f);
                                setOpenSettings(true);
                              }}
                              className="grid size-4 shrink-0 place-items-center rounded-[2px] text-muted-foreground transition-colors hover:text-menugreen"
                            >
                              <Settings2 className="size-3" />
                            </button>

                            {f.restricted && <Lock className="gs-gold size-3 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            {[...bySection.values()].every((v) => !v.length) && (
              <p className="px-1 py-4 text-[11px] text-muted-foreground">
                Brak funkcji dla „{query}”.
              </p>
            )}
          </div>

          {/* Profil użytkownika */}
          <div className="mt-1 flex items-center gap-2 rounded-sm border border-border bg-card/60 p-2">
            <span className="grid size-7 place-items-center rounded-sm bg-menugreen/15">
              <User className="size-4 gs-glow text-menugreen" />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-xs font-semibold">Adam Kurczak</span>
              <span className="block text-[10px] text-muted-foreground">Til: 27.08.2026 24:00</span>
            </span>
          </div>
        </div>

        {/* Okno ustawień wybranego modułu */}
        <div
          className={cn(
            "p-2.5",
            "max-lg:fixed max-lg:inset-x-2 max-lg:bottom-2 max-lg:top-14 max-lg:z-50 max-lg:overflow-y-auto max-lg:rounded-md max-lg:border max-lg:border-menugreen/30 max-lg:bg-background/95 max-lg:shadow-2xl max-lg:backdrop-blur",
            !openSettings && "max-lg:hidden",
          )}
        >
          <div className="overflow-hidden rounded-sm border border-menugreen/25 bg-card/70">
            <div className="flex items-center justify-between gap-2 border-b border-menugreen/25 bg-menugreen/15 px-2 py-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/90">
                {selected.title} — ustawienia
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">
                  {activeCount} aktywnych · INS = menu
                </span>
                <button
                  type="button"
                  aria-label="Zamknij ustawienia"
                  onClick={() => setOpenSettings(false)}
                  className="grid size-5 place-items-center rounded-sm text-muted-foreground transition-colors hover:text-menugreen lg:hidden"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            </div>


            <div className="p-4">
              {["custom-skin", "czat-glosowy", "radio", "2pacalypse", "pyszne-kfc"].includes(
                selected.slug,
              ) && <GsPreviewPanel slug={selected.slug} />}

              <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                <div className="space-y-3.5">{cfg.left.map((c, i) => renderControl(c, "l", i))}</div>
                <div className="space-y-3.5">{cfg.right.map((c, i) => renderControl(c, "r", i))}</div>
              </div>

              <p className="mt-4 flex items-start gap-1.5 border-t border-border pt-3 text-[11px] leading-relaxed text-muted-foreground">
                <Gauge className="mt-0.5 size-3 shrink-0" />
                <span>{cfg.note}</span>
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
                chickenhook.wtf © 2016–2026 · Build 4.chkn · Alpha
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
