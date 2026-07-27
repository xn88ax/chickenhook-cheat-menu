import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Lock } from "lucide-react";



import { FeatureDialog } from "@/components/feature-dialog";
import { features } from "@/data/features";
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
      "Moduły ryzykowne (tryb boga, brak klipu, teleport) po podaniu",
      "Priorytetowy support 24/7",
      "Dostęp do beta buildów",
    ],
  },
];

import { FeaturePreview } from "@/components/feature-preview";





const heroStats = [
  ["Win 10 / 11", "Tylko Windows"],
  ["24/7", "Wsparcie na żywo"],
  ["Kernel", "Ochrona sterownika"],
  ["18 420", "Zadowolonych graczy"],
  ["Regularne", "Aktualizacje"],
];

function Index() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Nav */}
      <header className="sticky top-4 z-50 px-4">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full border border-border glass px-3 pl-5">
          <a href="#top" className="flex items-center gap-2">
            <img
              src={chickenhookLogo.url}
              alt="Herb ChickenHook — kogut na tarczy"
              className="h-7 w-auto"
            />
            <span className="text-display text-lg tracking-tight">chickenhook</span>
          </a>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#funkcje" className="transition-colors hover:text-foreground">
              Funkcje
            </a>
            <Link to="/opcje" className="transition-colors hover:text-foreground">
              Opcje
            </Link>
            <a href="#menu" className="transition-colors hover:text-foreground">
              Cennik
            </a>
            <a href="#status" className="transition-colors hover:text-foreground">
              Status
            </a>
            <a href="#faq" className="transition-colors hover:text-foreground">
              FAQ
            </a>
          </nav>

          <Link
            to="/forum"
            className="glass-focus rounded-full border border-border bg-secondary/70 px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            Forum
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 glow-top" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 aurora opacity-40" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-5 py-28 text-center md:py-36">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Premium CS2 software
          </span>
          <h1 className="mt-6 text-display text-5xl sm:text-6xl md:text-7xl">
            Wciąż grasz na tych{" "}
            <span className="glitch inline-block" data-text="samych cheatach?">
              samych cheatach?
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            Uwolnij pełen potencjał w Counter-Strike 2 z najnowszym prywatnym oprogramowaniem.
            Dopracowane w każdym detalu, z pełną personalizacją każdego modułu.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#menu"
              className="glass-focus rounded-full border border-border bg-secondary px-7 py-3 text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5"
            >
              Uzyskaj dostęp
            </a>
            <a
              href="#funkcje"
              className="glass-focus rounded-full border border-border px-7 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Dowiedz się więcej
            </a>
          </div>
          <p className="mx-auto mt-6 w-fit rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground">
            Już od 39 zł / miesiąc
          </p>
        </div>

        <div className="relative mx-auto grid max-w-5xl grid-cols-2 gap-y-8 px-5 pb-20 text-center sm:grid-cols-3 md:grid-cols-5">
          {heroStats.map(([v, l]) => (
            <div key={l}>
              <p className="text-display text-2xl">{v}</p>
              <p className="mt-1 text-xs text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Showcase */}
      <section className="relative mx-auto max-w-5xl px-5 pb-24">
        <div className="overflow-hidden rounded-3xl border border-border glass p-3">
          <img
            src={chickenOnTree.url}
            alt="Podgląd wizualizacji ChickenHook w akcji"
            width={1024}
            height={1024}
            loading="lazy"
            className="w-full rounded-2xl object-cover"
          />
        </div>
      </section>

      {/* Features */}
      <section id="funkcje" className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0 glow-top opacity-30" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Funkcje
            </span>
            <h2 className="mt-4 text-display text-4xl md:text-5xl">
              Co dostajesz dołączając do ChickenHook?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Każdy moduł konfigurowany osobno i testowany na Premierze powyżej 20k ELO.
            </p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <article
                key={f.title}
                className="feature-card group flex flex-col rounded-2xl p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex size-11 items-center justify-center rounded-xl border border-border bg-secondary/60 text-foreground transition-colors duration-300 group-hover:border-primary/50 group-hover:text-primary">
                    <f.icon className="size-5 transition-transform duration-300 group-hover:scale-110" />
                  </span>
                  {f.restricted ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">
                      <Lock className="size-3" />
                      Elite + podanie
                    </span>
                  ) : (
                    <span className="text-display text-xl leading-none text-muted-foreground/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  )}
                </div>
                <h3 className="mt-6 text-display text-xl">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                <FeaturePreview kind={f.preview} />
                <FeatureDialog feature={f} />
              </article>
            ))}
          </div>
        </div>
      </section>




      {/* Menu / pricing */}
      <section id="menu" className="border-y border-border bg-card/40 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-display text-5xl uppercase md:text-6xl">
            Wybierz <span className="text-primary">plan</span>
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
                  className={`glass-focus mt-7 rounded-sm px-5 py-3 text-center text-sm font-bold uppercase tracking-wide hover:-translate-y-0.5 ${
                    p.featured
                      ? "bucket-gradient text-primary-foreground"
                      : "border border-border text-foreground hover:bg-secondary"
                  }`}
                >
                  Wybieram {p.name}

                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Status */}
      <section id="status" className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-display text-5xl uppercase md:text-6xl">
          Status <span className="text-primary">bezpieczeństwa</span>
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
              className="flex items-center justify-between border-b border-border glass px-5 py-4 last:border-0"
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
                "Czy mogę zmienić plan?",
                "Tak, w ciągu 48 godzin dopłacasz różnicę i przechodzisz na wyższy plan.",
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
            © 2026 ChickenHook — Private CS2 software
          </p>
        </div>
      </footer>
    </div>
  );
}
