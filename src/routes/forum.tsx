import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Flame,
  LifeBuoy,
  MessageSquare,
  Megaphone,
  Pin,
  Settings2,
  ShieldCheck,
  Users,
} from "lucide-react";
import chickenhookLogo from "@/assets/chickenhook-logo.png.asset.json";

export const Route = createFileRoute("/forum")({
  head: () => ({
    meta: [
      { title: "Forum ChickenHook.ru — społeczność cheatów do CS2" },
      {
        name: "description",
        content:
          "Forum ChickenHook: ogłoszenia, konfiguracje, pomoc techniczna, status bezpieczeństwa i dyskusje graczy CS2.",
      },
      { property: "og:title", content: "Forum ChickenHook.ru" },
      {
        property: "og:description",
        content: "Ogłoszenia, configi, support i dyskusje społeczności ChickenHook.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Forum,
});

const categories = [
  {
    icon: Megaphone,
    name: "Ogłoszenia",
    desc: "Changelogi, patche i przerwy techniczne.",
    topics: 128,
    posts: "2 341",
    last: "Build 4.12 — hotfix po patchu",
  },
  {
    icon: Settings2,
    name: "Configi",
    desc: "Gotowe ustawienia aim, ESP i HvH od społeczności.",
    topics: 964,
    posts: "18 720",
    last: "Legit config 20k ELO Premier",
  },
  {
    icon: LifeBuoy,
    name: "Pomoc techniczna",
    desc: "Loader nie startuje? Tu znajdziesz rozwiązanie.",
    topics: 1432,
    posts: "26 108",
    last: "Secure Boot — jak wyłączyć na MSI",
  },
  {
    icon: ShieldCheck,
    name: "Bezpieczeństwo",
    desc: "Status detekcji, dobre praktyki i zgłoszenia.",
    topics: 311,
    posts: "7 004",
    last: "Czy stream proof działa na OBS 31?",
  },
  {
    icon: Flame,
    name: "HvH & Highlighty",
    desc: "Klipy, fragmovie i wojny na ragebotach.",
    topics: 588,
    posts: "12 455",
    last: "1v5 na Mirage — desync clip",
  },
  {
    icon: Users,
    name: "Off-topic",
    desc: "Kurczaki, memy i wszystko poza CS2.",
    topics: 2033,
    posts: "44 190",
    last: "Kto je skrzydełka o 3 w nocy?",
  },
];

const threads = [
  {
    pinned: true,
    title: "REGULAMIN forum ChickenHook — przeczytaj przed postowaniem",
    author: "admin_kogut",
    cat: "Ogłoszenia",
    replies: 0,
    time: "przypięty",
  },
  {
    pinned: true,
    title: "Build 4.12 — undetected po dzisiejszym patchu CS2",
    author: "dev_panierka",
    cat: "Ogłoszenia",
    replies: 214,
    time: "12 min temu",
  },
  {
    title: "Legit config pod Premier 20k+ (smooth 18, FOV 2.5)",
    author: "zimnyFrytek",
    cat: "Configi",
    replies: 87,
    time: "34 min temu",
  },
  {
    title: "Triggerbot opóźnienie — jakie wartości są bezpieczne?",
    author: "nuggetsOnly",
    cat: "Pomoc techniczna",
    replies: 41,
    time: "1 godz. temu",
  },
  {
    title: "Skin changer nie ładuje noża po restarcie gry",
    author: "kfc_enjoyer",
    cat: "Pomoc techniczna",
    replies: 19,
    time: "2 godz. temu",
  },
  {
    title: "HvH: mój setup na anty-aim + backtrack 12 ticków",
    author: "ragebot_ziut",
    cat: "HvH & Highlighty",
    replies: 133,
    time: "3 godz. temu",
  },
  {
    title: "Czy warto brać Elite jak gram 2h dziennie?",
    author: "budzetowy",
    cat: "Off-topic",
    replies: 56,
    time: "5 godz. temu",
  },
];

const stats = [
  ["18 420", "Użytkowników"],
  ["5 456", "Tematów"],
  ["110 818", "Postów"],
];

function Forum() {
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
            <Link to="/opcje" className="transition-colors hover:text-foreground">
              Opcje
            </Link>
            <Link to="/forum" className="text-foreground">
              Forum
            </Link>
          </nav>
          <Link
            to="/"
            hash="menu"
            className="rounded-sm bucket-gradient px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-bucket)] transition-transform hover:-translate-y-0.5"
          >
            Kup teraz
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 glow-top" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-5 py-16 md:py-20">
          <span className="inline-block rounded-sm border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Społeczność
          </span>
          <h1 className="mt-5 text-display text-6xl uppercase sm:text-7xl md:text-8xl">
            Forum <span className="text-primary">ChickenHook</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground">
            Configi, pomoc techniczna, changelogi i dyskusje. Miejsce, gdzie użytkownicy dzielą się
            ustawieniami i zgłaszają problemy.
          </p>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {stats.map(([v, l]) => (
              <div key={l}>
                <dt className="text-display text-3xl text-accent">{v}</dt>
                <dd className="text-xs uppercase tracking-wide text-muted-foreground">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="h-3 stripe-band" aria-hidden />

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-display text-5xl uppercase md:text-6xl">
          Działy <span className="text-primary">forum</span>
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div
              key={c.name}
              className="panel group flex flex-col rounded-sm p-6 transition-colors hover:border-primary/50"
            >
              <c.icon className="size-7 text-primary transition-transform group-hover:scale-110" />
              <h3 className="mt-4 text-display text-2xl uppercase">{c.name}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{c.desc}</p>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs uppercase tracking-wide text-muted-foreground">
                <span>{c.topics} tematów</span>
                <span>{c.posts} postów</span>
              </div>
              <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <MessageSquare className="size-3.5 shrink-0 text-accent" />
                <span className="truncate">{c.last}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/40 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-display text-5xl uppercase md:text-6xl">
            Ostatnie <span className="text-primary">tematy</span>
          </h2>
          <div className="mt-8 overflow-hidden rounded-sm border border-border">
            {threads.map((t) => (
              <article
                key={t.title}
                className="flex flex-col gap-2 border-b border-border bg-card px-5 py-4 last:border-0 transition-colors hover:bg-secondary/60 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    {t.pinned && <Pin className="size-3.5 shrink-0 text-primary" />}
                    <span className="truncate">{t.title}</span>
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                    {t.cat} · @{t.author}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-5 text-xs uppercase tracking-wide text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="size-3.5 text-accent" />
                    {t.replies}
                  </span>
                  <span>{t.time}</span>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Forum demonstracyjne — zakładanie kont i pisanie postów jest wyłączone.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex flex-wrap gap-3">
          <Link
            to="/"
            hash="menu"
            className="rounded-sm bucket-gradient px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-bucket)] transition-transform hover:-translate-y-0.5"
          >
            Zobacz cennik
          </Link>
          <Link
            to="/opcje"
            className="rounded-sm border border-border px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-foreground transition-colors hover:bg-secondary"
          >
            Opcje cheata
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
