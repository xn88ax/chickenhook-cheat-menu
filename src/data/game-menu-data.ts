import type { LucideIcon } from "lucide-react";
import { Activity, Bot, Boxes, Crosshair, Eye, Hammer, Map, MousePointer2, PackageSearch, Shield, Sparkles, Swords, Trees, Wand2, Zap } from "lucide-react";

export type GameControl =
  | { kind: "toggle"; id: string; label: string; defaultOn?: boolean; warning?: boolean }
  | { kind: "slider"; id: string; label: string; min: number; max: number; value: number; unit?: string }
  | { kind: "select"; id: string; label: string; options: string[]; value?: number }
  | { kind: "key"; id: string; label: string; value: string };

export type GameSection = { id: string; title: string; icon: LucideIcon; controls: GameControl[] };
export type GameMenuConfig = { game: string; build: string; tagline: string; sections: GameSection[] };

export const LOL_MENU: GameMenuConfig = {
  game: "League of Legends",
  build: "4-chkn-lol",
  tagline: "Rift edition · Alpha",
  sections: [
    { id: "walka", title: "Walka", icon: Swords, controls: [
      { kind: "toggle", id: "orbwalker", label: "Orbwalker", defaultOn: true },
      { kind: "select", id: "orb-mode", label: "Tryb orbwalkera", options: ["Combo", "Harass", "Last hit", "Lane clear"] },
      { kind: "slider", id: "windup", label: "Opóźnienie ataku", min: 0, max: 200, value: 35, unit: " ms" },
      { kind: "toggle", id: "combo", label: "Automatyczne combo", defaultOn: true },
      { kind: "select", id: "combo-style", label: "Styl combo", options: ["Bezpieczny", "Agresywny", "All-in", "0/10 Yasuo"] },
      { kind: "toggle", id: "target", label: "Priorytet słabego celu", defaultOn: true },
      { kind: "key", id: "combo-key", label: "Klawisz combo", value: "SPACE" },
    ]},
    { id: "uniki", title: "Evade", icon: Shield, controls: [
      { kind: "toggle", id: "evade", label: "Auto-dodge", defaultOn: true },
      { kind: "slider", id: "danger", label: "Próg zagrożenia", min: 1, max: 5, value: 3 },
      { kind: "toggle", id: "flash", label: "Użyj Flasha awaryjnie" },
      { kind: "toggle", id: "turret", label: "Nie uciekaj pod wieżę", defaultOn: true },
      { kind: "select", id: "path", label: "Kierunek uniku", options: ["Najkrótszy", "Do kursora", "Do drużyny", "Do fontanny"] },
    ]},
    { id: "farma", title: "Farma", icon: Trees, controls: [
      { kind: "toggle", id: "lasthit", label: "Auto last hit", defaultOn: true },
      { kind: "toggle", id: "lane", label: "Lane clear" },
      { kind: "slider", id: "mana", label: "Minimalna mana", min: 0, max: 100, value: 45, unit: "%" },
      { kind: "toggle", id: "freeze", label: "Utrzymuj freeze" },
      { kind: "toggle", id: "cannon", label: "Nigdy nie zgub cannona", defaultOn: true },
    ]},
    { id: "wizualizacje", title: "Wizualizacje", icon: Eye, controls: [
      { kind: "toggle", id: "ranges", label: "Zasięgi umiejętności", defaultOn: true },
      { kind: "toggle", id: "turrets", label: "Zasięgi wież", defaultOn: true },
      { kind: "toggle", id: "wards", label: "Wardy wroga", defaultOn: true },
      { kind: "toggle", id: "cooldowns", label: "Cooldowny przeciwników", defaultOn: true },
      { kind: "toggle", id: "gank", label: "Ostrzeżenie o ganku", defaultOn: true },
      { kind: "select", id: "overlay", label: "Styl nakładki", options: ["Minimalny", "Turniejowy", "Kurnik RGB"] },
    ]},
    { id: "jungle", title: "Jungle", icon: Map, controls: [
      { kind: "toggle", id: "smite", label: "Auto-smite", defaultOn: true },
      { kind: "select", id: "objective", label: "Priorytet", options: ["Baron", "Elder", "Smok", "Grzyb Teemo"] },
      { kind: "toggle", id: "timers", label: "Timery obozów", defaultOn: true },
      { kind: "toggle", id: "route", label: "Trasa jungli" },
      { kind: "slider", id: "smite-hp", label: "Bufor Smite", min: 0, max: 150, value: 28, unit: " HP" },
    ]},
    { id: "champion", title: "Champion", icon: Wand2, controls: [
      { kind: "select", id: "champ", label: "Profil championa", options: ["Yasuo", "Teemo", "Anivia", "Master Yi", "Kalista", "Azir"] },
      { kind: "toggle", id: "level", label: "Auto level umiejętności", defaultOn: true },
      { kind: "toggle", id: "items", label: "Auto zakup itemów" },
      { kind: "toggle", id: "mute", label: "Auto /mute all", defaultOn: true },
      { kind: "toggle", id: "chicken", label: "Kurczak skin" },
    ]},
  ],
};

export const FORTNITE_MENU: GameMenuConfig = {
  game: "Fortnite",
  build: "4-chkn-fn",
  tagline: "Battle Royale edition · Alpha",
  sections: [
    { id: "celowanie", title: "Celowanie", icon: Crosshair, controls: [
      { kind: "toggle", id: "aim", label: "Wsparcie celowania", defaultOn: true },
      { kind: "slider", id: "fov", label: "Pole widzenia", min: 1, max: 180, value: 38, unit: "°" },
      { kind: "slider", id: "smooth", label: "Wygładzanie", min: 0, max: 100, value: 72, unit: "%" },
      { kind: "select", id: "bone", label: "Punkt celu", options: ["Głowa", "Klatka", "Najbliższy", "Kilof"] },
      { kind: "toggle", id: "prediction", label: "Predykcja pocisku", defaultOn: true },
      { kind: "key", id: "aim-key", label: "Klawisz", value: "MOUSE5" },
    ]},
    { id: "wizualizacje", title: "Wizualizacje", icon: Eye, controls: [
      { kind: "toggle", id: "players", label: "ESP graczy", defaultOn: true },
      { kind: "toggle", id: "skeleton", label: "Szkielet", defaultOn: true },
      { kind: "toggle", id: "distance", label: "Dystans i broń", defaultOn: true },
      { kind: "toggle", id: "storm", label: "Następny krąg burzy", defaultOn: true },
      { kind: "toggle", id: "spectators", label: "Lista obserwujących" },
      { kind: "select", id: "rarity", label: "Kolor ESP", options: ["Rzadkość broni", "Drużyna", "Czerwony", "Kurczak"] },
    ]},
    { id: "budowanie", title: "Budowanie", icon: Hammer, controls: [
      { kind: "toggle", id: "build", label: "Turbo build", defaultOn: true },
      { kind: "toggle", id: "piece", label: "Auto wybór elementu", defaultOn: true },
      { kind: "slider", id: "delay", label: "Opóźnienie budowy", min: 0, max: 150, value: 12, unit: " ms" },
      { kind: "toggle", id: "materials", label: "Automatyczna zmiana materiału" },
      { kind: "select", id: "preset", label: "Preset", options: ["90s", "Turtle", "Ramp rush", "Kurnik 1×1"] },
    ]},
    { id: "edycja", title: "Edycja", icon: Boxes, controls: [
      { kind: "toggle", id: "edit", label: "Szybka edycja", defaultOn: true },
      { kind: "toggle", id: "confirm", label: "Potwierdź po puszczeniu", defaultOn: true },
      { kind: "toggle", id: "reset", label: "Natychmiastowy reset", defaultOn: true },
      { kind: "slider", id: "edit-delay", label: "Opóźnienie edycji", min: 0, max: 200, value: 18, unit: " ms" },
      { kind: "key", id: "edit-key", label: "Klawisz edycji", value: "F" },
    ]},
    { id: "ruch", title: "Ruch", icon: Zap, controls: [
      { kind: "toggle", id: "sprint", label: "Auto sprint", defaultOn: true },
      { kind: "toggle", id: "mantle", label: "Auto mantle", defaultOn: true },
      { kind: "toggle", id: "slide", label: "Slide boost" },
      { kind: "toggle", id: "glider", label: "Wcześniejszy deploy lotni" },
      { kind: "slider", id: "speed", label: "Prędkość ruchu", min: 100, max: 180, value: 112, unit: "%" },
    ]},
    { id: "loot", title: "Loot", icon: PackageSearch, controls: [
      { kind: "toggle", id: "loot", label: "Loot ESP", defaultOn: true },
      { kind: "select", id: "min-rarity", label: "Minimalna rzadkość", options: ["Szara", "Zielona", "Niebieska", "Fioletowa", "Złota"] , value: 2},
      { kind: "toggle", id: "chests", label: "Skrzynki i sejfy", defaultOn: true },
      { kind: "toggle", id: "llamas", label: "Lamy", defaultOn: true },
      { kind: "toggle", id: "auto-pickup", label: "Auto podnoszenie amunicji" },
    ]},
    { id: "inne", title: "Inne", icon: Sparkles, controls: [
      { kind: "toggle", id: "vehicles", label: "ESP pojazdów", defaultOn: true },
      { kind: "toggle", id: "radio", label: "Radio w Battle Busie" },
      { kind: "toggle", id: "emote", label: "Auto emotka po eliminacji" },
      { kind: "select", id: "skin", label: "Podgląd skina", options: ["Domyślny", "Peely", "Fishstick", "Kurczak"] },
      { kind: "toggle", id: "crown", label: "Korona zwycięstwa na HUD", defaultOn: true },
    ]},
  ],
};
