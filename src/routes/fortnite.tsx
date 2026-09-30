import { createFileRoute } from "@tanstack/react-router";

import { GameMenu, GameTabs } from "@/components/game-menu";
import { GsPanel, GsShell } from "@/components/gs-shell";
import { FORTNITE_MENU } from "@/data/game-menu-data";

export const Route = createFileRoute("/fortnite")({
  head: () => ({
    meta: [
      { title: "ChickenHook Fortnite — menu i moduły" },
      { name: "description", content: "Interaktywne menu ChickenHook dla Fortnite z celowaniem, ESP, budowaniem, edycją, ruchem i wyszukiwaniem lootu." },
      { property: "og:title", content: "ChickenHook Fortnite — menu i moduły" },
      { property: "og:description", content: "Pełne demonstracyjne menu ChickenHook dla Fortnite." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FortnitePage,
});

function FortnitePage() {
  return (
    <GsShell crumbs={[{ label: "Gry" }, { label: "Fortnite" }]}>
      <main className="mx-auto max-w-[920px] space-y-3 px-3 py-4 sm:px-5">
        <GameTabs active="fortnite" />
        <p className="gs-banner px-4 py-2.5 text-center text-xs font-bold">ChickenHook × Fortnite — build 4.chkn-fn · Alpha</p>
        <GsPanel title="Menu Fortnite"><div className="p-2"><GameMenu config={FORTNITE_MENU} /></div></GsPanel>
      </main>
    </GsShell>
  );
}
