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

/* ------------------------- parametry poszczególnych ------------------------ */

const PARAMS: Record<string, { title: string; rows: Row[] }> = {
  aim: {
    title: "Robot celu",
    rows: [
      { kind: "slider", id: "aim.delay", label: "Opóźnienie reakcji", min: 0, max: 500, def: 120, unit: " ms" },
      { kind: "slider", id: "aim.hitchance", label: "Szansa trafienia", min: 0, max: 100, def: 65, unit: "%" },
      { kind: "select", id: "aim.target", label: "Wybór celu", options: ["Najbliższy", "Najniższe HP", "Krzyżyk", "Losowy kurczak"] },
      { kind: "toggle", id: "aim.autowall", label: "Przebicie ścian", def: true },
      { kind: "toggle", id: "aim.norecoil", label: "Brak odrzutu" },
    ],
  },
  esp: {
    title: "Wizualizacje",
    rows: [
      { kind: "slider", id: "esp.range", label: "Zasięg", min: 0, max: 2000, def: 900, unit: " u" },
      { kind: "toggle", id: "esp.box", label: "Ramka", def: true },
      { kind: "toggle", id: "esp.hp", label: "Pasek HP", def: true },
      { kind: "toggle", id: "esp.nick", label: "Nick" },
      { kind: "toggle", id: "esp.weapon", label: "Broń" },
      { kind: "select", id: "esp.color", label: "Kolor", options: ["Czerwony", "Zielony", "Kurczakowy żółty"] },
    ],
  },
  skins: {
    title: "Zmieniacz skórek",
    rows: [
      { kind: "select", id: "skins.knife", label: "Nóż", options: ["Karambit", "Butterfly", "Tasak do kurczaka"] },
      { kind: "slider", id: "skins.wear", label: "Zużycie", min: 0, max: 100, def: 3, unit: "%" },
      { kind: "toggle", id: "skins.stattrak", label: "StatTrak", def: true },
      { kind: "slider", id: "skins.kills", label: "Liczba zabójstw", min: 0, max: 9999, def: 1337 },
    ],
  },
  customskin: {
    title: "Custom skin",
    rows: [
      { kind: "select", id: "customskin.model", label: "Model", options: ["Kurczak CT", "Kurczak T", "Panierka"] },
      { kind: "slider", id: "customskin.scale", label: "Skala", min: 50, max: 150, def: 100, unit: "%" },
      { kind: "toggle", id: "customskin.glow", label: "Poświata" },
    ],
  },
  noclip: {
    title: "Noclip",
    rows: [
      { kind: "slider", id: "noclip.speed", label: "Prędkość", min: 1, max: 20, def: 6, unit: "x" },
      { kind: "toggle", id: "noclip.vertical", label: "Lot pionowy", def: true },
      { kind: "toggle", id: "noclip.collide", label: "Kolizja ze ścianami" },
      { kind: "key", id: "noclip.key", label: "Klawisz", value: "MOUSE4" },
    ],
  },
  bhop: {
    title: "Króliczy skok",
    rows: [
      { kind: "slider", id: "bhop.chance", label: "Szansa skoku", min: 0, max: 100, def: 88, unit: "%" },
      { kind: "toggle", id: "bhop.autostrafe", label: "Auto strafe", def: true },
      { kind: "select", id: "bhop.mode", label: "Tryb", options: ["Legit", "Rage", "Kangur"] },
    ],
  },
  move: {
    title: "Ruch",
    rows: [
      { kind: "toggle", id: "move.slowwalk", label: "Cichy chód" },
      { kind: "toggle", id: "move.edgebug", label: "Edge bug" },
      { kind: "slider", id: "move.smooth", label: "Wygładzanie ruchu", min: 0, max: 100, def: 40 },
    ],
  },
  speed: {
    title: "Przyspieszenie",
    rows: [
      { kind: "slider", id: "speed.mult", label: "Mnożnik", min: 100, max: 400, def: 140, unit: "%" },
      { kind: "toggle", id: "speed.smooth", label: "Ukrywaj przed anticheatem" },
    ],
  },
  god: {
    title: "Tryb boga",
    rows: [
      { kind: "slider", id: "god.hp", label: "HP", min: 100, max: 999, def: 999 },
      { kind: "toggle", id: "god.nofall", label: "Brak obrażeń z upadku", def: true },
      { kind: "toggle", id: "god.nofire", label: "Odporność na ogień" },
    ],
  },
  tp: {
    title: "Teleport",
    rows: [
      { kind: "slider", id: "tp.dist", label: "Dystans", min: 10, max: 500, def: 120, unit: " u" },
      { kind: "select", id: "tp.mode", label: "Cel", options: ["Krzyżyk", "Bombsite A", "Bombsite B", "KFC"] },
      { kind: "key", id: "tp.key", label: "Klawisz", value: "T" },
    ],
  },
  crash: {
    title: "Awaria serwera",
    rows: [
      { kind: "slider", id: "crash.rate", label: "Intensywność", min: 1, max: 10, def: 3 },
      { kind: "toggle", id: "crash.mock", label: "Tryb czysto żartobliwy", def: true },
    ],
  },
  money: {
    title: "Glitch kasy",
    rows: [
      { kind: "slider", id: "money.amount", label: "Kwota", min: 0, max: 16000, def: 16000, unit: " $" },
      { kind: "toggle", id: "money.auto", label: "Co rundę", def: true },
    ],
  },
  "2pac": {
    title: "2PACALYPSE 2.3",
    rows: [
      { kind: "slider", id: "2pac.power", label: "Moc", min: 1, max: 10, def: 7 },
      { kind: "select", id: "2pac.track", label: "Podkład", options: ["Hit 'Em Up", "Changes", "Kurczak Anthem"] },
      { kind: "toggle", id: "2pac.retro", label: "Retro zielony motyw", def: true },
    ],
  },
  jam: {
    title: "Zacinka broni wroga",
    rows: [
      { kind: "slider", id: "jam.chance", label: "Szansa zacięcia", min: 0, max: 100, def: 35, unit: "%" },
      { kind: "slider", id: "jam.time", label: "Czas zacięcia", min: 100, max: 3000, def: 800, unit: " ms" },
      { kind: "toggle", id: "jam.sound", label: "Dźwięk klik-klik", def: true },
    ],
  },
  cars: {
    title: "Spawner pojazdów",
    rows: [
      { kind: "select", id: "cars.model", label: "Model", options: ["Maluch", "Ferrari peek", "Traktor", "Rower kurczaka"] },
      { kind: "slider", id: "cars.limit", label: "Limit pojazdów", min: 1, max: 20, def: 4 },
      { kind: "toggle", id: "cars.collide", label: "Kolizja" },
      { kind: "key", id: "cars.key", label: "Klawisz", value: "V" },
    ],
  },
  kfc: {
    title: "Pyszne.pl – KFC",
    rows: [
      { kind: "select", id: "kfc.meal", label: "Zestaw", options: ["Kubełek 9", "Zinger Box", "Hot Wings 20"] },
      { kind: "slider", id: "kfc.sauce", label: "Sosy", min: 0, max: 10, def: 3 },
      { kind: "toggle", id: "kfc.auto", label: "Zamów po przegranej rundzie" },
    ],
  },
  voice: {
    title: "Czat głosowy",
    rows: [
      { kind: "slider", id: "voice.gain", label: "Głośność mikrofonu", min: 0, max: 200, def: 100, unit: "%" },
      { kind: "select", id: "voice.filter", label: "Filtr głosu", options: ["Brak", "Robot", "Kurczak", "Bass boost"] },
      { kind: "toggle", id: "voice.spam", label: "Spam soundboardem" },
    ],
  },
  radio: {
    title: "Radio",
    rows: [
      { kind: "slider", id: "radio.vol", label: "Głośność", min: 0, max: 100, def: 45, unit: "%" },
      { kind: "select", id: "radio.station", label: "Stacja", options: ["xn88ax", "Disco Polo", "HvH Phonk"] },
      { kind: "toggle", id: "radio.shuffle", label: "Losowo", def: true },
    ],
  },
  strazak: {
    title: "Auto strażak",
    rows: [
      { kind: "slider", id: "strazak.reaction", label: "Reakcja", min: 0, max: 1000, def: 250, unit: " ms" },
      { kind: "toggle", id: "strazak.smoke", label: "Używaj smoke", def: true },
      { kind: "toggle", id: "strazak.teammate", label: "Gaś też kolegów" },
    ],
  },
  flash: {
    title: "Auto flash",
    rows: [
      { kind: "slider", id: "flash.throw", label: "Siła rzutu", min: 0, max: 100, def: 70, unit: "%" },
      { kind: "toggle", id: "flash.popflash", label: "Popflash", def: true },
      { kind: "toggle", id: "flash.warnteam", label: "Ostrzegaj drużynę" },
    ],
  },
  nade: {
    title: "Nade helper",
    rows: [
      { kind: "select", id: "nade.map", label: "Mapa", options: ["Mirage", "Inferno", "Dust2", "Kurnik"] },
      { kind: "toggle", id: "nade.lines", label: "Pokaż linie lotu", def: true },
      { kind: "toggle", id: "nade.jumpthrow", label: "Jump throw" },
    ],
  },
  plant: {
    title: "Auto plant",
    rows: [
      { kind: "select", id: "plant.spot", label: "Miejsce", options: ["Domyślne", "Default A", "Pit", "Za kurczakiem"] },
      { kind: "slider", id: "plant.delay", label: "Opóźnienie", min: 0, max: 2000, def: 300, unit: " ms" },
      { kind: "toggle", id: "plant.safe", label: "Tylko gdy bezpiecznie", def: true },
    ],
  },
  resolver: {
    title: "Kurczak resolver",
    rows: [
      { kind: "select", id: "resolver.mode", label: "Tryb", options: ["Auto", "Brute force", "Kurczak logic"] },
      { kind: "slider", id: "resolver.acc", label: "Dokładność", min: 0, max: 100, def: 72, unit: "%" },
      { kind: "toggle", id: "resolver.desync", label: "Koryguj desync", def: true },
    ],
  },
  babcia: {
    title: "Auto headshot na babci z sklepu",
    rows: [
      { kind: "slider", id: "babcia.respect", label: "Szacunek", min: 0, max: 100, def: 100, unit: "%" },
      { kind: "toggle", id: "babcia.greet", label: "Powiedz dzień dobry", def: true },
      { kind: "select", id: "babcia.item", label: "Zakupy", options: ["Bułki", "Kurczak", "Mleko"] },
    ],
  },
  antiaim: {
    title: "Anti-aim",
    rows: [
      { kind: "select", id: "antiaim.yaw", label: "Yaw", options: ["Backward", "Jitter", "Spin", "Kurczak dance"] },
      { kind: "slider", id: "antiaim.jitter", label: "Jitter", min: 0, max: 180, def: 45, unit: "°" },
      { kind: "toggle", id: "antiaim.desync", label: "Desync", def: true },
    ],
  },
  fakelag: {
    title: "Fake lag",
    rows: [
      { kind: "slider", id: "fakelag.ticks", label: "Choke ticks", min: 1, max: 16, def: 8 },
      { kind: "select", id: "fakelag.mode", label: "Tryb", options: ["Stały", "Adaptacyjny", "Losowy"] },
      { kind: "toggle", id: "fakelag.air", label: "Tylko w powietrzu" },
    ],
  },
  fakeduck: {
    title: "Fake duck",
    rows: [
      { kind: "slider", id: "fakeduck.speed", label: "Prędkość kucania", min: 1, max: 10, def: 5 },
      { kind: "key", id: "fakeduck.key", label: "Klawisz", value: "MOUSE3" },
    ],
  },
  silent: {
    title: "Silent aim",
    rows: [
      { kind: "slider", id: "silent.fov", label: "FOV", min: 0, max: 90, def: 18, unit: "°" },
      { kind: "toggle", id: "silent.pitch", label: "Ukryj pitch", def: true },
    ],
  },
  autoshot: {
    title: "Auto strzał",
    rows: [
      { kind: "slider", id: "autoshot.hitchance", label: "Hitchance", min: 0, max: 100, def: 60, unit: "%" },
      { kind: "toggle", id: "autoshot.scope", label: "Auto scope", def: true },
    ],
  },
  forceacc: {
    title: "Force accuracy",
    rows: [
      { kind: "slider", id: "forceacc.spread", label: "Maks. rozrzut", min: 0, max: 100, def: 15, unit: "%" },
      { kind: "toggle", id: "forceacc.air", label: "Także w powietrzu" },
    ],
  },
  mama: {
    title: "Strzelaj tylko gdy mama patrzy",
    rows: [
      { kind: "slider", id: "mama.window", label: "Okno czasu", min: 1, max: 30, def: 5, unit: " s" },
      { kind: "toggle", id: "mama.hide", label: "Ukryj menu gdy wchodzi", def: true },
    ],
  },
};


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

const ALL_ROWS: Row[] = [
  ...SECTIONS.flatMap((s) => s.rows),
  ...Object.values(PARAMS).flatMap((p) => p.rows),
];

const MODULE_IDS: string[] = SECTIONS.flatMap((s) =>
  s.rows.flatMap((r) =>
    r.kind === "toggle" ? [r.id] : r.kind === "grid" ? r.items.map((i) => i.id) : [],
  ),
);


const DEFAULT_TOGGLES = (() => {
  const map: Record<string, boolean> = {};
  for (const r of ALL_ROWS) {
    if (r.kind === "toggle") map[r.id] = Boolean(r.def);
    if (r.kind === "grid") for (const i of r.items) map[i.id] = false;
  }
  return map;
})();

const DEFAULT_SLIDERS = (() => {
  const map: Record<string, number> = {};
  for (const r of ALL_ROWS) {
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
  narrow,
}: {
  options: string[];
  value: number;
  onChange: (v: number) => void;
  narrow?: boolean;
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
        className={cn("flex h-[22px] items-center justify-between gap-1 rounded-md border border-border bg-background/70 px-2 text-[11px] text-foreground/90 transition-colors hover:border-ovl-accent/60", narrow ? "w-[112px]" : "w-[132px]")}
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
    () => MODULE_IDS.filter((id) => toggles[id]).length,
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

  const [wins, setWins] = useState<{ id: string; x: number; y: number; z: number }[]>([]);
  const zTop = useRef(50);
  const panelRef = useRef<HTMLDivElement>(null);

  const clampWin = (x: number, y: number) => {
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return { x: Math.max(0, x), y: Math.max(0, y) };
    return {
      x: Math.max(0, Math.min(x, Math.floor(rect.width) - 270)),
      y: Math.max(0, Math.min(y, Math.floor(rect.height) - 120)),
    };
  };

  const openWindow = (id: string) => {
    if (!PARAMS[id]) return;
    zTop.current += 1;
    setWins((w) => {
      const found = w.find((x) => x.id === id);
      if (found)
        return w.map((x) => (x.id === id ? { ...x, z: zTop.current } : x));
      const n = w.length;
      const pos = clampWin(60 + n * 26, 90 + n * 24);
      return [...w, { id, x: pos.x, y: pos.y, z: zTop.current }];
    });
  };

  const closeWindow = (id: string) => setWins((w) => w.filter((x) => x.id !== id));

  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);

  const startDrag = (id: string, e: React.PointerEvent) => {
    const win = wins.find((w) => w.id === id);
    if (!win || !panelRef.current) return;
    zTop.current += 1;
    setWins((w) => w.map((x) => (x.id === id ? { ...x, z: zTop.current } : x)));
    const rect = panelRef.current.getBoundingClientRect();
    dragRef.current = {
      id,
      dx: e.clientX - rect.left - win.x,
      dy: e.clientY - rect.top - win.y,
    };
    const onMove = (ev: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const r = panelRef.current?.getBoundingClientRect();
      if (!r) return;
      setWins((w) =>
        w.map((x) => {
          if (x.id !== d.id) return x;
          const nx = Math.max(0, Math.min(Math.floor(r.width) - 270, ev.clientX - r.left - d.dx));
          const ny = Math.max(0, Math.min(Math.floor(r.height) - 120, ev.clientY - r.top - d.dy));
          return { ...x, x: nx, y: ny };
        }),
      );
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const renderControl = (r: Row, narrow = false) => (
    <>
      {r.kind === "toggle" && (
        <Pill
          on={Boolean(toggles[r.id])}
          onClick={() => setToggles((t) => ({ ...t, [r.id]: !t[r.id] }))}
        />
      )}
      {r.kind === "select" && (
        <Compact
          options={r.options}
          value={selects[r.id] ?? r.def ?? 0}
          onChange={(v) => setSelects((s2) => ({ ...s2, [r.id]: v }))}
          narrow={narrow}
        />
      )}
      {r.kind === "slider" && (
        <div className="flex shrink-0 items-center gap-2">
          <Thin
            min={r.min}
            max={r.max}
            value={sliders[r.id] ?? r.def}
            onChange={(v) => setSliders((s2) => ({ ...s2, [r.id]: v }))}
            className={narrow ? "w-[96px]" : "w-[132px]"}
          />
          <span className="w-[46px] text-right text-[10px] tabular-nums text-ovl-accent">
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
                onChange={(v) => setSliders((s2) => ({ ...s2, [`${r.id}-${axis}`]: v }))}
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
    </>
  );



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
      <div
        ref={panelRef}
        className="ovl-panel relative z-10 flex h-[720px] w-full max-w-[880px] select-none flex-col overflow-hidden rounded-[10px] border border-border/80 bg-ovl-panel/95 font-sans"
      >
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
                                onDoubleClick={() => openWindow(i.id)}
                                className="flex h-[26px] cursor-default items-center justify-between gap-2"
                              >
                                <span
                                  title={PARAMS[i.id] ? `${i.label} — 2× klik = parametry` : i.label}
                                  className="truncate text-[11px] text-foreground/85"
                                >
                                  {i.label}
                                  {PARAMS[i.id] && (
                                    <span className="ml-1 text-[9px] text-muted-foreground">⋯</span>
                                  )}
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
                          onDoubleClick={() => openWindow(r.id)}
                          className="flex h-[32px] cursor-default items-center justify-between gap-3"
                        >
                          <span
                            title={PARAMS[r.id] ? `${r.label} — 2× klik = parametry` : r.label}
                            className="flex min-w-0 items-center gap-1.5 truncate text-[11px] text-foreground/85"
                          >
                            {r.kind === "toggle" && r.warn && (
                              <TriangleAlert className="size-3 shrink-0 text-amber-500" />
                            )}
                            {r.label}
                            {PARAMS[r.id] && (
                              <span className="text-[9px] text-muted-foreground">⋯</span>
                            )}
                          </span>

                          {renderControl(r)}
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

        {wins.map((w) => {
          const p = PARAMS[w.id];
          if (!p) return null;
          return (
            <div
              key={w.id}
              style={{ left: w.x, top: w.y, zIndex: w.z }}
              className="ovl-panel absolute w-[270px] overflow-hidden rounded-[10px] border border-ovl-accent/50 bg-ovl-panel/98"
            >
              <div
                onPointerDown={(e) => startDrag(w.id, e)}
                className="flex h-[26px] cursor-move items-center gap-2 border-b border-border/70 bg-background/60 px-2 select-none"
              >
                <span className="truncate text-[10px] font-bold uppercase tracking-widest text-foreground/90">
                  {p.title}
                </span>
                <button
                  type="button"
                  aria-label="Zamknij parametry"
                  onClick={() => closeWindow(w.id)}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="ml-auto grid size-[16px] place-items-center rounded text-muted-foreground transition-colors hover:text-ovl-accent"
                >
                  <X className="size-3" />
                </button>
              </div>
              <div className="px-2 py-1">
                {p.rows.map((r) =>
                  r.kind === "grid" ? null : (
                    <div
                      key={r.id}
                      className="flex min-h-[28px] items-center justify-between gap-2"
                    >
                      <span
                        title={r.label}
                        className="min-w-0 truncate text-[11px] text-foreground/85"
                      >
                        {r.label}
                      </span>
                      {renderControl(r, true)}
                    </div>
                  ),
                )}
              </div>
            </div>
          );
        })}

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
