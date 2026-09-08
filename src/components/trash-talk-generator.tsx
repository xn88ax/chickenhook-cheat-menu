import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Copy, Check } from "lucide-react";

const openings = [
  "mój aim jest tak czysty",
  "twój config jest tak słaby",
  "ja nawet bez chwytania się za myszkę",
  "twoja mama gra lepiej",
  "ten twój paste",
  "twoje fov na 0.1",
];

const middles = [
  "że cię VACnę z zamkniętymi oczami",
  "to ja bym się zastanowił nad uninstall",
  "a ty dalej liczysz na luckshoty",
  "to nawet bot cię wyzywa na duel",
  "wyglądasz jakbyś kupił cheat na Allegro",
  "to ja bym wolał grać z pingiem 300",
];

const closings = [
  "#chickenhook",
  "kurnik górą",
  "gg wp ez",
  "wróć do matchmakingu",
  "zainstaluj ChickenHook",
  "twoja kara: permanentny ban",
];

export function TrashTalkGenerator() {
  const [text, setText] = useState("Kliknij losuj, żeby dostać gotową wypowiedź.");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const a = openings[Math.floor(Math.random() * openings.length)];
    const b = middles[Math.floor(Math.random() * middles.length)];
    const c = closings[Math.floor(Math.random() * closings.length)];
    setText(`${a}, ${b} — ${c}`);
    setCopied(false);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="min-h-[80px] rounded-lg border border-border bg-background/50 p-4 text-sm leading-relaxed">
        {text}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={generate}>
          <RefreshCw className="h-3.5 w-3.5" />
          Losuj
        </Button>
        <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={copy}>
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Skopiowano" : "Kopiuj"}
        </Button>
      </div>
      <p className="text-[10px] leading-relaxed text-muted-foreground">
        Generator tekstów tylko dla beki — używaj z głową, żeby nie dostać mute.
      </p>
    </div>
  );
}
