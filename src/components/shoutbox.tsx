import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

import { shoutLines, shoutNicks } from "@/data/community";

type Shout = { id: number; nick: string; text: string; time: string; mine?: boolean };

function clock(offsetSeconds = 0) {
  const d = new Date(Date.now() - offsetSeconds * 1000);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

let seq = 0;

export function Shoutbox() {
  const [shouts, setShouts] = useState<Shout[]>([]);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  // Wiadomości startowe generujemy po hydratacji, żeby serwer i klient się zgadzały.
  useEffect(() => {
    setShouts(
      Array.from({ length: 6 }, (_, i) => ({
        id: ++seq,
        nick: pick(shoutNicks),
        text: pick(shoutLines),
        time: clock((6 - i) * 47),
      })),
    );
  }, []);

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    const tick = () => {
      id = setTimeout(() => {
        setShouts((s) =>
          [...s, { id: ++seq, nick: pick(shoutNicks), text: pick(shoutLines), time: clock() }].slice(
            -40,
          ),
        );
        tick();
      }, 3000 + Math.random() * 3000);
    };
    tick();
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shouts]);

  return (
    <div>
      <div
        ref={listRef}
        className="h-64 space-y-1.5 overflow-y-auto px-4 py-3 text-xs"
        aria-live="polite"
      >
        {shouts.map((s) => (
          <p key={s.id} className="leading-relaxed">
            <span className="mr-1.5 text-[10px] text-muted-foreground tabular-nums">{s.time}</span>
            <span className={`font-bold ${s.mine ? "gs-green" : "text-primary"}`}>{s.nick}</span>
            <span className="text-muted-foreground">: {s.text}</span>
          </p>
        ))}
      </div>
      <form
        className="flex gap-2 border-t border-border px-4 py-3"
        onSubmit={(e) => {
          e.preventDefault();
          const text = draft.trim();
          if (!text) return;
          setShouts((s) =>
            [...s, { id: ++seq, nick: "Ty", text, time: clock(), mine: true }].slice(-40),
          );
          setDraft("");
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={140}
          placeholder="Napisz coś do kurnika…"
          aria-label="Wiadomość na czacie"
          className="flex-1 border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary/60"
        />
        <button type="submit" className="gs-action px-4 py-2" aria-label="Wyślij">
          <Send className="size-3.5" />
          Wyślij
        </button>
      </form>
      <p className="border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
        Czat jest symulowany na potrzeby parodii — Twoje wiadomości nigdzie nie lecą.
      </p>
    </div>
  );
}
