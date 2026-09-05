import { createFileRoute } from "@tanstack/react-router";

import { GsPanel, GsShell } from "@/components/gs-shell";
import { merch } from "@/data/merch";

export const Route = createFileRoute("/sklep")({
  head: () => ({
    meta: [
      { title: "Sklep z merchem — ChickenHook.ru" },
      {
        name: "description",
        content:
          "Koszulki, kubki, naklejki i poduszki-kurczaki ChickenHook. Wszystko wyprzedane albo tylko dla planu Elite.",
      },
      { property: "og:title", content: "Sklep z merchem — ChickenHook.ru" },
      {
        property: "og:description",
        content: "Merch kurnika: koszulki, kubki, naklejki. Nic nie da się kupić i to jest część żartu.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Sklep,
});

const badge: Record<string, string> = {
  Wyprzedane: "border border-border text-muted-foreground",
  "Tylko Elite": "border border-primary/60 text-primary",
  "Zaginęło w transporcie": "border border-border gs-gold",
};

function Sklep() {
  return (
    <GsShell crumbs={[{ label: "Sklep" }]}>
      <main className="mx-auto max-w-6xl space-y-4 px-5 py-4">
        <p className="gs-banner px-4 py-2.5 text-center text-xs font-bold">
          Sklep kurnika — magazyn pusty od 2024 roku
        </p>

        <GsPanel title="Merch">
          <h1 className="sr-only">Sklep z merchem ChickenHook</h1>
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {merch.map((m) => (
              <article key={m.name} className="gs-panel flex flex-col p-4">
                <span className="text-3xl" aria-hidden="true">
                  {m.emoji}
                </span>
                <h2 className="mt-2 text-xs font-bold">{m.name}</h2>
                <p className="mt-1 flex-1 text-[11px] text-muted-foreground">{m.desc}</p>
                <p className="mt-2 text-sm font-bold gs-lime">{m.price}</p>
                <span
                  className={`mt-2 inline-block px-2 py-0.5 text-center text-[10px] font-bold uppercase ${badge[m.status]}`}
                >
                  {m.status}
                </span>
                <button
                  type="button"
                  disabled
                  className="mt-2 border border-border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground opacity-60"
                >
                  Do koszyka
                </button>
              </article>
            ))}
          </div>
          <p className="border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
            Sklep jest częścią parodii — żaden produkt nie istnieje i nie da się nic zamówić.
          </p>
        </GsPanel>
      </main>
    </GsShell>
  );
}
