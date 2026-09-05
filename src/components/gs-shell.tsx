import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, ChevronDown, ChevronRight } from "lucide-react";

const tabs = [
  { label: "Index", to: "/", cls: "" },
  { label: "Funkcje", to: "/opcje", cls: "text-accent" },
  { label: "Forum", to: "/forum", cls: "font-bold text-primary" },
  { label: "Narzędzia", to: "/narzedzia", cls: "gs-green" },
  { label: "Sponsorzy", to: "/sponsorzy", cls: "gs-gold" },
] as const;

const moreTabs = [
  { label: "Restauracje", to: "/restauracje" },
  { label: "Changelog", to: "/changelog" },
  { label: "Poradniki", to: "/poradniki" },
  { label: "Sklep", to: "/sklep" },
  { label: "O nas", to: "/o-nas" },
  { label: "Podanie", to: "/podanie" },
] as const;

/** Panel with a gamesense-style header bar and red underline. */
export function GsPanel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`gs-panel ${className}`}>
      {title && (
        <>
          <h2 className="gs-head px-4 py-2 text-xs font-bold uppercase">{title}</h2>
          <div className="gs-underline" aria-hidden="true" />
        </>
      )}
      {children}
    </section>
  );
}

export function GsShell({
  children,
  crumbs = [],
}: {
  children: ReactNode;
  crumbs?: { label: string }[];
}) {
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
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-1 px-5 text-xs font-semibold">
          <Bell className="mr-2 size-3.5 gs-lime" />
          {tabs.map((t) => (
            <Link
              key={t.label}
              to={t.to}
              className={`px-2.5 py-3 transition-colors hover:brightness-125 sm:px-3 ${t.cls || "text-muted-foreground hover:text-foreground"}`}
            >
              {t.label}
            </Link>
          ))}

          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-1 px-2.5 py-3 text-muted-foreground transition-colors hover:text-foreground sm:px-3">
              Więcej
              <ChevronDown className="size-3 transition-transform group-open:rotate-180" />
            </summary>
            <div className="absolute left-0 top-full z-50 min-w-40 border border-border gs-panel">
              {moreTabs.map((t) => (
                <Link
                  key={t.label}
                  to={t.to}
                  className="block px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </details>

          <Link to="/" hash="menu" className="px-2.5 py-3 font-bold text-primary hover:brightness-110 sm:px-3">
            Premium
          </Link>
          <Link
            to="/forum"
            className="ml-auto px-2.5 py-3 text-muted-foreground transition-colors hover:text-foreground sm:px-3"
          >
            Zaloguj
          </Link>
        </div>
        <div className="gs-bar" aria-hidden="true" />
      </header>

      {/* Info bar */}
      <div className="border-b border-border gs-panel">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-2.5 text-xs">
          <p className="text-muted-foreground">
            ChickenHook.ru — private cheat do CS2 ·{" "}
            <Link to="/" hash="menu" className="text-primary hover:underline">
              kup subskrypcję
            </Link>
          </p>
          <p className="text-muted-foreground">
            Status: <span className="gs-lime font-bold">Undetected</span> · Build 4.12.0
          </p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="border-b border-border gs-bg">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-1.5 px-5 py-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Start
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
          Strona parodystyczna, stworzona w celach demonstracyjnych. © 2026 ChickenHook.ru
        </p>
      </footer>
    </div>
  );
}
