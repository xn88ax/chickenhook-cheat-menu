import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomChunk(len: number) {
  let out = "";
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return out;
}

function makeCode() {
  return `CHICKEN-${randomChunk(4)}-${randomChunk(4)}`;
}

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) throw new Error("Brak uprawnień administratora.");
}

export const getAdminData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);

    const [codes, profiles, roles] = await Promise.all([
      context.supabase
        .from("invite_codes")
        .select("id,code,note,used_by,used_at,expires_at,created_at")
        .order("created_at", { ascending: false })
        .limit(200),
      context.supabase.from("profiles").select("id,username,created_at").order("created_at"),
      context.supabase.from("user_roles").select("user_id,role"),
    ]);

    return {
      codes: codes.data ?? [],
      members: (profiles.data ?? []).map((p) => ({
        ...p,
        roles: (roles.data ?? []).filter((r) => r.user_id === p.id).map((r) => r.role),
      })),
    };
  });

export const generateInviteCodes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        count: z.number().int().min(1).max(20),
        note: z.string().trim().max(120).default(""),
        days: z.number().int().min(0).max(365).default(0),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    const expires_at =
      data.days > 0 ? new Date(Date.now() + data.days * 86400000).toISOString() : null;

    const rows = Array.from({ length: data.count }, () => ({
      code: makeCode(),
      note: data.note,
      expires_at,
    }));

    const { data: inserted, error } = await context.supabase
      .from("invite_codes")
      .insert(rows)
      .select("code");

    if (error) return { ok: false as const, error: "Nie udało się wygenerować kodów." };
    return { ok: true as const, codes: (inserted ?? []).map((r) => r.code) };
  });

export const deleteInviteCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("invite_codes").delete().eq("id", data.id);
    if (error) return { ok: false as const, error: "Nie udało się usunąć kodu." };
    return { ok: true as const };
  });
