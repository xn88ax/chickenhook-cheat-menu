import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Krótkie klipy pokazujące działanie danej funkcji — pobierane z KLIPY.
// Publiczny odczyt ograniczony do jednego endpointu (clips/search).

const QUERIES: Record<string, string> = {
  noclip: "counter strike flying",
  god: "video game god mode",
  bhop: "bunny hop",
  aim: "aimbot",
  trigger: "counter strike headshot",
  esp: "wallhack",
  skins: "counter strike knife skin",
  movement: "counter strike surf",
  misc: "counter strike",
  teleport: "video game teleport",
  crash: "game glitch",
  speed: "speed hack",
  money: "money rain",
};

const cache = new Map<string, { url: string; poster: string } | null>();

export const getCheatClip = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ kind: z.string().max(24) }).parse(data))
  .handler(async ({ data }) => {
    const kind = data.kind;
    if (cache.has(kind)) return cache.get(kind);

    const apiKey = process.env["KLIPY_API_KEY"];
    const lovableKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey || !lovableKey) return null;

    const q = QUERIES[kind] ?? "counter strike";
    const params = new URLSearchParams({ q, customer_id: "chickenhook-site", per_page: "8" });
    const res = await fetch(
      `https://connector-gateway.lovable.dev/klipy/clips/search?${params}`,
      {
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": apiKey,
        },
      },
    );
    if (!res.ok) {
      console.error(`KLIPY clips failed [${res.status}]: ${await res.text()}`);
      cache.set(kind, null);
      return null;
    }
    const json = await res.json();
    const items = json?.data?.data ?? [];
    // losowy klip z wyników, żeby było "randomowo"
    const item = items[Math.floor(Math.random() * items.length)];
    const file = item?.file ?? {};
    // animowany GIF/WebP w <img> — działa wszędzie, także na iOS
    const url =
      file?.gif ??
      file?.md?.gif?.url ??
      file?.md?.webp?.url ??
      file?.sm?.gif?.url ??
      file?.webp ??
      null;
    const out = url ? { url } : null;
    cache.set(kind, out);
    return out;
  });
