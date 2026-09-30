import type { CSSProperties, ReactNode } from "react";

import { avatarDecoration, avatarDecorationImg, nameplate, nickVars, profileEffect } from "@/lib/profile-media";

export function DecoratedAvatar({
  decoration,
  accent,
  accent2,
  className = "",
  children,
}: {
  decoration?: string | null;
  accent?: string | null;
  accent2?: string | null;
  className?: string;
  children: ReactNode;
}) {
  const selected = avatarDecoration(decoration);
  const img = avatarDecorationImg(decoration);
  return (
    <div
      className={`avatar-cosmetic avatar-cosmetic-${selected} ${className}`}
      style={nickVars(accent, accent2) as CSSProperties}
      data-decoration={selected}
    >
      <div className="avatar-cosmetic-content">{children}</div>
      {img ? (
        <img className="avatar-cosmetic-img" src={img} alt="" aria-hidden="true" loading="lazy" />
      ) : (
        selected !== "none" && <span className="avatar-cosmetic-overlay" aria-hidden="true" />
      )}
    </div>
  );
}

export function ProfileEffectLayer({ effect }: { effect?: string | null }) {
  const selected = profileEffect(effect);
  if (selected === "none") return null;
  return (
    <div className={`profile-effect profile-effect-${selected}`} aria-hidden="true">
      {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
    </div>
  );
}

export function Nameplate({
  variant,
  accent,
  accent2,
  compact = false,
  children,
}: {
  variant?: string | null;
  accent?: string | null;
  accent2?: string | null;
  compact?: boolean;
  children: ReactNode;
}) {
  const selected = nameplate(variant);
  return (
    <span
      className={`nameplate nameplate-${selected}${compact ? " nameplate-compact" : ""}`}
      style={nickVars(accent, accent2) as CSSProperties}
    >
      {children}
    </span>
  );
}