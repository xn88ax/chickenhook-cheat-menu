import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Copy, Check } from "lucide-react";

const styles = ["klasyczny", "kropka", "krzyżyk", "okrągły", "dynamiczny"];
const colors = ["#00ff00", "#ff0000", "#ffff00", "#00ffff", "#ff00ff", "#ffffff", "#ff8800"];
const outlines = ["czarny", "biały", "brak"];

export function CrosshairGenerator() {
  const [style, setStyle] = useState(styles[0]);
  const [color, setColor] = useState(colors[0]);
  const [gap, setGap] = useState(4);
  const [length, setLength] = useState(6);
  const [thickness, setThickness] = useState(2);
  const [outline, setOutline] = useState(outlines[0]);
  const [copied, setCopied] = useState(false);

  const randomize = () => {
    setStyle(styles[Math.floor(Math.random() * styles.length)]);
    setColor(colors[Math.floor(Math.random() * colors.length)]);
    setGap(Math.floor(Math.random() * 10));
    setLength(2 + Math.floor(Math.random() * 14));
    setThickness(1 + Math.floor(Math.random() * 4));
    setOutline(outlines[Math.floor(Math.random() * outlines.length)]);
    setCopied(false);
  };

  const config = `cl_crosshairstyle ${styles.indexOf(style) + 1}; cl_crosshaircolor "${color}"; cl_crosshairgap ${gap}; cl_crosshairsize ${length}; cl_crosshairthickness ${thickness}; cl_crosshair_outlinethickness ${outline === "brak" ? 0 : 1}`;

  const copy = async () => {
    await navigator.clipboard.writeText(config);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const outlineColor = outline === "czarny" ? "#000" : outline === "biały" ? "#fff" : "transparent";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center rounded-lg border border-border bg-background/50 p-8">
        <div
          className="relative"
          style={{
            width: 120,
            height: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {style === "kropka" && (
            <div
              style={{
                width: thickness * 2 + 4,
                height: thickness * 2 + 4,
                background: color,
                borderRadius: "50%",
                boxShadow: `0 0 0 2px ${outlineColor}`,
              }}
            />
          )}
          {style === "okrągły" && (
            <div
              style={{
                width: 24 + length * 2,
                height: 24 + length * 2,
                border: `${thickness}px solid ${color}`,
                borderRadius: "50%",
                boxShadow: `0 0 0 2px ${outlineColor}`,
              }}
            />
          )}
          {(style === "klasyczny" || style === "dynamiczny" || style === "krzyżyk") && (
            <>
              <div style={{ position: "absolute", width: length, height: thickness, background: color, top: `calc(50% - ${gap + length}px)`, left: `calc(50% - ${length / 2}px)`, boxShadow: `0 0 0 1px ${outlineColor}` }} />
              <div style={{ position: "absolute", width: length, height: thickness, background: color, bottom: `calc(50% - ${gap + length}px)`, left: `calc(50% - ${length / 2}px)`, boxShadow: `0 0 0 1px ${outlineColor}` }} />
              <div style={{ position: "absolute", width: thickness, height: length, background: color, left: `calc(50% - ${gap + length}px)`, top: `calc(50% - ${length / 2}px)`, boxShadow: `0 0 0 1px ${outlineColor}` }} />
              <div style={{ position: "absolute", width: thickness, height: length, background: color, right: `calc(50% - ${gap + length}px)`, top: `calc(50% - ${length / 2}px)`, boxShadow: `0 0 0 1px ${outlineColor}` }} />
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="space-y-1">
          <span className="text-muted-foreground">Styl</span>
          <div className="font-medium">{style}</div>
        </div>
        <div className="space-y-1">
          <span className="text-muted-foreground">Kolor</span>
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-block h-3 w-3 rounded-full border border-border" style={{ background: color }} />
            {color}
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-muted-foreground">Rozstaw</span>
          <div className="font-medium">{gap}</div>
        </div>
        <div className="space-y-1">
          <span className="text-muted-foreground">Długość</span>
          <div className="font-medium">{length}</div>
        </div>
        <div className="space-y-1">
          <span className="text-muted-foreground">Grubość</span>
          <div className="font-medium">{thickness}</div>
        </div>
        <div className="space-y-1">
          <span className="text-muted-foreground">Obrys</span>
          <div className="font-medium">{outline}</div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={randomize}>
          <RefreshCw className="h-3.5 w-3.5" />
          Losuj
        </Button>
        <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={copy}>
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Skopiowano" : "Kopiuj config"}
        </Button>
      </div>

      <p className="text-[10px] leading-relaxed text-muted-foreground">
        Podgląd crosshaira — kliknij Losuj, żeby wylosować nowy, albo Kopiuj config, żeby wkleić do konsoli.
      </p>
    </div>
  );
}
