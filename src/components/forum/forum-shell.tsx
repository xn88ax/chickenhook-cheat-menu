import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, displayName } from "@/hooks/use-auth";

export function Avatar({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center bucket-gradient text-xs font-bold uppercase text-primary-foreground ${className}`}
      aria-hidden
    >
      {name.slice(0, 2)}
    </span>
  );
}

export function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "przed chwilą";
  if (diff < 3600) return `${Math.floor(diff / 60)} min temu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} godz. temu`;
  return `${Math.floor(diff / 86400)} dni temu`;
}

export function ForumShell({
  children,
  crumbs = [],
}: {
  children: ReactNode;
  crumbs?: { label: string; to?: string }[];
}) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gs-bg font-sans text-foreground">
      {/* Logo bar */}
      <div className="mx-auto max-w-6xl px-5 pt-5">
        <Link to="/" className="inline-flex items-baseline text-2xl font-extrabold tracking-tight">
          <span className="text-foreground">chicken</span>
          <span className="gs-lime">hook</span>
          <span className="text-muted-foreground">.ru</span>
        </Link>
      </div>

      {/* Tab nav */}
      <header className="sticky top-0 z-50 mt-4 border-y border-border gs-head">
        <div className="mx-auto flex max-w-6xl items-center gap-1 px-5 text-xs font-semibold">
          <Bell className="mr-2 size-3.5 gs-lime" />
          <Link to="/forum" className="px-3 py-3 text-foreground">
            Index
          </Link>
          <Link to="/forum" className="px-3 py-3 text-muted-foreground hover:text-foreground">
            Lista użytkowników
          </Link>
          <Link to="/poradniki" className="px-3 py-3 text-muted-foreground hover:text-foreground">
            Poradniki
          </Link>

          <Link to="/forum" className="px-3 py-3 text-muted-foreground hover:text-foreground">
            Profil
          </Link>
          <Link to="/" hash="menu" className="px-3 py-3 font-bold text-primary hover:brightness-110">
            Premium
          </Link>
          <Link to="/" className="px-3 py-3 font-bold text-accent hover:brightness-110">
            Administracja
          </Link>
          {user ? (
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/forum" });
              }}
              className="ml-auto px-3 py-3 text-muted-foreground hover:text-foreground"
            >
              Wyloguj
            </button>
          ) : (
            <Link
              to="/auth"
              search={{ next: "/forum" }}
              className="ml-auto px-3 py-3 text-muted-foreground hover:text-foreground"
            >
              Zaloguj
            </Link>
          )}
        </div>
        {/* animated red gradient bar */}
        <div className="gs-bar" aria-hidden="true" />
      </header>

      {/* Info bar */}
      <div className="border-b border-border gs-panel">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-2.5 text-xs">
          {user ? (
            <p>
              Zalogowany jako{" "}
              <span className="font-bold text-primary">{displayName(user)}</span>{" "}
              <span className="text-muted-foreground">
                · Premium (Counter-Strike 2) ·{" "}
                <Link to="/" hash="menu" className="text-primary hover:underline">
                  przedłuż subskrypcję
                </Link>
              </span>
            </p>
          ) : (
            <p className="text-muted-foreground">
              Nie jesteś zalogowany.{" "}
              <Link to="/auth" search={{ next: "/forum" }} className="text-primary hover:underline">
                Zaloguj się
              </Link>
            </p>
          )}
          <p className="text-muted-foreground">
            Tematy:{" "}
            <span className="cursor-pointer text-primary hover:underline">Napisane</span> |{" "}
            <span className="cursor-pointer text-primary hover:underline">Nowe</span> |{" "}
            <span className="cursor-pointer text-primary hover:underline">Aktywne</span> |{" "}
            <span className="cursor-pointer text-primary hover:underline">Bez odpowiedzi</span>
          </p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="border-b border-border gs-bg">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-1.5 px-5 py-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Start
          </Link>
          <ChevronRight className="size-3" />
          <Link to="/forum" className="hover:text-foreground">
            Forum
          </Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1.5">
              <ChevronRight className="size-3" />
              <span className="text-foreground">{c.label}</span>
            </span>
          ))}
        </div>
      </div>

      {children}

      <footer className="mx-auto max-w-6xl px-5 py-10">
        <p className="text-xs text-muted-foreground">
          Strona parodystyczna, stworzona w celach demonstracyjnych.
        </p>
      </footer>
    </div>
  );
}
