import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ImagePlus, LogIn, Send, Trash2, X } from "lucide-react";
import { useIsAdmin } from "@/hooks/use-is-admin";

import { supabase } from "@/integrations/supabase/client";
import { displayName, useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { DecoratedAvatar, Nameplate } from "@/components/profile-cosmetics";

import { nameEffect, nickVars, useProfileMedia } from "@/lib/profile-media";
import { mainRoleOf, useRoleStyles } from "@/lib/role-styles";

type Shout = {
  id: string;
  nick: string;
  text: string;
  created_at: string;
  user_id: string | null;
  attachment_url?: string | null;
};

const signedCache = new Map<string, string>();
function ChatAttachment({ path }: { path: string }) {
  const [url, setUrl] = useState<string | null>(signedCache.get(path) ?? null);
  useEffect(() => {
    if (url) return;
    void supabase.storage.from("chat").createSignedUrl(path, 60 * 60 * 24).then(({ data }) => {
      if (data?.signedUrl) { signedCache.set(path, data.signedUrl); setUrl(data.signedUrl); }
    });
  }, [path, url]);
  if (!url) return <span className="block text-[11px] text-[var(--text-subtle)]">ładuję załącznik…</span>;
  const isVideo = /\.(mp4|webm|mov)$/i.test(path);
  const isImage = /\.(png|jpe?g|gif|webp|avif)$/i.test(path);
  if (isVideo) return <video src={url} controls className="mt-1 block max-h-48 max-w-full rounded-md border border-border" />;
  if (isImage) return <a href={url} target="_blank" rel="noreferrer"><img src={url} alt="załącznik" loading="lazy" className="mt-1 block max-h-48 max-w-full rounded-md border border-border" /></a>;
  return <a href={url} target="_blank" rel="noreferrer" className="mt-1 block text-xs font-bold text-primary underline">📎 {path.split("/").pop()}</a>;
}

type ShoutProfile = {
  id: string;
  username: string;
  avatar_url: string | null;
  accent: string | null;
  accent_2: string | null;
  name_effect: string | null;
  avatar_decoration: string | null;
  nameplate: string | null;
  roles: string[];
};

function ChatAvatar({ profile }: { profile?: ShoutProfile }) {
  const avatar = useProfileMedia(profile?.avatar_url);
  if (!avatar) return null;
  return (
    <DecoratedAvatar decoration={profile?.avatar_decoration} accent={profile?.accent} accent2={profile?.accent_2} className="size-7 shrink-0">
      <img src={avatar} alt="" className="size-full object-cover" />
    </DecoratedAvatar>
  );
}

function MentionText({ text, known }: { text: string; known: Set<string> }) {
  // Dopasowuje @nick, także ze spacjami: bierze najdłuższy znany nick.
  const nicks = [...known].sort((a, b) => b.length - a.length);
  const parts: (string | { nick: string; label: string })[] = [];
  let rest = text;
  while (rest) {
    const at = rest.indexOf("@");
    if (at === -1) {
      parts.push(rest);
      break;
    }
    if (at > 0) parts.push(rest.slice(0, at));
    rest = rest.slice(at);
    const tail = rest.slice(1).toLowerCase();
    const hit = nicks.find((n) => tail.startsWith(n));
    if (hit) {
      parts.push({ nick: hit, label: rest.slice(0, 1 + hit.length) });
      rest = rest.slice(1 + hit.length);
    } else {
      parts.push("@");
      rest = rest.slice(1);
    }
  }
  return (
    <>
      {parts.map((part, i) =>
        typeof part === "string" ? (
          part
        ) : (
          <Link
            key={i}
            to="/profil/$username"
            params={{ username: part.nick }}
            className="rounded bg-primary/15 px-1 font-semibold text-primary hover:bg-primary/25"
          >
            {part.label}
          </Link>
        ),
      )}
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

// Animowany wynik komendy: moneta kręci się i "pada", kostka losuje jak automat.
function CmdFx({ kind, value, max }: { kind: "roll" | "flip"; value: string; max?: string }) {
  const [shown, setShown] = useState(kind === "roll" ? "0" : "?");
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const tick =
      kind === "roll"
        ? window.setInterval(() => setShown(String(Math.floor(1 + Math.random() * Number(max ?? "100")))), 70)
        : null;
    const stop = window.setTimeout(() => {
      if (tick) window.clearInterval(tick);
      setShown(value);
      setSettled(true);
    }, 1400);
    return () => {
      if (tick) window.clearInterval(tick);
      window.clearTimeout(stop);
    };
  }, [kind, value, max]);
  if (kind === "flip") {
    return (
      <span>
        <span
          className={`chat-cmd-coin ${settled ? "chat-cmd-coin-settled" : ""} ${settled && value === "RESZKA" ? "chat-cmd-coin-tails" : ""}`}
        >
          🪙
        </span>{" "}
        /flip →{" "}
        <span className={`chat-cmd-value ${settled ? "chat-cmd-value-locked" : "chat-cmd-value-cycling"}`}>
          {shown}
        </span>
      </span>
    );
  }
  return (
    <span>
      <span className="chat-cmd-dice">🎲</span> /roll 1-{max} →{" "}
      <span className={`chat-cmd-value ${settled ? "chat-cmd-value-locked" : "chat-cmd-value-cycling"}`}>
        {shown}
      </span>
    </span>
  );
}

export function Shoutbox() {
  const { user, loading } = useAuth();
  const [shouts, setShouts] = useState<Shout[]>([]);
  const [draft, setDraft] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [guestNick, setGuestNick] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Record<string, ShoutProfile>>({});
  const roleStyles = useRoleStyles();
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const seenIds = useRef<Set<string>>(new Set());
  const fxTimer = useRef<number | null>(null);
  const [cmdFx, setCmdFx] = useState<{ id: string; kind: "roll" | "flip"; value: string; max?: string } | null>(null);

  // Animacja wyniku /roll i /flip — tylko dla wiadomości, które przychodzą na żywo
  // (po przeładowaniu strony historia wgrywa się już bez animacji).
  function noteFx(shout: Shout) {
    if (seenIds.current.has(shout.id)) return;
    seenIds.current.add(shout.id);
    const roll = /^🎲 \/roll 1-(\d+) → wylosowałem (\d+)$/.exec(shout.text);
    const flip = /^🪙 \/flip → (ORZEŁ|RESZKA)$/.exec(shout.text);
    if (!roll && !flip) return;
    if (Date.now() - new Date(shout.created_at).getTime() > 15000) return;
    if (fxTimer.current) window.clearTimeout(fxTimer.current);
    if (roll) setCmdFx({ id: shout.id, kind: "roll", value: roll[2], max: roll[1] });
    else setCmdFx({ id: shout.id, kind: "flip", value: flip![1] });
    fxTimer.current = window.setTimeout(() => setCmdFx(null), 2300);
  }

  const knownNicks = new Set<string>([
    ...Object.values(profiles).map((p) => p.username.toLowerCase()),
    ...shouts.map((s) => s.nick.toLowerCase()),
  ]);

  function mention(nick: string) {
    setDraft((d) => (d.endsWith(" ") || d === "" ? `${d}@${nick} ` : `${d} @${nick} `));
    inputRef.current?.focus();
  }

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
      supabase.from("profiles").select("id,username,avatar_url,accent,accent_2,name_effect,avatar_decoration,nameplate").in("id", userIds),
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
      .select("id, nick, text, created_at, user_id, attachment_url")
      .order("created_at", { ascending: false })
      .limit(80)
      .then(({ data }) => {
        if (active && data) {
          const rows = [...data].reverse() as Shout[];
          for (const row of rows) seenIds.current.add(row.id);
          setShouts(rows);
        }
      });

    const channel = supabase
      .channel("shouts-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "shouts" },
        (payload) => {
          const row = payload.new as Shout;
          noteFx(row);
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
    let text = draft.trim();
    // Komendy czatu: /roll [max] i /flip.
    const rollMatch = /^\/roll(?:\s+(\d+))?$/i.exec(text);
    if (rollMatch) {
      const max = Math.min(Math.max(parseInt(rollMatch[1] ?? "100", 10) || 100, 2), 1_000_000);
      text = `🎲 /roll 1-${max} → wylosowałem ${Math.floor(1 + Math.random() * max)}`;
    } else if (/^\/flip$/i.test(text)) {
      text = `🪙 /flip → ${Math.random() < 0.5 ? "ORZEŁ" : "RESZKA"}`;
    }
    const nick = (
      user
        ? displayName(user)
        : /^gosc_\d{4}$/.test(guestNick)
          ? guestNick
          : `gosc_${Math.floor(1000 + Math.random() * 8999)}`
    ).slice(0, 32);
    if ((!text && !file) || sending) return;
    setSending(true);
    setError(null);
    let attachment_url: string | null = null;
    if (file) {
      if (!user) { setSending(false); setError("Załączniki tylko dla zalogowanych."); return; }
      if (file.size > 10 * 1024 * 1024) { setSending(false); setError("Plik za duży (max 10 MB)."); return; }
      const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("chat").upload(path, file, { contentType: file.type || undefined });
      if (upErr) { setSending(false); setError("Nie udało się wgrać pliku."); return; }
      attachment_url = path;
    }
    const { data, error: err } = await supabase
      .from("shouts")
      .insert({ nick, text: text || "📎", user_id: user ? user.id : null, attachment_url })
      .select("id, nick, text, created_at, user_id, attachment_url")
      .single();
    setSending(false);
    if (err || !data) {
      setError("Nie udało się wysłać. Spróbuj jeszcze raz.");
      return;
    }
    setDraft("");
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
    noteFx(data as Shout);
    setShouts((s) => (s.some((x) => x.id === data.id) ? s : [...s, data as Shout].slice(-120)));
  }

  const { isAdmin } = useIsAdmin();

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
            const fx = nameEffect(profile?.name_effect);
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
                    <Nameplate variant={profile?.nameplate} accent={profile?.accent} accent2={profile?.accent_2} compact>
                    <button
                      type="button"
                      onClick={() => mention(s.nick)}
                      title={`Oznacz @${s.nick}`}
                      className={`cursor-pointer font-semibold hover:underline ${fx !== "solid" ? `nick-fx nick-fx-${fx}` : glitter ? "forum-nick-glitter" : roleStyle ? "forum-nick-color" : "text-primary"}`}
                      style={
                        fx !== "solid"
                          ? (nickVars(profile?.accent, profile?.accent_2) as React.CSSProperties)
                          : roleStyle
                            ? ({ "--role-color": roleStyle.color } as React.CSSProperties)
                            : undefined
                      }
                    >
                      {s.nick}
                    </button>
                    </Nameplate>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => mention(s.nick)}
                    title={`Oznacz @${s.nick}`}
                    className="cursor-pointer font-semibold text-muted-foreground hover:underline"
                  >
                    {s.nick}
                  </button>
                )}
                <span className="min-w-0 break-words text-muted-foreground">
                  {!(s.attachment_url && s.text === "📎") && (cmdFx?.id === s.id ? <CmdFx kind={cmdFx.kind} value={cmdFx.value} max={cmdFx.max} /> : <MentionText text={s.text} known={knownNicks} />)}
                  {s.attachment_url ? <ChatAttachment path={s.attachment_url} /> : null}
                </span>
                {mine || isAdmin ? (
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

       {file ? (
        <div className="flex items-center gap-2 border-t border-border px-4 pt-2 text-[11px] text-muted-foreground">
          <span className="truncate">📎 {file.name}</span>
          <button type="button" aria-label="Usuń załącznik" onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ""; }}><X className="size-3" /></button>
        </div>
      ) : null}
       <form className="flex gap-2 border-t border-border px-4 py-3" onSubmit={send}>
        <input ref={fileRef} type="file" hidden accept="image/*,video/mp4,video/webm,.pdf,.txt,.zip" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <Button type="button" variant="outline" size="sm" className="h-9 rounded-lg px-2.5" aria-label="Załącz plik" title={user ? "Załącz obrazek / plik" : "Zaloguj się, żeby załączać"} disabled={!user} onClick={() => fileRef.current?.click()}>
          <ImagePlus className="size-3.5" />
        </Button>
         <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={200}
          placeholder="Napisz coś do kurnika… (/roll, /flip)"
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
