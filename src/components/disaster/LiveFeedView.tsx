import { useState } from "react";
import { Flame, Ambulance, Droplets, FlaskConical, AlertTriangle, ShieldCheck, Zap, XCircle, CheckCircle2 } from "lucide-react";

type TweetItem = {
  id: string;
  handle: string;
  time: string;
  text: string;
  icon: any;
  type: string;
  location: string;
  severity: number;
  confidence: number;
  isDuplicate: boolean;
  status: "New" | "Analyzed" | "Dispatched" | "Ignored";
};

const sampleTweets: TweetItem[] = [
  {
    id: "tw-1",
    handle: "@citizen_alert",
    time: "1m ago",
    text: "🚨 Major fire near Central Railway Station! Smoke everywhere on platform 3.",
    icon: Flame,
    type: "Fire",
    location: "Central Railway Station",
    severity: 9,
    confidence: 0.94,
    isDuplicate: false,
    status: "New",
  },
  {
    id: "tw-2",
    handle: "@traffic_watch",
    time: "3m ago",
    text: "🚑 Need ambulance near City Hospital. Multiple vehicles collided at crossroad.",
    icon: Ambulance,
    type: "Medical",
    location: "City Hospital Crossing",
    severity: 7,
    confidence: 0.88,
    isDuplicate: false,
    status: "New",
  },
  {
    id: "tw-3",
    handle: "@metro_reporter",
    time: "5m ago",
    text: "🔥 Factory explosion reported in Industrial Sector 4. Sirens sounding.",
    icon: Flame,
    type: "Explosion",
    location: "Industrial Sector 4",
    severity: 10,
    confidence: 0.96,
    isDuplicate: false,
    status: "New",
  },
  {
    id: "tw-4",
    handle: "@river_monitor",
    time: "8m ago",
    text: "🌊 Flood water rising rapidly near Market Road. Basement stores submerged.",
    icon: Droplets,
    type: "Flood",
    location: "Market Road",
    severity: 6,
    confidence: 0.82,
    isDuplicate: true,
    status: "Analyzed",
  },
  {
    id: "tw-5",
    handle: "@school_safety",
    time: "12m ago",
    text: "⚠ Gas leak smelled near St. Jude Public School. Evacuating classrooms now.",
    icon: FlaskConical,
    type: "Gas Leak",
    location: "St. Jude Public School",
    severity: 8,
    confidence: 0.91,
    isDuplicate: false,
    status: "New",
  },
];

export function LiveFeedView() {
  const [tweets, setTweets] = useState<TweetItem[]>(sampleTweets);
  const [selectedTweet, setSelectedTweet] = useState<TweetItem>(sampleTweets[0]);

  const handleAction = (status: "Analyzed" | "Dispatched" | "Ignored") => {
    setTweets((prev) =>
      prev.map((t) => (t.id === selectedTweet.id ? { ...t, status } : t))
    );
    setSelectedTweet((prev) => ({ ...prev, status }));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12 rise-in">
      {/* Left Column: Twitter/X Style Live Feed */}
      <div className="lg:col-span-7 space-y-4">
        <div className="flashcard p-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-foreground flex items-center gap-2">
              <span className="flex size-2 rounded-full bg-rose-500 animate-ping" />
              Live Emergency Social Feed (Twitter/X Stream)
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Real-time citizen posts ingested by Tweet Listener Agent</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">
            {tweets.length} Active Stream
          </span>
        </div>

        <div className="space-y-3">
          {tweets.map((t) => {
            const Icon = t.icon;
            const isSelected = selectedTweet.id === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setSelectedTweet(t)}
                className={`flashcard p-4 cursor-pointer transition-all ${
                  isSelected
                    ? "border-purple-500 bg-purple-50/40 dark:bg-purple-950/30 shadow-md ring-2 ring-purple-400/30"
                    : "hover:border-purple-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300">
                      <Icon className="size-4" />
                    </span>
                    <div>
                      <span className="text-xs font-bold text-foreground">{t.handle}</span>
                      <span className="text-[11px] text-muted-foreground ml-2">{t.time}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      t.status === "Dispatched"
                        ? "bg-emerald-100 text-emerald-700"
                        : t.status === "Ignored"
                        ? "bg-slate-100 text-slate-600"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <p className="mt-3 text-xs font-semibold text-foreground/90 leading-relaxed">{t.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: AI Analysis Panel */}
      <div className="lg:col-span-5">
        <div className="flashcard p-6 sticky top-6 space-y-5 border-purple-200">
          <div className="flex items-center justify-between border-b border-purple-100 pb-4 dark:border-purple-900">
            <div>
              <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
                <ShieldCheck className="size-5 text-purple-600" /> AI Report Analysis Panel
              </h3>
              <p className="text-xs text-muted-foreground">Neural classification &amp; threat validation</p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-600 bg-purple-100 dark:bg-purple-900/50 px-2.5 py-1 rounded-lg">
              {selectedTweet.id}
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900">
              <span className="text-muted-foreground font-semibold">Selected Tweet Content</span>
              <p className="mt-1 font-bold text-foreground leading-snug">{selectedTweet.text}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-[11px] text-muted-foreground font-medium">Incident Type</span>
                <p className="text-sm font-extrabold text-foreground mt-0.5">{selectedTweet.type}</p>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-[11px] text-muted-foreground font-medium">Location</span>
                <p className="text-sm font-extrabold text-foreground mt-0.5 truncate">{selectedTweet.location}</p>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-[11px] text-muted-foreground font-medium">Severity Score</span>
                <p className="text-sm font-extrabold text-rose-600 mt-0.5">{selectedTweet.severity} / 10</p>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-[11px] text-muted-foreground font-medium">Confidence Score</span>
                <p className="text-sm font-extrabold text-emerald-600 mt-0.5">{(selectedTweet.confidence * 100).toFixed(0)}%</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border flex items-center justify-between">
              <span className="font-semibold text-muted-foreground">Duplicate Detection</span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${selectedTweet.isDuplicate ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                {selectedTweet.isDuplicate ? "Duplicate Report Merged" : "Unique Incident"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border flex items-center justify-between">
              <span className="font-semibold text-muted-foreground">Triage Status</span>
              <span className="font-extrabold text-purple-600">{selectedTweet.status}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 grid grid-cols-3 gap-2">
            <button
              onClick={() => handleAction("Analyzed")}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md hover:bg-purple-700 active:scale-95 transition-all"
            >
              <Zap className="size-3.5" /> Analyze
            </button>
            <button
              onClick={() => handleAction("Dispatched")}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md hover:bg-emerald-700 active:scale-95 transition-all"
            >
              <CheckCircle2 className="size-3.5" /> Dispatch
            </button>
            <button
              onClick={() => handleAction("Ignored")}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-border bg-card text-foreground font-semibold text-xs hover:bg-muted active:scale-95 transition-all"
            >
              <XCircle className="size-3.5 text-muted-foreground" /> Ignore
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
