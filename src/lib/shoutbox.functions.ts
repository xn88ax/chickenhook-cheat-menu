import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const shoutSchema = z.object({
  shouts: z
    .array(
      z.object({
        nick: z.string().min(2).max(24),
        text: z.string().min(2).max(120),
      }),
    )
    .min(1)
    .max(12),
});

export type GeneratedShout = z.infer<typeof shoutSchema>["shouts"][number];

export const generateShouts = createServerFn({ method: "GET" }).handler(async () => {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return { shouts: [] as GeneratedShout[] };

  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: [
              "Piszesz wiadomości na shoutbox parodystycznego polskiego forum o cheacie do CS o nazwie ChickenHook.",
              "Luźny slang graczy, małe litery mile widziane, zero wulgaryzmów, zero prawdziwych osób.",
              "Tematy: aim assist, configi, prośby o invite, zero banów, kurczaki, kfc, faceit, premier, loader, undetected.",
              "Nicki: kreatywne, polsko-angielskie, z podkreśleniami i cyframi.",
              "Każdy tekst max 80 znaków. Nie powtarzaj się.",
              'Zwróć WYŁĄCZNIE JSON w formacie: {"shouts":[{"nick":"...","text":"..."}]} — dokładnie 8 wiadomości.',
            ].join(" "),
          },
          {
            role: "user",
            content: `Daj świeżą paczkę wiadomości. Ziarno losowości: ${Math.random().toString(36).slice(2)}`,
          },
        ],
      }),
    });

    if (!res.ok) return { shouts: [] as GeneratedShout[] };
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = json.choices?.[0]?.message?.content;
    if (!content) return { shouts: [] as GeneratedShout[] };

    const parsed = shoutSchema.safeParse(JSON.parse(content));
    if (!parsed.success) return { shouts: [] as GeneratedShout[] };
    return { shouts: parsed.data.shouts };
  } catch {
    return { shouts: [] as GeneratedShout[] };
  }
});
