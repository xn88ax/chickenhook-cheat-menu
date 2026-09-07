import { useEffect, useRef, useState } from "react";
import { Music2, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Square } from "lucide-react";

type SynthTrack = {
  kind: "synth";
  title: string;
  bpm: number;
  /** MIDI note numbers; null = pauza */
  notes: (number | null)[];
  bass: (number | null)[];
};

type SpotifyTrack = {
  kind: "spotify";
  title: string;
  /** Spotify track id */
  spotifyId: string;
};

type Track = SynthTrack | SpotifyTrack;

const TRACKS: Track[] = [
  { kind: "spotify", title: "xn88ax - PROMETHAZINE", spotifyId: "6DTqemry14eOoHRNkSnMSG" },
  { kind: "spotify", title: "Akucum, xn88ax - never ending story", spotifyId: "6mjFHZizlvfsXTTkDQxPKr" },
  { kind: "spotify", title: "xn88ax, 11eter - POLANDSTRONKBAGUETTE", spotifyId: "4XqImVR5TRY4JSuYTkNjaC" },
  { kind: "spotify", title: "Akucum, xn88ax - shy type", spotifyId: "19ra9hRnCPHuBehkJYnqrU" },
  { kind: "spotify", title: "xn88ax - ALLEYESONYOU", spotifyId: "7k5sHL9hegoWIoEAuHFsC7" },
  {
    kind: "spotify",
    title: "xn88ax, Frostekk - BORDERLINE (frostekk Remix)",
    spotifyId: "1DckBYNtjT7FZ9IVa8Ugcm",
  },
  {
    kind: "spotify",
    title: "xn88ax, 11eter, Frostekk - RIFTWALK",
    spotifyId: "75HNY2VWNNnVBuwvxVHEQQ",
  },
  { kind: "spotify", title: "mst200, xn88ax - P250", spotifyId: "1Mvbhgyd07STFB4VoKwhMp" },
  {
    kind: "spotify",
    title: "r0pss, xn88ax, szczvras - All The Things She Said",
    spotifyId: "3LktBB9ms4SYNWCXiTcB8j",
  },
  { kind: "spotify", title: "heimi, xn88ax - ОТПУСТИ МЕНЯ", spotifyId: "4B8qpanj9jiJERqcelHGrG" },

  {
    kind: "synth",
    title: "ChickenHook - Kurnik Anthem (chiptune)",
    bpm: 132,
    notes: [69, 72, 76, 72, 69, 67, 69, 71, 69, 72, 76, 79, 76, 72, 69, null],
    bass: [45, null, 45, null, 43, null, 41, null, 45, null, 45, null, 40, null, 40, null],
  },
  {
    kind: "synth",
    title: "HvH Panierka - Fried Bassline",
    bpm: 148,
    notes: [64, 64, 67, 71, 74, 71, 67, 64, 62, 65, 69, 72, 69, 65, 62, null],
    bass: [40, 40, 43, 43, 38, 38, 41, 41, 40, 40, 36, 36, 43, 43, 45, 45],
  },
  {
    kind: "synth",
    title: "Undetected 412 Days - Loader Theme",
    bpm: 118,
    notes: [72, 74, 76, 79, 81, 79, 76, 74, 72, 71, 69, 71, 72, 76, 72, null],
    bass: [48, null, 43, null, 41, null, 45, null, 48, null, 43, null, 41, null, 41, null],
  },
];

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

export function Winamp() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [balance, setBalance] = useState(0);
  const [loop, setLoop] = useState(true);
  const [shuffle, setShuffle] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const panRef = useRef<StereoPannerNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const stepRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const track = TRACKS[index]!;
  const isSynth = track.kind === "synth";
  const stepMs = isSynth ? 60000 / track.bpm / 2 : 0;

  function stopClock() {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }

  useEffect(() => stopClock, []);

  useEffect(() => {
    if (gainRef.current && ctxRef.current) {
      gainRef.current.gain.setTargetAtTime(volume / 250, ctxRef.current.currentTime, 0.05);
    }
  }, [volume]);

  useEffect(() => {
    if (panRef.current && ctxRef.current) {
      panRef.current.pan.setTargetAtTime(balance / 100, ctxRef.current.currentTime, 0.05);
    }
  }, [balance]);

  function ensureAudio() {
    if (ctxRef.current) return ctxRef.current;
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.gain.value = volume / 250;
    const pan = ctx.createStereoPanner();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    gain.connect(pan);
    pan.connect(analyser);
    analyser.connect(ctx.destination);
    ctxRef.current = ctx;
    gainRef.current = gain;
    panRef.current = pan;
    analyserRef.current = analyser;
    return ctx;
  }

  function blip(freq: number, dur: number, type: OscillatorType, level: number) {
    const ctx = ctxRef.current!;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const t = ctx.currentTime;
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(level, t + 0.01);
    env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(env);
    env.connect(gainRef.current!);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  function tick() {
    const t = TRACKS[index]!;
    if (t.kind !== "synth") return;
    const s = stepRef.current % t.notes.length;
    const lead = t.notes[s];
    const bass = t.bass[s];
    if (lead != null) blip(midi(lead), 0.18, "square", 0.35);
    if (bass != null) blip(midi(bass), 0.22, "triangle", 0.5);
    if (s % 4 === 0) blip(90, 0.1, "sawtooth", 0.3);
    stepRef.current += 1;
    setElapsed(Math.floor((stepRef.current * stepMs) / 1000));

    if (stepRef.current % t.notes.length === 0) {
      if (!loop) next();
    }
  }

  function startDraw() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const draw = () => {
      const canvas = canvasRef.current;
      const analyser = analyserRef.current;
      if (canvas) {
        const g = canvas.getContext("2d");
        if (g) {
          const w = canvas.width;
          const h = canvas.height;
          const styles = getComputedStyle(canvas);
          const accent = styles.getPropertyValue("--color-primary").trim() || "#e5484d";

          g.shadowBlur = 0;
          g.fillStyle = "rgba(0,0,0,0.35)";
          g.fillRect(0, 0, w, h);
          g.strokeStyle = "rgba(255,255,255,0.08)";
          g.lineWidth = 1;
          g.beginPath();
          g.moveTo(0, h / 2);
          g.lineTo(w, h / 2);
          g.stroke();

          g.strokeStyle = accent;
          g.lineWidth = 1.5;
          g.shadowColor = accent;
          g.shadowBlur = 6;
          g.beginPath();

          if (analyser) {
            // prawdziwa fala z sygnału audio (kurnikowe chiptune'y)
            const buf = new Uint8Array(analyser.fftSize);
            analyser.getByteTimeDomainData(buf);
            const step = w / buf.length;
            for (let i = 0; i < buf.length; i += 1) {
              const y = ((buf[i] ?? 128) / 255) * h;
              if (i === 0) g.moveTo(0, y);
              else g.lineTo(i * step, y);
            }
          } else {
            // brak dostępu do sygnału (player Spotify) — animowana linia
            const t = performance.now() / 260;
            for (let x = 0; x <= w; x += 2) {
              const p = x / w;
              const amp = playingRef.current ? 0.32 : 0.02;
              const y =
                h / 2 +
                Math.sin(p * 22 + t) * h * amp * 0.6 +
                Math.sin(p * 7 - t * 1.7) * h * amp * 0.4;
              if (x === 0) g.moveTo(0, y);
              else g.lineTo(x, y);
            }
          }
          g.stroke();
          g.shadowBlur = 0;
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
  }

  // rysuj zawsze — także gdy nic nie leci (płaska linia / animacja)
  useEffect(() => {
    startDraw();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function start() {
    if (!isSynth) {
      playingRef.current = true;
      setPlaying(true);
      return;
    }
    const ctx = ensureAudio();
    void ctx.resume();
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(tick, stepMs);
    playingRef.current = true;
    setPlaying(true);
  }

  function pause() {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
    playingRef.current = false;
    setPlaying(false);
  }


  function stop() {
    pause();
    stepRef.current = 0;
    setElapsed(0);
  }

  function select(nextIndex: number) {
    pause();
    setIndex(nextIndex);
    stepRef.current = 0;
    setElapsed(0);
  }

  function jump(delta: number) {
    const nextIndex = shuffle
      ? Math.floor(Math.random() * TRACKS.length)
      : (index + delta + TRACKS.length) % TRACKS.length;
    select(nextIndex);
  }

  const next = () => jump(1);

  const mmss = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;

  return (
    <div className="px-4 py-3">
      {/* Obudowa Winampa */}
      <div className="mx-auto max-w-md border border-border bg-secondary/50">
        {/* Titlebar */}
        <div className="flex items-center justify-between border-b border-border bg-background/70 px-2 py-1">
          <span className="gs-glow text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            ChickenAmp 2.91
          </span>
          <span className="flex gap-1">
            {["_", "▫", "×"].map((s) => (
              <span
                key={s}
                className="grid size-3 place-items-center border border-border text-[8px] leading-none text-muted-foreground"
              >
                {s}
              </span>
            ))}
          </span>
        </div>

        {/* Wyświetlacz */}
        <div className="flex gap-2 border-b border-border bg-background px-2 py-2">
          <div className="gs-glow font-mono text-2xl tabular-nums text-primary">{mmss}</div>
          <div className="min-w-0 flex-1">
            <canvas
              ref={canvasRef}
              width={560}
              height={40}
              className="h-10 w-full border border-border/60 bg-background"
              aria-label="Fala dźwiękowa na żywo"
            />
            <p className="mt-1 truncate font-mono text-[10px] text-primary/90">
              {index + 1}. {track.title}
              {isSynth ? ` · ${track.bpm} BPM` : " · Spotify"}
            </p>
          </div>
        </div>

        {/* Wbudowany player Spotify dla prawdziwych utworów */}
        {track.kind === "spotify" && (
          <div className="border-b border-border bg-background px-2 py-2">
            <iframe
              key={track.spotifyId}
              src={`https://open.spotify.com/embed/track/${track.spotifyId}?utm_source=generator&theme=0`}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title={`Spotify: ${track.title}`}
              className="block w-full border border-border/60"
            />
            <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
              <Music2 className="size-3" /> Odtwarzanie obsługuje player Spotify — zalogowani słyszą
              pełną wersję.
            </p>
          </div>
        )}

        {/* Suwaki */}
        <div className="grid gap-2 border-b border-border px-2 py-2 sm:grid-cols-2">
          <label className="text-[10px] uppercase text-muted-foreground">
            Głośność {volume}
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="gs-range mt-1 h-0.5 w-full cursor-pointer appearance-none rounded-full"
              style={{
                background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${volume}%, var(--border) ${volume}%, var(--border) 100%)`,
              }}
            />
          </label>
          <label className="text-[10px] uppercase text-muted-foreground">
            Balans {balance > 0 ? `P${balance}` : balance < 0 ? `L${-balance}` : "środek"}
            <input
              type="range"
              min={-100}
              max={100}
              value={balance}
              onChange={(e) => setBalance(Number(e.target.value))}
              className="gs-range mt-1 h-0.5 w-full cursor-pointer appearance-none rounded-full"
              style={{
                background: `linear-gradient(to right, var(--border) 0%, var(--color-primary) 50%, var(--border) 100%)`,
              }}
            />
          </label>
        </div>

        {/* Transport */}
        <div className="flex flex-wrap items-center gap-1 px-2 py-2">
          {[
            { icon: SkipBack, label: "Poprzedni", onClick: () => jump(-1), active: false, disabled: false },
            {
              icon: playing ? Pause : Play,
              label: playing ? "Pauza" : "Odtwarzaj",
              onClick: () => (playing ? pause() : start()),
              active: playing,
              disabled: !isSynth,
            },
            { icon: Square, label: "Stop", onClick: stop, active: false, disabled: !isSynth },
            { icon: SkipForward, label: "Następny", onClick: next, active: false, disabled: false },
            {
              icon: Shuffle,
              label: "Losowo",
              onClick: () => setShuffle((s) => !s),
              active: shuffle,
              disabled: false,
            },
            {
              icon: Repeat,
              label: "Powtarzaj",
              onClick: () => setLoop((l) => !l),
              active: loop,
              disabled: false,
            },
          ].map((b) => (
            <button
              key={b.label}
              type="button"
              aria-label={b.label}
              onClick={b.onClick}
              disabled={b.disabled}
              className={`grid size-7 place-items-center border border-border transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30 ${
                b.active ? "gs-glow border-primary/60 text-primary" : "text-muted-foreground"
              }`}
            >
              <b.icon className="size-3.5" />
            </button>
          ))}
          {!isSynth && (
            <span className="ml-1 text-[10px] text-muted-foreground">
              Play/pauza w playerze Spotify powyżej
            </span>
          )}
        </div>

        {/* Playlista */}
        <div className="border-t border-border">
          {TRACKS.map((t, i) => (
            <button
              key={t.title}
              type="button"
              onClick={() => select(i)}
              className={`block w-full truncate px-2 py-1.5 text-left font-mono text-[11px] transition-colors hover:bg-secondary ${
                i === index ? "gs-glow bg-secondary text-primary" : "text-muted-foreground"
              }`}
            >
              {i + 1}. {t.title}
              {t.kind === "spotify" ? " · Spotify" : " · chiptune"}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-2 text-center text-[10px] text-muted-foreground">
        Prawdziwe utwory xn88ax lecą z playera Spotify, a kurnikowe chiptune'y są syntezowane na
        żywo — fala na wyświetlaczu rysuje się z faktycznego sygnału.
      </p>
    </div>
  );
}
