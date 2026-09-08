import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Copy, Check } from "lucide-react";

const excuses = [
  "mój internet szwankuje",
  "siostra włączyła mikrofalę",
  "mam 20 fps w menu",
  "moja myszka się rozładowała",
  "ktoś mi zadzwonił na komórkę",
  "grałem na touchpadzie",
  "mam nową podkładkę i się nie przyzwyczaiłem",
  "monitor mi się przegrzał",
  "mój krzesło się złamało",
  "ktoś mi wylał wodę na biurko",
  "mam opóźnienie w audio",
  "dźwięk był odwrotnie w słuchawkach",
  "mój kot wszedł na klawiaturę",
  "zresetował mi się router",
  "komputer aktualizuje Windowsa",
];

const endings = [
  "ale i tak bym cię rozniósł.",
  "dlatego ten frag nie liczy.",
  "w następnej rundzie zobaczysz.",
  "to był lag, nie skill.",
  "jak naprawię, to zagramy 1v1.",
  "a ty dalej myślisz, że to fair.",
];

export function RageQuitGenerator() {
  const [text, setText] = useState("Kliknij losuj, żeby uzyskać gotowe wytłumaczenie porażki.");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const a = excuses[Math.floor(Math.random() * excuses.length)];
    const b = endings[Math.floor(Math.random() * endings.length)];
    setText(`${a}, ${b}`);
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
          Losuj wymówkę
        </Button>
        <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={copy}>
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Skopiowano" : "Kopiuj"}
        </Button>
      </div>
      <p className="text-[10px] leading-relaxed text-muted-foreground">
        Legendarne wytłumaczenia rage quita — zawsze znajdziesz powód, dla którego to nie Twoja wina.
      </p>
    </div>
  );
}
