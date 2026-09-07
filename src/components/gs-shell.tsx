import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const tabs = [
  { label: "Index", to: "/" },
  { label: "Funkcje", to: "/opcje" },
  { label: "Forum", to: "/forum" },
  { label: "Narzędzia", to: "/narzedzia" },
] as const;

const moreTabs = [
  { label: "Sponsorzy", to: "/sponsorzy" },
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
        <h2 className="gs-head border-b border-border px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em]">{title}</h2>
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
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!moreOpen) return;
    function onDown(e: MouseEvent) {
      if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [moreOpen]);

  return (

    <div className="relative min-h-screen font-sans text-foreground">
      <div className="site-bg" aria-hidden="true">
        <div className="site-bg-photo" />
      </div>
      <header className="sticky top-0 z-50 h-14 border-b border-border bg-secondary/95 backdrop-blur-md">
        <div className="relative z-10 mx-auto flex h-full max-w-[1160px] items-center gap-5 px-5">
          <Link to="/" className="font-display text-[25px] leading-none tracking-normal">
            <span className="text-foreground">chicken</span><span className="text-primary">hook.ru</span>
          </Link>
          <nav className="hidden items-center gap-1 min-[860px]:flex" aria-label="Główna nawigacja">
          {tabs.map((t) => (
            <Link
              key={t.label}
              to={t.to}
              className={`px-2 py-2 text-xs font-medium transition-colors hover:text-foreground ${pathname === t.to || (t.to !== "/" && pathname.startsWith(t.to)) ? "text-primary" : "text-muted-foreground"}`}
            >
              {t.label}
            </Link>
          ))}
          <div className="relative" ref={moreRef}>
            <Button
              variant="ghost"
              size="sm"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((o) => !o)}
              className="h-8 px-2 text-xs text-muted-foreground"
            >
              Więcej
              <ChevronDown className={`size-3 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
            </Button>
            {moreOpen && (
              <div className="absolute left-0 top-full z-50 mt-2 min-w-44 rounded-lg border border-border bg-card p-1 shadow-xl">
                {moreTabs.map((t) => (
                  <Link
                    key={t.label}
                    to={t.to}
                    onClick={() => setMoreOpen(false)}
                    className="block rounded-md px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {t.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          </nav>
          <div className="ml-auto hidden items-center gap-3 min-[860px]:flex">
            <span className="rounded-full border border-border bg-background/40 px-3 py-1.5 text-xs text-muted-foreground">
              <span className="text-[var(--status-ok)]">Undetected</span> · 4.12.0
            </span>
            <Link to="/auth" search={{ next: pathname }} className="text-xs font-medium text-muted-foreground hover:text-foreground">
              Zaloguj
            </Link>
            <Link to="/" hash="menu" className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-accent">
              Kup
            </Link>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto min-[860px]:hidden" aria-label={mobileOpen ? "Zamknij menu" : "Otwórz menu"} aria-expanded={mobileOpen} onClick={() => setMobileOpen((v) => !v)}>
            {mobileOpen ? <X /> : <Menu />}
          </Button>
          {mobileOpen && (
            <nav className="absolute inset-x-5 top-[calc(100%+8px)] rounded-lg border border-border bg-card p-2 shadow-xl min-[860px]:hidden" aria-label="Menu mobilne">
              {[...tabs, ...moreTabs].map((t) => (
                <Link key={t.label} to={t.to} onClick={() => setMobileOpen(false)} className="block rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">{t.label}</Link>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border pt-2">
                <Link to="/auth" search={{ next: pathname }} onClick={() => setMobileOpen(false)} className="inline-flex h-9 items-center justify-center rounded-lg border border-border text-xs font-semibold">Zaloguj</Link>
                <Link to="/" hash="menu" onClick={() => setMobileOpen(false)} className="inline-flex h-9 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">Kup</Link>
              </div>
            </nav>
          )}
        </div>
        <div className="gs-bar absolute inset-x-0 bottom-0" aria-hidden="true" />
      </header>

      <div className="relative z-10">
        {crumbs.length > 0 && (
          <div className="mx-auto max-w-[1160px] px-5 pt-4 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">Start</Link>
            {crumbs.map((c) => <span key={c.label}> / <span className="text-foreground">{c.label}</span></span>)}
          </div>
        )}
        {children}
      </div>

      <footer className="relative z-10 mx-auto max-w-[1160px] px-5 py-10">
        <p className="text-xs text-muted-foreground">© 2026 ChickenHook.ru · Demo, strona parodystyczna.</p>
      </footer>
    </div>
  );
}
