import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { AtSign, ShieldCheck } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

import { DecoratedAvatar, Nameplate, ProfileEffectLayer } from "@/components/profile-cosmetics";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
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
  created_at?: string | null;
  member_number?: number | null;
  roles?: string[];
};

const CARD_FIELDS =
  "id, username, display_name, bio, avatar_url, banner_url, accent, accent_2, name_effect, name_font, avatar_decoration, profile_effect, nameplate, profile_frame, status, created_at, member_number";

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
  const status = userStatus(profile.status);
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
