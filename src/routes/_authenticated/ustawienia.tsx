import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ExternalLink, ImagePlus, Loader2, RotateCcw } from "lucide-react";

import { GsPanel, GsShell } from "@/components/gs-shell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useSiteSettings } from "@/lib/site-settings";
import { isRememberSession, setRememberSession } from "@/lib/session-persistence";
import { ACCENTS, accentColor, uploadProfileMedia, useProfileMedia } from "@/lib/profile-media";

export const Route = createFileRoute("/_authenticated/ustawienia")({
  head: () => ({
    meta: [
      { title: "Ustawienia konta — chickenhook.wtf" },
      {
        name: "description",
        content:
          "Ustawienia profilu i strony: nick, hasło, sesja, tło, animacje i easter eggi w kurniku chickenhook.wtf.",
      },
      { property: "og:title", content: "Ustawienia — chickenhook.wtf" },
      {
        property: "og:description",
        content: "Zmień nick, hasło i wygląd strony chickenhook.wtf.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Settings,
});

const inputClass =
  "mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-xs outline-none focus:border-primary";
const btnClass =
  "inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60";

const TABS = [
  ["profile", "Profil"],
  ["site", "Strona"],
] as const;
type Tab = (typeof TABS)[number][0];

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      <div>
        <p className="text-xs font-semibold text-foreground">{label}</p>
        {hint && <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`h-5 w-9 rounded-full border transition-colors ${on ? "border-primary bg-primary/80" : "border-border bg-background/60"}`}
    >
      <span
        className={`block size-3.5 rounded-full bg-foreground transition-transform ${on ? "translate-x-4.5" : "translate-x-0.5"}`}
      />
    </button>
  );
}

function Settings() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { settings, update, reset } = useSiteSettings();
  const [tab, setTab] = useState<Tab>("profile");

  const [username, setUsername] = useState("");
  const [nameState, setNameState] = useState<{ busy: boolean; msg: string | null; err: boolean }>({
    busy: false,
    msg: null,
    err: false,
  });
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [passState, setPassState] = useState<{ busy: boolean; msg: string | null; err: boolean }>({
    busy: false,
    msg: null,
    err: false,
  });
  const [remember, setRemember] = useState(true);

  useEffect(() => setRemember(isRememberSession()), []);

  const { data: profile } = useQuery({
    enabled: !!user,
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user!.id)
        .maybeSingle();
      return data ?? null;
    },
  });

  useEffect(() => {
    if (profile?.username) setUsername(profile.username);
  }, [profile?.username]);

  async function saveUsername(e: React.FormEvent) {
    e.preventDefault();
    const nick = username.trim();
    if (nick.length < 3 || nick.length > 24) {
      setNameState({ busy: false, msg: "Nick musi mieć 3–24 znaki.", err: true });
      return;
    }
    setNameState({ busy: true, msg: null, err: false });
    const { error } = await supabase.from("profiles").update({ username: nick }).eq("id", user!.id);
    if (error) {
      setNameState({ busy: false, msg: "Nie udało się zapisać nicku (może być zajęty).", err: true });
      return;
    }
    await supabase.auth.updateUser({ data: { username: nick } });
    await qc.invalidateQueries({ queryKey: ["profile", user?.id] });
    setNameState({ busy: false, msg: "Nick zapisany.", err: false });
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setPassState({ busy: false, msg: "Hasło musi mieć min. 8 znaków.", err: true });
      return;
    }
    if (password !== password2) {
      setPassState({ busy: false, msg: "Hasła nie są takie same.", err: true });
      return;
    }
    setPassState({ busy: true, msg: null, err: false });
    const { error } = await supabase.auth.updateUser({ password });
    setPassword("");
    setPassword2("");
    setPassState({
      busy: false,
      msg: error ? "Nie udało się zmienić hasła." : "Hasło zmienione.",
      err: !!error,
    });
  }

  return (
    <GsShell crumbs={[{ label: "Ustawienia" }]}>
      <main className="mx-auto max-w-[1160px] px-5 py-6">
        <h1 className="font-display text-3xl tracking-wide text-foreground">Ustawienia</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Konto: <span className="text-foreground">{user?.email ?? "—"}</span>
        </p>

        <div className="mt-5 flex gap-2">
          {TABS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${tab === id ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "profile" && (
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <GsPanel title="Profil">
              <form className="space-y-3 p-4" onSubmit={saveUsername}>
                <label className="block text-xs">
                  <span className="text-muted-foreground">Nick na forum i czacie</span>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    minLength={3}
                    maxLength={24}
                    required
                    className={inputClass}
                  />
                </label>
                <button type="submit" disabled={nameState.busy} className={btnClass}>
                  {nameState.busy ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Check className="size-3" />
                  )}
                  Zapisz nick
                </button>
                {nameState.msg && (
                  <p
                    className={`text-[11px] ${nameState.err ? "text-primary" : "text-[var(--status-ok)]"}`}
                  >
                    {nameState.msg}
                  </p>
                )}
              </form>
            </GsPanel>

            <GsPanel title="Hasło">
              <form className="space-y-3 p-4" onSubmit={savePassword}>
                <label className="block text-xs">
                  <span className="text-muted-foreground">Nowe hasło</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                    className={inputClass}
                  />
                </label>
                <label className="block text-xs">
                  <span className="text-muted-foreground">Powtórz hasło</span>
                  <input
                    type="password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    minLength={8}
                    required
                    className={inputClass}
                  />
                </label>
                <button type="submit" disabled={passState.busy} className={btnClass}>
                  {passState.busy ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Check className="size-3" />
                  )}
                  Zmień hasło
                </button>
                {passState.msg && (
                  <p
                    className={`text-[11px] ${passState.err ? "text-primary" : "text-[var(--status-ok)]"}`}
                  >
                    {passState.msg}
                  </p>
                )}
              </form>
            </GsPanel>

            <GsPanel title="Sesja" className="lg:col-span-2">
              <div className="divide-y divide-border/60">
                <Row
                  label="Zapamiętaj mnie"
                  hint="Wyłączone: wylogowanie po zamknięciu karty przeglądarki."
                >
                  <Toggle
                    on={remember}
                    onChange={(v) => {
                      setRemember(v);
                      setRememberSession(v);
                    }}
                  />
                </Row>
                <Row label="Wyloguj na tym urządzeniu" hint="Kończy bieżącą sesję.">
                  <button
                    type="button"
                    onClick={() => void supabase.auth.signOut()}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary"
                  >
                    Wyloguj
                  </button>
                </Row>
              </div>
            </GsPanel>
          </div>
        )}

        {tab === "site" && (
          <div className="mt-5 grid gap-5">
            <GsPanel title="Wygląd strony">
              <div className="divide-y divide-border/60">
                <Row label="Animowane tło" hint="GIF w tle wszystkich podstron.">
                  <Toggle on={settings.background} onChange={(v) => update({ background: v })} />
                </Row>
                <Row label="Siła tła" hint="Jak mocno widać tło pod kartami.">
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={5}
                      max={60}
                      step={1}
                      value={settings.backgroundStrength}
                      onChange={(e) => update({ backgroundStrength: Number(e.target.value) })}
                      className="w-40 accent-[var(--color-primary)]"
                    />
                    <span className="w-9 text-right text-xs text-muted-foreground">
                      {settings.backgroundStrength}%
                    </span>
                  </div>
                </Row>
                <Row label="Animacje i przejścia" hint="Wyłącz, jeśli strona ma być spokojniejsza.">
                  <Toggle on={settings.animations} onChange={(v) => update({ animations: v })} />
                </Row>
                <Row label="Kompaktowe odstępy" hint="Mniej powietrza, więcej treści na ekranie.">
                  <Toggle on={settings.compact} onChange={(v) => update({ compact: v })} />
                </Row>
                <Row label="Easter eggi" hint="Klawisz „a” i inne żarty na stronie głównej.">
                  <Toggle on={settings.easterEggs} onChange={(v) => update({ easterEggs: v })} />
                </Row>
                <Row label="Przywróć domyślne" hint="Wraca do ustawień fabrycznych kurnika.">
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary"
                  >
                    <RotateCcw className="size-3" />
                    Reset
                  </button>
                </Row>
              </div>
            </GsPanel>
            <p className="text-[11px] text-muted-foreground">
              Ustawienia strony zapisują się w tej przeglądarce.
            </p>
          </div>
        )}
      </main>
    </GsShell>
  );
}
