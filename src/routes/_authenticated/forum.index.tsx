import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Pin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, ForumShell, timeAgo } from "@/components/forum/forum-shell";

export const Route = createFileRoute("/_authenticated/forum/")({
  head: () => ({
    meta: [
      { title: "Forum ChickenHook.ru — społeczność cheatów do CS2" },
      {
        name: "description",
        content:
          "Forum ChickenHook: ogłoszenia, configi, pomoc techniczna i dyskusje graczy CS2. Załóż konto i pisz.",
      },
      { property: "og:title", content: "Forum ChickenHook.ru" },
      {
        property: "og:description",
        content: "Ogłoszenia, configi, support i dyskusje społeczności ChickenHook.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Forum,
});

type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  section: string;
  position: number;
};

type ThreadRow = {
  id: string;
  title: string;
  pinned: boolean;
  created_at: string;
  author_id: string;
  category_id: string;
};

function Forum() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ["forum", "categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_categories")
        .select("*")
        .order("position");
      if (error) throw error;
      return data as Category[];
    },
  });

  const threadsQuery = useQuery({
    queryKey: ["forum", "threads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_threads")
        .select("id,title,pinned,created_at,author_id,category_id")
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return data as ThreadRow[];
    },
  });

  const statsQuery = useQuery({
    queryKey: ["forum", "stats"],
    queryFn: async () => {
      const [threads, posts, members] = await Promise.all([
        supabase.from("forum_threads").select("id", { count: "exact", head: true }),
        supabase.from("forum_posts").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);
      return {
        threads: threads.count ?? 0,
        posts: posts.count ?? 0,
        members: members.count ?? 0,
      };
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

  const nameOf = (id: string) =>
    profilesQuery.data?.find((p) => p.id === id)?.username ?? "użytkownik";

  const createThread = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Musisz być zalogowany.");
      const { data, error } = await supabase
        .from("forum_threads")
        .insert({ title, body, category_id: categoryId, author_id: user.id })
        .select("id")
        .single();
      if (error) throw error;
      return data.id as string;
    },
    onSuccess: (id) => {
      setOpen(false);
      setTitle("");
      setBody("");
      queryClient.invalidateQueries({ queryKey: ["forum"] });
      navigate({ to: "/forum/watek/$id", params: { id } });
    },
    onError: (e) => setError(e instanceof Error ? e.message : "Nie udało się dodać wątku."),
  });

  const categories = categoriesQuery.data ?? [];
  const sections = Array.from(new Set(categories.map((c) => c.section)));
  const threads = threadsQuery.data ?? [];

  const countFor = (categoryId: string) =>
    threads.filter((t) => t.category_id === categoryId).length;

  return (
    <ForumShell>
      <main className="mx-auto grid max-w-6xl gap-6 px-5 py-6 lg:grid-cols-[1fr_260px]">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-display text-3xl uppercase">
              Forum <span className="text-primary">ChickenHook</span>
            </h1>
            {user ? (
              <button
                onClick={() => setOpen((v) => !v)}
                className="rounded-sm bucket-gradient px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-bucket)]"
              >
                {open ? "Anuluj" : "Nowy wątek"}
              </button>
            ) : (
              <Link
                to="/auth"
                search={{ next: "/forum" }}
                className="rounded-sm border border-border px-4 py-2 text-xs font-bold uppercase tracking-wide text-foreground hover:bg-secondary"
              >
                Zaloguj się, aby pisać
              </Link>
            )}
          </div>

          {open && user && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setError(null);
                createThread.mutate();
              }}
              className="space-y-3 rounded-sm border border-border bg-card p-4"
            >
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="">Wybierz dział…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                required
                maxLength={140}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tytuł wątku"
                className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm"
              />
              <textarea
                required
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Treść pierwszego posta"
                className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm"
              />
              {error && <p className="text-xs text-primary">{error}</p>}
              <button
                type="submit"
                disabled={createThread.isPending}
                className="rounded-sm bucket-gradient px-4 py-2 text-xs font-bold uppercase text-primary-foreground disabled:opacity-60"
              >
                Opublikuj wątek
              </button>
            </form>
          )}

          {sections.map((section) => (
            <section key={section} className="overflow-hidden rounded-sm border border-border">
              <h2 className="bucket-gradient px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-foreground">
                {section}
              </h2>
              <div className="divide-y divide-border">
                {categories
                  .filter((c) => c.section === section)
                  .map((c) => (
                    <Link
                      key={c.id}
                      to="/forum/dzial/$slug"
                      params={{ slug: c.slug }}
                      className="flex items-center gap-4 glass px-4 py-4 transition-colors hover:bg-secondary/50"
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold">{c.name}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {countFor(c.id)} wątków
                      </span>
                    </Link>
                  ))}
              </div>
            </section>
          ))}

          <section className="overflow-hidden rounded-sm border border-border">
            <h2 className="bg-secondary px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-foreground">
              Ostatnie wątki
            </h2>
            <div className="divide-y divide-border">
              {threadsQuery.isLoading && (
                <p className="bg-card px-4 py-6 text-xs text-muted-foreground">Ładowanie…</p>
              )}
              {!threadsQuery.isLoading && threads.length === 0 && (
                <p className="bg-card px-4 py-6 text-xs text-muted-foreground">
                  Brak wątków. Załóż pierwszy.
                </p>
              )}
              {threads.map((t) => (
                <Link
                  key={t.id}
                  to="/forum/watek/$id"
                  params={{ id: t.id }}
                  className="flex items-center gap-3 glass px-4 py-3 transition-colors hover:bg-secondary/50"
                >
                  <Avatar name={nameOf(t.author_id)} className="size-9" />
                  <div className="min-w-0 flex-1">
                    <h3 className="flex items-center gap-1.5 text-sm font-semibold">
                      {t.pinned && <Pin className="size-3.5 shrink-0 text-primary" />}
                      <span className="truncate">{t.title}</span>
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {nameOf(t.author_id)} · {timeAgo(t.created_at)}
                    </p>
                  </div>
                  <MessageSquare className="size-4 shrink-0 text-accent" />
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="overflow-hidden rounded-sm border border-border">
            <h2 className="bg-secondary px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-foreground">
              Statystyki forum
            </h2>
            <dl className="space-y-2 bg-card px-4 py-4 text-xs">
              {[
                ["Wątki", statsQuery.data?.threads ?? 0],
                ["Posty", statsQuery.data?.posts ?? 0],
                ["Członkowie", statsQuery.data?.members ?? 0],
              ].map(([l, v]) => (
                <div key={l as string} className="flex items-center justify-between">
                  <dt className="uppercase tracking-wide text-muted-foreground">{l}</dt>
                  <dd className="text-display text-xl text-accent">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="overflow-hidden rounded-sm border border-border">
            <h2 className="bg-secondary px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-foreground">
              Dołącz do nas
            </h2>
            <div className="space-y-2 bg-card px-4 py-4">
              <Link
                to="/"
                hash="menu"
                className="block rounded-sm bucket-gradient px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-primary-foreground"
              >
                Zobacz cennik
              </Link>
              <Link
                to="/opcje"
                className="block rounded-sm border border-border px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-foreground hover:bg-secondary"
              >
                Opcje cheata
              </Link>
            </div>
          </section>
        </aside>
      </main>
    </ForumShell>
  );
}
