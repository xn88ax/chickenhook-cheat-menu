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
  | "money"
  | "voice"
  | "customskin"
  | "radio"
  | "ddos"
  | "strazak"
  | "flashassist"
  | "nade"
  | "plant"
  | "pyszne";

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
  voice: "CZAT GŁOSOWY",
  customskin: "CUSTOM SKIN",
  radio: "RADIO",
  ddos: "2PACALYPSE 2.3",
  strazak: "AUTO STRAŻAK",
  flashassist: "AUTO FLASH ASSIST",
  nade: "NADE HELPER",
  plant: "AUTO PLANT",
  pyszne: "PYSZNE.PL — KFC",
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
    case "voice":
      return (
        <>
          <div className="preview-fire absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-primary">
            MIC
          </div>
          <div className="preview-slide absolute bottom-4 h-1 w-10 rounded bg-primary/70" />
        </>
      );
    case "radio":
      return (
        <>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-end gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="preview-hop w-1 rounded-sm bg-primary"
                style={{ height: `${8 + ((i * 7) % 18)}px`, animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
        </>
      );
    case "customskin":
      return (
        <div className="preview-skin absolute left-1/2 top-1/2 h-16 w-10 -translate-x-1/2 -translate-y-1/2 rounded bg-gradient-to-b from-primary/70 via-accent/60 to-primary/70" />
      );
    case "nade":
      return (
        <>
          <div className="preview-slide absolute top-1/3 h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_hsl(var(--accent))]" />
          <div className="absolute inset-4 rounded border border-dashed border-accent/40" />
          <div className="preview-fov absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/60" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-bold text-accent">
            LINEUP OK
          </div>
        </>
      );
    case "strazak":
      return (
        <>
          <div className="preview-fire absolute bottom-5 left-1/2 h-6 w-10 -translate-x-1/2 rounded-t-full bg-gradient-to-t from-primary/80 to-accent/70 blur-[1px]" />
          <div className="preview-slide absolute top-1/2 h-1 w-8 rounded bg-sky-400/80" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-bold text-sky-300">
            MOLOTOV OFF
          </div>
        </>
      );
    case "flashassist":
      return (
        <>
          <div className="preview-fire absolute left-1/2 top-1/3 h-5 w-5 -translate-x-1/2 rounded-full bg-yellow-300/90 shadow-[0_0_16px_hsl(48_100%_60%)]" />
          <div className="preview-slide absolute top-1/2 h-1 w-10 rounded bg-yellow-200/70" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-bold text-yellow-200">
            FLASH IN
          </div>
        </>
      );
    case "plant":
      return (
        <>
          <div className="preview-fire absolute bottom-5 left-1/2 h-6 w-4 -translate-x-1/2 rounded-sm bg-foreground/30" />
          <div className="preview-fire absolute bottom-3 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_14px_hsl(var(--primary))]" />
          <div className="preview-box absolute inset-3 border border-dashed border-primary/40" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary">
            PLANTED
          </div>
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
