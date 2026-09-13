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
    .in("role", ["admin", "owner"])
    .limit(1)
    .maybeSingle();
  if (error || !data) throw new Error("Brak uprawnień administratora.");
}

async function assertOwner(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "owner")
    .limit(1)
    .maybeSingle();
  if (error || !data) throw new Error("Tylko właściciel może zmieniać rangi.");
}


export const getAdminData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);

    const [codes, profiles, roles, bans] = await Promise.all([
      context.supabase
        .from("invite_codes")
        .select("id,code,note,used_by,used_at,expires_at,created_at")
        .order("created_at", { ascending: false })
        .limit(200),
      context.supabase.from("profiles").select("id,username,created_at").order("created_at"),
      context.supabase.from("user_roles").select("user_id,role"),
      context.supabase
        .from("user_bans")
        .select("user_id,reason,banned_until,created_at,active")
        .eq("active", true),
    ]);

    return {
      codes: codes.data ?? [],
      members: (profiles.data ?? []).map((p) => ({
        ...p,
        roles: (roles.data ?? []).filter((r) => r.user_id === p.id).map((r) => r.role),
        ban: (bans.data ?? []).find((b) => b.user_id === p.id) ?? null,
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

/** Recent forum + shoutbox content for moderation. */
export const getModerationData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [threads, posts, shouts, profiles] = await Promise.all([
      supabaseAdmin
        .from("forum_threads")
        .select("id,title,pinned,created_at,author_id")
        .order("created_at", { ascending: false })
        .limit(40),
      supabaseAdmin
        .from("forum_posts")
        .select("id,body,created_at,author_id,thread_id")
        .order("created_at", { ascending: false })
        .limit(40),
      supabaseAdmin
        .from("shouts")
        .select("id,nick,text,created_at")
        .order("created_at", { ascending: false })
        .limit(40),
      supabaseAdmin.from("profiles").select("id,username"),
    ]);

    const nameOf = (id: string | null) =>
      (profiles.data ?? []).find((p) => p.id === id)?.username ?? "gość";

    return {
      threads: (threads.data ?? []).map((t) => ({ ...t, author: nameOf(t.author_id) })),
      posts: (posts.data ?? []).map((p) => ({ ...p, author: nameOf(p.author_id) })),
      shouts: shouts.data ?? [],
    };
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        userId: z.string().uuid(),
        role: z.enum(["admin", "moderator"]),
        grant: z.boolean(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertOwner(context.supabase, context.userId);
    if (data.userId === context.userId && data.role === "admin" && !data.grant) {
      return { ok: false as const, error: "Nie możesz odebrać uprawnień sobie." };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = data.grant
      ? await supabaseAdmin
          .from("user_roles")
          .upsert({ user_id: data.userId, role: data.role }, { onConflict: "user_id,role" })
      : await supabaseAdmin
          .from("user_roles")
          .delete()
          .eq("user_id", data.userId)
          .eq("role", data.role);

    if (error) return { ok: false as const, error: "Nie udało się zmienić roli." };
    return { ok: true as const };
  });

export const moderateContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        kind: z.enum(["thread", "post", "shout"]),
        id: z.string().uuid(),
        action: z.enum(["delete", "pin", "unpin"]).default("delete"),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (data.kind === "thread" && data.action !== "delete") {
      const { error } = await supabaseAdmin
        .from("forum_threads")
        .update({ pinned: data.action === "pin" })
        .eq("id", data.id);
      if (error) return { ok: false as const, error: "Nie udało się zmienić wątku." };
      return { ok: true as const };
    }

    const table =
      data.kind === "thread" ? "forum_threads" : data.kind === "post" ? "forum_posts" : "shouts";
    const { error } = await supabaseAdmin.from(table).delete().eq("id", data.id);
    if (error) return { ok: false as const, error: "Nie udało się usunąć treści." };
    return { ok: true as const };
  });


/** Ban a member: closes their account in auth and logs reason + date. */
export const banUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        userId: z.string().uuid(),
        reason: z.string().trim().min(3).max(300),
        until: z.string().trim().max(40).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    if (data.userId === context.userId) {
      return { ok: false as const, error: "Nie możesz zbanować samego siebie." };
    }

    let hours = 876000; // ~100 lat = ban permanentny
    let bannedUntil: string | null = null;
    if (data.until) {
      const ts = new Date(data.until).getTime();
      if (Number.isNaN(ts)) return { ok: false as const, error: "Nieprawidłowa data bana." };
      if (ts <= Date.now()) return { ok: false as const, error: "Data bana musi być w przyszłości." };
      hours = Math.max(1, Math.ceil((ts - Date.now()) / 3600000));
      bannedUntil = new Date(ts).toISOString();
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
      ban_duration: `${hours}h`,
    });
    if (authError) return { ok: false as const, error: "Nie udało się zamknąć konta." };

    await supabaseAdmin.from("user_bans").update({ active: false }).eq("user_id", data.userId);
    const { error } = await supabaseAdmin.from("user_bans").insert({
      user_id: data.userId,
      reason: data.reason,
      banned_until: bannedUntil,
      banned_by: context.userId,
      active: true,
    });
    if (error) return { ok: false as const, error: "Nie udało się zapisać bana." };

    return { ok: true as const };
  });

/** Lift a ban and reopen the account. */
export const unbanUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ userId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
      ban_duration: "none",
    });
    if (authError) return { ok: false as const, error: "Nie udało się odblokować konta." };

    await supabaseAdmin
      .from("user_bans")
      .update({ active: false })
      .eq("user_id", data.userId)
      .eq("active", true);

    return { ok: true as const };
  });

/** Admin-only: rename a member (nicks are locked for regular users). */
export const setUsername = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        userId: z.string().uuid(),
        username: z.string().trim().min(3).max(24),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: taken } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .ilike("username", data.username)
      .neq("id", data.userId)
      .maybeSingle();
    if (taken) return { ok: false as const, error: "Ten nick jest już zajęty." };

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ username: data.username })
      .eq("id", data.userId);
    if (error) return { ok: false as const, error: "Nie udało się zmienić nicku." };

    await supabaseAdmin.auth.admin.updateUserById(data.userId, {
      user_metadata: { username: data.username },
    });

    return { ok: true as const };
  });
