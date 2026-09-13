import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";

import { GsPanel } from "@/components/gs-shell";
import { RoleBadge } from "@/components/forum/user-identity";
import { supabase } from "@/integrations/supabase/client";
import { ROLE_ORDER, useRoleStyles, type RoleStyle } from "@/lib/role-styles";

const ROLE_LABELS: Record<string, string> = {
  owner: "Właściciel",
  admin: "Administrator",
  moderator: "Moderator",
  user: "Użytkownik",
};

export function RoleStylesPanel() {
  const styles = useRoleStyles();
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Record<string, RoleStyle>>(styles);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    setDraft(styles);
  }, [styles]);

  const save = useMutation({
    mutationFn: async () => {
      const rows = ROLE_ORDER.map((role) => ({
        role,
        color: draft[role]?.color ?? "#e11d2e",
        glitter: draft[role]?.glitter ?? false,
      }));
      const { error } = await supabase.from("role_styles").upsert(rows, { onConflict: "role" });
      if (error) throw error;
    },
    onSuccess: () => {
      setNote("Zapisano kolory rang.");
      qc.invalidateQueries({ queryKey: ["role-styles"] });
    },
    onError: () => setNote("Nie udało się zapisać — tylko admin lub właściciel może to zmieniać."),
  });

  return (
    <GsPanel title="Kolory rang">
      <div className="space-y-3 p-4">
        <p className="text-xs text-muted-foreground">
          Kolor i brokat rangi widać na profilach, forum i czacie.
        </p>
        {ROLE_ORDER.map((role) => {
          const style = draft[role] ?? { role, color: "#e11d2e", glitter: false };
          return (
            <div
              key={role}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-border/60 bg-background/40 px-3 py-2.5"
            >
              <span className="w-28 text-xs font-bold">{ROLE_LABELS[role] ?? role}</span>
              <input
                type="color"
                aria-label={`Kolor rangi ${ROLE_LABELS[role] ?? role}`}
                value={style.color}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, [role]: { ...style, color: e.target.value } }))
                }
                className="h-8 w-12 cursor-pointer rounded border border-border bg-transparent"
              />
              <input
                value={style.color}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, [role]: { ...style, color: e.target.value } }))
                }
                aria-label={`Kod koloru rangi ${ROLE_LABELS[role] ?? role}`}
                className="w-24 rounded border border-border bg-background/60 px-2 py-1 font-mono text-xs outline-none focus:border-primary"
              />
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={style.glitter}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, [role]: { ...style, glitter: e.target.checked } }))
                  }
                />
                Brokat
              </label>
              <span
                className={`forum-role-badge forum-role-${role}${style.glitter ? " forum-role-glitter" : ""}`}
                style={{ ["--role-color" as string]: style.color }}
              >
                {ROLE_LABELS[role] ?? role}
              </span>
            </div>
          );
        })}
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={save.isPending}
            onClick={() => save.mutate()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/60 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/10 disabled:opacity-50"
          >
            <Save className="size-3.5" />
            Zapisz kolory
          </button>
          {note ? <span className="text-xs text-muted-foreground">{note}</span> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Podgląd odznak
          </span>
          {ROLE_ORDER.map((role) => (
            <RoleBadge key={role} role={role} />
          ))}
        </div>
      </div>
    </GsPanel>
  );
}
