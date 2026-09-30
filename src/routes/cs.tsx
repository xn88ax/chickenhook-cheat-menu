import { createFileRoute } from "@tanstack/react-router";

import { GameTabs } from "@/components/game-menu";
import { GsPanel, GsShell } from "@/components/gs-shell";
import { OverlayMenu } from "@/components/overlay-menu";

export const Route = createFileRoute("/cs")({
  head: () => ({
    meta: [
      { title: "ChickenHook CS2 — menu i moduły" },
      { name: "description", content: "Interaktywne menu ChickenHook dla CS2 z ustawieniami celowania, wizualizacji, ruchu i modułów dodatkowych." },
      { property: "og:title", content: "ChickenHook CS2 — menu i moduły" },
      { property: "og:description", content: "Pełne demonstracyjne menu ChickenHook dla CS2." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CsPage,
});

function CsPage() {
  return (
    <GsShell crumbs={[{ label: "Gry" }, { label: "CS2" }]}>
      <main className="mx-auto max-w-[920px] space-y-3 px-3 py-4 sm:px-5">
        <GameTabs active="cs" />
        <p className="gs-banner px-4 py-2.5 text-center text-xs font-bold">ChickenHook × Counter-Strike 2 — build 4.chkn · Alpha</p>
        <GsPanel title="Menu CS2">
          <div className="p-2"><OverlayMenu /></div>
        </GsPanel>
      </main>
    </GsShell>
  );
}
