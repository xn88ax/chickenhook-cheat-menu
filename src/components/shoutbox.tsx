import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Send, Sparkles } from "lucide-react";

import { generateShouts, type GeneratedShout } from "@/lib/shoutbox.functions";
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
  const [aiOn, setAiOn] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const queue = useRef<GeneratedShout[]>([]);
  const fetching = useRef(false);
  const fetchShouts = useServerFn(generateShouts);

  // Pobiera paczkę świeżych wiadomości z AI do kolejki.
  const refill = useCallback(async () => {
    if (fetching.current || queue.current.length > 2) return;
    fetching.current = true;
    try {
      const { shouts: fresh } = await fetchShouts();
      if (fresh.length > 0) {
        queue.current = [...queue.current, ...fresh];
        setAiOn(true);
      }
    } catch {
      // fallback lokalny — cicho
    } finally {
      fetching.current = false;
    }
  }, [fetchShouts]);

  const nextShout = useCallback((): Omit<Shout, "id" | "time"> => {
    const fresh = queue.current.shift();
    if (fresh) return fresh;
    // Awaryjnie, gdy AI nie odpowiada.
    return { nick: pick(shoutNicks), text: pick(shoutLines) };
  }, []);

  // Start: paczka z AI + pierwsze wiadomości po hydratacji.
  useEffect(() => {
    void refill();
    setShouts(
      Array.from({ length: 4 }, (_, i) => ({
        id: ++seq,
        ...nextShout(),
        time: clock((4 - i) * 47),
      })),
    );
  }, [refill, nextShout]);

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    const tick = () => {
      id = setTimeout(() => {
        void refill();
        setShouts((s) => [...s, { id: ++seq, ...nextShout(), time: clock() }].slice(-40));
        tick();
      }, 3500 + Math.random() * 3500);
    };
    tick();
    return () => clearTimeout(id);
  }, [refill, nextShout]);

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
          aria-label="Wiadomość na shoutboxie"
          className="flex-1 border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary/60"
        />
        <button type="submit" className="gs-action px-4 py-2" aria-label="Wyślij">
          <Send className="size-3.5" />
          Wyślij
        </button>
      </form>
      <p className="flex items-center gap-1.5 border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
        {aiOn ? (
          <>
            <Sparkles className="size-3 gs-lime" />
            Wiadomości generuje AI — każda paczka jest świeża. Twoje wiadomości nigdzie nie lecą.
          </>
        ) : (
          "Shoutbox jest symulowany na potrzeby parodii — Twoje wiadomości nigdzie nie lecą."
        )}
      </p>
    </div>
  );
}
