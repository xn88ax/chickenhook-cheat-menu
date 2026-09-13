// Platformy społecznościowe dostępne na profilu.
export const SOCIAL_PLATFORMS = [
  { id: "youtube", label: "YouTube", placeholder: "https://youtube.com/@twojkanal" },
  { id: "x", label: "X (Twitter)", placeholder: "https://x.com/twojnick" },
  { id: "instagram", label: "Instagram", placeholder: "https://instagram.com/twojnick" },
  { id: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@twojnick" },
  { id: "discord", label: "Discord", placeholder: "https://discord.gg/twojserwer" },
  { id: "twitch", label: "Twitch", placeholder: "https://twitch.tv/twojnick" },
  { id: "steam", label: "Steam", placeholder: "https://steamcommunity.com/id/twojnick" },
  { id: "spotify", label: "Spotify", placeholder: "https://open.spotify.com/user/…" },
  { id: "soundcloud", label: "SoundCloud", placeholder: "https://soundcloud.com/twojnick" },
  { id: "telegram", label: "Telegram", placeholder: "https://t.me/twojnick" },
] as const;

export type SocialId = (typeof SOCIAL_PLATFORMS)[number]["id"];

export type Socials = Partial<Record<SocialId, string>>;

export function parseSocials(raw: unknown): Socials {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Socials = {};
  for (const { id } of SOCIAL_PLATFORMS) {
    const value = (raw as Record<string, unknown>)[id];
    if (typeof value === "string" && value.trim()) out[id] = value.trim();
  }
  return out;
}
