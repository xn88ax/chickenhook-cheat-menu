import { supabase } from "@/integrations/supabase/client";

/** Prosty store liczby osób online (Realtime Presence). */
type Listener = (count: number) => void;

let count = 0;
let started = false;
const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) l(count);
}

export function subscribeOnlineCount(listener: Listener) {
  listeners.add(listener);
  listener(count);
  startPresence();
  return () => {
    listeners.delete(listener);
  };
}

function startPresence() {
  if (started || typeof window === "undefined") return;
  started = true;
  const key = crypto.randomUUID();
  const channel = supabase.channel("site-online", { config: { presence: { key } } });
  channel
    .on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      count = Object.keys(state).length;
      emit();
    })
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") await channel.track({ at: Date.now() });
    });
}
