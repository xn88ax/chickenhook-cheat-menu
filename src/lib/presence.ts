import { supabase } from "@/integrations/supabase/client";

/** Prosty store obecności na stronie (Realtime Presence). */
type CountListener = (count: number) => void;
type UsersListener = (ids: Set<string>) => void;

let count = 0;
let onlineIds = new Set<string>();
let started = false;
const countListeners = new Set<CountListener>();
const userListeners = new Set<UsersListener>();

function emit() {
  for (const l of countListeners) l(count);
  for (const l of userListeners) l(onlineIds);
}

export function subscribeOnlineCount(listener: CountListener) {
  countListeners.add(listener);
  listener(count);
  startPresence();
  return () => {
    countListeners.delete(listener);
  };
}

/** Zbiór user_id zalogowanych osób, które są teraz na stronie. */
export function subscribeOnlineUsers(listener: UsersListener) {
  userListeners.add(listener);
  listener(onlineIds);
  startPresence();
  return () => {
    userListeners.delete(listener);
  };
}

function startPresence() {
  if (started || typeof window === "undefined") return;
  started = true;
  const key = crypto.randomUUID();
  const channel = supabase.channel("site-online", { config: { presence: { key } } });
  channel
    .on("presence", { event: "sync" }, () => {
      const state = channel.presenceState<{ user_id?: string }>();
      const ids = new Set<string>();
      for (const metas of Object.values(state)) {
        for (const m of metas) if (m.user_id) ids.add(m.user_id);
      }
      count = Object.keys(state).length;
      onlineIds = ids;
      emit();
    })
    .subscribe(async (status) => {
      if (status !== "SUBSCRIBED") return;
      const { data } = await supabase.auth.getUser();
      await channel.track({ at: Date.now(), user_id: data.user?.id ?? null });
    });
}
