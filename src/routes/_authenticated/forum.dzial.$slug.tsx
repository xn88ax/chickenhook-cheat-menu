import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Pin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, ForumShell, timeAgo } from "@/components/forum/forum-shell";

export const Route = createFileRoute("/_authenticated/forum/dzial/$slug")({
  head: () => ({
    meta: [
      { title: "Dział forum — ChickenHook.ru" },
      { name: "description", content: "Wątki w wybranym dziale forum ChickenHook dla graczy CS2." },
      { property: "og:title", content: "Dział forum ChickenHook.ru" },
      { property: "og:description", content: "Przeglądaj wątki w dziale forum ChickenHook." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();

  const categoryQuery = useQuery({
    queryKey: ["forum", "category", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_categories")
        .select("id,name,description")
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
    <ForumShell crumbs={category ? [{ label: category.name }] : []}>
      <main className="mx-auto max-w-4xl space-y-4 px-5 py-6">
        {categoryQuery.isLoading && <p className="text-sm text-muted-foreground">Ładowanie…</p>}
        {!categoryQuery.isLoading && !category && (
          <p className="text-sm text-muted-foreground">
            Nie ma takiego działu.{" "}
            <Link to="/forum" className="text-primary underline">
              Wróć na forum
            </Link>
          </p>
        )}

        {category && (
          <>
            <div>
              <h1 className="text-display text-3xl uppercase">{category.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
            </div>

            <section className="gs-panel">
              <h2 className="gs-head px-4 py-2 text-xs font-bold">
                Wątki
              </h2>
              <div className="border-b-2" style={{ borderColor: "oklch(0.62 0.23 26)" }} />
              <div className="divide-y divide-border">
                {(threadsQuery.data ?? []).length === 0 && (
                  <p className="px-4 py-6 text-xs text-muted-foreground">
                    Brak wątków w tym dziale.
                  </p>
                )}
                {(threadsQuery.data ?? []).map((t) => (
                  <Link
                    key={t.id}
                    to="/forum/watek/$id"
                    params={{ id: t.id }}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/5"
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
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </ForumShell>
  );
}
