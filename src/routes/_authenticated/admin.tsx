import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, KeyRound, Loader2, ShieldAlert, Trash2 } from "lucide-react";

import { GsPanel, GsShell } from "@/components/gs-shell";
import { deleteInviteCode, generateInviteCodes, getAdminData } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Panel admina — kurnik ChickenHook.ru" },
      {
        name: "description",
        content: "Panel administracyjny kurnika: generowanie kodów zaproszeń i lista członków.",
      },
      { property: "og:title", content: "Panel admina ChickenHook.ru" },
      { property: "og:description", content: "Generowanie kodów zaproszeń i lista członków." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const load = useServerFn(getAdminData);
  const gen = useServerFn(generateInviteCodes);
  const del = useServerFn(deleteInviteCode);
  const qc = useQueryClient();

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

  function copy(code: string) {
    void navigator.clipboard.writeText(code);
    setCopied(code);
    window.setTimeout(() => setCopied(null), 1500);
  }

  const codes = data?.codes ?? [];
  const used = codes.filter((c) => c.used_by).length;

  return (
    <GsShell crumbs={[{ label: "Panel admina" }]}>
      <main className="mx-auto max-w-6xl space-y-4 px-5 py-4">
        <h1 className="sr-only">Panel administratora ChickenHook</h1>

        {error ? (
          <GsPanel title="Brak dostępu">
            <div className="flex items-center gap-2 px-4 py-4 text-xs text-muted-foreground">
              <ShieldAlert className="size-4 text-primary" />
              To miejsce jest tylko dla adminów kurnika.
            </div>
          </GsPanel>
        ) : (
          <>
            <GsPanel title="Statystyki kurnika">
              <dl className="flex flex-wrap gap-6 px-4 py-3 text-xs">
                {[
                  ["Kody razem", String(codes.length)],
                  ["Wykorzystane", String(used)],
                  ["Wolne", String(codes.length - used)],
                  ["Członkowie", String(data?.members.length ?? 0)],
                ].map(([l, v]) => (
                  <div key={l} className="flex items-baseline gap-2">
                    <dt className="uppercase tracking-wide text-muted-foreground">{l}</dt>
                    <dd className="gs-glow text-sm font-bold text-primary">{v}</dd>
                  </div>
                ))}
              </dl>
            </GsPanel>

            <GsPanel title="Generator kodów zaproszeń">
              <div className="space-y-3 px-4 py-3">
                <div className="grid gap-3 sm:grid-cols-3">
                  <label className="text-xs">
                    <span className="text-muted-foreground">Ile kodów</span>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                      className="mt-1 w-full border border-border bg-background px-2 py-1.5 text-xs outline-none focus:border-primary"
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
                      className="mt-1 w-full border border-border bg-background px-2 py-1.5 text-xs outline-none focus:border-primary"
                    />
                  </label>
                  <label className="text-xs">
                    <span className="text-muted-foreground">Notatka</span>
                    <input
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="np. dla Zbyszka"
                      className="mt-1 w-full border border-border bg-background px-2 py-1.5 text-xs outline-none focus:border-primary"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => generate.mutate()}
                  disabled={generate.isPending}
                  className="gs-glow inline-flex items-center gap-2 bg-primary px-3 py-1.5 text-[11px] font-bold uppercase text-primary-foreground disabled:opacity-60"
                >
                  {generate.isPending ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <KeyRound className="size-3" />
                  )}
                  Wygeneruj kody
                </button>

                {fresh.length > 0 && (
                  <div className="border border-primary/40 px-3 py-2">
                    <p className="text-[11px] font-bold uppercase text-primary">Świeżo z kurnika</p>
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
                          {copied === c && <span className="text-[10px] gs-lime">skopiowane</span>}
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
                        <th className="px-4 py-2 font-semibold">Kod</th>
                        <th className="px-4 py-2 font-semibold">Notatka</th>
                        <th className="px-4 py-2 font-semibold">Status</th>
                        <th className="px-4 py-2 font-semibold">Wygasa</th>
                        <th className="px-4 py-2" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {codes.map((c) => (
                        <tr key={c.id}>
                          <td className="px-4 py-2 font-mono">{c.code}</td>
                          <td className="px-4 py-2 text-muted-foreground">{c.note || "—"}</td>
                          <td className="px-4 py-2">
                            {c.used_by ? (
                              <span className="text-muted-foreground">Wykorzystany</span>
                            ) : (
                              <span className="gs-lime font-bold">Wolny</span>
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

            <GsPanel title="Członkowie kurnika">
              <div className="divide-y divide-border">
                {(data?.members ?? []).map((m) => (
                  <div key={m.id} className="flex items-center justify-between px-4 py-2.5 text-xs">
                    <span className="font-semibold">{m.username}</span>
                    <span className="text-muted-foreground">
                      {m.roles.length ? m.roles.join(", ") : "user"} ·{" "}
                      {new Date(m.created_at).toLocaleDateString("pl-PL")}
                    </span>
                  </div>
                ))}
                {(data?.members ?? []).length === 0 && (
                  <p className="px-4 py-4 text-xs text-muted-foreground">Pusty kurnik.</p>
                )}
              </div>
            </GsPanel>
          </>
        )}
      </main>
    </GsShell>
  );
}
