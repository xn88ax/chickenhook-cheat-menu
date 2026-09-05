import { createFileRoute } from "@tanstack/react-router";

import { CompetitorTable } from "@/components/competitor-table";
import { ConfigGenerator } from "@/components/config-generator";
import { FortuneWheel } from "@/components/fortune-wheel";
import { GsPanel, GsShell } from "@/components/gs-shell";
import { VacScanner } from "@/components/vac-scanner";

export const Route = createFileRoute("/narzedzia")({
  head: () => ({
    meta: [
      { title: "Narzędzia — generator configu i skaner | ChickenHook.ru" },
      {
        name: "description",
        content:
          "Generator configu HvH, skaner bezpieczeństwa konta, koło fortuny z nagrodami i porównanie ChickenHook z konkurencją.",
      },
      { property: "og:title", content: "Narzędzia ChickenHook.ru" },
      {
        property: "og:description",
        content: "Wylosuj config, przeskanuj konto, zakręć kołem i sprawdź, jak wypadamy przy konkurencji.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Narzedzia,
});

function Narzedzia() {
  return (
    <GsShell crumbs={[{ label: "Narzędzia" }]}>
      <main className="mx-auto max-w-6xl space-y-4 px-5 py-4">
        <p className="gs-banner px-4 py-2.5 text-center text-xs font-bold">
          Narzędzia kurnika — wszystko losowe, wszystko dla beki
        </p>

        <h1 className="sr-only">Narzędzia ChickenHook</h1>

        <div className="grid gap-4 lg:grid-cols-2">
          <GsPanel title="Generator configu HvH">
            <ConfigGenerator />
          </GsPanel>
          <GsPanel title="Skaner bezpieczeństwa konta">
            <VacScanner />
          </GsPanel>
        </div>

        <GsPanel title="Koło fortuny modułów">
          <FortuneWheel />
        </GsPanel>

        <GsPanel title="ChickenHook vs konkurencja">
          <CompetitorTable />
        </GsPanel>
      </main>
    </GsShell>
  );
}
