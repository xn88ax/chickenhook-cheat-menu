import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  code: z.string().trim().min(4).max(64),
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
  username: z.string().trim().min(2).max(24),
});

export const registerWithInvite = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const code = data.code.toUpperCase();
    const { data: invite, error: inviteError } = await supabaseAdmin
      .from("invite_codes")
      .select("id,used_by,expires_at")
      .eq("code", code)
      .maybeSingle();

    if (inviteError) return { ok: false as const, error: "Nie udało się sprawdzić kodu." };
    if (!invite) return { ok: false as const, error: "Nieprawidłowy kod zaproszenia." };
    if (invite.used_by) return { ok: false as const, error: "Ten kod został już wykorzystany." };
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      return { ok: false as const, error: "Ten kod zaproszenia wygasł." };
    }

    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { username: data.username },
    });

    if (createError || !created.user) {
      return {
        ok: false as const,
        error: createError?.message?.includes("already")
          ? "Konto z tym e-mailem już istnieje."
          : "Nie udało się utworzyć konta.",
      };
    }

    const { error: claimError } = await supabaseAdmin
      .from("invite_codes")
      .update({ used_by: created.user.id, used_at: new Date().toISOString() })
      .eq("id", invite.id)
      .is("used_by", null);

    if (claimError) {
      await supabaseAdmin.auth.admin.deleteUser(created.user.id);
      return { ok: false as const, error: "Kod został właśnie wykorzystany przez kogoś innego." };
    }

    return { ok: true as const };
  });
