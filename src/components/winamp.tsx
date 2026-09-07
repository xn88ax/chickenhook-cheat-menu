import { useEffect, useRef, useState } from "react";
import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Square } from "lucide-react";

type Track = {
  title: string;
  bpm: number;
  /** MIDI note numbers; null = pauza */
  notes: (number | null)[];
  bass: (number | null)[];
};

const TRACKS: Track[] = [
  {
    title: "ChickenHook - Kurnik Anthem (chiptune)",
    bpm: 132,
    notes: [69, 72, 76, 72, 69, 67, 69, 71, 69, 72, 76, 79, 76, 72, 69, null],
    bass: [45, null, 45, null, 43, null, 41, null, 45, null, 45, null, 40, null, 40, null],
  },
  {
    title: "HvH Panierka - Fried Bassline",
    bpm: 148,
    notes: [64, 64, 67, 71, 74, 71, 67, 64, 62, 65, 69, 72, 69, 65, 62, null],
    bass: [40, 40, 43, 43, 38, 38, 41, 41, 40, 40, 36, 36, 43, 43, 45, 45],
  },
  {
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
  const stepMs = 60000 / track.bpm / 2;

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

  function start() {
    const ctx = ensureAudio();
    void ctx.resume();
    stopClock();
    timerRef.current = window.setInterval(tick, stepMs);
    const draw = () => {
      const analyser = analyserRef.current;
      const canvas = canvasRef.current;
      if (analyser && canvas) {
        const g = canvas.getContext("2d");
        if (g) {
          const w = canvas.width;
          const h = canvas.height;
          const buf = new Uint8Array(analyser.fftSize);
          analyser.getByteTimeDomainData(buf);
          const styles = getComputedStyle(canvas);
          const accent = styles.getPropertyValue("--color-primary").trim() || "#e5484d";
          g.fillStyle = "rgba(0,0,0,0.35)";
          g.fillRect(0, 0, w, h);
          // linia środka
          g.strokeStyle = "rgba(255,255,255,0.08)";
          g.lineWidth = 1;
          g.beginPath();
          g.moveTo(0, h / 2);
          g.lineTo(w, h / 2);
          g.stroke();
          // prawdziwa fala z sygnału audio
          g.strokeStyle = accent;
          g.lineWidth = 1.5;
          g.shadowColor = accent;
          g.shadowBlur = 6;
          g.beginPath();
          const step = w / buf.length;
          for (let i = 0; i < buf.length; i += 1) {
            const y = ((buf[i] ?? 128) / 255) * h;
            if (i === 0) g.moveTo(0, y);
            else g.lineTo(i * step, y);
          }
          g.stroke();
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    setPlaying(true);
  }

  function pause() {
    stopClock();
    const canvas = canvasRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    setPlaying(false);
  }

  function stop() {
    pause();
    stepRef.current = 0;
    setElapsed(0);
  }

  function jump(delta: number) {
    const nextIndex = shuffle
      ? Math.floor(Math.random() * TRACKS.length)
      : (index + delta + TRACKS.length) % TRACKS.length;
    setIndex(nextIndex);
    stepRef.current = 0;
    setElapsed(0);
    if (playing) {
      stopClock();
      timerRef.current = window.setInterval(tick, 60000 / TRACKS[nextIndex]!.bpm / 2);
    }
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
            <div className="flex h-6 items-end gap-[2px]">
              {bars.map((v, i) => (
                <span
                  key={i}
                  className="w-full bg-primary/80"
                  style={{ height: `${Math.max(4, v * 100)}%` }}
                />
              ))}
            </div>
            <p className="mt-1 truncate font-mono text-[10px] text-primary/90">
              {index + 1}. {track.title} · {track.bpm} BPM
            </p>
          </div>
        </div>

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
            { icon: SkipBack, label: "Poprzedni", onClick: () => jump(-1), active: false },
            {
              icon: playing ? Pause : Play,
              label: playing ? "Pauza" : "Odtwarzaj",
              onClick: () => (playing ? pause() : start()),
              active: playing,
            },
            { icon: Square, label: "Stop", onClick: stop, active: false },
            { icon: SkipForward, label: "Następny", onClick: next, active: false },
            { icon: Shuffle, label: "Losowo", onClick: () => setShuffle((s) => !s), active: shuffle },
            { icon: Repeat, label: "Powtarzaj", onClick: () => setLoop((l) => !l), active: loop },
          ].map((b) => (
            <button
              key={b.label}
              type="button"
              aria-label={b.label}
              onClick={b.onClick}
              className={`grid size-7 place-items-center border border-border transition-colors hover:border-primary hover:text-primary ${
                b.active ? "gs-glow border-primary/60 text-primary" : "text-muted-foreground"
              }`}
            >
              <b.icon className="size-3.5" />
            </button>
          ))}
        </div>

        {/* Playlista */}
        <div className="border-t border-border">
          {TRACKS.map((t, i) => (
            <button
              key={t.title}
              type="button"
              onClick={() => {
                setIndex(i);
                stepRef.current = 0;
                setElapsed(0);
                if (playing) {
                  stopClock();
                  timerRef.current = window.setInterval(tick, 60000 / t.bpm / 2);
                }
              }}
              className={`block w-full truncate px-2 py-1.5 text-left font-mono text-[11px] transition-colors hover:bg-secondary ${
                i === index ? "gs-glow bg-secondary text-primary" : "text-muted-foreground"
              }`}
            >
              {i + 1}. {t.title}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-2 text-center text-[10px] text-muted-foreground">
        Dźwięk generowany na żywo w przeglądarce — żadnych plików, tylko czysty kurnikowy chiptune.
      </p>
    </div>
  );
}
