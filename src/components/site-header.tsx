import { Link } from "@tanstack/react-router";

import chickenhookLogo from "@/assets/chickenhook-logo.png.asset.json";

type Props = { active?: "start" | "opcje" | "forum" };

export function SiteHeader({ active }: Props) {
  const link = (isActive: boolean) =>
    `transition-colors ${isActive ? "text-foreground" : "hover:text-foreground"}`;

  return (
    <header className="sticky top-4 z-50 px-4">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full border border-border glass px-3 pl-5">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={chickenhookLogo.url}
            alt="Herb ChickenHook — kogut na tarczy"
            className="h-7 w-auto"
          />
          <span className="text-display text-lg tracking-tight">chickenhook</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <Link to="/" className={link(active === "start")}>
            Start
          </Link>
          <Link to="/opcje" className={link(active === "opcje")}>
            Opcje
          </Link>
          <Link to="/" hash="menu" className={link(false)}>
            Cennik
          </Link>
        </nav>
        <Link
          to="/forum"
          className="glass-focus rounded-full border border-border bg-secondary/70 px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
        >
          Forum
        </Link>
      </div>
    </header>
  );
}
