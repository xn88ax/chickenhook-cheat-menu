import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ExternalLink, ImagePlus, Loader2, Lock, RotateCcw } from "lucide-react";

import { GsPanel, GsShell } from "@/components/gs-shell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { useSiteSettings } from "@/lib/site-settings";
import { isRememberSession, setRememberSession } from "@/lib/session-persistence";
import {
  ACCENTS,
  PROFILE_THEMES,
  accentColor,
  isCustomAccent,
  profileTheme,
  uploadProfileMedia,
  useProfileMedia,
} from "@/lib/profile-media";
import { SOCIAL_PLATFORMS, parseSocials, type Socials } from "@/lib/socials";

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
  const { isAdmin } = useIsAdmin();
  const qc = useQueryClient();
  const { settings, update, reset } = useSiteSettings();
  const [tab, setTab] = useState<Tab>("profile");

  const [username, setUsername] = useState("");
  const [nameState, setNameState] = useState<{ busy: boolean; msg: string | null; err: boolean }>({
    busy: false,
    msg: null,
    err: false,
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [passState, setPassState] = useState<{ busy: boolean; msg: string | null; err: boolean }>({
    busy: false,
    msg: null,
    err: false,
  });
  const [remember, setRemember] = useState(true);

  useEffect(() => setRemember(isRememberSession()), []);

  const [bio, setBio] = useState("");
  const [accent, setAccent] = useState("red");
  const [socials, setSocials] = useState<Socials>({});
  const [profileState, setProfileState] = useState<{
    busy: boolean;
    msg: string | null;
    err: boolean;
  }>({ busy: false, msg: null, err: false });

  const { data: profile } = useQuery({
    enabled: !!user,
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("username, bio, avatar_url, banner_url, accent, views, socials")
        .eq("id", user!.id)
        .maybeSingle();
      return data ?? null;
    },
  });

  const avatarUrl = useProfileMedia(profile?.avatar_url);
  const bannerUrl = useProfileMedia(profile?.banner_url);

  useEffect(() => {
    if (profile?.username) setUsername(profile.username);
    if (profile) {
      setBio(profile.bio ?? "");
      setAccent(profile.accent ?? "red");
      setSocials(parseSocials(profile.socials));
    }
  }, [profile]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    const normalizedSocials: Socials = {};
    for (const { id } of SOCIAL_PLATFORMS) {
      const value = (socials[id] ?? "").trim();
      if (!value) continue;
      try {
        if (!["http:", "https:"].includes(new URL(value).protocol)) throw new Error();
      } catch {
        setProfileState({ busy: false, msg: "Linki muszą zaczynać się od http:// lub https://.", err: true });
        return;
      }
      normalizedSocials[id] = value;
    }
    setProfileState({ busy: true, msg: null, err: false });
    const { error } = await supabase
      .from("profiles")
      .update({
        bio: bio.slice(0, 500),
        accent,
        socials: normalizedSocials,
      })
      .eq("id", user!.id);
    await qc.invalidateQueries({ queryKey: ["profile", user?.id] });
    setProfileState({
      busy: false,
      msg: error ? "Nie udało się zapisać profilu." : "Profil zapisany.",
      err: !!error,
    });
  }

  async function pickMedia(kind: "avatar" | "banner", file: File | null | undefined) {
    if (!file || !user) return;
    setProfileState({ busy: true, msg: null, err: false });
    try {
      const path = await uploadProfileMedia(user.id, kind, file);
      const { error } = await supabase
        .from("profiles")
        .update(kind === "avatar" ? { avatar_url: path } : { banner_url: path })
        .eq("id", user.id);
      if (error) throw error;
      await qc.invalidateQueries({ queryKey: ["profile", user.id] });
      setProfileState({
        busy: false,
        msg: kind === "avatar" ? "Nowe zdjęcie profilowe." : "Nowy banner.",
        err: false,
      });
    } catch {
      setProfileState({
        busy: false,
        msg: "Nie udało się wgrać pliku (maks. 8 MB, obrazek lub GIF).",
        err: true,
      });
    }
  }

  async function clearMedia(kind: "avatar" | "banner") {
    if (!user) return;
    await supabase
      .from("profiles")
      .update(kind === "avatar" ? { avatar_url: null } : { banner_url: null })
      .eq("id", user.id);
    await qc.invalidateQueries({ queryKey: ["profile", user.id] });
  }

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
    if (!currentPassword) {
      setPassState({ busy: false, msg: "Podaj obecne hasło.", err: true });
      return;
    }
    if (password.length < 8) {
      setPassState({ busy: false, msg: "Hasło musi mieć min. 8 znaków.", err: true });
      return;
    }
    if (password !== password2) {
      setPassState({ busy: false, msg: "Hasła nie są takie same.", err: true });
      return;
    }
    if (password === currentPassword) {
      setPassState({ busy: false, msg: "Nowe hasło musi być inne niż obecne.", err: true });
      return;
    }
    setPassState({ busy: true, msg: null, err: false });

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: user!.email!,
      password: currentPassword,
    });
    if (authError) {
      setPassState({ busy: false, msg: "Obecne hasło jest nieprawidłowe.", err: true });
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    setCurrentPassword("");
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
            <GsPanel title="Profil publiczny" className="lg:col-span-2 overflow-hidden">
              <div
                className="profile-banner relative h-36 w-full"
                style={{
                  ...(bannerUrl ? { backgroundImage: `url(${bannerUrl})` } : {}),
                  ["--profile-accent" as string]: accentColor(accent),
                }}
                aria-hidden="true"
              >
                {!bannerUrl && <div className="profile-banner-fallback" />}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-2/3"
                  style={{
                    background: `linear-gradient(to bottom, ${accentColor(accent)}99, transparent)`,
                  }}
                  aria-hidden="true"
                />
              </div>
              <form className="space-y-4 p-4" onSubmit={saveProfile}>
                <div className="flex flex-wrap items-center gap-4">
                  <div
                    className="relative z-10 -mt-12 size-16 shrink-0 overflow-hidden rounded-xl border-2 bg-card"
                    style={{ borderColor: accentColor(accent) }}
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Twoje zdjęcie profilowe" className="size-full object-cover" />
                    ) : (
                      <div className="flex size-full items-center justify-center font-display text-xl text-muted-foreground">
                        {(profile?.username ?? "??").slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 py-2 hover:border-primary">
                      <ImagePlus className="size-3" />
                      Zdjęcie profilowe
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        className="hidden"
                        onChange={(e) => void pickMedia("avatar", e.target.files?.[0])}
                      />
                    </label>
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 py-2 hover:border-primary">
                      <ImagePlus className="size-3" />
                      Banner (GIF działa)
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        className="hidden"
                        onChange={(e) => void pickMedia("banner", e.target.files?.[0])}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => void clearMedia("avatar")}
                      className="rounded-lg border border-border px-3 py-2 text-muted-foreground hover:border-primary"
                    >
                      Usuń zdjęcie
                    </button>
                    <button
                      type="button"
                      onClick={() => void clearMedia("banner")}
                      className="rounded-lg border border-border px-3 py-2 text-muted-foreground hover:border-primary"
                    >
                      Usuń banner
                    </button>
                  </div>
                  {profile?.username && (
                    <Link
                      to="/profil/$username"
                      params={{ username: profile.username }}
                      className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-primary"
                    >
                      <ExternalLink className="size-3" />
                      Zobacz profil ({profile.views} odwiedzin)
                    </Link>
                  )}
                </div>

                <label className="block text-xs">
                  <span className="text-muted-foreground">O sobie (maks. 500 znaków)</span>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={500}
                    rows={4}
                    className={`${inputClass} resize-y`}
                  />
                </label>

                <div className="space-y-2 text-xs">
                  <span className="text-muted-foreground">Sociale na profilu</span>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {SOCIAL_PLATFORMS.map((platform) => (
                      <label key={platform.id} className="block">
                        <span className="text-[11px] text-muted-foreground">{platform.label}</span>
                        <input
                          type="url"
                          value={socials[platform.id] ?? ""}
                          onChange={(event) =>
                            setSocials((current) => ({
                              ...current,
                              [platform.id]: event.target.value,
                            }))
                          }
                          maxLength={300}
                          placeholder={platform.placeholder}
                          className={inputClass}
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="text-xs">
                  <span className="text-muted-foreground">Kolor profilu</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {ACCENTS.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setAccent(a.id)}
                        aria-pressed={accent === a.id}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 ${accent === a.id ? "border-primary text-foreground" : "border-border text-muted-foreground"}`}
                      >
                        <span
                          className="size-3 rounded-full"
                          style={{ backgroundColor: a.color }}
                        />
                        {a.label}
                      </button>
                    ))}
                    <label
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 ${isCustomAccent(accent) ? "border-primary text-foreground" : "border-border text-muted-foreground"}`}
                    >
                      <input
                        type="color"
                        value={accentColor(accent)}
                        onChange={(event) => setAccent(event.target.value.toLowerCase())}
                        className="size-4 cursor-pointer rounded border-0 bg-transparent p-0"
                        aria-label="Własny kolor profilu"
                      />
                      Własny kolor
                    </label>
                  </div>
                  {isCustomAccent(accent) && (
                    <p className="mt-1 font-mono text-[10px] text-muted-foreground">{accent}</p>
                  )}
                </div>

                <div className="text-xs">
                  <span className="text-muted-foreground">Motyw profilu</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {PROFILE_THEMES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTheme(t.id)}
                        aria-pressed={theme === t.id}
                        className={`rounded-lg border px-2.5 py-1.5 ${theme === t.id ? "border-primary text-foreground" : "border-border text-muted-foreground"}`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>


                <button type="submit" disabled={profileState.busy} className={btnClass}>
                  {profileState.busy ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Check className="size-3" />
                  )}
                  Zapisz profil
                </button>
                {profileState.msg && (
                  <p
                    className={`text-[11px] ${profileState.err ? "text-primary" : "text-[var(--status-ok)]"}`}
                  >
                    {profileState.msg}
                  </p>
                )}
              </form>
            </GsPanel>

            <GsPanel title="Nick">
              <form className="space-y-3 p-4" onSubmit={saveUsername}>
                <label className="block text-xs">
                  <span className="text-muted-foreground">Nick na forum i czacie</span>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    minLength={3}
                    maxLength={24}
                    required
                    disabled={!isAdmin}
                    className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-60`}
                  />
                </label>
                {isAdmin ? (
                  <>
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
                  </>
                ) : (
                  <p className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                    <Lock className="mt-0.5 size-3 shrink-0 text-primary" />
                    Nick zmienia tylko administracja kurnika — napisz na forum, jeśli chcesz zmianę.
                  </p>
                )}
              </form>
            </GsPanel>

            <GsPanel title="Hasło">
              <form className="space-y-3 p-4" onSubmit={savePassword}>
                <label className="block text-xs">
                  <span className="text-muted-foreground">Obecne hasło</span>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className={inputClass}
                  />
                </label>
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
