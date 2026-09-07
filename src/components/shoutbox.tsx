import { useEffect, useRef, useState } from "react";
import { Send, Users } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { shoutNicks } from "@/data/community";

type Shout = { id: string; nick: string; text: string; created_at: string };

const NICK_KEY = "chickenhook_nick";

function clock(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function Shoutbox() {
  const [nick, setNick] = useState<string | null>(null);
  const [nickDraft, setNickDraft] = useState("");
  const [shouts, setShouts] = useState<Shout[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Nick trzymamy lokalnie w przeglądarce.
  useEffect(() => {
    setNick(localStorage.getItem(NICK_KEY));
  }, []);

  // Historia + wiadomości na żywo.
  useEffect(() => {
    let active = true;
    void supabase
      .from("shouts")
      .select("id, nick, text, created_at")
      .order("created_at", { ascending: false })
      .limit(60)
      .then(({ data }) => {
        if (active && data) setShouts([...data].reverse() as Shout[]);
      });

    const channel = supabase
      .channel("shouts-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "shouts" },
        (payload) => {
          const row = payload.new as Shout;
          setShouts((s) => (s.some((x) => x.id === row.id) ? s : [...s, row].slice(-80)));
        },
      )
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shouts, nick]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !nick || sending) return;
    setSending(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("shouts")
      .insert({ nick, text })
      .select("id, nick, text, created_at")
      .single();
    setSending(false);
    if (err || !data) {
      setError("Nie udało się wysłać. Spróbuj jeszcze raz.");
      return;
    }
    setDraft("");
    setShouts((s) => (s.some((x) => x.id === data.id) ? s : [...s, data as Shout].slice(-80)));
  }

  if (nick === null) {
    return (
      <div className="px-4 py-5">
        <p className="flex items-center gap-1.5 text-xs font-bold">
          <Users className="size-3.5 gs-lime" />
          Wybierz nick, żeby pisać na shoutboxie
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Bez rejestracji — nick zapisuje się tylko w Twojej przeglądarce.
        </p>
        <form
          className="mt-3 flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const value = nickDraft.trim();
            if (value.length < 2) return;
            localStorage.setItem(NICK_KEY, value);
            setNick(value);
          }}
        >
          <input
            value={nickDraft}
            onChange={(e) => setNickDraft(e.target.value)}
            minLength={2}
            maxLength={24}
            placeholder="np. Kurczak_200iq"
            aria-label="Twój nick"
            className="min-w-48 flex-1 border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary/60"
          />
          <button type="submit" className="gs-action px-4 py-2">
            Wchodzę
          </button>
          <button
            type="button"
            className="border border-border px-3 py-2 text-[11px] uppercase text-muted-foreground hover:border-primary/60 hover:text-primary"
            onClick={() =>
              setNickDraft(
                `${shoutNicks[Math.floor(Math.random() * shoutNicks.length)]}${Math.floor(Math.random() * 90 + 10)}`,
              )
            }
          >
            Losuj nick
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div
        ref={listRef}
        className="h-64 space-y-1.5 overflow-y-auto px-4 py-3 text-xs"
        aria-live="polite"
      >
        {shouts.length === 0 ? (
          <p className="text-muted-foreground">Cicho tu… napisz pierwszy.</p>
        ) : (
          shouts.map((s) => (
            <p key={s.id} className="leading-relaxed">
              <span className="mr-1.5 text-[10px] text-muted-foreground tabular-nums">
                {clock(s.created_at)}
              </span>
              <span className={`font-bold ${s.nick === nick ? "gs-green" : "text-primary"}`}>
                {s.nick}
              </span>
              <span className="text-muted-foreground">: {s.text}</span>
            </p>
          ))
        )}
      </div>
      <form className="flex gap-2 border-t border-border px-4 py-3" onSubmit={send}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={200}
          placeholder="Napisz coś do kurnika…"
          aria-label="Wiadomość na shoutboxie"
          className="flex-1 border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary/60"
        />
        <button type="submit" disabled={sending} className="gs-action px-4 py-2 disabled:opacity-60">
          <Send className="size-3.5" />
          Wyślij
        </button>
      </form>
      <p className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
        <span>
          Piszesz jako <span className="font-bold gs-green">{nick}</span>
        </span>
        <button
          type="button"
          className="uppercase text-primary hover:underline"
          onClick={() => {
            localStorage.removeItem(NICK_KEY);
            setNick(null);
            setNickDraft("");
          }}
        >
          Zmień nick
        </button>
        {error ? <span className="text-primary">{error}</span> : null}
      </p>
    </div>
  );
}
