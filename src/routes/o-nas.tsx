import { createFileRoute } from "@tanstack/react-router";

import { GsPanel, GsShell } from "@/components/gs-shell";

export const Route = createFileRoute("/o-nas")({
  head: () => ({
    meta: [
      { title: "O nas — historia ChickenHook.ru" },
      {
        name: "description",
        content:
          "Jak powstał ChickenHook: kubełek skrzydełek, dwa laptopy i jedna zła decyzja o 3 w nocy. Kalendarium i zespół kurnika.",
      },
      { property: "og:title", content: "O nas — historia ChickenHook.ru" },
      {
        property: "og:description",
        content: "Legenda o powstaniu kurnika, kalendarium i zespół, którego nikt nigdy nie widział.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ONas,
});

const timeline = [
  ["2023", "Pierwsza linia kodu napisana na kolanie w KFC przy Marszałkowskiej."],
  ["2024", "Pierwszy użytkownik. Był to kolega założyciela. Nadal jest z nami."],
  ["2025", "Sześciu użytkowników. Powstaje forum, bo trzeba było gdzieś się kłócić."],
  ["styczeń 2026", "Zerowa liczba banów. Zaczynamy o tym pisać na każdej podstronie."],
  ["wrzesień 2026", "Build 4.12.0, sponsorzy z branży drobiarskiej i własny sklep bez towaru."],
];

const team = [
  ['Adam "Chicken" Kurczak', "Założyciel, główny programista, robi też grafiki"],
  ["kochammefke123PL", "Support, odpisuje w 12 sekund, nie wiadomo kiedy śpi"],
  ["adiadi", "Tester, psuje wszystko przed użytkownikami"],
  ["jajeczko1", "Pierwszy użytkownik, awansował na moderatora"],
];

function ONas() {
  return (
    <GsShell crumbs={[{ label: "O nas" }]}>
      <main className="mx-auto max-w-4xl space-y-4 px-5 py-4">
        <p className="gs-banner px-4 py-2.5 text-center text-xs font-bold">
          Od jednego kubełka do sześciu (albo siedmiu) użytkowników
        </p>

        <GsPanel title="Legenda o powstaniu">
          <div className="space-y-3 px-4 py-4 text-xs leading-relaxed text-muted-foreground">
            <h1 className="text-sm font-bold text-foreground">Jak powstał ChickenHook</h1>
            <p>
              Wszystko zaczęło się od kubełka skrzydełek i pytania, które zadał sobie nasz
              założyciel o trzeciej w nocy: „a co, jeśli aimbot mógłby być chrupiący?".
            </p>
            <p>
              Nikt nie potrafił mu odpowiedzieć, więc napisał go sam. Pierwsza wersja strzelała
              wyłącznie w kurczaki na mapach treningowych, co uznaliśmy za sukces i wypuściliśmy
              jako build 0.1.
            </p>
            <p>
              Dziś ChickenHook to sześć, może siedem osób, jeden bardzo hałaśliwy Discord, forum
              tylko na zaproszenia i lista sponsorów, w którą nikt nie wierzy. Undetected od 412
              dni — licząc po naszemu.
            </p>
            <p className="text-foreground">
              Cała strona jest parodią. Nie sprzedajemy żadnego oprogramowania i nie zachęcamy do
              oszukiwania w grach.
            </p>
          </div>
        </GsPanel>

        <GsPanel title="Kalendarium">
          <div className="divide-y divide-border">
            {timeline.map(([year, text]) => (
              <div key={year} className="flex gap-4 px-4 py-2.5 text-xs">
                <span className="w-28 shrink-0 font-bold gs-lime">{year}</span>
                <span className="text-muted-foreground">{text}</span>
              </div>
            ))}
          </div>
        </GsPanel>

        <GsPanel title="Zespół">
          <div className="divide-y divide-border">
            {team.map(([nick, role]) => (
              <div key={nick} className="flex gap-3 px-4 py-3">
                <span className="flex size-9 shrink-0 items-center justify-center bucket-gradient text-xs font-bold text-primary-foreground">
                  {nick.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <p className="text-xs font-bold">{nick}</p>
                  <p className="text-[11px] text-muted-foreground">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </GsPanel>
      </main>
    </GsShell>
  );
}
