import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { AtSign, ShieldCheck } from "lucide-react";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

import { DecoratedAvatar, Nameplate, ProfileEffectLayer } from "@/components/profile-cosmetics";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { subscribeOnlineUsers } from "@/lib/presence";
import {
  accentColor,
  nameEffect,
  nameFont,
  nickVars,
  profileFrame,
  secondAccent,
  userStatus,
  USER_STATUSES,
  useProfileMedia,
} from "@/lib/profile-media";
import { useRoleStyles } from "@/lib/role-styles";

/** Czy użytkownik jest teraz na stronie (Realtime Presence). */
export function useUserOnline(userId: string | null | undefined) {
  const [online, setOnline] = useState(false);
  useEffect(() => {
    if (!userId) return;
    return subscribeOnlineUsers((ids) => setOnline(ids.has(userId)));
  }, [userId]);
  return online;
}

export type ProfileCardData = {
  id: string;
  username: string;
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  banner_url?: string | null;
  accent?: string | null;
  accent_2?: string | null;
  name_effect?: string | null;
  name_font?: string | null;
  avatar_decoration?: string | null;
  profile_effect?: string | null;
  nameplate?: string | null;
  profile_frame?: string | null;
  status?: string | null;
  activity?: string | null;
  discord_id?: string | null;
  created_at?: string | null;
  member_number?: number | null;
  roles?: string[];
};

const CARD_FIELDS =
  "id, username, display_name, bio, avatar_url, banner_url, accent, accent_2, name_effect, name_font, avatar_decoration, profile_effect, nameplate, profile_frame, status, activity, discord_id, created_at, member_number";

const ROLE_LABELS: Record<string, string> = { owner: "Owner", admin: "Admin", moderator: "Moderator" };

export function useProfileCard(username: string | null | undefined, enabled = true) {
  return useQuery({
    enabled: !!username && enabled,
    queryKey: ["profile-card", username?.toLowerCase()],
    staleTime: 60_000,
    queryFn: async (): Promise<ProfileCardData | null> => {
      const { data } = await supabase.from("profiles").select(CARD_FIELDS).ilike("username", username!).maybeSingle();
      if (!data) return null;
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.id);
      return { ...data, roles: (roles ?? []).map((r) => r.role as string) };
    },
  });
}

type LanyardActivity = { name: string; type: number; details?: string; state?: string; application_id?: string; assets?: { large_image?: string } };
type LanyardData = {
  discord_status: string;
  activities: LanyardActivity[];
  listening_to_spotify?: boolean;
  spotify?: { song: string; artist: string; album_art_url: string } | null;
};

export function useDiscordPresence(discordId: string | null | undefined) {
  const id = discordId?.trim();
  return useQuery({
    enabled: !!id && /^\d{15,21}$/.test(id),
    queryKey: ["lanyard", id],
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: false,
    queryFn: async (): Promise<LanyardData | null> => {
      const r = await fetch(`https://api.lanyard.rest/v1/users/${id}`);
      if (!r.ok) return null;
      const j = await r.json();
      return j?.success ? (j.data as LanyardData) : null;
    },
  });
}

function activityImage(a: LanyardActivity) {
  const img = a.assets?.large_image;
  if (!img) return null;
  if (img.startsWith("mp:external/")) return `https://media.discordapp.net/external/${img.slice(12)}`;
  if (a.application_id) return `https://cdn.discordapp.com/app-assets/${a.application_id}/${img}.png`;
  return null;
}

const ACT_VERB: Record<number, string> = { 0: "Gra w", 1: "Streamuje", 2: "Słucha", 3: "Ogląda", 5: "Rywalizuje w" };

function ActivityBlock({ activity, discordId }: { activity?: string | null; discordId?: string | null }) {
  const { data } = useDiscordPresence(discordId);
  const game = data?.activities.find((a) => a.type !== 4 && a.type !== 2);
  const custom = data?.activities.find((a) => a.type === 4)?.state;
  const spotify = data?.listening_to_spotify ? data.spotify : null;
  const own = activity?.trim();
  if (!game && !spotify && !own && !custom) return null;
  return (
    <div className="dc-section">
      <h4>Aktywność{data ? " · Discord" : ""}</h4>
      {own || custom ? <p>💬 {own || custom}</p> : null}
      {game ? (
        <div className="mt-1 flex items-center gap-2">
          {activityImage(game) ? <img src={activityImage(game)!} alt="" className="size-10 rounded-md" /> : null}
          <div className="min-w-0 text-xs">
            <div className="text-muted-foreground">{ACT_VERB[game.type] ?? "Gra w"}</div>
            <div className="truncate font-semibold">{game.name}</div>
            {game.details ? <div className="truncate text-muted-foreground">{game.details}</div> : null}
            {game.state ? <div className="truncate text-muted-foreground">{game.state}</div> : null}
          </div>
        </div>
      ) : null}
      {spotify ? (
        <div className="mt-1 flex items-center gap-2">
          <img src={spotify.album_art_url} alt="" className="size-10 rounded-md" />
          <div className="min-w-0 text-xs">
            <div className="text-muted-foreground">Słucha Spotify</div>
            <div className="truncate font-semibold">{spotify.song}</div>
            <div className="truncate text-muted-foreground">{spotify.artist}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function isVideo(url: string | null | undefined) {
  return !!url && /\.(webm|mp4)(\?|$)/i.test(url);
}

export function ProfileCard({
  profile,
  size = "popout",
  actions,
}: {
  profile: ProfileCardData;
  size?: "popout" | "full";
  actions?: ReactNode;
}) {
  const avatar = useProfileMedia(profile.avatar_url);
  const banner = useProfileMedia(profile.banner_url);
  const roleStyles = useRoleStyles();
  const c1 = accentColor(profile.accent);
  const c2 = secondAccent(profile.accent_2, profile.accent);
  const online = useUserOnline(profile.id);
  const status = online ? userStatus(profile.status) : "offline";
  const statusLabel = USER_STATUSES.find((s) => s.id === status)?.label;
  const fx = nameEffect(profile.name_effect);
  const font = nameFont(profile.name_font);
  const frame = profileFrame(profile.profile_frame);
  const display = profile.display_name?.trim() || profile.username;
  const badges = (profile.roles ?? []).filter((r) => ROLE_LABELS[r]);

  return (
    <div
      className={`dc-card-frame dc-frame-${frame} ${size === "full" ? "dc-card-full" : ""}`}
      style={{ "--dc-1": c1, "--dc-2": c2 } as CSSProperties}
    >
      <div className="dc-card">
        <ProfileEffectLayer effect={profile.profile_effect} />
        <div className="dc-banner">
          {banner ? (
            isVideo(profile.banner_url) ? (
              <video src={banner} autoPlay loop muted playsInline />
            ) : (
              <img src={banner} alt="" />
            )
          ) : null}
        </div>

        <div className="dc-avatar-wrap">
          <DecoratedAvatar decoration={profile.avatar_decoration} accent={profile.accent} accent2={profile.accent_2} className="dc-avatar">
            {avatar ? (
              <img src={avatar} alt="" className="size-full rounded-full object-cover" />
            ) : (
              <span className="flex size-full items-center justify-center rounded-full bg-[var(--dc-1)] text-2xl font-bold uppercase text-primary-foreground">
                {profile.username.slice(0, 2)}
              </span>
            )}
          </DecoratedAvatar>
          <span className={`dc-status dc-status-${status}`} title={statusLabel} aria-label={statusLabel} />
        </div>

        {badges.length ? (
          <div className="dc-badges">
            {badges.map((r) => (
              <span
                key={r}
                className="dc-badge"
                title={ROLE_LABELS[r]}
                style={roleStyles[r] ? ({ "--role-color": roleStyles[r].color } as CSSProperties) : undefined}
              >
                <ShieldCheck className="size-3.5" />
              </span>
            ))}
          </div>
        ) : null}

        <div className="dc-body">
          <div className="dc-names">
            <Nameplate variant={profile.nameplate} accent={profile.accent} accent2={profile.accent_2}>
              <span
                className={`dc-display nick-fx nick-fx-${fx}`}
                style={{ ...nickVars(profile.accent, profile.accent_2), fontFamily: font.family } as CSSProperties}
              >
                {display}
              </span>
            </Nameplate>
            <div className="dc-handle">
              {profile.username}
              {profile.member_number ? <span> · UID {profile.member_number}</span> : null}
            </div>
            {badges.length ? (
              <div className="mt-1 flex flex-wrap gap-1">
                {badges.map((r) => (
                  <span key={r} className="dc-role-pill" style={roleStyles[r] ? ({ "--role-color": roleStyles[r].color } as CSSProperties) : undefined}>
                    {ROLE_LABELS[r]}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <ActivityBlock activity={profile.activity} discordId={profile.discord_id} />
          <div className="dc-section">
            {profile.bio ? (
              <>
                <h4>O mnie</h4>
                <p className="whitespace-pre-wrap">{profile.bio}</p>
              </>
            ) : null}
            {profile.created_at ? (
              <>
                <h4>Członek od</h4>
                <p>{new Date(profile.created_at).toLocaleDateString("pl-PL", { day: "numeric", month: "short", year: "numeric" })}</p>
              </>
            ) : null}
          </div>
          {actions ? <div className="dc-actions">{actions}</div> : null}
        </div>
      </div>
    </div>
  );
}

/** Kliknięcie nicka → karta profilu w stylu Discorda. */
export function ProfilePopover({
  username,
  children,
  onMention,
}: {
  username: string;
  children: ReactNode;
  onMention?: () => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent side="right" align="start" sideOffset={8} className="w-auto border-0 bg-transparent p-0 shadow-none">
        <PopoverCardBody username={username} onMention={onMention} />
      </PopoverContent>
    </Popover>
  );
}

function PopoverCardBody({ username, onMention }: { username: string; onMention?: () => void }) {
  const { data, isLoading } = useProfileCard(username);
  if (isLoading) return <div className="dc-card-frame"><div className="dc-card grid h-48 place-items-center text-xs text-muted-foreground">Ładowanie…</div></div>;
  if (!data) return <div className="dc-card-frame"><div className="dc-card p-4 text-xs text-muted-foreground">Nie znaleziono profilu.</div></div>;
  return (
    <ProfileCard
      profile={data}
      actions={
        <>
          <Link to="/profil/$username" params={{ username: data.username }} className="dc-btn dc-btn-primary">
            Zobacz profil
          </Link>
          {onMention ? (
            <button type="button" className="dc-btn" onClick={onMention}>
              <AtSign className="size-3.5" /> Oznacz
            </button>
          ) : null}
        </>
      }
    />
  );
}
