import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { LogIn, Send, Trash2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { displayName, useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

import { useProfileMedia } from "@/lib/profile-media";
import { mainRoleOf, useRoleStyles } from "@/lib/role-styles";

type Shout = {
  id: string;
  nick: string;
  text: string;
  created_at: string;
  user_id: string | null;
};

type ShoutProfile = {
  id: string;
  username: string;
  avatar_url: string | null;
  roles: string[];
};

function ChatAvatar({ profile }: { profile?: ShoutProfile }) {
  const avatar = useProfileMedia(profile?.avatar_url);
  if (!avatar) return null;
  return <img src={avatar} alt="" className="size-7 shrink-0 rounded-md object-cover" />;
}

function MentionText({ text, known }: { text: string; known: Set<string> }) {
  const parts = text.split(/(@[A-Za-z0-9_]+)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (!part.startsWith("@")) return part;
        const nick = part.slice(1).toLowerCase();
        return known.has(nick) ? (
          <Link
            key={i}
            to="/profil/$username"
            params={{ username: part.slice(1) }}
            className="rounded bg-primary/15 px-1 font-semibold text-primary hover:bg-primary/25"
          >
            {part}
          </Link>
        ) : (
          part
        );
      })}
    </>
  );
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  if (isSameDay(d, now)) return time;
  const months = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"];
  return `${d.getDate()} ${months[d.getMonth()]} ${time}`;
}

const NICK_KEY = "chickenhook_guest_nick";

export function Shoutbox() {
  const { user, loading } = useAuth();
  const [shouts, setShouts] = useState<Shout[]>([]);
  const [draft, setDraft] = useState("");
  const [guestNick, setGuestNick] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Record<string, ShoutProfile>>({});
  const roleStyles = useRoleStyles();
  const listRef = useRef<HTMLDivElement>(null);

  // Nick gościa jest przydzielany automatycznie i nie da się go zmienić bez konta.
  useEffect(() => {
    const saved = localStorage.getItem(NICK_KEY);
    const valid = saved && /^gosc_\d{4}$/.test(saved) ? saved : null;
    const nick = valid ?? `gosc_${Math.floor(1000 + Math.random() * 8999)}`;
    localStorage.setItem(NICK_KEY, nick);
    setGuestNick(nick);
  }, []);

  useEffect(() => {
    const userIds = [...new Set(shouts.flatMap((shout) => (shout.user_id ? [shout.user_id] : [])))];
    if (userIds.length === 0) return;
    void Promise.all([
      supabase.from("profiles").select("id,username,avatar_url").in("id", userIds),
      supabase.from("user_roles").select("user_id,role").in("user_id", userIds),
    ]).then(([profileResult, roleResult]) => {
      const next: Record<string, ShoutProfile> = {};
      for (const profile of profileResult.data ?? []) {
        next[profile.id] = {
          ...profile,
          roles: (roleResult.data ?? [])
            .filter((item) => item.user_id === profile.id)
            .map((item) => item.role),
        };
      }
      setProfiles(next);
    });
  }, [shouts]);

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
    const nick = (
      user
        ? displayName(user)
        : /^gosc_\d{4}$/.test(guestNick)
          ? guestNick
          : `gosc_${Math.floor(1000 + Math.random() * 8999)}`
    ).slice(0, 32);
    if (!text || sending) return;
    setSending(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("shouts")
      .insert({ nick, text, user_id: user ? user.id : null })
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
        className="h-[280px] overflow-y-auto px-4 py-3 text-[13px]"
        aria-live="polite"
      >
        {shouts.length === 0 ? (
          <p className="text-muted-foreground">Cicho tu… napisz pierwszy.</p>
        ) : (
          shouts.map((s) => {
            const mine = !!user && s.user_id === user.id;
            const profile = s.user_id ? profiles[s.user_id] : undefined;
            const mainRole = profile ? mainRoleOf(profile.roles) : undefined;
            const roleStyle = mainRole ? roleStyles[mainRole] : undefined;
            const glitter = roleStyle?.glitter ?? false;
            const hasAvatar = !!profile?.avatar_url;
            return (
              <div
                key={s.id}
                className={`group grid items-center gap-2 border-b border-border/50 py-1.5 leading-relaxed last:border-0 ${hasAvatar ? "grid-cols-[auto_auto_auto_1fr_auto]" : "grid-cols-[auto_auto_1fr_auto]"}`}
              >
                <span className="text-xs text-[var(--text-subtle)] tabular-nums">
                  {formatTime(s.created_at)}
                </span>
                <ChatAvatar profile={profile} />
                {s.user_id ? (
                  <span className="flex min-w-0 flex-wrap items-center gap-1">
                    <Link
                      to="/profil/$username"
                      params={{ username: s.nick }}
                      className={`font-semibold hover:underline ${glitter ? "forum-nick-glitter" : roleStyle ? "forum-nick-color" : "text-primary"}`}
                      style={
                        roleStyle
                          ? ({ "--role-color": roleStyle.color } as React.CSSProperties)
                          : undefined
                      }
                    >
                      {s.nick}
                    </Link>
                  </span>
                ) : (
                  <span className="font-semibold text-muted-foreground">{s.nick}</span>
                )}
                <span className="min-w-0 break-words text-muted-foreground">{s.text}</span>
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
              </div>
            );
          })
        )}
      </div>

       <form className="flex gap-2 border-t border-border px-4 py-3" onSubmit={send}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={200}
          placeholder="Napisz coś do kurnika…"
          aria-label="Wiadomość na shoutboxie"
           className="h-9 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
        />
         <Button type="submit" disabled={sending} size="sm" className="h-9 rounded-lg px-4">
          <Send className="size-3.5" />
          Wyślij
         </Button>
      </form>
       <div className="flex flex-wrap items-center gap-2 px-4 pb-3 text-[11px] text-[var(--text-subtle)]">
        {user ? (
          <span>
            Piszesz jako <span className="font-bold gs-green">{displayName(user)}</span> — konto z
            kurnika
          </span>
        ) : (
          <>
            <span>
              Piszesz jako gość <span className="font-bold text-foreground">{guestNick}</span> —
              własny nick tylko z kontem
            </span>
            <Link
              to="/auth"
              search={{ next: "/" }}
              className="inline-flex items-center gap-1 font-bold text-primary"
            >
              <LogIn className="size-3" />
              {loading ? "Sprawdzam konto…" : "Zaloguj się"}
            </Link>
          </>
        )}
        {error ? <span className="text-primary">{error}</span> : null}
       </div>

    </div>
  );
}
