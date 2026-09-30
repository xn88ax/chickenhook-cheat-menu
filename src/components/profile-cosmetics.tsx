import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

import { avatarDecoration, avatarDecorationImg, nameplate, nameplateMedia, nickVars, profileEffect, profileEffectMedia } from "@/lib/profile-media";

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

function MediaEffect({ media }: { media: NonNullable<ReturnType<typeof profileEffectMedia>> }) {
  const [phase, setPhase] = useState<"intro" | "loop">("intro");
  useEffect(() => {
    setPhase("intro");
    if (!media.loop) return;
    const t = window.setTimeout(() => setPhase("loop"), media.introMs || 3000);
    return () => window.clearTimeout(t);
  }, [media]);
  const src = phase === "loop" && media.loop ? media.loop : media.intro;
  return (
    <div className="profile-effect-media" aria-hidden="true">
      <img key={src} src={src} alt="" />
    </div>
  );
}

export function ProfileEffectLayer({ effect }: { effect?: string | null }) {
  const selected = profileEffect(effect);
  if (selected === "none") return null;
  const media = profileEffectMedia(selected);
  if (media) return <MediaEffect media={media} />;
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
  const media = nameplateMedia(selected);
  return (
    <span
      className={`nameplate nameplate-${media ? "media" : selected}${compact ? " nameplate-compact" : ""}`}
      style={nickVars(accent, accent2) as CSSProperties}
    >
      {media ? (
        <video className="nameplate-video" src={media.video} poster={media.still} autoPlay loop muted playsInline aria-hidden="true" />
      ) : null}
      {children}
    </span>
  );
}