import { Play, Pause, Square, Zap, Flame, Droplets, Activity, Radio } from "lucide-react";

export function SimulationControlsView({
  running,
  setRunning,
  advance,
  reset,
  simSpeed,
  setSimSpeed,
}: {
  running: boolean;
  setRunning: (val: boolean) => void;
  advance: () => void;
  reset: () => void;
  simSpeed: number;
  setSimSpeed: (val: number) => void;
}) {
  const speeds = [1, 2, 5, 10];

  return (
    <div className="max-w-4xl mx-auto space-y-6 rise-in">
      <div className="flashcard p-6 border-purple-200 space-y-6">
        <div className="flex items-center justify-between border-b border-purple-100 pb-4 dark:border-purple-900">
          <div>
            <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
              <Radio className="size-5 text-purple-600 animate-pulse" /> Emergency Simulation Control Panel
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Control live feed playback, execution speed, and trigger mock disasters</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">
            Speed: {simSpeed}×
          </span>
        </div>

        {/* Playback Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 py-3">
          <button
            onClick={() => setRunning(true)}
            disabled={running}
            className={`px-6 py-3 rounded-2xl font-extrabold text-xs flex items-center gap-2 shadow-md transition-all ${
              running ? "bg-emerald-500/30 text-emerald-700 opacity-60 cursor-not-allowed" : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95"
            }`}
          >
            <Play className="size-4" /> Start Simulation
          </button>

          <button
            onClick={() => setRunning(false)}
            disabled={!running}
            className={`px-6 py-3 rounded-2xl font-extrabold text-xs flex items-center gap-2 shadow-md transition-all ${
              !running ? "bg-rose-500/30 text-rose-700 opacity-60 cursor-not-allowed" : "bg-rose-600 text-white hover:bg-rose-700 active:scale-95"
            }`}
          >
            <Pause className="size-4" /> Pause
          </button>

          <button
            onClick={reset}
            className="px-6 py-3 rounded-2xl border border-border bg-card text-foreground font-extrabold text-xs flex items-center gap-2 hover:bg-accent active:scale-95 transition-all shadow-xs"
          >
            <Square className="size-4 text-muted-foreground" /> Stop &amp; Reset
          </button>
        </div>

        {/* Speed Slider */}
        <div className="p-5 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900 space-y-3">
          <div className="flex items-center justify-between text-xs font-extrabold text-foreground">
            <span>Simulation Execution Speed</span>
            <span className="text-purple-600">{simSpeed}× Realtime</span>
          </div>
          <div className="flex gap-2">
            {speeds.map((s) => (
              <button
                key={s}
                onClick={() => setSimSpeed(s)}
                className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  simSpeed === s
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-card border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>

        {/* Incident Trigger Buttons */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
            Trigger Mock Disaster Scenarios
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-bold">
            <button
              onClick={advance}
              className="p-3.5 rounded-xl border border-purple-200 bg-card hover:bg-purple-50 hover:border-purple-300 text-purple-700 flex flex-col items-center gap-2 active:scale-95 transition-all"
            >
              <Zap className="size-5 text-purple-600" /> Random Incident
            </button>
            <button
              onClick={advance}
              className="p-3.5 rounded-xl border border-rose-200 bg-card hover:bg-rose-50 hover:border-rose-300 text-rose-700 flex flex-col items-center gap-2 active:scale-95 transition-all"
            >
              <Flame className="size-5 text-rose-600" /> Fire Emergency
            </button>
            <button
              onClick={advance}
              className="p-3.5 rounded-xl border border-cyan-200 bg-card hover:bg-cyan-50 hover:border-cyan-300 text-cyan-700 flex flex-col items-center gap-2 active:scale-95 transition-all"
            >
              <Droplets className="size-5 text-cyan-600" /> Flash Flood
            </button>
            <button
              onClick={advance}
              className="p-3.5 rounded-xl border border-amber-200 bg-card hover:bg-amber-50 hover:border-amber-300 text-amber-700 flex flex-col items-center gap-2 active:scale-95 transition-all"
            >
              <Activity className="size-5 text-amber-600" /> Earthquake
            </button>
            <button
              onClick={advance}
              className="p-3.5 rounded-xl border border-red-200 bg-card hover:bg-red-50 hover:border-red-300 text-red-700 flex flex-col items-center gap-2 active:scale-95 transition-all col-span-2 sm:col-span-1"
            >
              <Flame className="size-5 text-red-600 animate-bounce" /> Explosion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
