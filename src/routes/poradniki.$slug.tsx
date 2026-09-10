import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { GsPanel, GsShell } from "@/components/gs-shell";
import { guides } from "@/data/guides";

export const Route = createFileRoute("/poradniki/$slug")({
  loader: ({ params }) => {
    const guide = guides.find((g) => g.slug === params.slug);
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Nie znaleziono poradnika — chickenhook.wtf" }, { name: "robots", content: "noindex" }],
      };
    }
    const { guide } = loaderData;
    return {
      meta: [
        { title: `${guide.title} — chickenhook.wtf` },
        { name: "description", content: guide.excerpt },
        { property: "og:title", content: guide.title },
        { property: "og:description", content: guide.excerpt },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: GuideNotFound,
  component: GuidePage,
});

function GuideNotFound() {
  return (
    <GsShell crumbs={[{ label: "Poradniki" }]}>
      <main className="mx-auto max-w-4xl px-5 py-4">
        <GsPanel title="Nie ma takiego poradnika">
          <div className="px-4 py-4 text-xs text-muted-foreground">
            <p>Ten poradnik zniknął razem z buildem, o którym opowiadał.</p>
            <Link to="/poradniki" className="mt-3 inline-block text-primary hover:underline">
              Wróć do listy poradników
            </Link>
          </div>
        </GsPanel>
      </main>
    </GsShell>
  );
}

function GuidePage() {
  const { guide } = Route.useLoaderData();

  return (
    <GsShell crumbs={[{ label: "Poradniki" }, { label: guide.title }]}>
      <main className="mx-auto max-w-3xl space-y-4 px-5 py-4">
        <GsPanel title="Poradnik">
          <article className="px-4 py-4">
            <h1 className="text-lg font-bold">{guide.title}</h1>
            <p className="mt-1 text-[11px] text-muted-foreground">
              <span className="font-bold text-primary">{guide.author}</span> · {guide.date} ·{" "}
              {guide.readTime} czytania
            </p>
            <p className="mt-3 text-xs italic text-muted-foreground">{guide.excerpt}</p>

            {guide.body.map((s) => (
              <section key={s.heading} className="mt-5">
                <h2 className="text-sm font-bold gs-lime">{s.heading}</h2>
                {s.paragraphs.map((p) => (
                  <p key={p} className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
              </section>
            ))}

            <Link to="/poradniki" className="mt-6 inline-block text-xs text-primary hover:underline">
              ← Wszystkie poradniki
            </Link>
          </article>
        </GsPanel>
      </main>
    </GsShell>
  );
}
