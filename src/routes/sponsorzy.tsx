import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

import chickenhookLogo from "@/assets/chickenhook-logo.png.asset.json";
import mualaLogo from "@/assets/muala-logo.png.asset.json";
import pollosLogo from "@/assets/logo-pollos.png";
import drobpolLogo from "@/assets/logo-drobool.png";
import davesLogo from "@/assets/logo-daves.png";
import pepsiLogo from "@/assets/logo-pepsi.png";
import popeyesLogo from "@/assets/logo-popeyes.png";
import chickfilaLogo from "@/assets/logo-chickfila.png";
import wendysLogo from "@/assets/logo-wendys.png";
import twitterLogo from "@/assets/logo-twitter.png.asset.json";
import totalcasinoLogo from "@/assets/totalcasino.png";
import stakeLogo from "@/assets/stake.png";
import trumpLogo from "@/assets/trump.jpg";
import marshmelloLogo from "@/assets/marshmello.jpg";

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
    color: "#F0F4FA",
    textColor: "#1A1A1A",
    logo: pepsiLogo,
  },
  {
    name: "Popeyes",
    slug: "popeyes",
    category: "Fast food",
    desc: "Pikantne stripsy i jeszcze pikantsze configi do HvH. Louisiana flavor w każdym fragu.",
    color: "#FFF4E0",
    textColor: "#1A1A1A",
    logo: popeyesLogo,
  },
  {
    name: "MUALA",
    slug: "muala",
    category: "Partner strategiczny",
    desc: "Nowy, tajny składnik w naszym sosie. MUALA to brand, który rozumie chicken game na poważnie.",
    color: "#FFFFFF",
    textColor: "#1A1A1A",
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
    color: "#FFF0F2",
    textColor: "#1A1A1A",
    logo: chickfilaLogo,
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
    color: "#FFF0F2",
    textColor: "#1A1A1A",
    logo: wendysLogo,
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
    logo: twitterLogo.url,
  },
  {
    name: "Stake",
    slug: "stake",
    category: "Rozrywka",
    desc: "Stawia na naszego kurczaka w każdym meczu. High risk, high reward — tak jak nasz elite build.",
    color: "#0F212E",
    textColor: "#FFFFFF",
    logo: stakeLogo,
  },
  {
    name: "Total Casino",
    slug: "totalcasino",
    category: "Rozrywka",
    desc: "Legalne polskie kasyno wspiera legalnie niedostępnego cheata. Jackpot to u nas pełny magazynek.",
    color: "#FFFFFF",
    textColor: "#1A1A1A",
    logo: totalcasinoLogo,
  },
  {
    name: "AliExpress",
    slug: "aliexpress",
    category: "E-commerce",
    desc: "Dostarcza nam tanie konta do testów. Wysyłka 30 dni, ban w 30 sekund.",
    color: "#E62E04",
    textColor: "#FFFFFF",
    icon: "https://cdn.simpleicons.org/aliexpress/ffffff",
  },
  {
    name: "Żabka",
    slug: "zabka",
    category: "Handel",
    desc: "Żabka na rogu zawsze otwarta — tak jak nasze menu w grze. Hot-dog i headshot o 3 w nocy.",
    color: "#00833E",
    textColor: "#FFFFFF",
    icon: "https://cdn.simpleicons.org/zabka/ffffff",
  },
  {
    name: "Telegram",
    slug: "telegram",
    category: "Komunikacja",
    desc: "Tutaj lecą prywatne buildy i invite'y. Szyfrowane czaty dla szyfrowanego kodu.",
    color: "#26A5E4",
    textColor: "#FFFFFF",
    icon: "https://cdn.simpleicons.org/telegram/ffffff",
  },
  {
    name: "WhatsApp",
    slug: "whatsapp",
    category: "Komunikacja",
    desc: "Grupa 'Kurnik Elite' — tam koordynujemy queue na Mirage. Mama też tam jest, ale nie wie.",
    color: "#25D366",
    textColor: "#FFFFFF",
    icon: "https://cdn.simpleicons.org/whatsapp/ffffff",
  },
  {
    name: "Donald John Trump",
    slug: "donaldjtrump",
    category: "VIP",
    desc: "Make ChickenHook Great Again. Mówi, że nasz aimbot to najlepszy aimbot w historii — wszyscy to mówią.",
    color: "#1A1A2E",
    textColor: "#FFFFFF",
    logo: trumpLogo,
  },
  {
    name: "Marshmello",
    slug: "marshmello",
    category: "Muzyka",
    desc: "Grał na Fortnite, teraz buja się z nami w CS2. Kask na głowie, chamsy na ekranie.",
    color: "#F5F5F5",
    textColor: "#1A1A1A",
    logo: marshmelloLogo,
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
    <GsShell crumbs={[{ label: "Sponsorzy" }]}>
      <main className="mx-auto max-w-6xl space-y-4 px-5 py-4">
        <p className="gs-banner px-4 py-2.5 text-center text-xs font-bold">
          Partnerzy ChickenHook — dziękujemy za wsparcie kurnika
        </p>

        <GsPanel title="Sponsorzy">
        <div className="p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

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
