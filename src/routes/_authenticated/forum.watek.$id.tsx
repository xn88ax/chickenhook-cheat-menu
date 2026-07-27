import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, ForumShell, timeAgo } from "@/components/forum/forum-shell";

export const Route = createFileRoute("/_authenticated/forum/watek/$id")({
  head: () => ({
    meta: [
      { title: "Wątek — Forum ChickenHook.ru" },
      { name: "description", content: "Dyskusja społeczności ChickenHook o CS2, configach i pomocy." },
      { property: "og:title", content: "Wątek na forum ChickenHook.ru" },
      { property: "og:description", content: "Czytaj i odpowiadaj w wątku forum ChickenHook." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ThreadPage,
});

function ThreadPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [reply, setReply] = useState("");
  const [error, setError] = useState<string | null>(null);

  const threadQuery = useQuery({
    queryKey: ["forum", "thread", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_threads")
        .select("id,title,body,created_at,author_id,category_id")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const postsQuery = useQuery({
    queryKey: ["forum", "posts", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_posts")
        .select("id,body,created_at,author_id")
        .eq("thread_id", id)
        .order("created_at");
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

  const addPost = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Zaloguj się, aby odpowiedzieć.");
      const { error } = await supabase
        .from("forum_posts")
        .insert({ thread_id: id, author_id: user.id, body: reply });
      if (error) throw error;
    },
    onSuccess: () => {
      setReply("");
      queryClient.invalidateQueries({ queryKey: ["forum", "posts", id] });
    },
    onError: (e) => setError(e instanceof Error ? e.message : "Nie udało się wysłać."),
  });

  const thread = threadQuery.data;

  return (
    <ForumShell crumbs={thread ? [{ label: thread.title }] : []}>
      <main className="mx-auto max-w-4xl space-y-4 px-5 py-6">
        {threadQuery.isLoading && <p className="text-sm text-muted-foreground">Ładowanie…</p>}
        {!threadQuery.isLoading && !thread && (
          <p className="text-sm text-muted-foreground">
            Nie ma takiego wątku.{" "}
            <Link to="/forum" className="text-primary underline">
              Wróć na forum
            </Link>
          </p>
        )}

        {thread && (
          <>
            <h1 className="text-display text-3xl uppercase">{thread.title}</h1>

            <article className="overflow-hidden rounded-sm border border-border">
              <header className="flex items-center gap-3 bg-secondary px-4 py-2.5">
                <Avatar name={nameOf(thread.author_id)} className="size-8" />
                <span className="text-xs font-bold">{nameOf(thread.author_id)}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {timeAgo(thread.created_at)}
                </span>
              </header>
              <p className="whitespace-pre-wrap glass px-4 py-4 text-sm leading-relaxed">
                {thread.body}
              </p>
            </article>

            {(postsQuery.data ?? []).map((p) => (
              <article key={p.id} className="overflow-hidden rounded-sm border border-border">
                <header className="flex items-center gap-3 bg-secondary px-4 py-2.5">
                  <Avatar name={nameOf(p.author_id)} className="size-8" />
                  <span className="text-xs font-bold">{nameOf(p.author_id)}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {timeAgo(p.created_at)}
                  </span>
                </header>
                <p className="whitespace-pre-wrap glass px-4 py-4 text-sm leading-relaxed">
                  {p.body}
                </p>
              </article>
            ))}

            {user ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setError(null);
                  addPost.mutate();
                }}
                className="space-y-3 rounded-sm border border-border glass p-4"
              >
                <textarea
                  required
                  rows={4}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Napisz odpowiedź…"
                  className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm"
                />
                {error && <p className="text-xs text-primary">{error}</p>}
                <button
                  type="submit"
                  disabled={addPost.isPending}
                  className="rounded-sm bucket-gradient px-4 py-2 text-xs font-bold uppercase text-primary-foreground disabled:opacity-60"
                >
                  Odpowiedz
                </button>
              </form>
            ) : (
              <Link
                to="/auth"
                search={{ next: `/forum/watek/${id}` }}
                className="inline-block rounded-sm border border-border px-4 py-2 text-xs font-bold uppercase text-foreground hover:bg-secondary"
              >
                Zaloguj się, aby odpowiedzieć
              </Link>
            )}
          </>
        )}
      </main>
    </ForumShell>
  );
}
