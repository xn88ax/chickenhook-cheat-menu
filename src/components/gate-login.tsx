// ============= Full file contents =============
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

import { registerWithInvite } from "@/lib/invite.functions";
import { isRememberSession, setRememberSession } from "@/lib/session-persistence";

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

export function GateLogin({ next }: { next: string }) {
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (!showLogin) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowLogin(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showLogin]);

  if (!showLogin) {
    return (
      <button
        type="button"
        aria-label="Kliknij, aby się zalogować"
        onClick={() => setShowLogin(true)}
        className="cursor-pointer text-foreground transition-opacity hover:opacity-70"
      >
        <pre className="select-none whitespace-pre font-mono text-[10px] leading-[1.1] sm:text-sm">{ART}</pre>
      </button>
    );
  }

  return (
    <div
      role="presentation"
      onClick={() => setShowLogin(false)}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 p-6"
    >
      <div onClick={(e) => e.stopPropagation()}>
        <PixelLoginForm next={next} />
      </div>
    </div>
  );
}

function PixelLoginForm({ next }: { next: string }) {
  const navigate = useNavigate();
  const register = useServerFn(registerWithInvite);

  const [mode, setMode] = useState<"login" | "invite">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [username, setUsername] = useState("");
  const [invite, setInvite] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    setRemember(isRememberSession());
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      setRememberSession(remember);
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: next });
      } else {
        if (password !== password2) {
          setError("Passwords do not match.");
          setBusy(false);
          return;
        }
        if (password.length < 8) {
          setError("Password must be at least 8 characters.");
          setBusy(false);
          return;
        }
        const result = await register({
          data: {
            code: invite,
            email,
            password,
            username: username || email.split("@")[0],
          },
        });
        if (!result.ok) {
          setError(result.error);
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setInfo("Account created. Log in.");
          setMode("login");
          return;
        }
        navigate({ to: next });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const field = "w-full border-[3px] border-foreground bg-background px-3 py-2 outline-none";
  return (
    <main className="pixel-login w-full max-w-sm">
      <form onSubmit={onSubmit} className="pixel-box space-y-4 p-6">
        <h1 className="text-center text-foreground">{mode === "login" ? "LOGIN" : "INVITE"}</h1>
        {mode === "invite" && (
          <>
            <input aria-label="Invite code" required value={invite} onChange={(e) => setInvite(e.target.value.toUpperCase())} maxLength={64} placeholder="INVITE CODE" className={field} />
            <input aria-label="Username" value={username} onChange={(e) => setUsername(e.target.value)} maxLength={24} placeholder="USERNAME" className={field} />
          </>
        )}
        <input aria-label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="EMAIL" className={field} />
        <input aria-label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="PASSWORD" className={field} />
        {mode === "invite" && (
          <input aria-label="Repeat password" type="password" required value={password2} onChange={(e) => setPassword2(e.target.value)} placeholder="REPEAT PASSWORD" className={field} />
        )}
        {error && <p className="text-foreground">{error}</p>}
        {info && <p className="text-foreground">{info}</p>}
        <button type="submit" disabled={busy} className="w-full border-[3px] border-foreground bg-foreground px-4 py-2.5 text-background disabled:opacity-60">
          {busy ? "..." : mode === "login" ? "ENTER" : "ACTIVATE"}
        </button>
        <button type="button" onClick={() => { setMode(mode === "login" ? "invite" : "login"); setError(null); setInfo(null); }} className="w-full text-muted-foreground hover:text-foreground">
          {mode === "login" ? "invite code?" : "back to login"}
        </button>
      </form>
    </main>
  );
}
