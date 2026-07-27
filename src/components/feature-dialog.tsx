import { Check, PlayCircle } from "lucide-react";

import { FeaturePreview } from "@/components/feature-preview";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Feature } from "@/data/features";

export function FeatureDialog({ feature }: { feature: Feature }) {
  const Icon = feature.icon;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="mt-5 inline-flex items-center gap-2 self-start rounded-sm border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary transition-colors hover:bg-primary/20"
        >
          <PlayCircle className="size-4" />
          Zobacz jak działa
        </button>
      </DialogTrigger>
      <DialogContent className="glass max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
            <DialogTitle className="text-display text-3xl uppercase leading-none">
              {feature.title}
            </DialogTitle>
          </div>
          <DialogDescription className="pt-2 text-left text-sm leading-relaxed">
            {feature.long}
          </DialogDescription>
        </DialogHeader>

        <div className="group">
          <FeaturePreview kind={feature.preview} />
        </div>

        <ul className="mt-2 space-y-2">
          {feature.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
