import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronRight, X } from "lucide-react";

import adamAsset1 from "@/assets/adam-kurczak.jpg.asset.json";
import adamAsset2 from "@/assets/adam-kurczak-2.jpg.asset.json";
import adamAsset3 from "@/assets/adam-kurczak-3.jpg.asset.json";
import chickenAsset from "@/assets/chicken.png.asset.json";

const ADAM_IMAGES = [adamAsset1.url, adamAsset2.url, adamAsset3.url];
import { BanFeed } from "@/components/ban-feed";
import { FeatureDialog } from "@/components/feature-dialog";
import { OppList } from "@/components/opp-list";
import { OnlineCounter } from "@/components/online-counter";
import { Shoutbox } from "@/components/shoutbox";
import { Button } from "@/components/ui/button";
import { builds } from "@/data/changelog";
import { features } from "@/data/features";
import { GsPanel, GsShell } from "@/components/gs-shell";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "chickenhook" },
    { name: "description", content: "chikn" },
    { property: "og:title", content: "chickenhook" },
    { property: "og:description", content: "chikn" },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "https://chickenhook-cheat-menu.lovable.app/og.gif" },
    { property: "og:image:type", content: "image/gif" },
    { property: "og:image:width", content: "320" },
    { property: "og:image:height", content: "313" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: "https://chickenhook-cheat-menu.lovable.app/og.gif" },
  ] }),
  component: Index,
});

const plans = [
  { name: "Solo", price: "39", period: "7 dni", tag: "Na start", items: ["Aimbot z smoothem", "Box ESP + HP", "Radar hack"] },
  { name: "Premium", price: "89", period: "30 dni", tag: "Najczęściej brany", featured: true, items: ["Wszystko z Solo", "Skeleton ESP + glow", "Triggerbot i backtrack"] },
  { name: "Elite", price: "249", period: "lifetime", tag: "Pełny dostęp", items: ["Wszystko z Premium", "HvH ready config", "Moduły po podaniu"] },
];

const faq = [
  ["Czy dostanę bana?", "Nasz loader jest aktualizowany po każdym patchu. Zero banów od stycznia 2026 — ale zawsze graj z głową."],
  ["Jak szybko dostanę dostęp?", "Loader i klucz lądują na Twoim koncie natychmiast po opłaceniu zamówienia."],
  ["Jakie są wymagania?", "Windows 10/11, wyłączony Secure Boot i około 5 minut na konfigurację."],
  ["Czy mogę zmienić plan?", "Tak, w ciągu 48 godzin dopłacasz różnicę i przechodzisz na wyższy plan."],
] as const;

type Chicken = { id: number; x: number; y: number; rotation: number; size: number };

const ADAM_CODE = "adam kurczak";

function Index() {
  const [bannerOpen, setBannerOpen] = useState(true);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [chickens, setChickens] = useState<Chicken[]>([]);
  const [adamFlashUrl, setAdamFlashUrl] = useState<string | null>(null);
  const adamBuffer = useRef("");
  const adamTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("banners-closed")) setBannerOpen(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "a" || e.key === "A") {
        const id = Date.now() + Math.random();
        const x = Math.random() * 90 + 5;
        const y = Math.random() * 80 + 10;
        const rotation = Math.random() * 360;
        const size = 28 + Math.random() * 36;
        setChickens((prev) => [...prev, { id, x, y, rotation, size }]);
        setTimeout(() => setChickens((prev) => prev.filter((c) => c.id !== id)), 2500);
      }

      const target = e.target as HTMLElement;
      const isTyping = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable);
      if (isTyping) return;

      if (e.key.length === 1) {
        adamBuffer.current += e.key.toLowerCase();
        if (adamBuffer.current.length > ADAM_CODE.length) {
          adamBuffer.current = adamBuffer.current.slice(-ADAM_CODE.length);
        }
        if (adamBuffer.current.endsWith(ADAM_CODE)) {
          adamBuffer.current = "";
          const url = ADAM_IMAGES[Math.floor(Math.random() * ADAM_IMAGES.length)];
          setAdamFlashUrl(url);
          setTimeout(() => setAdamFlashUrl(null), 100);
        }
        if (adamTimer.current) clearTimeout(adamTimer.current);
        adamTimer.current = setTimeout(() => { adamBuffer.current = ""; }, 1500);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <GsShell>
      {chickens.map((c) => (
        <img
          key={c.id}
          src={chickenAsset.url}
          alt=""
          aria-hidden="true"
          className="pointer-events-none fixed z-50 animate-fade-in"
          style={{ left: `${c.x}vw`, top: `${c.y}vh`, width: c.size, transform: `rotate(${c.rotation}deg)` }}
        />
      ))}
      {adamFlashUrl &&
        createPortal(
          <img
            src={adamFlashUrl}
            alt=""
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[99999] h-full w-full object-cover"
          />,
          document.body,
        )}
      <main className="mx-auto max-w-[1160px] space-y-6 px-5 py-6">
        {bannerOpen && (
          <div className="gs-banner flex min-h-11 flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2.5 pr-12 text-[13px]">
            <strong>Nowy klient · build 4.12.0</strong>
            <span className="text-muted-foreground"><span className="text-[var(--status-ok)]">Undetected 412 dni</span> · 0 banów 2026</span>
            <Link to="/changelog" className="font-medium text-primary hover:text-accent">Changelog →</Link>
            <Button variant="ghost" size="icon" aria-label="Zamknij ogłoszenie" onClick={() => { sessionStorage.setItem("banners-closed", "1"); setBannerOpen(false); }} className="absolute right-[max(1.25rem,calc((100%-1160px)/2+1.25rem))] size-8 text-muted-foreground hover:text-foreground"><X /></Button>
          </div>
        )}

        <section className="gs-panel border-l-2 border-l-primary px-4 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-primary">Ogłoszenie</p>
          <h1 className="mt-1 text-[13px] font-semibold">Nowy build jest gotowy do pobrania.</h1>
          <p className="mt-1 text-sm text-muted-foreground">Po zakupie załóż ticket na <a href="#faq" className="text-primary hover:text-accent">supporcie</a>, aby aktywować dostęp. Moduły ryzykowne wymagają <Link to="/podanie" search={{ modul: "" }} className="text-primary hover:text-accent">podania</Link>.</p>
        </section>

        <section aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">Statystyki</h2>
          <dl className="grid grid-cols-2 gap-3 min-[860px]:grid-cols-4">
            {[["6–7", "użytkowników"], ["0", "bany 2026"], [String(features.length), "moduły"], ["412", "dni"]].map(([value, label]) => (
              <div key={label} className="gs-panel px-4 py-4">
                <dd className="text-[28px] font-bold leading-none text-foreground">{value}</dd>
                <dt className="mt-2 text-[11px] uppercase tracking-[0.08em] text-[var(--text-subtle)]">{label}</dt>
              </div>
            ))}
          </dl>
          <div className="gs-panel mt-3"><OnlineCounter /></div>
        </section>

        <div className="grid gap-4 min-[860px]:grid-cols-[1.4fr_1fr]">
          <GsPanel title="Shoutbox"><Shoutbox /></GsPanel>
          <GsPanel title="Fala banów — konkurencja"><BanFeed /></GsPanel>
        </div>

        <GsPanel title="Lista oppsów — zbanowani"><OppList /></GsPanel>

        <div className="grid gap-4 min-[860px]:grid-cols-[1.4fr_1fr]">
          <GsPanel title="Funkcje">
            <div id="funkcje" className="grid gap-px bg-border min-[680px]:grid-cols-3">
              {features.slice(0, 3).map((feature) => (
                <article key={feature.slug} className="flex min-h-48 flex-col bg-card p-4">
                  <div className="flex items-center justify-between gap-2">
                    <feature.icon className="size-5 text-muted-foreground" />
                    <span className={`rounded border px-2 py-0.5 text-[10px] uppercase ${feature.restricted ? "border-primary/40 text-primary" : "border-border text-muted-foreground"}`}>{feature.restricted ? "Elite" : "Standard"}</span>
                  </div>
                  <h3 className="mt-4 text-sm font-semibold">{feature.title}</h3>
                  <p className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground">{feature.desc}</p>
                  <FeatureDialog feature={feature} />
                </article>
              ))}
            </div>
            <div className="border-t border-border px-4 py-3"><Link to="/opcje" className="text-xs font-semibold text-primary hover:text-accent">Wszystkie {features.length} modułów →</Link></div>
          </GsPanel>

          <GsPanel title={`Ostatni build — ${builds[0]?.version ?? "4.12.0"}`}>
            <div className="p-4 text-sm">
              <p className="text-xs text-[var(--text-subtle)]">{builds[0]?.date}</p>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                {builds[0]?.notes.slice(0, 3).map((note) => <li key={note} className="flex gap-2"><span className="text-primary">·</span>{note}</li>)}
              </ul>
              <Link to="/changelog" className="mt-4 inline-block text-xs font-semibold text-primary hover:text-accent">Cały changelog →</Link>
            </div>
          </GsPanel>
        </div>

        <GsPanel title="Cennik">
          <div id="menu" className="grid gap-px bg-border min-[760px]:grid-cols-3">
            {plans.map((plan) => (
              <article key={plan.name} className="flex flex-col bg-card p-4">
                <div className="flex items-center justify-between gap-2"><h3 className="font-semibold">{plan.name}</h3><span className="text-[10px] uppercase text-[var(--text-subtle)]">{plan.tag}</span></div>
                <p className="mt-3"><strong className="text-2xl">{plan.price} zł</strong> <span className="text-xs text-muted-foreground">/ {plan.period}</span></p>
                <ul className="my-4 flex-1 space-y-2 text-xs text-muted-foreground">{plan.items.map((item) => <li key={item} className="flex gap-2"><Check className="size-3.5 text-[var(--status-ok)]" />{item}</li>)}</ul>
                <Button asChild variant={plan.featured ? "default" : "outline"} className="rounded-lg"><a href="#faq">Wybieram {plan.name}</a></Button>
              </article>
            ))}
          </div>
        </GsPanel>

        <GsPanel title="Status bezpieczeństwa">
          <div id="status" className="grid gap-px bg-border sm:grid-cols-2 min-[900px]:grid-cols-4">
            {["CS2 Premier", "CS2 Faceit", "HvH build", "Legacy CS:GO"].map((name, i) => (
              <div key={name} className="bg-card p-4"><p className="text-xs font-semibold">{name}</p><p className={`mt-2 flex items-center gap-2 text-xs ${i < 3 ? "text-[var(--status-ok)]" : "text-muted-foreground"}`}><span className={`size-2 rounded-full ${i < 3 ? "bg-[var(--status-ok)]" : "bg-muted-foreground"}`} />{i < 3 ? "Undetected" : "W remoncie"}</p></div>
            ))}
          </div>
        </GsPanel>

        <GsPanel title="Opinie">
          <div className="grid gap-px bg-border min-[760px]:grid-cols-3">
            {[
              ["Magda Gessler", "ESP? Widzę wszystko. 10/10, ale więcej czosnku."],
              ["Gordon Ramsay", "The bunnyhop is crispy. Finally, some flavour."],
              ["Adam Kurczak", "Wszedłem po config, zostałem dla shoutboxa."],
            ].map(([name, quote]) => <blockquote key={name} className="bg-card p-4 text-sm"><p className="text-muted-foreground">„{quote}”</p><footer className="mt-3 text-xs font-semibold text-primary">{name}</footer></blockquote>)}
          </div>
        </GsPanel>

        <section id="faq" aria-labelledby="faq-heading">
          <p className="mb-3 text-[11px] uppercase tracking-[0.12em] text-[var(--text-subtle)]">Demo · strona parodystyczna</p>
          <GsPanel title="FAQ">
            <div>
              {faq.map(([question, answer], index) => {
                const open = faqOpen === index;
                return <div key={question} className={`border-b border-border last:border-0 ${open ? "bg-muted/40" : ""}`}>
                  <Button variant="ghost" onClick={() => setFaqOpen(open ? null : index)} aria-expanded={open} className="h-auto w-full justify-between rounded-none px-4 py-3.5 text-left text-[15px] font-medium hover:bg-muted">
                    {question}<ChevronRight className={`size-3.5 transition-transform ${open ? "rotate-90" : ""}`} />
                  </Button>
                  {open && <p className="px-4 pb-3.5 text-sm text-muted-foreground">{answer}</p>}
                </div>;
              })}
            </div>
          </GsPanel>
        </section>
      </main>
    </GsShell>
  );
}
