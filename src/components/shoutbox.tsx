import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { LogIn, Send, Trash2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { displayName, useAuth } from "@/hooks/use-auth";

type Shout = {
  id: string;
  nick: string;
  text: string;
  created_at: string;
  user_id: string | null;
};

function clock(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function Shoutbox() {
  const { user, loading } = useAuth();
  const [shouts, setShouts] = useState<Shout[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Historia z bazy + wiadomości na żywo.
  useEffect(() => {
    let active = true;
    void supabase
      .from("shouts")
      .select("id, nick, text, created_at, user_id")
      .order("created_at", { ascending: false })
      .limit(80)
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
          setShouts((s) => (s.some((x) => x.id === row.id) ? s : [...s, row].slice(-120)));
        },
      )
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "shouts" }, (payload) => {
        const gone = payload.old as { id?: string };
        setShouts((s) => s.filter((x) => x.id !== gone.id));
      })
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shouts, user]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !user || sending) return;
    setSending(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("shouts")
      .insert({ nick: displayName(user), text, user_id: user.id })
      .select("id, nick, text, created_at, user_id")
      .single();
    setSending(false);
    if (err || !data) {
      setError("Nie udało się wysłać. Spróbuj jeszcze raz.");
      return;
    }
    setDraft("");
    setShouts((s) => (s.some((x) => x.id === data.id) ? s : [...s, data as Shout].slice(-120)));
  }

  async function remove(id: string) {
    setShouts((s) => s.filter((x) => x.id !== id));
    const { error: err } = await supabase.from("shouts").delete().eq("id", id);
    if (err) setError("Nie udało się usunąć wiadomości.");
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
          shouts.map((s) => {
            const mine = !!user && s.user_id === user.id;
            return (
              <p key={s.id} className="group flex items-baseline gap-1.5 leading-relaxed">
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {clock(s.created_at)}
                </span>
                <span className={`font-bold ${mine ? "gs-green" : "text-primary"}`}>{s.nick}</span>
                <span className="min-w-0 flex-1 break-words text-muted-foreground">: {s.text}</span>
                {mine ? (
                  <button
                    type="button"
                    onClick={() => void remove(s.id)}
                    aria-label="Usuń wiadomość"
                    className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-primary group-hover:opacity-100"
                  >
                    <Trash2 className="size-3" />
                  </button>
                ) : null}
              </p>
            );
          })
        )}
      </div>

      {user ? (
        <>
          <form className="flex gap-2 border-t border-border px-4 py-3" onSubmit={send}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={200}
              placeholder="Napisz coś do kurnika…"
              aria-label="Wiadomość na shoutboxie"
              className="flex-1 border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary/60"
            />
            <button
              type="submit"
              disabled={sending}
              className="gs-action px-4 py-2 disabled:opacity-60"
            >
              <Send className="size-3.5" />
              Wyślij
            </button>
          </form>
          <p className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
            <span>
              Piszesz jako <span className="font-bold gs-green">{displayName(user)}</span> — konto z
              kurnika
            </span>
            {error ? <span className="text-primary">{error}</span> : null}
          </p>
        </>
      ) : (
        <div className="border-t border-border px-4 py-4">
          <p className="flex items-center gap-1.5 text-xs font-bold">
            <LogIn className="size-3.5 gs-lime" />
            Zaloguj się, żeby pisać na shoutboxie
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Wiadomości są trwałe i podpisane Twoim nickiem z kurnika. Czytać może każdy.
          </p>
          <Link to="/auth" className="mt-3 inline-flex gs-action px-4 py-2">
            {loading ? "Sprawdzam konto…" : "Zaloguj się / Rejestracja"}
          </Link>
        </div>
      )}
    </div>
  );
}
