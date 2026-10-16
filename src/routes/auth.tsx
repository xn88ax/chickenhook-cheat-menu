// ============= Full file contents =============
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { GateLogin } from "@/components/gate-login";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    next: typeof search.next === "string" ? search.next : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Logowanie — Forum chickenhook.wtf (invite only)" },
      {
        name: "description",
        content:
          "Forum ChickenHook działa w trybie invite only. Zaloguj się lub aktywuj konto kodem zaproszenia.",
      },
      { property: "og:title", content: "Logowanie — Forum chickenhook.wtf" },
      {
        property: "og:description",
        content: "Dostęp do forum ChickenHook wyłącznie z kodem zaproszenia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { next } = useSearch({ from: "/auth" });
  const target = next && next.startsWith("/") ? next : "/forum";

  return (
    <div className="gate-bg flex min-h-screen items-center justify-center px-5 py-12">
      <GateLogin next={target} />
    </div>
  );
}
