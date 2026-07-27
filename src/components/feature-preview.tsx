import { useRef } from "react";

import noclipVideo from "@/assets/preview-noclip.mp4.asset.json";
import godVideo from "@/assets/preview-god.mp4.asset.json";
import bhopVideo from "@/assets/preview-bhop.mp4.asset.json";
import aimVideo from "@/assets/preview-aim.mp4.asset.json";
import triggerVideo from "@/assets/preview-trigger.mp4.asset.json";
import espVideo from "@/assets/preview-esp.mp4.asset.json";
import skinsVideo from "@/assets/preview-skins.mp4.asset.json";
import movementVideo from "@/assets/preview-movement.mp4.asset.json";
import miscVideo from "@/assets/preview-misc.mp4.asset.json";

export type PreviewKind =
  | "noclip"
  | "god"
  | "bhop"
  | "aim"
  | "trigger"
  | "esp"
  | "skins"
  | "movement"
  | "misc";

const clips: Record<PreviewKind, { url: string; label: string }> = {
  noclip: { url: noclipVideo.url, label: "NOCLIP" },
  god: { url: godVideo.url, label: "GOD MODE" },
  bhop: { url: bhopVideo.url, label: "BHOP" },
  aim: { url: aimVideo.url, label: "AIMBOT" },
  trigger: { url: triggerVideo.url, label: "TRIGGER" },
  esp: { url: espVideo.url, label: "ESP" },
  skins: { url: skinsVideo.url, label: "SKINS" },
  movement: { url: movementVideo.url, label: "MOVEMENT" },
  misc: { url: miscVideo.url, label: "MISC" },
};

export function FeaturePreview({ kind }: { kind: PreviewKind }) {
  const ref = useRef<HTMLVideoElement>(null);
  const clip = clips[kind];

  const play = () => {
    const el = ref.current;
    if (!el) return;
    el.play().catch(() => {});
  };

  const pause = () => {
    const el = ref.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
  };

  return (
    <div
      className="preview-stage relative mt-5 aspect-video w-full overflow-hidden rounded-md border border-border/70 bg-background/70"
      onMouseEnter={play}
      onMouseLeave={pause}
      onFocus={play}
      onBlur={pause}
    >
      <video
        ref={ref}
        src={clip.url}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={`Podgląd działania: ${clip.label}`}
        className="size-full object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100"
      />
      <span className="pointer-events-none absolute left-2 top-2 rounded-sm bg-background/70 px-2 py-0.5 text-[10px] font-bold tracking-widest text-accent backdrop-blur-sm">
        {clip.label}
      </span>
    </div>
  );
}
