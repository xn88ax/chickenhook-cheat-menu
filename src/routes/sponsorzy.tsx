import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

import chickenhookLogo from "@/assets/chickenhook-logo.png.asset.json";
import mualaLogo from "@/assets/muala-logo.png.asset.json";
import pollosLogo from "@/assets/logo-pollos.png";
import drobpolLogo from "@/assets/logo-drobool.png";
import davesLogo from "@/assets/logo-daves.png";

export const Route = createFileRoute("/sponsorzy")({
  head: () => ({
    meta: [
      { title: "Sponsorzy — ChickenHook.ru | CS2" },
      {
        name: "description",
        content:
          "Partnerzy i sponsorzy ChickenHook: KFC, Pepsi, Popeyes, MUALA, Los Pollos Hermanos, Drob-Pol, Chick-fil-A, Dave's Hot Chicken, Wendy's, SpaceX, Twitter.",
      },
      { property: "og:title", content: "Sponsorzy — ChickenHook.ru" },
      {
        property: "og:description",
        content:
          "Zobacz kogo ChickenHook trzyma w swoim kurniku — od fast-foodowych gigantów po kosmicznych inżynierów.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Sponsorzy,
});

type Sponsor = {
  name: string;
  slug: string;
  category: string;
  desc: string;
  color: string;
  textColor: string;
  logo?: string;
  icon?: string;
  initial?: string;
};

const sponsors: Sponsor[] = [
  {
    name: "KFC",
    slug: "kfc",
    category: "Fast food",
    desc: "Dostarcza chrupiące skrzydełka, które inspirują nasz aimbot do precyzyjnych headshotów.",
    color: "#E4002B",
    textColor: "#FFFFFF",
    icon: "https://cdn.simpleicons.org/kfc/ffffff",
  },
  {
    name: "Pepsi",
    slug: "pepsi",
    category: "Napoje",
    desc: "Orzeźwiający boost do reakcji. Pijesz Pepsi — przeciwnik pije słone łzy.",
    color: "#004B93",
    textColor: "#FFFFFF",
    icon: "https://cdn.simpleicons.org/pepsi/ffffff",
  },
  {
    name: "Popeyes",
    slug: "popeyes",
    category: "Fast food",
    desc: "Pikantne stripsy i jeszcze pikantsze configi do HvH. Louisiana flavor w każdym fragu.",
    color: "#F4A900",
    textColor: "#1A1A1A",
    icon: "https://cdn.simpleicons.org/popeyes/1A1A1A",
  },
  {
    name: "MUALA",
    slug: "muala",
    category: "Partner strategiczny",
    desc: "Nowy, tajny składnik w naszym sosie. MUALA to brand, który rozumie chicken game na poważnie.",
    color: "#F7931A",
    textColor: "#FFFFFF",
    logo: mualaLogo.url,
  },
  {
    name: "Los Pollos Hermanos",
    slug: "los-pollos-hermanos",
    category: "Fast food",
    desc: "Dystrybucja na najwyższym poziomie. Ich kurczaki są tak czyste jak nasz bypass.",
    color: "#FED100",
    textColor: "#1A1A1A",
    logo: pollosLogo,
  },
  {
    name: "Drob-Pol",
    slug: "drob-pol",
    category: "Dostawca",
    desc: "Lokalny dostawca, który zapewnia świeży kod prosto z polskiego kurnika.",
    color: "#FFFFFF",
    textColor: "#1A1A1A",
    logo: drobpolLogo,
  },
  {
    name: "Chick-fil-A",
    slug: "chick-fil-a",
    category: "Fast food",
    desc: "Eat mor chicken, frag mor noobs. Amerykański standard wspiera naszego europejskiego kurczaka.",
    color: "#E11446",
    textColor: "#FFFFFF",
    icon: "https://cdn.simpleicons.org/chickfila/ffffff",
  },
  {
    name: "Dave's Hot Chicken",
    slug: "daves-hot-chicken",
    category: "Fast food",
    desc: "Stopień ostrości dopasowany do poziomu ryzyka. Extra hot = extra undetected.",
    color: "#FFF3EC",
    textColor: "#1A1A1A",
    logo: davesLogo,
  },
  {
    name: "Wendy's",
    slug: "wendys",
    category: "Fast food",
    desc: "Świeże, nigdy mrożone — tak jak nasze buildy. Beefy freshness w każdym update.",
    color: "#C8102E",
    textColor: "#FFFFFF",
    icon: "https://cdn.simpleicons.org/wendys/ffffff",
  },
  {
    name: "SpaceX",
    slug: "spacex",
    category: "Technologie",
    desc: "Rakiety ich, nasze chamsy — obie rzeczy latają pod radar. Kosmiczne wsparcie dla elite buildów.",
    color: "#000000",
    textColor: "#FFFFFF",
    icon: "https://cdn.simpleicons.org/spacex/ffffff",
  },
  {
    name: "Twitter",
    slug: "twitter",
    category: "Social media",
    desc: "Tutaj dzieją się dramy, leakują buildy i krzyczą cheaterzy. X oznacza miejsce spotkań naszej społeczności.",
    color: "#000000",
    textColor: "#FFFFFF",
    icon: "https://cdn.simpleicons.org/x/ffffff",
  },
];

function SponsorLogo({ sponsor }: { sponsor: Sponsor }) {
  if (sponsor.logo || sponsor.icon) {
    return (
      <div
        className="flex h-28 w-full items-center justify-center rounded-t-md p-5"
        style={{ backgroundColor: sponsor.color }}
      >
        <img
          src={sponsor.logo ?? sponsor.icon}
          alt={`Logo ${sponsor.name}`}
          loading="lazy"
          className="max-h-full max-w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className="flex h-28 w-full items-center justify-center rounded-t-md"
      style={{ backgroundColor: sponsor.color, color: sponsor.textColor }}
    >
      <span className="text-display text-6xl">{sponsor.initial}</span>
    </div>
  );
}

function Sponsorzy() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-50 border-b border-border glass-bar">
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
            <Link to="/forum" className="transition-colors hover:text-foreground">
              Forum
            </Link>
            <Link to="/sponsorzy" className="text-foreground">
              Sponsorzy
            </Link>
            <Link to="/restauracje" className="transition-colors hover:text-foreground">
              Restauracje
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
        <div className="relative mx-auto max-w-6xl px-5 py-16 md:py-24">
          <span className="inline-block rounded-sm border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Partnerzy
          </span>
          <h1 className="mt-5 text-display text-6xl uppercase sm:text-7xl md:text-8xl">
            Sponsorzy <span className="text-primary">kurczaka</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground">
            ChickenHook nie istniałby bez tych legend. Od fast-foodowych gigantów po kosmicznych
            inżynierów — wszyscy wierzą w moc złotego koguta.
          </p>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-5 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sponsors.map((s) => (
            <article
              key={s.slug}
              className="panel group flex flex-col overflow-hidden rounded-md"
            >
              <SponsorLogo sponsor={s} />
              <div className="flex flex-1 flex-col p-6">
                <span className="w-fit rounded-sm border border-border bg-secondary/50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                  {s.category}
                </span>
                <h2 className="mt-3 text-display text-3xl uppercase">{s.name}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
                <a
                  href={`https://${s.slug === "twitter" ? "x.com" : s.slug === "los-pollos-hermanos" ? "lospolloshermanos.com" : s.slug + ".com"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary transition-colors hover:text-accent"
                >
                  Odwiedź stronę
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-sm border border-dashed border-border bg-card/30 p-8 text-center">
          <p className="text-display text-2xl uppercase">Chcesz dołączyć do kurnika?</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Jeśli twój brand kocha kurczaka tak jak my, napisz do nas na forum.
          </p>
          <Link
            to="/forum"
            className="mt-5 inline-block rounded-sm bucket-gradient px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-bucket)] transition-transform hover:-translate-y-0.5"
          >
            Skontaktuj się przez forum
          </Link>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-5 py-12">
        <p className="text-xs text-muted-foreground">
          Strona parodystyczna, stworzona w celach demonstracyjnych.
        </p>
      </footer>
    </div>
  );
}
