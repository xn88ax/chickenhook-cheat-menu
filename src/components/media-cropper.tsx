import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Loader2, X, ZoomIn } from "lucide-react";

type Props = {
  file: File;
  /** szerokość / wysokość docelowego kadru */
  aspect: number;
  /** docelowa szerokość wyjściowa w px */
  outWidth: number;
  title: string;
  onCancel: () => void;
  onDone: (file: File) => void;
};

const BOX_W = 420;

export function MediaCropper({ file, aspect, outWidth, title, onCancel, onDone }: Props) {
  const boxH = Math.round(BOX_W / aspect);
  const [src, setSrc] = useState<string | null>(null);
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [busy, setBusy] = useState(false);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const base = nat ? Math.max(BOX_W / nat.w, boxH / nat.h) : 1;
  const eff = base * zoom;
  const imgW = nat ? nat.w * eff : 0;
  const imgH = nat ? nat.h * eff : 0;

  const clamp = useCallback(
    (o: { x: number; y: number }) => {
      const maxX = Math.max(0, (imgW - BOX_W) / 2);
      const maxY = Math.max(0, (imgH - boxH) / 2);
      return {
        x: Math.min(maxX, Math.max(-maxX, o.x)),
        y: Math.min(maxY, Math.max(-maxY, o.y)),
      };
    },
    [imgW, imgH, boxH],
  );

  useEffect(() => setOffset((o) => clamp(o)), [clamp]);

  async function confirm() {
    if (!nat || !src) return;
    setBusy(true);
    try {
      const img = new Image();
      img.src = src;
      await img.decode();
      const left = BOX_W / 2 + offset.x - imgW / 2;
      const top = boxH / 2 + offset.y - imgH / 2;
      const sx = -left / eff;
      const sy = -top / eff;
      const sw = BOX_W / eff;
      const sh = boxH / eff;

      const canvas = document.createElement("canvas");
      canvas.width = outWidth;
      canvas.height = Math.round(outWidth / aspect);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("brak canvas");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((res) =>
        canvas.toBlob((b) => res(b), "image/jpeg", 0.92),
      );
      if (!blob) throw new Error("brak blob");
      const name = file.name.replace(/\.[^.]+$/, "") || "obrazek";
      onDone(new File([blob], `${name}.jpg`, { type: "image/jpeg" }));
    } catch {
      setBusy(false);
      onCancel();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-[480px] rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground">{title}</h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Zamknij"
            className="rounded border border-border p-1 text-muted-foreground hover:border-primary"
          >
            <X className="size-3" />
          </button>
        </div>

        <div
          className="relative mx-auto touch-none select-none overflow-hidden rounded-lg border border-border bg-black"
          style={{ width: BOX_W, maxWidth: "100%", height: boxH, cursor: "grab" }}
          onPointerDown={(e) => {
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
            drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            if (!d) return;
            setOffset(clamp({ x: d.ox + (e.clientX - d.x), y: d.oy + (e.clientY - d.y) }));
          }}
          onPointerUp={() => {
            drag.current = null;
          }}
        >
          {src && (
            <img
              src={src}
              alt=""
              draggable={false}
              onLoad={(e) =>
                setNat({
                  w: e.currentTarget.naturalWidth,
                  h: e.currentTarget.naturalHeight,
                })
              }
              className="pointer-events-none absolute left-1/2 top-1/2 max-w-none"
              style={{
                width: imgW || undefined,
                height: imgH || undefined,
                transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
              }}
            />
          )}
        </div>

        <label className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
          <ZoomIn className="size-3" />
          Powiększenie
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-[var(--color-primary)]"
          />
          <span className="w-10 text-right font-mono">{zoom.toFixed(2)}x</span>
        </label>

        <p className="mt-2 text-[11px] text-muted-foreground">
          Przeciągnij obrazek, żeby ustawić kadr. Zapis w rozmiarze {outWidth}×
          {Math.round(outWidth / aspect)} px.
        </p>

        <div className="mt-3 flex justify-end gap-2 text-xs">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border px-3 py-2 text-muted-foreground hover:border-primary"
          >
            Anuluj
          </button>
          <button
            type="button"
            disabled={busy || !nat}
            onClick={() => void confirm()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary px-3 py-2 font-semibold text-primary disabled:opacity-60"
          >
            {busy ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
            Zapisz kadr
          </button>
        </div>
      </div>
    </div>
  );
}
