import { useState } from "react";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import chickenhookLogo from "@/assets/chickenhook-logo.png.asset.json";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    next: typeof search.next === "string" ? search.next : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Logowanie — Forum ChickenHook.ru" },
      {
        name: "description",
        content: "Zaloguj się lub załóż konto, aby pisać na forum ChickenHook.",
      },
      { property: "og:title", content: "Logowanie — Forum ChickenHook.ru" },
      { property: "og:description", content: "Konto forum ChickenHook — logowanie i rejestracja." },
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

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username: username || email.split("@")[0] },
            emailRedirectTo: `${window.location.origin}${target}`,
          },
        });
        if (error) throw error;
        if (data.session) navigate({ to: target });
        else setInfo("Sprawdź maila i potwierdź konto, potem zaloguj się.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Coś poszło nie tak.");
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    setError(null);
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError(result.error.message ?? "Logowanie Google nie powiodło się.");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: target });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <header className="border-b border-border bg-card">
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
            {mode === "login" ? "Logowanie" : "Rejestracja"}
          </h1>
          <form onSubmit={onSubmit} className="space-y-4 bg-card px-5 py-5">
            {mode === "register" && (
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

            {error && <p className="text-xs text-primary">{error}</p>}
            {info && <p className="text-xs text-accent">{info}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-sm bucket-gradient px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-foreground disabled:opacity-60"
            >
              {mode === "login" ? "Zaloguj się" : "Załóż konto"}
            </button>

            <button
              type="button"
              onClick={onGoogle}
              disabled={busy}
              className="w-full rounded-sm border border-border px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-foreground transition-colors hover:bg-secondary disabled:opacity-60"
            >
              Kontynuuj z Google
            </button>

            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError(null);
                setInfo(null);
              }}
              className="w-full text-xs text-muted-foreground underline-offset-2 hover:underline"
            >
              {mode === "login" ? "Nie masz konta? Zarejestruj się" : "Masz konto? Zaloguj się"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
