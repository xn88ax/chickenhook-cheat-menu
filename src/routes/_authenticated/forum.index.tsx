import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Lock, MessageSquare, Pin, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { GsPanel, GsShell } from "@/components/gs-shell";
import { Avatar, timeAgo } from "@/components/forum/forum-shell";

export const Route = createFileRoute("/_authenticated/forum/")({
  head: () => ({
    meta: [
      { title: "Forum chickenhook.wtf — społeczność cheatów do CS2" },
      {
        name: "description",
        content:
          "Forum ChickenHook: ogłoszenia, configi, pomoc techniczna i dyskusje graczy CS2. Załóż konto i pisz.",
      },
      { property: "og:title", content: "Forum chickenhook.wtf" },
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
  locked: boolean;
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

  const lastFor = (categoryId: string) =>
    threads
      .filter((t) => t.category_id === categoryId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];

  const inputClass =
    "w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary";

  return (
    <GsShell crumbs={[{ label: "Forum" }]}>
      <main className="mx-auto max-w-[1160px] space-y-6 px-5 py-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl leading-none">Forum</h1>
            <p className="mt-2 text-xs text-muted-foreground">
              Ogłoszenia, configi, support i dyskusje społeczności.
            </p>
          </div>
          {user && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/70 px-4 py-2 text-xs font-semibold hover:border-primary"
            >
              <Plus className="size-3.5" />
              {open ? "Anuluj" : "Nowy wątek"}
            </button>
          )}
        </header>

        <div className="grid gap-4 min-[860px]:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            {open && user && (
              <GsPanel title="Nowy wątek">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setError(null);
                    createThread.mutate();
                  }}
                  className="space-y-3 px-4 py-4"
                >
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className={inputClass}
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
                    className={inputClass}
                  />
                  <textarea
                    required
                    rows={4}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Treść pierwszego posta"
                    className={inputClass}
                  />
                  {error && <p className="text-xs text-primary">{error}</p>}
                  <button
                    type="submit"
                    disabled={createThread.isPending}
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60"
                  >
                    Opublikuj wątek
                  </button>
                </form>
              </GsPanel>
            )}

            {sections.map((section) => (
              <GsPanel key={section} title={section}>
                <div className="divide-y divide-border/60">
                  {categories
                    .filter((c) => c.section === section)
                    .map((c) => {
                      const last = lastFor(c.id);
                      return (
                        <Link
                          key={c.id}
                          to="/forum/dzial/$slug"
                          params={{ slug: c.slug }}
                          className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-white/5"
                        >
                          <MessageSquare className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-semibold text-foreground">{c.name}</h3>
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {c.description}
                            </p>
                          </div>
                          <span className="hidden w-20 shrink-0 text-right text-xs text-muted-foreground sm:block">
                            {countFor(c.id)} wątków
                          </span>
                          <span className="hidden w-44 shrink-0 text-right text-xs text-muted-foreground md:block">
                            {last ? (
                              <>
                                <span className="block truncate text-foreground">{last.title}</span>
                                {nameOf(last.author_id)} · {timeAgo(last.created_at)}
                              </>
                            ) : (
                              "brak postów"
                            )}
                          </span>
                        </Link>
                      );
                    })}
                </div>
              </GsPanel>
            ))}
          </div>

          <div className="space-y-4">
            <GsPanel title="Ostatnie wątki">
              <div className="divide-y divide-border/60">
                {threadsQuery.isLoading && (
                  <p className="px-4 py-6 text-xs text-muted-foreground">Ładowanie…</p>
                )}
                {!threadsQuery.isLoading && threads.length === 0 && (
                  <p className="px-4 py-6 text-xs text-muted-foreground">
                    Brak wątków. Załóż pierwszy.
                  </p>
                )}
                {threads.slice(0, 8).map((t) => (
                  <Link
                    key={t.id}
                    to="/forum/watek/$id"
                    params={{ id: t.id }}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/5"
                  >
                    <Avatar name={nameOf(t.author_id)} className="size-8" />
                    <div className="min-w-0 flex-1">
                      <h3 className="flex items-center gap-1.5 text-sm font-medium">
                        {t.pinned && <Pin className="size-3 shrink-0 text-primary" />}
                        <span className="truncate">{t.title}</span>
                      </h3>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {nameOf(t.author_id)} · {timeAgo(t.created_at)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </GsPanel>

            <GsPanel title="Statystyki">
              <dl className="grid grid-cols-3 gap-2 px-4 py-4 text-center">
                {[
                  ["Wątki", statsQuery.data?.threads ?? 0],
                  ["Posty", statsQuery.data?.posts ?? 0],
                  ["Członkowie", statsQuery.data?.members ?? 0],
                ].map(([l, v]) => (
                  <div key={l as string}>
                    <dd className="text-lg font-semibold text-foreground">{v}</dd>
                    <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{l}</dt>
                  </div>
                ))}
              </dl>
            </GsPanel>

            <GsPanel title="Zasady">
              <ul className="space-y-2 px-4 py-4 text-xs text-muted-foreground">
                <li>Bez spamu i reklam obcych cheatów.</li>
                <li>Problemy techniczne zgłaszaj w dziale support.</li>
                <li>To strona parodystyczna, demo bez prawdziwego oprogramowania.</li>
              </ul>
            </GsPanel>
          </div>
        </div>
      </main>
    </GsShell>
  );
}
