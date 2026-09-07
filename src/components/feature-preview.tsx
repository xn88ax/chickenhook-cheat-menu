import { VideoOff } from "lucide-react";

import { getClipVideo, getClipYoutube } from "@/data/clips";

export type PreviewKind =
  | "noclip"
  | "god"
  | "bhop"
  | "aim"
  | "trigger"
  | "esp"
  | "skins"
  | "movement"
  | "misc"
  | "teleport"
  | "crash"
  | "speed"
  | "money";

const labels: Record<PreviewKind, string> = {
  noclip: "NOCLIP",
  god: "TRYB BOGA",
  bhop: "KRÓLICZY SKOK",
  aim: "ROBOT CELU",
  trigger: "ROBOT SPUSTU",
  esp: "WIZUALIZACJE",
  skins: "SKÓRKI",
  movement: "RUCH",
  misc: "RÓŻNE",
  teleport: "TELEPORT",
  crash: "AWARIA SERWERA",
  speed: "PRZYSPIESZENIE",
  money: "GLITCH KASY",
};

function Scene({ kind }: { kind: PreviewKind }) {
  switch (kind) {
    case "noclip":
    case "teleport":
      return (
        <>
          <div className="absolute inset-y-3 left-1/2 w-2 -translate-x-1/2 rounded bg-foreground/20" />
          <div className="preview-noclip absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-sm bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
        </>
      );
    case "god":
      return (
        <>
          <div className="preview-shield absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/70" />
          <div className="preview-hp absolute bottom-2 left-2 rounded bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
            HP 100
          </div>
        </>
      );
    case "bhop":
    case "speed":
      return (
        <>
          <div className="absolute bottom-4 left-0 right-0 h-px bg-foreground/25" />
          <div className="preview-hop absolute bottom-4 left-1/2 h-4 w-4 -translate-x-1/2 rounded-sm bg-primary" />
          <div className="preview-slide absolute bottom-2 h-px w-8 bg-primary/70" />
        </>
      );
    case "aim":
      return (
        <>
          <div className="preview-target absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-sm border border-foreground/40" />
          <div className="preview-crosshair absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-primary" />
        </>
      );
    case "trigger":
      return (
        <>
          <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary" />
          <div className="preview-fire absolute right-3 top-3 rounded bg-primary/25 px-2 py-0.5 text-[10px] font-bold text-primary">
            FIRE
          </div>
        </>
      );
    case "esp":
      return (
        <>
          <div className="preview-box absolute left-4 top-4 h-10 w-6 border border-primary" />
          <div className="preview-box absolute right-6 top-6 h-8 w-5 border border-primary" />
          <div className="preview-box absolute bottom-4 left-1/2 h-9 w-6 border border-primary" />
        </>
      );
    case "skins":
      return (
        <div className="preview-skin absolute left-1/2 top-1/2 h-6 w-24 -translate-x-1/2 -translate-y-1/2 rounded bg-gradient-to-r from-primary via-accent to-primary" />
      );
    case "movement":
      return (
        <>
          <div className="absolute bottom-4 left-0 right-0 h-px bg-foreground/25" />
          <div className="preview-strafe absolute bottom-5 left-1/2 h-4 w-4 rounded-sm bg-primary" />
        </>
      );
    case "crash":
      return (
        <>
          <div className="preview-hp absolute inset-x-4 top-1/2 h-6 -translate-y-1/2 rounded bg-destructive/30" />
          <div className="preview-fire absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-primary">
            TIMEOUT
          </div>
        </>
      );
    case "money":
      return (
        <>
          <div className="preview-hp absolute left-3 top-3 text-[11px] font-bold text-primary">$16000</div>
          <div className="preview-slide absolute top-1/2 h-1 w-6 rounded bg-primary/70" />
        </>
      );
    case "misc":
    default:
      return (
        <>
          <div className="preview-fov absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/60" />
          <div className="preview-box absolute inset-3 border border-dashed border-foreground/20" />
        </>
      );
  }
}

export function FeaturePreview({ kind }: { kind: PreviewKind }) {
  const video = getClipVideo(kind);
  const youtube = video ? null : getClipYoutube(kind);

  return (
    <div className="preview-stage w-full">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border/60 bg-background/40">
        {video ? (
          <video
            src={video}
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
            aria-label={`Nagranie z CS:GO: ${labels[kind]}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : youtube ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtube}?rel=0`}
            title={`Film: ${labels[kind]}`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-muted-foreground">
            <Scene kind={kind} />
            <div className="relative z-10 flex items-center gap-1.5 rounded bg-background/85 px-2 py-1 text-[10px] font-bold tracking-wide">
              <VideoOff className="h-3 w-3" />
              BRAK NAGRANIA
            </div>
          </div>
        )}
        <span className="absolute bottom-1.5 right-2 rounded bg-background/70 px-1.5 py-0.5 text-[9px] font-bold tracking-widest text-muted-foreground">
          {labels[kind]}
        </span>
      </div>
    </div>
  );
}
