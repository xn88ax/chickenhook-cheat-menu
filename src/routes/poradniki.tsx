import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";

import { GsPanel, GsShell } from "@/components/gs-shell";
import { guides } from "@/data/guides";

export const Route = createFileRoute("/poradniki")({
  head: () => ({
    meta: [
      { title: "Poradniki dla kurczaków — chickenhook.wtf" },
      {
        name: "description",
        content:
          "Poradniki ChickenHook: jak nie dostać bana, HvH dla początkujących, aim jak Magda Gessler i pierwsze kroki po zakupie.",
      },
      { property: "og:title", content: "Poradniki — chickenhook.wtf" },
      {
        property: "og:description",
        content: "Krótkie, żartobliwe poradniki o cheatach w CS2 — od pierwszego configu po etykietę w HvH.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Poradniki,
});

function Poradniki() {
  return (
    <GsShell crumbs={[{ label: "Poradniki" }]}>
      <main className="mx-auto max-w-4xl space-y-4 px-5 py-4">
        <p className="gs-banner px-4 py-2.5 text-center text-xs font-bold">
          Baza wiedzy kurnika — {guides.length} poradniki, zero odpowiedzialności
        </p>

        <GsPanel title="Poradniki">
          <h1 className="sr-only">Poradniki ChickenHook</h1>
          <div className="divide-y divide-border">
            {guides.map((g) => (
              <article key={g.slug} className="px-4 py-3">
                <h2 className="text-sm font-bold">
                  <Link
                    to="/poradniki/$slug"
                    params={{ slug: g.slug }}
                    className="hover:text-primary"
                  >
                    {g.title}
                  </Link>
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">{g.excerpt}</p>
                <p className="mt-1.5 flex flex-wrap items-center gap-x-3 text-[11px] text-muted-foreground">
                  <span className="font-bold text-primary">{g.author}</span>
                  <span>{g.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {g.readTime}
                  </span>
                </p>
              </article>
            ))}
          </div>
        </GsPanel>
      </main>
    </GsShell>
  );
}
