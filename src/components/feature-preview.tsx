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

function Enemy({ className = "" }: { className?: string }) {
  return (
    <span
      className={`absolute size-4 rounded-[2px] bg-primary/80 shadow-[0_0_10px_hsl(var(--primary)/0.8)] ${className}`}
      aria-hidden
    />
  );
}

export function FeaturePreview({ kind }: { kind: PreviewKind }) {
  return (
    <div
      aria-hidden
      className="preview-stage relative mt-5 h-28 w-full overflow-hidden rounded-md border border-border/70 bg-background/70"
    >
      <div className="preview-grid absolute inset-0 opacity-40" />

      {kind === "noclip" && (
        <>
          <div className="absolute inset-y-0 left-1/2 w-2 -translate-x-1/2 bg-muted-foreground/30" />
          <span className="preview-noclip absolute top-1/2 size-4 -translate-y-1/2 rounded-[2px] bg-accent shadow-[0_0_12px_hsl(var(--accent)/0.9)]" />
        </>
      )}

      {kind === "god" && (
        <>
          <span className="preview-shield absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent/70" />
          <span className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-[2px] bg-accent" />
          <span className="preview-hp absolute bottom-2 left-2 text-[10px] font-bold tracking-widest text-accent">
            HP 100
          </span>
        </>
      )}

      {kind === "bhop" && (
        <>
          <div className="absolute bottom-5 left-0 right-0 h-px bg-muted-foreground/40" />
          <span className="preview-hop absolute bottom-5 left-4 size-4 rounded-[2px] bg-accent" />
          <span className="absolute right-2 top-2 text-[10px] font-bold tracking-widest text-muted-foreground">
            +VEL
          </span>
        </>
      )}

      {kind === "aim" && (
        <>
          <Enemy className="preview-target left-1/2 top-1/2" />
          <span className="preview-crosshair absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/80" />
          <span className="absolute left-2 top-2 text-[10px] font-bold tracking-widest text-accent">
            FOV 3°
          </span>
        </>
      )}

      {kind === "trigger" && (
        <>
          <span className="absolute left-1/2 top-1/2 h-6 w-px -translate-x-1/2 -translate-y-1/2 bg-accent/80" />
          <span className="absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 -translate-y-1/2 bg-accent/80" />
          <span className="preview-slide absolute top-1/2 size-4 -translate-y-1/2 rounded-[2px] bg-primary/80" />
          <span className="preview-fire absolute right-2 top-2 text-[10px] font-bold tracking-widest text-primary">
            FIRE
          </span>
        </>
      )}

      {kind === "esp" && (
        <>
          <span className="preview-box absolute left-8 top-6 h-16 w-10 border border-accent/80" />
          <span className="absolute left-8 top-3 text-[9px] font-bold tracking-widest text-accent">
            AWP · 87
          </span>
          <span className="preview-box absolute right-10 top-10 h-12 w-8 border border-primary/80 [animation-delay:.4s]" />
          <span className="absolute right-10 top-7 text-[9px] font-bold tracking-widest text-primary">
            AK · 42
          </span>
        </>
      )}

      {kind === "skins" && (
        <div className="flex h-full items-center justify-center">
          <span className="preview-skin h-8 w-24 rounded-[3px] bg-gradient-to-r from-primary via-accent to-primary" />
        </div>
      )}

      {kind === "movement" && (
        <>
          <div className="absolute bottom-5 left-0 right-0 h-px bg-muted-foreground/40" />
          <span className="preview-strafe absolute bottom-6 left-1/2 size-4 rounded-[2px] bg-accent" />
          <span className="absolute left-2 top-2 text-[10px] font-bold tracking-widest text-muted-foreground">
            AUTO-STRAFE
          </span>
        </>
      )}

      {kind === "misc" && (
        <>
          <span className="preview-fov absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-md border border-accent/60" />
          <span className="absolute bottom-2 left-2 text-[10px] font-bold tracking-widest text-muted-foreground">
            FOV · 3RD · NIGHT
          </span>
        </>
      )}
    </div>
  );
}
