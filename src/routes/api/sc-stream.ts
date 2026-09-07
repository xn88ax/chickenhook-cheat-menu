import { createFileRoute } from "@tanstack/react-router";

// Publiczny client_id strony soundcloud.com — potrzebny do pobrania podpisanego adresu MP3
const SC_CLIENT_ID = "Pb72ranhoyt6gw7hM7TkzUItXlMWSNSo";

export const Route = createFileRoute("/api/sc-stream")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const u = new URL(request.url).searchParams.get("u") ?? "";
        // pozwalamy tylko na endpointy mediów SoundCloud
        if (!u.startsWith("https://api-v2.soundcloud.com/media/soundcloud:tracks:")) {
          return new Response("bad url", { status: 400 });
        }
        try {
          const res = await fetch(`${u}?client_id=${SC_CLIENT_ID}`);
          const json = (await res.json()) as { url?: string };
          if (!json.url || !json.url.startsWith("https://")) {
            return new Response("no stream", { status: 404 });
          }
          return Response.redirect(json.url, 302);
        } catch {
          return new Response("upstream error", { status: 502 });
        }
      },
    },
  },
});
