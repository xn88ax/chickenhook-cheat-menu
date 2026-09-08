import { createFileRoute } from "@tanstack/react-router";

import { CompetitorTable } from "@/components/competitor-table";
import { ConfigGenerator } from "@/components/config-generator";
import { CrosshairGenerator } from "@/components/crosshair-generator";
import { FortuneWheel } from "@/components/fortune-wheel";
import { GsPanel, GsShell } from "@/components/gs-shell";
import { RageQuitGenerator } from "@/components/rage-quit-generator";
import { SensitivityConverter } from "@/components/sensitivity-converter";
import { TrashTalkGenerator } from "@/components/trash-talk-generator";
import { Winamp } from "@/components/winamp";
import { VacScanner } from "@/components/vac-scanner";

export const Route = createFileRoute("/narzedzia")({
  head: () => ({
    meta: [
      { title: "Narzędzia — generator configu i skaner | ChickenHook.wtf" },
      {
        name: "description",
        content:
          "Generator configu HvH, crosshair, przelicznik sensitivity, skaner bezpieczeństwa konta, koło fortuny, gotowe teksty i porównanie z konkurencją.",
      },
      { property: "og:title", content: "Narzędzia ChickenHook.wtf" },
      {
        property: "og:description",
        content: "Wylosuj config, zakręć kołem, przeskanuj konto i sprawdź, jak wypadamy przy konkurencji.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Narzedzia,
});

function Narzedzia() {
  return (
    <GsShell crumbs={[{ label: "Narzedzia" }]}>
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
          <GsPanel title="Generator crosshaira">
            <CrosshairGenerator />
          </GsPanel>
          <GsPanel title="Przelicznik sensitivity">
            <SensitivityConverter />
          </GsPanel>
          <GsPanel title="Generator tekstów HvH">
            <TrashTalkGenerator />
          </GsPanel>
          <GsPanel title="Generator wymówek rage quit">
            <RageQuitGenerator />
          </GsPanel>
        </div>

        <GsPanel title="Koło fortuny modułów">
          <FortuneWheel />
        </GsPanel>

        <GsPanel title="ChickenAmp — odtwarzacz kurnika">
          <Winamp />
        </GsPanel>

        <GsPanel title="ChickenHook vs konkurencja">
          <CompetitorTable />
        </GsPanel>
      </main>
    </GsShell>
  );
}
