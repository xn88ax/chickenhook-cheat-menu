import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bug,
  Crosshair,
  Eye,
  Heart,
  MousePointerClick,
  Rabbit,
  Shirt,
  Sparkles,
  Wind,
} from "lucide-react";
import chickenhookLogo from "@/assets/chickenhook-logo.png.asset.json";

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

const options = [
  {
    icon: Wind,
    title: "Brak klipu",
    desc: "Przechodzisz przez ściany i podłogi jak przez panierkę. Regulowana prędkość lotu.",
  },
  {
    icon: Heart,
    title: "Tryb boga",
    desc: "Nietykalność na serwerach lokalnych i testowych. Sprawdzisz configi bez ryzyka.",
  },
  {
    icon: Rabbit,
    title: "Króliczy skok",
    desc: "Auto bhop z synchronizacją strafe. Trzymasz spację, reszta dzieje się sama.",
  },
  {
    icon: Crosshair,
    title: "Robot celu",
    desc: "Aimbot z FOV, smoothem, RCS i wyborem kości. Od cichego wsparcia po pełne HvH.",
  },
  {
    icon: MousePointerClick,
    title: "Robot spustu",
    desc: "Triggerbot strzela w milisekundzie po najechaniu na wroga. Opóźnienie do ustawienia.",
  },
  {
    icon: Eye,
    title: "Wizualizacje",
    desc: "Skeleton ESP, boxy, HP, bronie, granaty, radar, chams i podświetlenia.",
  },
  {
    icon: Shirt,
    title: "Zmieniacz skórek",
    desc: "Skiny, noże, rękawiczki, naklejki i brelok — wszystko widoczne dla Ciebie od razu.",
  },
  {
    icon: Sparkles,
    title: "Ruch",
    desc: "Auto strafe, fast stop, edge jump, slide i optymalizacja peekowania.",
  },
  {
    icon: Bug,
    title: "Różne",
    desc: "Third person, zoom, FOV changer, night mode, spectator list i czysty log konsoli.",
  },
];

function Opcje() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={chickenhookLogo.url}
              alt="Herb ChickenHook — złoty kogut na czarnej tarczy"
              className="h-10 w-auto"
            />
            <span className="text-display text-2xl">
              CHICKEN<span className="text-primary">HOOK</span>
              <span className="text-muted-foreground">.RU</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground md:flex">
            <Link to="/" className="transition-colors hover:text-foreground">
              Start
            </Link>
            <Link to="/opcje" className="text-foreground">
              Opcje
            </Link>
          </nav>
          <Link
            to="/"
            hash="menu"
            className="rounded-sm bucket-gradient px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-bucket)] transition-transform hover:-translate-y-0.5"
          >
            Zamów
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 glow-top" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-5 py-16 md:py-20">
          <span className="inline-block rounded-sm border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Pełne menu funkcji
          </span>
          <h1 className="mt-5 text-display text-6xl uppercase sm:text-7xl md:text-8xl">
            Opcje <span className="text-primary">cheata</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground">
            Wszystkie składniki ChickenHook w jednym wiaderku. Każdą opcję włączasz osobno i
            doprawiasz pod swój styl gry.
          </p>
        </div>
      </section>

      <div className="overflow-hidden border-y border-border bg-primary py-3">
        <div className="marquee-track flex w-max gap-8 whitespace-nowrap text-display text-2xl uppercase text-primary-foreground">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex gap-8">
              {options.map((o) => (
                <span key={o.title} className="flex items-center gap-8">
                  {o.title} <span className="text-accent">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {options.map((o) => (
            <div
              key={o.title}
              className="panel group rounded-sm p-6 transition-colors hover:border-primary/50"
            >
              <o.icon className="size-7 text-primary transition-transform group-hover:scale-110" />
              <h2 className="mt-4 text-display text-2xl uppercase">{o.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{o.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            to="/"
            hash="menu"
            className="rounded-sm bucket-gradient px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-bucket)] transition-transform hover:-translate-y-0.5"
          >
            Zobacz menu
          </Link>
          <Link
            to="/"
            className="rounded-sm border border-border px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-foreground transition-colors hover:bg-secondary"
          >
            Wróć na start
          </Link>
        </div>
      </section>

      <div className="h-3 stripe-band" aria-hidden />

      <footer className="mx-auto max-w-6xl px-5 py-12">
        <p className="text-xs text-muted-foreground">
          Strona parodystyczna, stworzona w celach demonstracyjnych.
        </p>
      </footer>
    </div>
  );
}
