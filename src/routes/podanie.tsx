import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Lock, ShieldAlert } from "lucide-react";

import { features } from "@/data/features";
import { SiteHeader } from "@/components/site-header";


export const Route = createFileRoute("/podanie")({
  validateSearch: (search: Record<string, unknown>) => ({
    modul: typeof search.modul === "string" ? search.modul : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Podanie o moduły Elite — ChickenHook.ru" },
      {
        name: "description",
        content:
          "Złóż podanie o dostęp do modułów Elite ChickenHook: tryb boga, brak klipu, teleport, awaria serwera i glitch kasy.",
      },
      { property: "og:title", content: "Podanie o moduły Elite — ChickenHook.ru" },
      {
        property: "og:description",
        content: "Moduły ryzykowne dostajesz tylko w planie Elite i po zaakceptowanym podaniu.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/podanie" }],
  }),
  component: Podanie,
});

const restricted = features.filter((f) => f.restricted);

function Podanie() {
  const { modul } = Route.useSearch();
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <SiteHeader />


      <section className="mx-auto max-w-3xl px-5 py-16">
        <span className="inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          <Lock className="size-3.5" />
          Tylko Elite
        </span>
        <h1 className="mt-5 text-display text-5xl md:text-6xl">
          Podanie o <span className="text-primary">moduły ryzykowne</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          Moduły takie jak tryb boga, brak klipu, teleport, awaria serwera i glitch kasy są
          dostępne wyłącznie w planie <strong className="text-foreground">Elite</strong> i dopiero
          po ręcznej weryfikacji. Wypełnij podanie — odpowiadamy zwykle w 24 h.
        </p>

        <div className="panel mt-8 flex gap-3 rounded-xl p-5 text-sm text-muted-foreground">
          <ShieldAlert className="mt-0.5 size-5 shrink-0 text-primary" />
          <p>
            Weryfikujemy staż konta, historię banów i przeznaczenie modułu. Podania pod publiczne
            serwery Valve odrzucamy z automatu.
          </p>
        </div>

        {sent ? (
          <div className="panel mt-8 flex flex-col items-start gap-3 rounded-xl p-8">
            <CheckCircle2 className="size-8 text-primary" />
            <h2 className="text-display text-3xl ">Podanie wysłane</h2>
            <p className="text-sm text-muted-foreground">
              Dostaniesz decyzję na Discordzie. Do tego czasu moduły pozostają zablokowane w
              loaderze.
            </p>
            <Link
              to="/opcje"
              className="mt-2 rounded-xl border border-border px-5 py-2.5 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-secondary"
            >
              Wróć do opcji
            </Link>
          </div>
        ) : (
          <form
            className="panel mt-8 space-y-5 rounded-xl p-7"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-semibold uppercase tracking-wide">Nick / Discord</span>
                <input
                  required
                  name="nick"
                  className="glass-focus mt-2 w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm outline-none"
                  placeholder="adam#0001"
                />
              </label>
              <label className="block text-sm">
                <span className="font-semibold uppercase tracking-wide">Staż w CS2</span>
                <input
                  required
                  name="staz"
                  className="glass-focus mt-2 w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm outline-none"
                  placeholder="np. 4000 h, 18k ELO"
                />
              </label>
            </div>

            <fieldset className="text-sm">
              <legend className="font-semibold uppercase tracking-wide">
                O które moduły wnioskujesz
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {restricted.map((f) => (
                  <label
                    key={f.slug}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border bg-background/40 px-3 py-2.5 transition-colors hover:border-primary/50"
                  >
                    <input
                      type="checkbox"
                      name="moduly"
                      value={f.slug}
                      defaultChecked={modul === f.slug}
                      className="size-4 accent-[hsl(var(--primary))]"
                    />
                    <f.icon className="size-4 text-primary" />
                    <span>{f.title}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="block text-sm">
              <span className="font-semibold uppercase tracking-wide">Uzasadnienie</span>
              <textarea
                required
                name="uzasadnienie"
                rows={5}
                className="glass-focus mt-2 w-full resize-y rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm outline-none"
                placeholder="Gdzie i po co chcesz używać modułu (własny serwer, mapa treningowa, testy configów)…"
              />
            </label>

            <label className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <input required type="checkbox" className="mt-1 size-4 accent-[hsl(var(--primary))]" />
              <span>
                Rozumiem, że moduły ryzykowne wymagają planu Elite, a złamanie zasad kończy się
                odebraniem dostępu bez zwrotu.
              </span>
            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-secondary px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-bucket)] transition-transform hover:-translate-y-0.5"
            >
              Wyślij podanie
            </button>
          </form>
        )}
      </section>

      <footer className="mx-auto max-w-6xl px-5 py-12">
        <p className="text-xs text-muted-foreground">
          Strona parodystyczna, stworzona w celach demonstracyjnych.
        </p>
      </footer>
    </div>
  );
}
