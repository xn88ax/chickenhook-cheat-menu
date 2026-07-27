import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, displayName } from "@/hooks/use-auth";
import chickenhookLogo from "@/assets/chickenhook-logo.png.asset.json";

export function Avatar({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-sm bucket-gradient text-xs font-bold uppercase text-primary-foreground ${className}`}
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
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-50 border-b border-border glass-bar">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2">
            <img src={chickenhookLogo.url} alt="Herb ChickenHook" className="h-9 w-auto" />
            <span className="text-display text-xl">
              CHICKEN<span className="text-primary">HOOK</span>
              <span className="text-muted-foreground">.RU</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground md:flex">
            <Link to="/" className="transition-colors hover:text-foreground">
              Start
            </Link>
            <Link to="/opcje" className="transition-colors hover:text-foreground">
              Opcje
            </Link>
            <Link to="/forum" className="text-foreground">
              Forum
            </Link>
          </nav>
          {user ? (
            <div className="flex items-center gap-2">
              <Avatar name={displayName(user)} className="size-7" />
              <span className="hidden text-xs font-semibold sm:block">{displayName(user)}</span>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate({ to: "/forum" });
                }}
                className="rounded-sm border border-border px-3 py-1.5 text-xs font-bold uppercase text-muted-foreground transition-colors hover:text-foreground"
              >
                Wyloguj
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              search={{ next: "/forum" }}
              className="rounded-sm bucket-gradient px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-bucket)]"
            >
              Zaloguj się
            </Link>
          )}
        </div>
      </header>

      <div className="border-b border-border glass-bar">
        <div className="mx-auto flex max-w-6xl items-center gap-1 px-5 text-xs font-bold uppercase tracking-wide">
          <span className="border-b-2 border-primary px-3 py-3 text-foreground">Forum</span>
          <Link to="/forum" className="px-3 py-3 text-muted-foreground hover:text-foreground">
            Nowe posty
          </Link>
        </div>
      </div>

      <div className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-1.5 px-5 py-2.5 text-xs text-muted-foreground">
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

      <div className="h-3 stripe-band" aria-hidden />
      <footer className="mx-auto max-w-6xl px-5 py-10">
        <p className="text-xs text-muted-foreground">
          Strona parodystyczna, stworzona w celach demonstracyjnych.
        </p>
      </footer>
    </div>
  );
}
