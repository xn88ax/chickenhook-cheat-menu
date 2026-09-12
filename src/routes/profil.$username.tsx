import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Eye, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";

import { GsPanel, GsShell } from "@/components/gs-shell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { accentColor, useProfileMedia } from "@/lib/profile-media";

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

function ProfilePage() {
  const { username } = Route.useParams();
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["public-profile", username],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, username, bio, avatar_url, banner_url, accent, views, created_at")
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

  return (
    <GsShell crumbs={[{ label: "Profil" }]}>
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
            <GsPanel className="overflow-hidden">
              <div
                className="profile-banner relative h-40 w-full sm:h-52"
                style={{
                  ...(banner ? { backgroundImage: `url(${banner})` } : {}),
                  ["--profile-accent" as string]: accent,
                }}
                aria-hidden="true"
              >
                {!banner && <div className="profile-banner-fallback" />}
              </div>

              <div className="flex flex-wrap items-end gap-4 px-4 pb-4">
                <div
                  className="-mt-10 size-20 shrink-0 overflow-hidden rounded-xl border-2 bg-card"
                  style={{ borderColor: accent }}
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={`Zdjęcie profilowe ${profile.username}`}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center font-display text-2xl text-muted-foreground">
                      {profile.username.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="font-display text-2xl tracking-wide" style={{ color: accent }}>
                    {profile.username}
                  </h1>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    W kurniku od {pl(profile.created_at)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  {(roles ?? []).map((r) => (
                    <span
                      key={r}
                      className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1 text-foreground"
                    >
                      <ShieldCheck className="size-3" style={{ color: accent }} />
                      {r}
                    </span>
                  ))}
                  {isMine && (
                    <Link
                      to="/ustawienia"
                      className="rounded-full border border-border px-3 py-1 font-semibold text-primary hover:brightness-110"
                    >
                      Edytuj profil
                    </Link>
                  )}
                </div>
              </div>
            </GsPanel>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              <GsPanel title="O sobie">
                <p className="whitespace-pre-wrap p-4 text-xs leading-relaxed text-muted-foreground">
                  {profile.bio?.trim() || "Ten kurczak nic o sobie nie napisał."}
                </p>
              </GsPanel>

              <GsPanel title="Statystyki">
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
