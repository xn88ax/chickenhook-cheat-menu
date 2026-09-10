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

  return (
    <ForumShell>
      <main className="mx-auto max-w-6xl space-y-4 px-5 py-4">
        {/* Banners */}
        <div className="space-y-2">
          <p className="gs-banner px-4 py-2.5 text-center text-xs font-bold">
            Masz nieużyte kody zaproszeń!
          </p>
          <p className="gs-banner px-4 py-2.5 text-center text-xs font-bold">
            Dostępny jest nowy klient — build 4.chkn!
          </p>
        </div>

        {/* Welcome notice (iniuria-style) */}
        <p className="gs-panel px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          Jeśli jesteś tu pierwszy raz, przeczytaj{" "}
          <Link to="/" hash="faq" className="text-primary hover:underline">
            FAQ
          </Link>
          . Aby pisać na forum, musisz mieć konto z aktywną subskrypcją — po opłaceniu
          zamówienia konto aktywuje się automatycznie. Wybierz dział z listy poniżej i
          działaj.
        </p>

        {/* Big glossy action buttons */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <a href="#faq" className="gs-action">
            Pobierz
          </a>
          <Link to="/opcje" className="gs-action">
            Tutorial
          </Link>
          <a href="#faq" className="gs-action">
            Support
          </a>
        </div>

        {/* Announcement */}
        <section className="gs-panel">
          <h2 className="gs-head border-b border-border px-4 py-2 text-xs font-bold">
            Ogłoszenie
          </h2>
          <div className="px-4 py-3 text-xs leading-relaxed">
            <p className="font-bold text-primary">UWAGA, WAŻNA WIADOMOŚĆ:</p>
            <p className="mt-1 text-muted-foreground">
              Po zakupie subskrypcji załóż ticket na naszym{" "}
              <Link to="/" hash="faq" className="text-primary hover:underline">
                SUPPORCIE
              </Link>
              , aby otrzymać dane do konta i aktywować subskrypcję.
            </p>
          </div>
        </section>

        {/* New thread */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Wątki:{" "}
            <span className="cursor-pointer text-primary hover:underline">Napisane</span> |{" "}
            <span className="cursor-pointer text-primary hover:underline">Nowe</span> |{" "}
            <span className="cursor-pointer text-primary hover:underline">Aktywne</span>
          </span>
          {user && (
            <button
              onClick={() => setOpen((v) => !v)}
              className="bucket-gradient px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-primary-foreground"
            >
              {open ? "Anuluj" : "Nowy wątek"}
            </button>
          )}
        </div>

        {open && user && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setError(null);
              createThread.mutate();
            }}
            className="space-y-3 gs-panel p-4"
          >
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border border-border gs-bg px-3 py-2 text-sm"
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
              className="w-full border border-border gs-bg px-3 py-2 text-sm"
            />
            <textarea
              required
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Treść pierwszego posta"
              className="w-full border border-border gs-bg px-3 py-2 text-sm"
            />
            {error && <p className="text-xs text-primary">{error}</p>}
            <button
              type="submit"
              disabled={createThread.isPending}
              className="bucket-gradient px-4 py-2 text-xs font-bold uppercase text-primary-foreground disabled:opacity-60"
            >
              Opublikuj wątek
            </button>
          </form>
        )}

        {/* Sections */}
        {sections.map((section) => (
          <section key={section} className="gs-panel">
            <h2 className="gs-head px-4 py-2 text-xs font-bold">{section}</h2>
            <div className="border-b-2" style={{ borderColor: "oklch(0.62 0.23 26)" }} />
            <div className="divide-y divide-border">
              {categories
                .filter((c) => c.section === section)
                .map((c, i) => {
                  const last = lastFor(c.id);
                  return (
                    <Link
                      key={c.id}
                      to="/forum/dzial/$slug"
                      params={{ slug: c.slug }}
                      className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-white/5"
                    >
                      <MessageSquare className="size-5 shrink-0 text-muted-foreground" aria-hidden />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-foreground">
                          {c.name}{" "}
                          <span className="text-xs font-normal text-muted-foreground">
                            ({2 + ((i * 3) % 7)} ogląda)
                          </span>
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">{c.description}</p>
                      </div>
                      <span className="hidden w-24 shrink-0 text-right text-xs text-muted-foreground sm:block">
                        Wątki: <span className="font-bold text-foreground">{countFor(c.id)}</span>
                      </span>
                      <span className="hidden w-48 shrink-0 text-right text-xs text-muted-foreground md:block">
                        {last ? (
                          <>
                            <span className="block truncate text-foreground">{last.title}</span>
                            <span className="text-primary">{nameOf(last.author_id)}</span> ·{" "}
                            {timeAgo(last.created_at)}
                          </>
                        ) : (
                          "Brak postów"
                        )}
                      </span>
                    </Link>
                  );
                })}
            </div>
          </section>
        ))}

        {/* Latest threads */}
        <section className="gs-panel">
          <h2 className="gs-head px-4 py-2 text-xs font-bold">Ostatnie wątki</h2>
          <div className="border-b-2" style={{ borderColor: "oklch(0.62 0.23 26)" }} />
          <div className="divide-y divide-border">
            {threadsQuery.isLoading && (
              <p className="px-4 py-6 text-xs text-muted-foreground">Ładowanie…</p>
            )}
            {!threadsQuery.isLoading && threads.length === 0 && (
              <p className="px-4 py-6 text-xs text-muted-foreground">
                Brak wątków. Załóż pierwszy.
              </p>
            )}
            {threads.map((t) => (
              <Link
                key={t.id}
                to="/forum/watek/$id"
                params={{ id: t.id }}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/5"
              >
                <Avatar name={nameOf(t.author_id)} className="size-8" />
                <div className="min-w-0 flex-1">
                  <h3 className="flex items-center gap-1.5 text-sm font-semibold">
                    {t.pinned && <Pin className="size-3.5 shrink-0 gs-lime" />}
                    <span className="truncate">{t.title}</span>
                  </h3>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    <span className="text-primary">{nameOf(t.author_id)}</span> ·{" "}
                    {timeAgo(t.created_at)}
                  </p>
                </div>
                <MessageSquare className="size-4 shrink-0 gs-lime" />
              </Link>
            ))}
          </div>
        </section>

        {/* Stats strip */}
        <section className="gs-panel">
          <h2 className="gs-head px-4 py-2 text-xs font-bold">Statystyki forum</h2>
          <dl className="flex flex-wrap gap-6 px-4 py-3 text-xs">
            {[
              ["Wątki", statsQuery.data?.threads ?? 0],
              ["Posty", statsQuery.data?.posts ?? 0],
              ["Członkowie", statsQuery.data?.members ?? 0],
            ].map(([l, v]) => (
              <div key={l as string} className="flex items-baseline gap-2">
                <dt className="uppercase tracking-wide text-muted-foreground">{l}</dt>
                <dd className="text-sm font-bold gs-lime">{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </ForumShell>
  );
}
