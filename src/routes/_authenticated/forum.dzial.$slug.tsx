import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ban, Lock, Pin, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { GsPanel, GsShell } from "@/components/gs-shell";
import { Avatar, timeAgo } from "@/components/forum/forum-shell";
import { banUser, moderateContent } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/forum/dzial/$slug")({
  head: () => ({
    meta: [
      { title: "Dział forum — chickenhook.wtf" },
      { name: "description", content: "Wątki w wybranym dziale forum ChickenHook dla graczy CS2." },
      { property: "og:title", content: "Dział forum chickenhook.wtf" },
      { property: "og:description", content: "Przeglądaj wątki w dziale forum ChickenHook." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { isAdmin } = useIsAdmin();
  const queryClient = useQueryClient();
  const moderate = useServerFn(moderateContent);
  const ban = useServerFn(banUser);
  const [banNote, setBanNote] = useState<string | null>(null);
  const modAction = useMutation({
    mutationFn: (input: { kind: "thread" | "post" | "shout"; id: string }) =>
      moderate({ data: { kind: input.kind, id: input.id, action: "delete" } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["forum", "category-threads"] }),
  });
  const banAction = useMutation({
    mutationFn: (input: { userId: string; name: string }) =>
      ban({
        data: {
          userId: input.userId,
          reason: "Wykluczony z forum przez administrację — do decyzji admina.",
        },
      }).then((res) => ({ res, name: input.name })),
    onSuccess: ({ res, name }) => {
      setBanNote(
        res.ok
          ? `${name} został wykluczony z forum — konto zamknięte do odwołania admina.`
          : (res.error ?? "Nie udało się zbanować użytkownika."),
      );
      queryClient.invalidateQueries({ queryKey: ["forum", "category-threads"] });
    },
    onError: () => setBanNote("Nie udało się zbanować użytkownika."),
  });


  const categoryQuery = useQuery({
    queryKey: ["forum", "category", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_categories")
        .select("id,name,description,locked")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const category = categoryQuery.data;

  const threadsQuery = useQuery({
    enabled: !!category?.id,
    queryKey: ["forum", "category-threads", category?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_threads")
        .select("id,title,pinned,created_at,author_id")
        .eq("category_id", category!.id)
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const profilesQuery = useQuery({
    queryKey: ["forum", "profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id,username");
      if (error) throw error;
      return data as { id: string; username: string }[];
    },
  });
  const nameOf = (uid: string) =>
    profilesQuery.data?.find((p) => p.id === uid)?.username ?? "użytkownik";

  return (
    <GsShell crumbs={category ? [{ label: "Forum" }, { label: category.name }] : [{ label: "Forum" }]}>
      <main className="mx-auto max-w-[1160px] space-y-4 px-5 py-6">
        {categoryQuery.isLoading && <p className="text-sm text-muted-foreground">Ładowanie…</p>}
        {!categoryQuery.isLoading && !category && (
          <p className="text-sm text-muted-foreground">
            Nie ma takiego działu.{" "}
            <Link to="/forum" className="text-primary underline">
              Powrót
            </Link>
          </p>
        )}

        {category && (
          <>
            <div>
              <h1 className="flex items-center gap-2 font-display text-3xl">
                {category.locked && <Lock className="size-5 text-primary" aria-hidden />}
                {category.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
              {category.locked && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Dział tylko do odczytu — pisać mogą tu wyłącznie administratorzy.
                </p>
              )}
            </div>

            <section className="gs-panel">
              <h2 className="gs-head px-4 py-2 text-xs font-bold">
                Wątki
              </h2>
                            <div className="divide-y divide-border/60">
                {(threadsQuery.data ?? []).length === 0 && (
                  <p className="px-4 py-6 text-xs text-muted-foreground">
                    Brak wątków w tym dziale.
                  </p>
                )}
                {(threadsQuery.data ?? []).map((t) => (
                  <div key={t.id} className="group flex items-center transition-colors hover:bg-white/5">
                    <Link
                      to="/forum/watek/$id"
                      params={{ id: t.id }}
                      className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3"
                    >
                      <Avatar name={nameOf(t.author_id)} className="size-9" />
                      <div className="min-w-0 flex-1">
                        <h3 className="flex items-center gap-1.5 text-sm font-semibold">
                          {t.pinned && <Pin className="size-3.5 shrink-0 text-primary" />}
                          <span className="truncate">{t.title}</span>
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {nameOf(t.author_id)} · {timeAgo(t.created_at)}
                        </p>
                      </div>
                    </Link>
                    {isAdmin ? (
                      <>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          disabled={banAction.isPending}
                          onClick={() =>
                            banAction.mutate({
                              userId: t.author_id,
                              name: nameOf(t.author_id),
                            })
                          }
                          aria-label={`Zbanuj ${nameOf(t.author_id)}`}
                          title="Zbanuj autora — wyklucza z forum i zamyka konto"
                          className="size-8 shrink-0 text-muted-foreground hover:text-primary"
                        >
                          <Ban className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          disabled={modAction.isPending}
                          onClick={() => modAction.mutate({ kind: "thread", id: t.id })}
                          aria-label={`Usuń wątek ${t.title}`}
                          title="Usuń wątek"
                          className="mr-3 size-8 shrink-0 text-muted-foreground hover:text-primary"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </>
                    ) : null}

                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </GsShell>
  );
}
