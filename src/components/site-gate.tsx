import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";

const ART = `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠇⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡐⠅⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡐⠀⠈⣆⡤⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠋⠁⠉⡝⡄⠀⠀⠀
⠀⡖⡀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠀⠀⠀⠀
⠀⠑⡇⠀⠀⠀⠀⠀⡏⢷⡀⠀⠀⠀⠀⠀⠀⡀⣀⢀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣶⣟⠀⠀⠀⠀⠀⠀⠀
⢀⣘⡈⢒⠖⠂⠀⠀⡇⠀⠙⢗⢄⣤⣔⡏⠟⠯⠙⠙⠋⠛⠙⢷⣤⣀⡴⠕⠁⢸⡕⠀⠀⠀⠀⠀⠀⠀
⠋⠀⢱⠁⠀⠀⠀⠀⡇⠀⠀⠈⠻⡍⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠛⠁⠀⠀⣸⠅⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣠⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡷⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⡏⠀⠀⠀⠀⢠⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⡴⣇⠀⠀⠀⠀⠊⢗⡇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢸⠁⠀⠀⠀⠀⣾⠅⠀⠀⠀⠀⢠⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠸⡇⠀⠀⠀⠀⠀⠀
⠀⠀⠈⠐⠒⠒⠺⠗⠒⠀⠀⠀⠈⠁⠀⣀⠀⠀⣺⠀⠀⢀⠀⠻⠇⠀⠀⠀⠉⠁⢙⠏⠈⠈⠁⠉⠁⠀
⠀⠀⠀⠀⡄⠄⠼⡇⡊⠈⠀⠀⠀⠀⠀⢾⣄⣠⡟⣇⣀⡼⠀⠀⠀⠀⠀⠀⠂⠲⠗⡇⠐⠐⠄⡀⠀⠀
⠀⠀⠀⠠⡀⡀⠄⠵⡆⡂⠂⠀⠀⠀⠀⠀⠉⠉⠀⠉⠛⠁⠀⠀⠀⠀⠀⢀⡗⣛⠒⠅⣀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⡶⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣷⣿⡁⠀⠀⠀⠉⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⣃⠇⠡⠀⠀⠀⢀⠄⡒⠄
⠀⠀⠀⣨⠀⠀⠀⠀⠀⢸⡯⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠞⠅⠂⠀⣠⠒⠩⠙⡷
⠀⠀⠀⠷⡀⠀⠀⠀⠀⢐⣋⠀⠀⠀⢠⡇⠀⠀⠀⠀⡄⠀⠀⠀⢀⢀⠀⠀⠀⠀⡑⡁⠰⠁⠠⠁⡀⢏
⠀⢀⠞⡍⢹⡲⠒⠀⠀⠸⢍⠀⠀⠀⢸⠂⠀⠀⠀⠀⣇⠀⠀⠀⢟⡅⠀⠀⠀⠀⢘⣨⠁⠌⠀⣀⠘⠂
⠀⠀⠀⢱⠇⠃⠀⠀⠀⠐⡇⡄⠀⠀⢈⠆⠀⠀⠀⠀⢆⠀⠀⠀⢇⠆⠀⠀⠀⠀⣨⡏⠌⠀⡠⢀⠁⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⡣⡆⠀⠀⢀⠆⠀⠀⠀⠀⡅⠀⠀⢀⡒⠄⠀⠀⠀⠀⡜⣯⠀⠄⠒⠂⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠊⢘⠄⠀⢈⠄⠀⠀⠀⠀⡈⠀⠀⠠⠬⠀⠀⠀⠀⠀⡷⢥⢦⠟⠁⠀⠀⠀`;

const PUBLIC_PREFIXES = ["/auth", "/lovable/", "/api/"];

export function SiteGate({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, loading } = useAuth();

  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return <>{children}</>;
  if (loading) return <div className="min-h-screen bg-background" />;
  if (user) return <>{children}</>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Link to="/auth" aria-label="Zaloguj" className="text-foreground">
        <pre className="select-none whitespace-pre font-mono text-[10px] leading-[1.1] sm:text-sm">{ART}</pre>
      </Link>
    </div>
  );
}
