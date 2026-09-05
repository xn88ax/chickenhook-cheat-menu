import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Lock } from "lucide-react";

import { BanFeed } from "@/components/ban-feed";
import { FeatureDialog } from "@/components/feature-dialog";
import { FeaturePreview } from "@/components/feature-preview";
import { HallOfFame } from "@/components/hall-of-fame";
import { OnlineCounter } from "@/components/online-counter";
import { Shoutbox } from "@/components/shoutbox";
import { builds } from "@/data/changelog";
import { features } from "@/data/features";
import { GsPanel, GsShell } from "@/components/gs-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ChickenHook.ru — Cheaty do CS2 | Aim, ESP, HvH" },
      {
        name: "description",
        content:
          "ChickenHook.ru — private cheat do CS2. Aimbot, ESP, skin changer i pełny bypass. Świeży kod, aktualizacje w 24h.",
      },
      { property: "og:title", content: "ChickenHook.ru — Cheaty do CS2" },
      {
        property: "og:description",
        content: "Aimbot, ESP i bypass do CS2. Undetected od 412 dni.",
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

function Index() {
  return (
    <GsShell>
      <main className="mx-auto max-w-6xl space-y-4 px-5 py-4">
        {/* Banners */}
        <div className="space-y-2">
          <p className="gs-banner px-4 py-2.5 text-center text-xs font-bold">
            Dostępny jest nowy klient — build 4.12.0
          </p>
          <p className="gs-banner px-4 py-2.5 text-center text-xs font-bold">
            Undetected od 412 dni · 0 banów w 2026
          </p>
        </div>

        {/* Announcement */}
        <GsPanel title="Ogłoszenie">
          <div className="px-4 py-3 text-xs leading-relaxed">
            <p className="font-bold text-primary">UWAGA, WAŻNA WIADOMOŚĆ:</p>
            <p className="mt-1 text-muted-foreground">
              Po zakupie subskrypcji załóż ticket na{" "}
              <a href="#faq" className="text-primary hover:underline">
                SUPPORCIE
              </a>
              , aby otrzymać dane do konta i aktywować dostęp. Moduły ryzykowne wymagają{" "}
              <Link to="/podanie" search={{ modul: "" }} className="text-primary hover:underline">
                podania
              </Link>
              .
            </p>
          </div>
        </GsPanel>

        {/* Stats */}
        <GsPanel title="Statystyki">
          <dl className="flex flex-wrap gap-6 px-4 py-3 text-xs">
            {[
              ["Użytkowników", "6 albo 7"],
              ["Banów w 2026", "0"],
              ["Moduły", String(features.length)],
              ["Undetected", "412 dni"],
            ].map(([l, v]) => (
              <div key={l} className="flex items-baseline gap-2">
                <dt className="uppercase tracking-wide text-muted-foreground">{l}</dt>
                <dd className="text-sm font-bold gs-lime">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="border-t border-border">
            <OnlineCounter />
          </div>
        </GsPanel>

        {/* Społeczność */}
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <GsPanel title="Czat społeczności">
            <Shoutbox />
          </GsPanel>
          <GsPanel title="Fala banów — konkurencja">
            <BanFeed />
          </GsPanel>
        </div>

        <GsPanel title="Hall of Fame — top fraggerzy">
          <HallOfFame />
        </GsPanel>

        {/* Ostatni build */}
        <GsPanel title={`Ostatni build — ${builds[0]!.version}`}>
          <div className="px-4 py-3 text-xs">
            <p className="text-muted-foreground">{builds[0]!.date}</p>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              {builds[0]!.notes.slice(0, 3).map((n) => (
                <li key={n}>
                  <span className="mr-2 gs-lime">·</span>
                  {n}
                </li>
              ))}
            </ul>
            <Link to="/changelog" className="mt-2 inline-block text-primary hover:underline">
              Cały changelog →
            </Link>
          </div>
        </GsPanel>


        {/* Features */}
        <GsPanel title="Funkcje" className="scroll-mt-16" >
          <div id="funkcje" className="divide-y divide-border">
            {features.map((f, i) => (
              <article key={f.title} className="group flex gap-3 px-4 py-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center border border-border bg-secondary text-primary">
                  <f.icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="flex items-center gap-2 text-sm font-bold">
                    <span className="truncate">{f.title}</span>
                    {f.restricted ? (
                      <span className="inline-flex shrink-0 items-center gap-1 border border-primary/50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary">
                        <Lock className="size-2.5" />
                        Elite + podanie
                      </span>
                    ) : (
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    )}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{f.desc}</p>
                  <FeaturePreview kind={f.preview} />
                  <FeatureDialog feature={f} />
                </div>
              </article>
            ))}
          </div>
        </GsPanel>

        {/* Pricing */}
        <GsPanel title="Cennik">
          <div id="menu" className="divide-y divide-border">
            {menu.map((p) => (
              <div key={p.name} className="px-4 py-3">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="text-sm font-bold uppercase">{p.name}</h3>
                  <span className="text-sm font-bold gs-lime">{p.price} zł</span>
                  <span className="text-xs text-muted-foreground">{p.period}</span>
                  <span
                    className={`ml-auto px-2 py-0.5 text-[10px] font-bold uppercase ${
                      p.featured
                        ? "bucket-gradient text-primary-foreground"
                        : "border border-border text-muted-foreground"
                    }`}
                  >
                    {p.tag}
                  </span>
                </div>
                <ul className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                  {p.items.map((it) => (
                    <li key={it} className="flex gap-1.5">
                      <Check className="mt-0.5 size-3 shrink-0 text-primary" />
                      {it}
                    </li>
                  ))}
                </ul>
                <a
                  href="#faq"
                  className="mt-3 inline-block bucket-gradient px-3 py-1.5 text-[11px] font-bold uppercase text-primary-foreground"
                >
                  Wybieram {p.name}
                </a>
              </div>
            ))}
          </div>
        </GsPanel>

        {/* Status */}
        <GsPanel title="Status bezpieczeństwa">
          <div id="status" className="divide-y divide-border">
            {[
              ["ChickenHook — CS2 Premier", "Undetected", true],
              ["ChickenHook — CS2 Faceit", "Undetected", true],
              ["ChickenHook — HvH build", "Undetected", true],
              ["ChickenHook — Legacy CS:GO", "W remoncie", false],
            ].map(([name, status, ok]) => (
              <div
                key={name as string}
                className="flex items-center justify-between px-4 py-2.5 text-xs"
              >
                <span className="font-semibold">{name as string}</span>
                <span
                  className={`flex items-center gap-2 font-bold uppercase ${
                    ok ? "gs-lime" : "text-muted-foreground"
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${ok ? "bg-primary" : "bg-muted-foreground"}`}
                  />
                  {status as string}
                </span>
              </div>
            ))}
          </div>
        </GsPanel>

        {/* Opinie */}
        <GsPanel title="Eksperci o ChickenHook">
          <div className="divide-y divide-border">
            {[
              {
                name: "Magda Gessler",
                role: "Jurorka, restauratorka",
                quote:
                  "Ten aimbot jest jak idealnie usmażony filet — złoty z zewnątrz, soczysty w środku. A ten ESP? Widzę wszystko. 10/10, ale więcej czosnku.",
                initial: "MG",
              },
              {
                name: "Gordon Ramsay",
                role: "Szef kuchni, telewizyjna legenda",
                quote:
                  "Finally, a cheat with some actual flavour! The HvH config? Absolutely stunning. The bunnyhop? Crispy. ChickenHook — f*cking delicious.",
                initial: "GR",
              },
            ].map((t) => (
              <div key={t.name} className="flex gap-3 px-4 py-3">
                <span className="flex size-9 shrink-0 items-center justify-center bucket-gradient text-xs font-bold text-primary-foreground">
                  {t.initial}
                </span>
                <div className="min-w-0">
                  <p className="text-xs leading-relaxed">“{t.quote}”</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    <span className="font-bold text-primary">{t.name}</span> · {t.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GsPanel>

        {/* Opinie klientów — parodia recenzji z Trustpilot */}
        <GsPanel title="Opinie klientów">
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <span className="text-2xl font-extrabold text-primary">4,9</span>
            <div>
              <p className="text-xs tracking-wide text-primary">★★★★★</p>
              <p className="text-[11px] text-muted-foreground">Na podstawie 39 opinii · TrustBucket</p>
            </div>
          </div>
          <div className="divide-y divide-border">
            {[
              {
                name: "Marci",
                date: "14 maja 2026",
                stars: 5,
                text: "Zapłaciłem 250 zł za invite i 25 zł za suba. Loader wstrzykuje się w 10 sekund, admini odpisują na Discordzie zanim zdążę napisać pytanie. Warto każdej złotówki.",
              },
              {
                name: "HitP",
                date: "19 lipca 2026",
                stars: 5,
                text: "Jedyne prawdziwe chickenhook.ru — nie mylić z podróbkami, które sprzedają invite'y i liczą, że ktoś się pomyli. Tutaj wszystko działa od pierwszego kliknięcia.",
              },
              {
                name: "Maximilian",
                date: "24 lipca 2026",
                stars: 4,
                text: "Dostałem invite od znajomego i od razu kupiłem subskrypcję. Płatność nie była błyskawiczna, ale po 10 minutach miałem suba, loader odpalony i config załadowany. Polecam.",
              },
              {
                name: "bolek tolek",
                date: "1 lipca 2026",
                stars: 5,
                text: "TO JEST PRAWDZIWE, to nie jest żaden scam jak tamte inne strony co używają dobrego imienia. Kupiłem invite i gram do dziś, zero banów.",
              },
              {
                name: "Usama Khan",
                date: "22 grudnia 2025",
                stars: 5,
                text: "Kupiłem cfg od jednego z memberów i jest legit. Smooth aim, legit bot czuć jak tylko aim assist. 10/10, nie zmarnujecie pieniędzy.",
              },
            ].map((r) => (
              <div key={r.name + r.date} className="px-4 py-3">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="text-xs font-bold">{r.name}</span>
                  <span className="text-[11px] tracking-wide text-primary">
                    {"★".repeat(r.stars)}
                    <span className="text-muted-foreground">{"★".repeat(5 - r.stars)}</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground">{r.date}</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{r.text}</p>
              </div>
            ))}
          </div>
        </GsPanel>

        {/* FAQ */}
        <GsPanel title="FAQ">
          <div id="faq" className="divide-y divide-border">
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
                "Windows 10/11, wyłączony Secure Boot i 5 minut na konfigurację.",
              ],
              [
                "Czy mogę zmienić plan?",
                "Tak, w ciągu 48 godzin dopłacasz różnicę i przechodzisz na wyższy plan.",
              ],
            ].map(([q, a]) => (
              <details key={q} className="group px-4 py-2.5">
                <summary className="cursor-pointer list-none text-xs font-bold group-open:text-primary">
                  {q}
                </summary>
                <p className="mt-1.5 text-xs text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </GsPanel>
      </main>
    </GsShell>
  );
}
