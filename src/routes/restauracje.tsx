import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { GsPanel, GsShell } from "@/components/gs-shell";
import { Car, Clock, MapPin, Search, Truck, Utensils, X } from "lucide-react";


export const Route = createFileRoute("/restauracje")({
  head: () => ({
    meta: [
      { title: "Restauracje KFC — chickenhook.wtf | Lokalizacje" },
      {
        name: "description",
        content:
          "Znajdź restaurację KFC w swoim mieście — adresy, godziny otwarcia, drive-thru, dostawa i całodobowe lokale. Wyszukiwarka lokalizacji ChickenHook.",
      },
      { property: "og:title", content: "Restauracje KFC — chickenhook.wtf" },
      {
        property: "og:description",
        content:
          "Lista lokalizacji KFC w Polsce z godzinami otwarcia, drive-thru i dostawą. Wybierz miasto i znajdź swój kurnik.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Restauracje,
});

import { kfcRestaurants, type KfcTag as Tag } from "@/data/kfc";

const restaurants = kfcRestaurants;

const tagLabels: Record<Tag, { label: string; icon: typeof Car }> = {
  drive: { label: "Drive-thru", icon: Car },
  dostawa: { label: "Dostawa", icon: Truck },
  "24h": { label: "24h", icon: Clock },
  sala: { label: "Sala na miejscu", icon: Utensils },
};

const countByCity = restaurants.reduce<Record<string, number>>((acc, r) => {
  acc[r.city] = (acc[r.city] ?? 0) + 1;
  return acc;
}, {});

const allCities = Object.keys(countByCity).sort((a, b) => a.localeCompare(b, "pl"));
const topCities = Object.keys(countByCity)
  .sort((a, b) => countByCity[b] - countByCity[a] || a.localeCompare(b, "pl"))
  .slice(0, 12);
const cities = ["Wszystkie", ...topCities];


function Restauracje() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("Wszystkie");
  const [tag, setTag] = useState<Tag | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return restaurants.filter((r) => {
      if (city !== "Wszystkie" && r.city !== city) return false;
      if (tag && !r.tags.includes(tag)) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q)
      );
    });
  }, [query, city, tag]);

  return (
    <GsShell crumbs={[{ label: "Restauracje" }]}>
      <main className="mx-auto max-w-6xl space-y-4 px-5 py-4">
        <p className="gs-banner px-4 py-2.5 text-center text-xs font-bold">
          Lokalizacje kurników — drive-thru, dostawa i lokale 24h
        </p>

        <GsPanel title="Restauracje">
        <div className="p-4">
        <div className="border-b border-border pb-4">

          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Szukaj miasta, adresu lub restauracji…"
              aria-label="Szukaj restauracji"
              className="w-full rounded-sm border border-border bg-card/50 py-2.5 pl-9 pr-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Wyczyść wyszukiwanie"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {cities.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCity(c)}
                className={`rounded-sm border px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                  city === c
                    ? "border-primary/60 bg-primary/15 text-primary"
                    : "border-border bg-card/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
                {c !== "Wszystkie" && (
                  <span className="ml-1.5 text-muted-foreground">
                    {restaurants.filter((r) => r.city === c).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <label className="mt-3 block max-w-xs text-xs">
            <span className="text-muted-foreground">Wszystkie miasta ({allCities.length})</span>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 w-full rounded-sm border border-border bg-card/50 px-2 py-2 text-xs outline-none focus:border-primary/60"
            >
              <option value="Wszystkie">Wszystkie miasta</option>
              {allCities.map((c) => (
                <option key={c} value={c}>
                  {c} ({countByCity[c]})
                </option>
              ))}
            </select>
          </label>


          <div className="mt-3 flex flex-wrap gap-2">
            {(Object.keys(tagLabels) as Tag[]).map((t) => {
              const Icon = tagLabels[t].icon;
              const active = tag === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(active ? null : t)}
                  className={`inline-flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                    active
                      ? "border-accent/60 bg-accent/15 text-accent"
                      : "border-border bg-card/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="size-3.5" />
                  {tagLabels[t].label}
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Znaleziono {filtered.length}{" "}
          {filtered.length === 1 ? "restaurację" : "restauracji"} z {restaurants.length} w Polsce
        </p>


        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <article key={r.name} className="gs-panel flex flex-col p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-bold uppercase leading-tight">{r.name}</h3>
                <span className="shrink-0 rounded-sm border border-border bg-secondary/50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                  {r.city}
                </span>
              </div>

              <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                {r.address}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4 shrink-0 text-primary" />
                {r.hours}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {r.tags.map((t) => {
                  const Icon = tagLabels[t].icon;
                  return (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-sm border border-border bg-card/60 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground"
                    >
                      <Icon className="size-3" />
                      {tagLabels[t].label}
                    </span>
                  );
                })}
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name} ${r.address}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-fit items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary transition-colors hover:text-accent"
              >
                Pokaż na mapie
                <MapPin className="size-3.5" />
              </a>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="border border-dashed border-border p-8 text-center">
            <p className="text-sm font-bold uppercase">Brak wyników</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Zmień miasto, filtr albo wpisz inną frazę.
            </p>
          </div>
        )}
        </div>
        </GsPanel>
      </main>
    </GsShell>

  );
}
