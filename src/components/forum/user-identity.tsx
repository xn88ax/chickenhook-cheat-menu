import { Link } from "@tanstack/react-router";
import { ExternalLink, ShieldCheck } from "lucide-react";

import { Avatar } from "@/components/forum/forum-shell";

const ROLE_LABELS: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  moderator: "Moderator",
  user: "Użytkownik",
};

export function RoleBadge({ role }: { role: string }) {
  const highlighted = role === "owner" || role === "admin";
  return (
    <span
      className={`forum-role-badge forum-role-${role}${highlighted ? " forum-role-glitter" : ""}`}
    >
      <ShieldCheck className="size-3" aria-hidden />
      {ROLE_LABELS[role] ?? role}
    </span>
  );
}

export type ForumIdentity = {
  id: string;
  username: string;
  roles: string[];
  links?: Array<string | null>;
  memberNumber?: number | null;
};

function linkLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "link";
  }
}

export function UserIdentity({ profile }: { profile: ForumIdentity }) {
  const links = (profile.links ?? []).filter((link): link is string => Boolean(link));

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar name={profile.username} className="size-9" />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-1.5">
          <Link
            to="/profil/$username"
            params={{ username: profile.username }}
            className="text-xs font-bold text-foreground hover:text-primary"
          >
            {profile.username}
          </Link>
          {profile.roles.map((role) => (
            <RoleBadge key={role} role={role} />
          ))}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground">
          <span className="font-mono">UID: {profile.memberNumber ?? "?"}</span>
          {links.map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-0.5 hover:text-primary"
            >
              <ExternalLink className="size-2.5" aria-hidden />
              {linkLabel(url)}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}