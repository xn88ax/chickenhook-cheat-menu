import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";

import { FeatureDialog } from "@/components/feature-dialog";
import { features as options } from "@/data/features";
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




function Opcje() {
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
            <Link to="/opcje" className="text-foreground">
              Opcje
            </Link>
            <Link to="/forum" className="transition-colors hover:text-foreground">
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
            Pełna lista funkcji
          </span>
          <h1 className="mt-5 text-display text-6xl uppercase sm:text-7xl md:text-8xl">
            Opcje <span className="text-primary">cheata</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground">
            Wszystkie moduły ChickenHook w jednym panelu. Każdą opcję włączasz osobno i
            konfigurujesz pod swój styl gry.
          </p>
        </div>
      </section>


      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {options.map((o) => (
            <div
              key={o.title}
              className="panel group flex flex-col rounded-sm p-6 transition-colors hover:border-primary/50"
            >
              <div className="flex items-start justify-between gap-3">
                <o.icon className="size-7 text-primary transition-transform group-hover:scale-110" />
                {o.restricted && (
                  <span className="inline-flex items-center gap-1.5 rounded-sm border border-primary/40 bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
                    <Lock className="size-3" />
                    Elite + podanie
                  </span>
                )}
              </div>
              <h2 className="mt-4 text-display text-2xl uppercase">{o.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{o.desc}</p>
              <FeatureDialog feature={o} />
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            to="/"
            hash="menu"
            className="rounded-sm bucket-gradient px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-bucket)] transition-transform hover:-translate-y-0.5"
          >
            Zobacz cennik
          </Link>
          <Link
            to="/"
            className="rounded-sm border border-border px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-foreground transition-colors hover:bg-secondary"
          >
            Wróć na start
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
