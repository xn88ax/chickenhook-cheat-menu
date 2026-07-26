import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bug,
  Check,
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
import chickenOnTree from "@/assets/chicken-on-tree.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ChickenHook.ru — Cheaty do CS2 | Aim, ESP, HvH" },
      {
        name: "description",
        content:
          "ChickenHook.ru — chrupiący cheat do CS2. Aimbot, ESP, skin changer i pełny bypass VAC. Świeżo smażony kod, aktualizacje w 24h.",
      },
      { property: "og:title", content: "ChickenHook.ru — Cheaty do CS2" },
      {
        property: "og:description",
        content: "Aimbot, ESP i bypass do CS2 podawane na gorąco. 12 tajnych ziół i przypraw.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const menu = [
  {
    name: "Solo",
    price: "39",
    period: "/ 7 dni",
    tag: "Na start",
    items: ["Aimbot z smoothem", "Box ESP + HP", "Radar hack", "Wsparcie na Discordzie"],
  },
  {
    name: "Premium",
    price: "89",
    period: "/ 30 dni",
    tag: "Najczęściej brany",
    featured: true,
    items: [
      "Wszystko z Solo",
      "Skeleton ESP + glow",
      "Triggerbot i backtrack",
      "Skin & knife changer",
      "Bypass anti-cheat",
    ],
  },
  {
    name: "Elite",
    price: "249",
    period: "/ lifetime",
    tag: "Dla wymagających",
    items: [
      "Wszystko z Premium",
      "HvH ready config",
      "Konfigi od topowych graczy",
      "Priorytetowy support 24/7",
      "Dostęp do beta buildów",
    ],
  },
];

const features = [
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


function Index() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="#top" className="flex items-center gap-2">
            <img
              src={chickenhookLogo.url}
              alt="Herb ChickenHook — złoty kogut na czarnej tarczy"
              className="h-10 w-auto"
            />
            <span className="text-display text-2xl">
              CHICKEN<span className="text-primary">HOOK</span>
              <span className="text-muted-foreground">.RU</span>
            </span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground md:flex">
            <a href="#menu" className="transition-colors hover:text-foreground">
              Cennik
            </a>
            <a href="#funkcje" className="transition-colors hover:text-foreground">
              Funkcje
            </a>
            <Link to="/opcje" className="transition-colors hover:text-foreground">
              Opcje
            </Link>
            <a href="#status" className="transition-colors hover:text-foreground">
              Status
            </a>
            <a href="#faq" className="transition-colors hover:text-foreground">
              FAQ
            </a>
          </nav>

          <a
            href="#menu"
            className="rounded-sm bucket-gradient px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-bucket)] transition-transform hover:-translate-y-0.5"
          >
            Kup teraz
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 glow-top" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-block rounded-sm border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Undetected od 412 dni
            </span>
            <h1 className="mt-5 text-display text-6xl uppercase sm:text-7xl md:text-8xl">
              Daj się
              <br />
              <span className="text-primary">poczuć</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground">
              ChickenHook to private cheat do CS2 w fast-foodowej czerwieni. Aimbot, ESP, skin
              changer i bypass w jednym zestawie — podawane świeżo po każdym patchu.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#menu"
                className="rounded-sm bucket-gradient px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-bucket)] transition-transform hover:-translate-y-0.5"
              >
                Zobacz cennik
              </a>
              <a
                href="#funkcje"
                className="rounded-sm border border-border px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-foreground transition-colors hover:bg-secondary"
              >
                Funkcje
              </a>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[
                ["18 420", "Użytkowników"],
                ["0", "Banów w 2026"],
                ["24h", "Update po patchu"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="text-display text-3xl text-accent">{v}</dt>
                  <dd className="text-xs uppercase tracking-wide text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative flex justify-center">
            <div className="absolute -inset-6 rounded-full bg-primary/20 blur-3xl" aria-hidden />
            <img
              src={chickenOnTree.url}
              alt="Kurczak na drzewie — symbol ChickenHook"
              width={1024}
              height={1024}
              className="relative w-full max-w-md rounded-sm drop-shadow-[0_20px_45px_rgba(0,0,0,0.6)]"
            />
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y border-border bg-primary py-3">
        <div className="marquee-track flex w-max gap-8 whitespace-nowrap text-display text-2xl uppercase text-primary-foreground">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex gap-8">
              {[
                "Aimbot",
                "ESP",
                "Skin changer",
                "Triggerbot",
                "HvH ready",
                "Bypass VAC",
                "Stream proof",
                "Private build",
              ].map((t) => (
                <span key={t} className="flex items-center gap-8">
                  {t} <span className="text-accent">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="funkcje" className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-display text-5xl uppercase md:text-6xl">
          12 tajnych <span className="text-primary">przypraw</span>
        </h2>
        <p className="mt-3 max-w-lg text-muted-foreground">
          Każdy moduł doprawiony osobno i testowany na Premierze powyżej 20k ELO.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="panel group rounded-sm p-6 transition-colors hover:border-primary/50"
            >
              <f.icon className="size-7 text-primary transition-transform group-hover:scale-110" />
              <h3 className="mt-4 text-display text-2xl uppercase">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Menu / pricing */}
      <section id="menu" className="border-y border-border bg-card/40 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-display text-5xl uppercase md:text-6xl">
            Nasze <span className="text-primary">menu</span>
          </h2>
          <p className="mt-3 max-w-lg text-muted-foreground">
            Bez abonamentu na siłę. Wybierasz zestaw, dostajesz loader w 60 sekund.
          </p>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {menu.map((p) => (
              <div
                key={p.name}
                className={`panel relative flex flex-col rounded-sm p-7 ${
                  p.featured ? "border-primary shadow-[var(--shadow-bucket)]" : ""
                }`}
              >
                <span
                  className={`inline-block w-fit rounded-sm px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.15em] ${
                    p.featured
                      ? "bucket-gradient text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {p.tag}
                </span>
                <h3 className="mt-4 text-display text-4xl uppercase">{p.name}</h3>
                <p className="mt-2 flex items-baseline gap-1">
                  <span className="text-display text-5xl text-accent">{p.price} zł</span>
                  <span className="text-sm text-muted-foreground">{p.period}</span>
                </p>
                <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                  {p.items.map((it) => (
                    <li key={it} className="flex gap-2.5 text-muted-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {it}
                    </li>
                  ))}
                </ul>
                <a
                  href="#faq"
                  className={`mt-7 rounded-sm px-5 py-3 text-center text-sm font-bold uppercase tracking-wide transition-transform hover:-translate-y-0.5 ${
                    p.featured
                      ? "bucket-gradient text-primary-foreground"
                      : "border border-border text-foreground hover:bg-secondary"
                  }`}
                >
                  Do koszyka
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Status */}
      <section id="status" className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-display text-5xl uppercase md:text-6xl">
          Status <span className="text-primary">kuchni</span>
        </h2>
        <div className="mt-8 overflow-hidden rounded-sm border border-border">
          {[
            ["ChickenHook — CS2 Premier", "Undetected", true],
            ["ChickenHook — CS2 Faceit", "Undetected", true],
            ["ChickenHook — HvH build", "Undetected", true],
            ["ChickenHook — Legacy CS:GO", "W remoncie", false],
          ].map(([name, status, ok]) => (
            <div
              key={name as string}
              className="flex items-center justify-between border-b border-border bg-card px-5 py-4 last:border-0"
            >
              <span className="text-sm font-semibold">{name}</span>
              <span
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wide ${
                  ok ? "text-accent" : "text-muted-foreground"
                }`}
              >
                <span
                  className={`size-2 rounded-full ${ok ? "bg-accent" : "bg-muted-foreground"}`}
                />
                {status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border bg-card/40 py-20">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="text-display text-5xl uppercase md:text-6xl">FAQ</h2>
          <div className="mt-8 space-y-3">
            {[
              [
                "Czy dostanę bana?",
                "Nasz loader działa na poziomie kernela i jest przepisywany po każdym patchu. Zero banów od stycznia 2026 — ale zawsze graj z głową.",
              ],
              [
                "Jak szybko dostanę dostęp?",
                "Loader i klucz lądują na Discordzie natychmiast po opłaceniu zamówienia.",
              ],
              [
                "Jakie są wymagania?",
                "Windows 10/11, wyłączony Secure Boot i 5 minut na konfigurację. Instrukcja krok po kroku w panelu.",
              ],
              [
                "Czy mogę zmienić zestaw?",
                "Tak, w ciągu 48 godzin dopłacasz różnicę i przechodzisz na wyższe menu.",
              ],
            ].map(([q, a]) => (
              <details key={q} className="panel group rounded-sm p-5">
                <summary className="cursor-pointer list-none text-display text-2xl uppercase transition-colors group-open:text-primary">
                  {q}
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <div className="h-3 stripe-band" aria-hidden />

      <footer className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-display text-3xl uppercase">
              CHICKEN<span className="text-primary">HOOK</span>.RU
            </p>
            <p className="mt-2 max-w-sm text-xs text-muted-foreground">
              Strona parodystyczna, stworzona w celach demonstracyjnych. Nie sprzedajemy
              oprogramowania naruszającego regulaminy gier.
            </p>
          </div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            © 2026 ChickenHook — Finger lickin' headshots
          </p>
        </div>
      </footer>
    </div>
  );
}
