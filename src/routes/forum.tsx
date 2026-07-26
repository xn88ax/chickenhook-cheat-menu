import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Flame,
  LifeBuoy,
  MessageSquare,
  Megaphone,
  Pin,
  Search,
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

type Node = {
  icon: typeof Megaphone;
  name: string;
  desc: string;
  topics: string;
  posts: string;
  lastTitle: string;
  lastAuthor: string;
  lastTime: string;
};

const sections: { title: string; nodes: Node[] }[] = [
  {
    title: "ChickenHook — informacje",
    nodes: [
      {
        icon: Megaphone,
        name: "Ogłoszenia i changelogi",
        desc: "Nowe buildy, patche i przerwy techniczne.",
        topics: "128",
        posts: "2 341",
        lastTitle: "Build 4.12 — hotfix po patchu",
        lastAuthor: "dev_panierka",
        lastTime: "12 minut temu",
      },
      {
        icon: ShieldCheck,
        name: "Status bezpieczeństwa",
        desc: "Detekcje, dobre praktyki i zgłoszenia od użytkowników.",
        topics: "311",
        posts: "7 004",
        lastTitle: "Czy stream proof działa na OBS 31?",
        lastAuthor: "kfc_enjoyer",
        lastTime: "48 minut temu",
      },
    ],
  },
  {
    title: "Wsparcie i konfiguracja",
    nodes: [
      {
        icon: LifeBuoy,
        name: "Pomoc techniczna",
        desc: "Loader nie startuje? Tu znajdziesz rozwiązanie.",
        topics: "1 432",
        posts: "26 108",
        lastTitle: "Secure Boot — jak wyłączyć na MSI",
        lastAuthor: "zimnyFrytek",
        lastTime: "1 godzinę temu",
      },
      {
        icon: Settings2,
        name: "Configi i presety",
        desc: "Gotowe ustawienia aim, ESP i HvH od społeczności.",
        topics: "964",
        posts: "18 720",
        lastTitle: "Legit config 20k ELO Premier",
        lastAuthor: "nuggetsOnly",
        lastTime: "2 godziny temu",
      },
    ],
  },
  {
    title: "Społeczność",
    nodes: [
      {
        icon: Flame,
        name: "HvH i highlighty",
        desc: "Klipy, fragmovie i wojny na ragebotach.",
        topics: "588",
        posts: "12 455",
        lastTitle: "1v5 na Mirage — desync clip",
        lastAuthor: "ragebot_ziut",
        lastTime: "3 godziny temu",
      },
      {
        icon: Users,
        name: "Off-topic",
        desc: "Kurczaki, memy i wszystko poza CS2.",
        topics: "2 033",
        posts: "44 190",
        lastTitle: "Kto je skrzydełka o 3 w nocy?",
        lastAuthor: "budzetowy",
        lastTime: "5 godzin temu",
      },
    ],
  },
];

const threads = [
  {
    pinned: true,
    title: "REGULAMIN forum ChickenHook — przeczytaj przed postowaniem",
    author: "admin_kogut",
    cat: "Ogłoszenia i changelogi",
    replies: 0,
    time: "przypięty",
  },
  {
    pinned: true,
    title: "Build 4.12 — undetected po dzisiejszym patchu CS2",
    author: "dev_panierka",
    cat: "Ogłoszenia i changelogi",
    replies: 214,
    time: "12 minut temu",
  },
  {
    title: "Legit config pod Premier 20k+ (smooth 18, FOV 2.5)",
    author: "zimnyFrytek",
    cat: "Configi i presety",
    replies: 87,
    time: "34 minuty temu",
  },
  {
    title: "Triggerbot opóźnienie — jakie wartości są bezpieczne?",
    author: "nuggetsOnly",
    cat: "Pomoc techniczna",
    replies: 41,
    time: "1 godzinę temu",
  },
  {
    title: "Skin changer nie ładuje noża po restarcie gry",
    author: "kfc_enjoyer",
    cat: "Pomoc techniczna",
    replies: 19,
    time: "2 godziny temu",
  },
  {
    title: "HvH: mój setup na anty-aim + backtrack 12 ticków",
    author: "ragebot_ziut",
    cat: "HvH i highlighty",
    replies: 133,
    time: "3 godziny temu",
  },
];

const members = ["admin_kogut", "dev_panierka", "zimnyFrytek", "nuggetsOnly", "ragebot_ziut"];

function Avatar({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-sm bucket-gradient text-xs font-bold uppercase text-primary-foreground ${className}`}
      aria-hidden
    >
      {name.slice(0, 2)}
    </span>
  );
}

function Forum() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={chickenhookLogo.url}
              alt="Herb ChickenHook — złoty kogut na czarnej tarczy"
              className="h-9 w-auto"
            />
            <span className="text-display text-xl">
              CHICKEN<span className="text-primary">HOOK</span>
              <span className="text-muted-foreground">.RU</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground md:flex">
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
            className="rounded-sm bucket-gradient px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-bucket)]"
          >
            Kup teraz
          </Link>
        </div>
      </header>

      {/* XenForo-style forum tab bar */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5">
          <nav className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide">
            <span className="border-b-2 border-primary px-3 py-3 text-foreground">Forum</span>
            <span className="px-3 py-3 text-muted-foreground">Nowe posty</span>
            <span className="hidden px-3 py-3 text-muted-foreground sm:block">Szukaj forum</span>
            <span className="hidden px-3 py-3 text-muted-foreground sm:block">Członkowie</span>
          </nav>
          <div className="hidden items-center gap-2 rounded-sm border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground md:flex">
            <Search className="size-3.5" />
            Szukaj…
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center gap-1.5 px-5 py-2.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Start
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground">Forum</span>
        </div>
      </div>

      <main className="mx-auto grid max-w-6xl gap-6 px-5 py-6 lg:grid-cols-[1fr_260px]">
        <div className="space-y-5">
          <h1 className="text-display text-3xl uppercase">
            Forum <span className="text-primary">ChickenHook</span>
          </h1>

          {/* Node list */}
          {sections.map((section) => (
            <section key={section.title} className="overflow-hidden rounded-sm border border-border">
              <h2 className="bucket-gradient px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-foreground">
                {section.title}
              </h2>
              <div className="divide-y divide-border">
                {section.nodes.map((n) => (
                  <div
                    key={n.name}
                    className="flex items-start gap-4 bg-card px-4 py-4 transition-colors hover:bg-secondary/50"
                  >
                    <n.icon className="mt-0.5 size-7 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-foreground">{n.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{n.desc}</p>
                    </div>
                    <dl className="hidden w-28 shrink-0 text-xs text-muted-foreground sm:block">
                      <div className="flex justify-between">
                        <dt>Wątki</dt>
                        <dd className="font-semibold text-foreground">{n.topics}</dd>
                      </div>
                      <div className="mt-1 flex justify-between">
                        <dt>Posty</dt>
                        <dd className="font-semibold text-foreground">{n.posts}</dd>
                      </div>
                    </dl>
                    <div className="hidden w-56 shrink-0 items-start gap-2 lg:flex">
                      <Avatar name={n.lastAuthor} className="size-8" />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-foreground">
                          {n.lastTitle}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {n.lastAuthor} · {n.lastTime}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Latest threads table */}
          <section className="overflow-hidden rounded-sm border border-border">
            <h2 className="flex items-center justify-between bg-secondary px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-foreground">
              Ostatnie wątki
              <span className="text-xs font-semibold normal-case text-muted-foreground">
                Pokaż wszystkie
              </span>
            </h2>
            <div className="divide-y divide-border">
              {threads.map((t) => (
                <article
                  key={t.title}
                  className="flex items-center gap-3 bg-card px-4 py-3 transition-colors hover:bg-secondary/50"
                >
                  <Avatar name={t.author} className="size-9" />
                  <div className="min-w-0 flex-1">
                    <h3 className="flex items-center gap-1.5 text-sm font-semibold">
                      {t.pinned && <Pin className="size-3.5 shrink-0 text-primary" />}
                      <span className="truncate">{t.title}</span>
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {t.author} · {t.time} · {t.cat}
                    </p>
                  </div>
                  <div className="hidden w-24 shrink-0 text-right text-xs text-muted-foreground sm:block">
                    <span className="flex items-center justify-end gap-1.5">
                      <MessageSquare className="size-3.5 text-accent" />
                      {t.replies}
                    </span>
                    <span className="mt-1 block">odpowiedzi</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Forum statistics widget */}
          <section className="overflow-hidden rounded-sm border border-border">
            <h2 className="bg-secondary px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-foreground">
              Statystyki forum
            </h2>
            <dl className="grid grid-cols-2 gap-4 bg-card px-4 py-4 text-xs sm:grid-cols-4">
              {[
                ["Wątki", "5 456"],
                ["Posty", "110 818"],
                ["Członkowie", "18 420"],
                ["Najnowszy", "budzetowy"],
              ].map(([l, v]) => (
                <div key={l}>
                  <dt className="uppercase tracking-wide text-muted-foreground">{l}</dt>
                  <dd className="mt-1 text-display text-2xl text-accent">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <p className="text-xs text-muted-foreground">
            Forum demonstracyjne — zakładanie kont i pisanie postów jest wyłączone.
          </p>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          <section className="overflow-hidden rounded-sm border border-border">
            <h2 className="bg-secondary px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-foreground">
              Użytkownicy online
            </h2>
            <div className="space-y-2 bg-card px-4 py-3">
              {members.map((m) => (
                <div key={m} className="flex items-center gap-2 text-xs">
                  <Avatar name={m} className="size-6" />
                  <span className="truncate text-foreground">{m}</span>
                  <span className="ml-auto size-1.5 rounded-full bg-accent" aria-hidden />
                </div>
              ))}
              <p className="pt-1 text-xs text-muted-foreground">
                Łącznie: 342 (użytkowników: 51, gości: 291)
              </p>
            </div>
          </section>

          <section className="overflow-hidden rounded-sm border border-border">
            <h2 className="bg-secondary px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-foreground">
              Status buildów
            </h2>
            <div className="divide-y divide-border bg-card text-xs">
              {[
                ["CS2 Premier", true],
                ["CS2 Faceit", true],
                ["HvH build", true],
                ["Legacy CS:GO", false],
              ].map(([name, ok]) => (
                <div key={name as string} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-foreground">{name}</span>
                  <span
                    className={`flex items-center gap-1.5 font-semibold uppercase ${
                      ok ? "text-accent" : "text-muted-foreground"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${ok ? "bg-accent" : "bg-muted-foreground"}`}
                    />
                    {ok ? "OK" : "Remont"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-sm border border-border">
            <h2 className="bg-secondary px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-foreground">
              Dołącz do nas
            </h2>
            <div className="space-y-2 bg-card px-4 py-4">
              <Link
                to="/"
                hash="menu"
                className="block rounded-sm bucket-gradient px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-bucket)]"
              >
                Zobacz cennik
              </Link>
              <Link
                to="/opcje"
                className="block rounded-sm border border-border px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-foreground transition-colors hover:bg-secondary"
              >
                Opcje cheata
              </Link>
            </div>
          </section>
        </aside>
      </main>

      <div className="h-3 stripe-band" aria-hidden />

      <footer className="mx-auto max-w-6xl px-5 py-10">
        <p className="text-xs text-muted-foreground">
          Strona parodystyczna, stworzona w celach demonstracyjnych.
        </p>
      </footer>
    </div>
  );
}
