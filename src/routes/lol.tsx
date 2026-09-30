import { createFileRoute } from "@tanstack/react-router";

import { GameMenu, GameTabs } from "@/components/game-menu";
import { GsPanel, GsShell } from "@/components/gs-shell";
import { LOL_MENU } from "@/data/game-menu-data";

export const Route = createFileRoute("/lol")({
  head: () => ({
    meta: [
      { title: "ChickenHook League of Legends — menu i moduły" },
      { name: "description", content: "Interaktywne menu ChickenHook dla League of Legends z orbwalkerem, evade, farmieniem, jungle i profilem championa." },
      { property: "og:title", content: "ChickenHook League of Legends — menu i moduły" },
      { property: "og:description", content: "Pełne demonstracyjne menu ChickenHook dla League of Legends." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LolPage,
});

function LolPage() {
  return (
    <GsShell crumbs={[{ label: "Gry" }, { label: "League of Legends" }]}>
      <main className="mx-auto max-w-[920px] space-y-3 px-3 py-4 sm:px-5">
        <GameTabs active="lol" />
        <p className="gs-banner px-4 py-2.5 text-center text-xs font-bold">ChickenHook × League of Legends — build 4.chkn-lol · Alpha</p>
        <GsPanel title="Menu League of Legends"><div className="p-2"><GameMenu config={LOL_MENU} /></div></GsPanel>
      </main>
    </GsShell>
  );
}
