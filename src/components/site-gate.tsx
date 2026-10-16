import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { GateLogin } from "@/components/gate-login";

const PUBLIC_PREFIXES = ["/auth", "/lovable/", "/api/"];

export function SiteGate({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, loading } = useAuth();

  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return <>{children}</>;
  if (loading) return <div className="min-h-screen bg-background" />;
  if (user) return <>{children}</>;

  return (
    <div className="gate-bg flex min-h-screen items-center justify-center">
      <GateLogin next={pathname} />
    </div>
  );
}

