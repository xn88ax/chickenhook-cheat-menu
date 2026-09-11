import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, KeyRound, Loader2, Pin, PinOff, ShieldAlert, Trash2 } from "lucide-react";

import { GsPanel, GsShell } from "@/components/gs-shell";
import {
  deleteInviteCode,
  generateInviteCodes,
  getAdminData,
  getModerationData,
  moderateContent,
  setUserRole,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Panel admina — kurnik chickenhook.wtf" },
      {
        name: "description",
        content:
          "Panel administracyjny kurnika: kody zaproszeń, role członków i moderacja forum oraz czatu.",
      },
      { property: "og:title", content: "Panel admina chickenhook.wtf" },
      {
        property: "og:description",
        content: "Kody zaproszeń, role członków i moderacja treści.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Admin,
});

const TABS = [
  ["overview", "Przegląd"],
  ["codes", "Kody"],
  ["members", "Członkowie"],
  ["moderation", "Moderacja"],
] as const;

type Tab = (typeof TABS)[number][0];

const inputClass =
  "mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-xs outline-none focus:border-primary";

function Admin() {
  const load = useServerFn(getAdminData);
  const loadMod = useServerFn(getModerationData);
  const gen = useServerFn(generateInviteCodes);
  const del = useServerFn(deleteInviteCode);
  const role = useServerFn(setUserRole);
  const moderate = useServerFn(moderateContent);
  const qc = useQueryClient();

  const [tab, setTab] = useState<Tab>("overview");
  const [count, setCount] = useState(3);
  const [note, setNote] = useState("");
  const [days, setDays] = useState(30);
  const [fresh, setFresh] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-data"],
    queryFn: () => load(),
    retry: false,
  });

  const mod = useQuery({
    enabled: !error,
    queryKey: ["admin-moderation"],
    queryFn: () => loadMod(),
    retry: false,
  });

  const generate = useMutation({
    mutationFn: () => gen({ data: { count, note, days } }),
    onSuccess: (res) => {
      if (res.ok) setFresh(res.codes);
      qc.invalidateQueries({ queryKey: ["admin-data"] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-data"] }),
  });

  const changeRole = useMutation({
    mutationFn: (v: { userId: string; role: "admin" | "moderator"; grant: boolean }) =>
      role({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-data"] }),
  });

  const modAction = useMutation({
    mutationFn: (v: {
      kind: "thread" | "post" | "shout";
      id: string;
      action: "delete" | "pin" | "unpin";
    }) => moderate({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-moderation"] }),
  });

  function copy(code: string) {
    void navigator.clipboard.writeText(code);
    setCopied(code);
    window.setTimeout(() => setCopied(null), 1500);
  }

  const codes = data?.codes ?? [];
  const used = codes.filter((c) => c.used_by).length;
  const members = data?.members ?? [];

  if (error) {
    return (
      <GsShell crumbs={[{ label: "Panel admina" }]}>
        <main className="mx-auto max-w-[1160px] px-5 py-6">
          <GsPanel title="Brak dostępu">
            <div className="flex items-center gap-2 px-4 py-5 text-xs text-muted-foreground">
              <ShieldAlert className="size-4 text-primary" />
              To miejsce jest tylko dla adminów kurnika.
            </div>
          </GsPanel>
        </main>
      </GsShell>
    );
  }

  return (
    <GsShell crumbs={[{ label: "Panel admina" }]}>
      <main className="mx-auto max-w-[1160px] space-y-6 px-5 py-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl leading-none">Panel admina</h1>
            <p className="mt-2 text-xs text-muted-foreground">
              Zaproszenia, role członków i moderacja forum oraz czatu.
            </p>
          </div>
          <Link to="/forum" className="text-xs text-muted-foreground hover:text-foreground">
            Przejdź na forum
          </Link>
        </header>

        <nav className="flex flex-wrap gap-1 rounded-xl border border-border bg-secondary/50 p-1">
          {TABS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-current={tab === id}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                tab === id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {tab === "overview" && (
          <div className="grid gap-4 sm:grid-cols-2 min-[860px]:grid-cols-4">
            {[
              ["Kody razem", String(codes.length)],
              ["Wykorzystane", String(used)],
              ["Wolne", String(codes.length - used)],
              ["Członkowie", String(members.length)],
              ["Wątki", String(mod.data?.threads.length ?? 0)],
              ["Posty", String(mod.data?.posts.length ?? 0)],
              ["Wiadomości czatu", String(mod.data?.shouts.length ?? 0)],
              ["Adminów", String(members.filter((m) => m.roles.includes("admin")).length)],
            ].map(([l, v]) => (
              <GsPanel key={l}>
                <div className="px-4 py-4">
                  <p className="text-2xl font-semibold text-foreground">{v}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">{l}</p>
                </div>
              </GsPanel>
            ))}
          </div>
        )}

        {tab === "codes" && (
          <div className="space-y-4">
            <GsPanel title="Generator kodów zaproszeń">
              <div className="space-y-3 px-4 py-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <label className="text-xs">
                    <span className="text-muted-foreground">Ile kodów</span>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                      className={inputClass}
                    />
                  </label>
                  <label className="text-xs">
                    <span className="text-muted-foreground">Ważność (dni, 0 = bez limitu)</span>
                    <input
                      type="number"
                      min={0}
                      max={365}
                      value={days}
                      onChange={(e) => setDays(Number(e.target.value))}
                      className={inputClass}
                    />
                  </label>
                  <label className="text-xs">
                    <span className="text-muted-foreground">Notatka</span>
                    <input
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="np. dla Zbyszka"
                      className={inputClass}
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => generate.mutate()}
                  disabled={generate.isPending}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60"
                >
                  {generate.isPending ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <KeyRound className="size-3" />
                  )}
                  Wygeneruj kody
                </button>

                {fresh.length > 0 && (
                  <div className="rounded-lg border border-primary/40 px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase text-primary">
                      Świeżo z kurnika
                    </p>
                    <ul className="mt-1 space-y-1">
                      {fresh.map((c) => (
                        <li key={c} className="flex items-center gap-2 font-mono text-xs">
                          {c}
                          <button
                            type="button"
                            onClick={() => copy(c)}
                            className="text-muted-foreground hover:text-primary"
                            aria-label={`Kopiuj ${c}`}
                          >
                            <Copy className="size-3" />
                          </button>
                          {copied === c && (
                            <span className="text-[10px] text-[var(--status-ok)]">skopiowane</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </GsPanel>

            <GsPanel title="Wszystkie kody">
              {isLoading ? (
                <p className="px-4 py-4 text-xs text-muted-foreground">Ładowanie…</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-muted-foreground">
                      <tr className="border-b border-border">
                        <th className="px-4 py-2 font-medium">Kod</th>
                        <th className="px-4 py-2 font-medium">Notatka</th>
                        <th className="px-4 py-2 font-medium">Status</th>
                        <th className="px-4 py-2 font-medium">Wygasa</th>
                        <th className="px-4 py-2" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {codes.map((c) => (
                        <tr key={c.id}>
                          <td className="px-4 py-2 font-mono">{c.code}</td>
                          <td className="px-4 py-2 text-muted-foreground">{c.note || "—"}</td>
                          <td className="px-4 py-2">
                            {c.used_by ? (
                              <span className="text-muted-foreground">Wykorzystany</span>
                            ) : (
                              <span className="font-semibold text-[var(--status-ok)]">Wolny</span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-muted-foreground">
                            {c.expires_at
                              ? new Date(c.expires_at).toLocaleDateString("pl-PL")
                              : "bez limitu"}
                          </td>
                          <td className="px-4 py-2 text-right">
                            <button
                              type="button"
                              onClick={() => remove.mutate(c.id)}
                              className="text-muted-foreground hover:text-primary"
                              aria-label={`Usuń kod ${c.code}`}
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {codes.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-4 text-muted-foreground">
                            Jeszcze nie ma żadnych kodów.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </GsPanel>
          </div>
        )}

        {tab === "members" && (
          <GsPanel title="Członkowie kurnika">
            <div className="divide-y divide-border/60">
              {members.map((m) => {
                const isAdmin = m.roles.includes("admin");
                const isMod = m.roles.includes("moderator");
                const banned = Boolean(m.ban);
                const open = banTarget === m.id;
                return (
                  <div key={m.id} className="px-4 py-3 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">
                          {m.username}
                          {banned && (
                            <span className="ml-2 rounded border border-primary/50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
                              zbanowany
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 text-muted-foreground">
                          {m.roles.length ? m.roles.join(", ") : "user"} ·{" "}
                          {new Date(m.created_at).toLocaleDateString("pl-PL")}
                        </p>
                        {m.ban && (
                          <p className="mt-1 text-primary">
                            Powód: {m.ban.reason} ·{" "}
                            {m.ban.banned_until
                              ? `do ${new Date(m.ban.banned_until).toLocaleString("pl-PL")}`
                              : "na zawsze"}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={changeRole.isPending}
                          onClick={() =>
                            changeRole.mutate({ userId: m.id, role: "moderator", grant: !isMod })
                          }
                          className="rounded-lg border border-border px-3 py-1.5 font-medium hover:border-primary disabled:opacity-60"
                        >
                          {isMod ? "Odbierz moda" : "Nadaj moda"}
                        </button>
                        <button
                          type="button"
                          disabled={changeRole.isPending}
                          onClick={() =>
                            changeRole.mutate({ userId: m.id, role: "admin", grant: !isAdmin })
                          }
                          className="rounded-lg border border-border px-3 py-1.5 font-medium hover:border-primary disabled:opacity-60"
                        >
                          {isAdmin ? "Odbierz admina" : "Nadaj admina"}
                        </button>
                        {banned ? (
                          <button
                            type="button"
                            disabled={unban.isPending}
                            onClick={() => unban.mutate({ userId: m.id })}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-medium hover:border-primary disabled:opacity-60"
                          >
                            <ShieldCheck className="size-3" />
                            Odbanuj
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setBanTarget(open ? null : m.id);
                              setBanReason("");
                              setBanUntil("");
                              setBanError(null);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 font-semibold text-primary-foreground"
                          >
                            <Ban className="size-3" />
                            Zbanuj
                          </button>
                        )}
                      </div>
                    </div>

                    {open && !banned && (
                      <form
                        className="mt-3 grid gap-3 rounded-lg border border-primary/40 p-3 sm:grid-cols-[1fr_auto_auto]"
                        onSubmit={(e) => {
                          e.preventDefault();
                          setBanError(null);
                          ban.mutate({
                            userId: m.id,
                            reason: banReason.trim(),
                            until: banUntil || undefined,
                          });
                        }}
                      >
                        <label className="text-xs">
                          <span className="text-muted-foreground">Powód bana</span>
                          <input
                            value={banReason}
                            onChange={(e) => setBanReason(e.target.value)}
                            required
                            minLength={3}
                            maxLength={300}
                            placeholder="np. leakowanie loadera"
                            className={inputClass}
                          />
                        </label>
                        <label className="text-xs">
                          <span className="text-muted-foreground">Do kiedy (puste = na zawsze)</span>
                          <input
                            type="datetime-local"
                            value={banUntil}
                            onChange={(e) => setBanUntil(e.target.value)}
                            className={inputClass}
                          />
                        </label>
                        <div className="flex items-end">
                          <button
                            type="submit"
                            disabled={ban.isPending}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60"
                          >
                            {ban.isPending ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : (
                              <Ban className="size-3" />
                            )}
                            Zamknij konto
                          </button>
                        </div>
                        {banError && (
                          <p className="sm:col-span-3 text-[11px] text-primary">{banError}</p>
                        )}
                        <p className="sm:col-span-3 text-[11px] text-muted-foreground">
                          Ban natychmiast zamyka konto — użytkownik nie zaloguje się do wygaśnięcia
                          bana.
                        </p>
                      </form>
                    )}
                  </div>
                );
              })}
              {members.length === 0 && (
                <p className="px-4 py-4 text-xs text-muted-foreground">Pusty kurnik.</p>
              )}
            </div>
          </GsPanel>
        )}

        {tab === "moderation" && (
          <div className="grid gap-4 min-[860px]:grid-cols-2">
            <GsPanel title="Wątki forum">
              <div className="divide-y divide-border/60">
                {(mod.data?.threads ?? []).map((t) => (
                  <div key={t.id} className="flex items-center gap-3 px-4 py-2.5 text-xs">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">{t.title}</p>
                      <p className="text-muted-foreground">
                        {t.author} · {new Date(t.created_at).toLocaleDateString("pl-PL")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        modAction.mutate({
                          kind: "thread",
                          id: t.id,
                          action: t.pinned ? "unpin" : "pin",
                        })
                      }
                      className="text-muted-foreground hover:text-primary"
                      aria-label={t.pinned ? "Odepnij wątek" : "Przypnij wątek"}
                    >
                      {t.pinned ? <PinOff className="size-3.5" /> : <Pin className="size-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => modAction.mutate({ kind: "thread", id: t.id, action: "delete" })}
                      className="text-muted-foreground hover:text-primary"
                      aria-label="Usuń wątek"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
                {(mod.data?.threads ?? []).length === 0 && (
                  <p className="px-4 py-4 text-xs text-muted-foreground">Brak wątków.</p>
                )}
              </div>
            </GsPanel>

            <GsPanel title="Posty">
              <div className="max-h-[420px] divide-y divide-border/60 overflow-y-auto">
                {(mod.data?.posts ?? []).map((p) => (
                  <div key={p.id} className="flex items-center gap-3 px-4 py-2.5 text-xs">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-foreground">{p.body}</p>
                      <p className="text-muted-foreground">{p.author}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => modAction.mutate({ kind: "post", id: p.id, action: "delete" })}
                      className="text-muted-foreground hover:text-primary"
                      aria-label="Usuń post"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
                {(mod.data?.posts ?? []).length === 0 && (
                  <p className="px-4 py-4 text-xs text-muted-foreground">Brak postów.</p>
                )}
              </div>
            </GsPanel>

            <GsPanel title="Czat (shoutbox)" className="min-[860px]:col-span-2">
              <div className="max-h-[420px] divide-y divide-border/60 overflow-y-auto">
                {(mod.data?.shouts ?? []).map((s) => (
                  <div key={s.id} className="flex items-center gap-3 px-4 py-2.5 text-xs">
                    <span className="w-28 shrink-0 truncate font-medium text-primary">{s.nick}</span>
                    <span className="min-w-0 flex-1 truncate">{s.text}</span>
                    <span className="hidden shrink-0 text-muted-foreground sm:block">
                      {new Date(s.created_at).toLocaleString("pl-PL")}
                    </span>
                    <button
                      type="button"
                      onClick={() => modAction.mutate({ kind: "shout", id: s.id, action: "delete" })}
                      className="text-muted-foreground hover:text-primary"
                      aria-label="Usuń wiadomość"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
                {(mod.data?.shouts ?? []).length === 0 && (
                  <p className="px-4 py-4 text-xs text-muted-foreground">Brak wiadomości.</p>
                )}
              </div>
            </GsPanel>
          </div>
        )}
      </main>
    </GsShell>
  );
}
