import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Eye, MessageSquare, Sparkles } from "lucide-react";

import { RoleBadge } from "@/components/forum/user-identity";
import { GsPanel, GsShell } from "@/components/gs-shell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { accentColor, useProfileMedia } from "@/lib/profile-media";
import { SOCIAL_PLATFORMS, parseSocials } from "@/lib/socials";

export const Route = createFileRoute("/profil/$username")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.username} — profil na chickenhook.wtf` },
      {
        name: "description",
        content: `Profil ${params.username} w kurniku chickenhook.wtf: banner, opis, liczba odwiedzin oraz aktywność na forum.`,
      },
      { property: "og:title", content: `${params.username} — chickenhook.wtf` },
      {
        property: "og:description",
        content: `Zobacz profil ${params.username} na forum chickenhook.wtf.`,
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

const months = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"];
function pl(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
function plTime(iso: string) {
  const d = new Date(iso);
  return `${pl(iso)} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

const TABS = [
  ["about", "O mnie"],
  ["activity", "Ostatnia aktywność"],
] as const;
type Tab = (typeof TABS)[number][0];

const ROLE_TITLES: Record<string, string> = {
  owner: "Właściciel kurnika",
  admin: "Administrator",
  moderator: "Moderator",
};

function ProfilePage() {
  const { username } = Route.useParams();
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("about");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["public-profile", username],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, username, bio, avatar_url, banner_url, accent, views, created_at, socials, member_number")
        .ilike("username", username)
        .maybeSingle();
      return data ?? null;
    },
  });

  const { data: stats } = useQuery({
    enabled: !!profile?.id,
    queryKey: ["public-profile-stats", profile?.id],
    queryFn: async () => {
      const [threads, posts, shouts] = await Promise.all([
        supabase
          .from("forum_threads")
          .select("id", { count: "exact", head: true })
          .eq("author_id", profile!.id),
        supabase
          .from("forum_posts")
          .select("id", { count: "exact", head: true })
          .eq("author_id", profile!.id),
        supabase
          .from("shouts")
          .select("id", { count: "exact", head: true })
          .eq("user_id", profile!.id),
      ]);
      return {
        threads: threads.count ?? 0,
        posts: posts.count ?? 0,
        shouts: shouts.count ?? 0,
      };
    },
  });

  const { data: activity } = useQuery({
    enabled: !!profile?.id,
    queryKey: ["public-profile-activity", profile?.id],
    queryFn: async () => {
      const [threads, posts] = await Promise.all([
        supabase
          .from("forum_threads")
          .select("id, title, created_at")
          .eq("author_id", profile!.id)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("forum_posts")
          .select("id, body, created_at, thread_id")
          .eq("author_id", profile!.id)
          .order("created_at", { ascending: false })
          .limit(10),
      ]);
      const items = [
        ...(threads.data ?? []).map((t) => ({
          key: `t-${t.id}`,
          kind: "Nowy wątek",
          text: t.title,
          at: t.created_at,
          threadId: t.id,
        })),
        ...(posts.data ?? []).map((p) => ({
          key: `p-${p.id}`,
          kind: "Odpowiedź w wątku",
          text: p.body.slice(0, 140),
          at: p.created_at,
          threadId: p.thread_id,
        })),
      ];
      return items.sort((a, b) => b.at.localeCompare(a.at)).slice(0, 12);
    },
  });

  const { data: roles } = useQuery({
    enabled: !!profile?.id && !!user,
    queryKey: ["public-profile-roles", profile?.id],
    queryFn: async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", profile!.id);
      return (data ?? []).map((r) => r.role as string);
    },
  });

  const banner = useProfileMedia(profile?.banner_url);
  const avatar = useProfileMedia(profile?.avatar_url);
  const accent = accentColor(profile?.accent);

  // Licznik odwiedzin: raz na sesję przeglądarki na dany profil.
  useEffect(() => {
    if (!profile?.username) return;
    const key = `chickenhook_view_${profile.username.toLowerCase()}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    void supabase.rpc("bump_profile_view", { _username: profile.username });
  }, [profile?.username]);

  const isMine = !!user && user.id === profile?.id;
  const roleList = roles ?? [];
  const title =
    ROLE_TITLES[roleList.find((r) => ROLE_TITLES[r]) ?? ""] ?? "Członek kurnika";
  const socials = parseSocials(profile?.socials);
  const socialEntries = SOCIAL_PLATFORMS.filter((p) => socials[p.id]);

  return (
    <GsShell crumbs={[{ label: "Członkowie" }, { label: username }]}>
      <main className="mx-auto max-w-[1160px] px-5 py-6">
        {isLoading ? (
          <p className="text-xs text-muted-foreground">Szukam w kurniku…</p>
        ) : !profile ? (
          <GsPanel title="Nie ma takiego kurczaka">
            <p className="p-4 text-xs text-muted-foreground">
              Profil „{username}” nie istnieje.{" "}
              <Link to="/forum" className="text-primary">
                Wróć na forum
              </Link>
              .
            </p>
          </GsPanel>
        ) : (
          <>
            {/* Nagłówek profilu w stylu forumowej karty członka */}
            <GsPanel className="overflow-hidden">
              <div
                className="profile-banner relative h-40 w-full sm:h-56"
                style={{
                  ...(banner ? { backgroundImage: `url(${banner})` } : {}),
                  ["--profile-accent" as string]: accent,
                }}
                aria-hidden="true"
              >
                {!banner && <div className="profile-banner-fallback" />}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
                  style={{
                    background: `linear-gradient(to top, ${accent}66, transparent)`,
                  }}
                  aria-hidden="true"
                />
              </div>

              <div className="flex flex-wrap items-end gap-4 border-b border-border/60 px-4 pb-4">
                <div
                  className="relative z-10 -mt-14 size-24 shrink-0 overflow-hidden rounded-lg border-2 bg-card sm:size-28"
                  style={{ borderColor: accent }}
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={`Zdjęcie profilowe ${profile.username}`}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center font-display text-3xl text-muted-foreground">
                      {profile.username.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="font-display text-2xl tracking-wide" style={{ color: accent }}>
                    {profile.username}
                  </h1>
                  <p className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                    {title}
                  </p>
                  <p className="mt-1 break-all font-mono text-[10px] text-muted-foreground">
                    UID: {profile.member_number}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                    {roleList.map((r) => (
                      <RoleBadge key={r} role={r} />
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  {isMine ? (
                    <Link
                      to="/ustawienia"
                      className="rounded border border-border px-3 py-1.5 font-semibold text-primary hover:border-primary"
                    >
                      Edytuj profil
                    </Link>
                  ) : (
                    <Link
                      to="/forum"
                      className="rounded border border-border px-3 py-1.5 font-semibold text-muted-foreground hover:border-primary hover:text-foreground"
                    >
                      Znajdź posty
                    </Link>
                  )}
                </div>
              </div>

              {/* Pasek liczników jak w profilu forum */}
              <dl className="grid grid-cols-1 divide-y divide-border/60 text-xs sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {[
                  ["Wiadomości", (stats?.posts ?? 0) + (stats?.threads ?? 0)],
                  ["Odwiedziny", profile.views],
                  ["Dołączył", pl(profile.created_at)],
                ].map(([label, value]) => (
                  <div key={label as string} className="px-4 py-3">
                    <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      {label as string}
                    </dt>
                    <dd className="mt-0.5 font-semibold tabular-nums text-foreground">
                      {value as string | number}
                    </dd>
                  </div>
                ))}
              </dl>
            </GsPanel>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
              <div>
                <nav className="flex gap-1 rounded-xl border border-border bg-secondary/50 p-1">
                  {TABS.map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setTab(id)}
                      aria-current={tab === id}
                      className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                        tab === id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </nav>

                {tab === "about" && (
                  <div className="mt-4 space-y-4">
                    <GsPanel title="O mnie">
                      <p className="whitespace-pre-wrap p-4 text-xs leading-relaxed text-muted-foreground">
                        {profile.bio?.trim() || "Ten kurczak nic o sobie nie napisał."}
                      </p>
                    </GsPanel>
                    <GsPanel title="Sociale">
                      <div className="flex flex-wrap gap-2 p-4">
                        {socialEntries.map((platform) => (
                          <a
                            key={platform.id}
                            href={socials[platform.id]}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex max-w-full items-center gap-1.5 rounded border border-border px-3 py-2 text-xs text-foreground hover:border-primary hover:text-primary"
                          >
                            <ExternalLink className="size-3 shrink-0" aria-hidden />
                            <span className="truncate">{platform.label}</span>
                          </a>
                        ))}
                        {socialEntries.length === 0 && (
                          <p className="text-xs text-muted-foreground">Brak dodanych sociali.</p>
                        )}
                      </div>
                    </GsPanel>
                  </div>
                )}

                {tab === "activity" && (
                  <GsPanel title="Ostatnia aktywność" className="mt-4">
                    <div className="divide-y divide-border/60">
                      {(activity ?? []).map((a) => (
                        <div key={a.key} className="px-4 py-3 text-xs">
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                            {a.kind} · {plTime(a.at)}
                          </p>
                          <Link
                            to="/forum/watek/$id"
                            params={{ id: a.threadId }}
                            className="mt-1 block text-foreground hover:text-primary"
                          >
                            {a.text}
                          </Link>
                        </div>
                      ))}
                      {(activity ?? []).length === 0 && (
                        <p className="px-4 py-4 text-xs text-muted-foreground">
                          Brak aktywności na forum.
                        </p>
                      )}
                    </div>
                  </GsPanel>
                )}
              </div>

              <GsPanel title="Informacje" className="lg:mt-11">
                <dl className="divide-y divide-border/60 text-xs">
                  {[
                    ["Odwiedziny profilu", profile.views, Eye],
                    ["Wątki na forum", stats?.threads ?? 0, MessageSquare],
                    ["Posty na forum", stats?.posts ?? 0, MessageSquare],
                    ["Wiadomości na czacie", stats?.shouts ?? 0, Sparkles],
                  ].map(([label, value, Icon]) => {
                    const I = Icon as typeof Eye;
                    return (
                      <div
                        key={label as string}
                        className="flex items-center justify-between px-4 py-2.5"
                      >
                        <dt className="flex items-center gap-2 text-muted-foreground">
                          <I className="size-3" style={{ color: accent }} />
                          {label as string}
                        </dt>
                        <dd className="font-semibold tabular-nums text-foreground">
                          {value as number}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </GsPanel>
            </div>
          </>
        )}
      </main>
    </GsShell>
  );
}
