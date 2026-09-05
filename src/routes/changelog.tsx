import { createFileRoute } from "@tanstack/react-router";

import { GsPanel, GsShell } from "@/components/gs-shell";
import { builds } from "@/data/changelog";

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: "Changelog buildów — ChickenHook.ru | CS2" },
      {
        name: "description",
        content:
          "Lista zmian w kolejnych buildach ChickenHook: co naprawiliśmy, co dodaliśmy i co zepsuliśmy po drodze.",
      },
      { property: "og:title", content: "Changelog buildów — ChickenHook.ru" },
      {
        property: "og:description",
        content: "Build 4.12.0 i wcześniejsze — pełna historia zmian naszego kurczaka.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Changelog,
});

function Changelog() {
  return (
    <GsShell crumbs={[{ label: "Changelog" }]}>
      <main className="mx-auto max-w-4xl space-y-4 px-5 py-4">
        <p className="gs-banner px-4 py-2.5 text-center text-xs font-bold">
          Aktualny build: 4.12.0 · aktualizacje po każdym patchu Valve
        </p>

        <h1 className="sr-only">Changelog ChickenHook</h1>

        {builds.map((b) => (
          <GsPanel key={b.version} title={`Build ${b.version}`}>
            <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-2 text-[11px]">
              <span className="text-muted-foreground">{b.date}</span>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                  b.tag === "Aktualny"
                    ? "bucket-gradient text-primary-foreground"
                    : "border border-border text-muted-foreground"
                }`}
              >
                {b.tag}
              </span>
            </div>
            <ul className="divide-y divide-border">
              {b.notes.map((n) => (
                <li key={n} className="px-4 py-2 text-xs text-muted-foreground">
                  <span className="mr-2 gs-lime">·</span>
                  {n}
                </li>
              ))}
            </ul>
          </GsPanel>
        ))}
      </main>
    </GsShell>
  );
}
