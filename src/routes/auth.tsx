import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

import { registerWithInvite } from "@/lib/invite.functions";
import { isRememberSession, setRememberSession } from "@/lib/session-persistence";
import chickenhookLogo from "@/assets/chickenhook-logo.png.asset.json";


export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    next: typeof search.next === "string" ? search.next : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Logowanie — Forum chickenhook.wtf (invite only)" },
      {
        name: "description",
        content:
          "Forum ChickenHook działa w trybie invite only. Zaloguj się lub aktywuj konto kodem zaproszenia.",
      },
      { property: "og:title", content: "Logowanie — Forum chickenhook.wtf" },
      {
        property: "og:description",
        content: "Dostęp do forum ChickenHook wyłącznie z kodem zaproszenia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { next } = useSearch({ from: "/auth" });
  const target = next && next.startsWith("/") ? next : "/forum";
  const register = useServerFn(registerWithInvite);

  const [mode, setMode] = useState<"login" | "invite">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [invite, setInvite] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    setRemember(isRememberSession());
  }, []);


  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: target });
      } else {
        const result = await register({
          data: {
            code: invite,
            email,
            password,
            username: username || email.split("@")[0],
          },
        });
        if (!result.ok) {
          setError(result.error);
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setInfo("Konto utworzone. Zaloguj się.");
          setMode("login");
          return;
        }
        navigate({ to: target });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Coś poszło nie tak.");
    } finally {
      setBusy(false);
    }
  }





  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <header className="border-b border-border glass-bar">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2">
            <img src={chickenhookLogo.url} alt="Herb ChickenHook" className="h-9 w-auto" />
            <span className="text-display text-xl">
              CHICKEN<span className="text-primary">HOOK</span>
              <span className="text-muted-foreground">.RU</span>
            </span>
          </Link>
          <Link to="/forum" className="text-xs font-bold uppercase text-muted-foreground">
            Wróć na forum
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-12">
        <div className="overflow-hidden rounded-sm border border-border">
          <h1 className="bucket-gradient px-4 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground">
            {mode === "login" ? "Logowanie" : "Aktywacja zaproszenia"}
          </h1>
          <form onSubmit={onSubmit} className="space-y-4 glass px-5 py-5">
            <p className="rounded-sm border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
              Forum działa w trybie <span className="font-bold text-accent">invite only</span> —
              otwarta rejestracja jest wyłączona. Konto założysz tylko z kodem zaproszenia.
            </p>
            {mode === "invite" && (
              <>
                <div>
                  <label
                    className="text-xs font-bold uppercase text-muted-foreground"
                    htmlFor="invite"
                  >
                    Kod zaproszenia
                  </label>
                  <input
                    id="invite"
                    required
                    value={invite}
                    onChange={(e) => setInvite(e.target.value.toUpperCase())}
                    maxLength={64}
                    className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm uppercase tracking-wide outline-none focus:border-primary"
                    placeholder="CHICKEN-XXXXX-2026"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground" htmlFor="nick">
                    Nick
                  </label>
                  <input
                    id="nick"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={24}
                    className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    placeholder="np. zimnyFrytek"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground" htmlFor="email">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground" htmlFor="pass">
                Hasło
              </label>
              <input
                id="pass"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => {
                  setRemember(e.target.checked);
                  setRememberSession(e.target.checked);
                }}
                className="size-4 accent-[hsl(var(--primary))]"
              />
              Zapamiętaj mnie
            </label>

            {error && <p className="text-xs text-primary">{error}</p>}
            {info && <p className="text-xs text-accent">{info}</p>}


            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-sm bucket-gradient px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-foreground disabled:opacity-60"
            >
              {mode === "login" ? "Zaloguj się" : "Aktywuj kod i wejdź"}
            </button>


            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "invite" : "login");
                setError(null);
                setInfo(null);
              }}
              className="w-full text-xs text-muted-foreground underline-offset-2 hover:underline"
            >
              {mode === "login" ? "Masz kod zaproszenia? Aktywuj konto" : "Masz konto? Zaloguj się"}
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}
