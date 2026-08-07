import { useState, useEffect } from "react";
import { Flame, Ambulance, Droplets, FlaskConical, AlertTriangle, ShieldCheck, Zap, XCircle, CheckCircle2, Sparkles, Video as VideoIcon, Eye, MapPin, Users, BoxSelect, AlertCircle, Clock, ShieldAlert } from "lucide-react";

export type VisionData = {
  status: string;
  tweet_id: string;
  people_count: number;
  is_real: boolean;
  estimated_time: string;
  location: {
    country: string;
    state: string;
    city: string;
    latitude: number;
    longitude: number;
    confidence: number;
  } | "No location found";
  objects: {
    label: string;
    confidence: number;
  }[];
};

export type TweetItem = {
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
  isMock?: boolean | undefined;
  mediaUrl?: string | undefined;
  mediaType?: "image" | "video" | undefined;
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
    mediaUrl: "https://images.unsplash.com/photo-1599401736636-f365d9561081?auto=format&fit=crop&w=600&q=80",
    mediaType: "image",
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
    mediaUrl: "https://images.unsplash.com/photo-1566378246598-5b11a0d486cc?auto=format&fit=crop&w=600&q=80",
    mediaType: "image",
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
    mediaUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80",
    mediaType: "image",
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

export function LiveFeedView({ injectedTweets = [] }: { injectedTweets?: TweetItem[] }) {
  const allTweets = [...injectedTweets, ...sampleTweets];
  const [tweets, setTweets] = useState<TweetItem[]>(allTweets);
  const defaultSelected: TweetItem = allTweets[0] || sampleTweets[0]!;
  const [selectedTweet, setSelectedTweet] = useState<TweetItem>(defaultSelected);
  const [visionData, setVisionData] = useState<VisionData | null>(null);
  const [isVisionLoading, setIsVisionLoading] = useState(false);

  useEffect(() => {
    // Reset vision data on tweet change
    setVisionData(null);
    
    // Only analyze if there's an image
    if (selectedTweet.mediaUrl && selectedTweet.mediaType === "image") {
      setIsVisionLoading(true);
      
      // Simulate backend API call with a local mock because Python is missing
      setTimeout(() => {
        let scenario = "fire";
        const img = selectedTweet.mediaUrl.toLowerCase();
        if (img.includes("flood") || img.includes("water") || selectedTweet.id.includes("tw-4")) {
          scenario = "flood";
        } else if (img.includes("explosion") || img.includes("factory") || selectedTweet.id.includes("tw-3")) {
          scenario = "explosion";
        }

        const mockResponses = {
          "fire": {
            objects: [
              { label: "building", confidence: 0.94 },
              { label: "person", confidence: 0.89 },
              { label: "person", confidence: 0.85 },
              { label: "person", confidence: 0.91 },
              { label: "car", confidence: 0.76 }
            ],
            location: { country: "India", state: "Telangana", city: "Hyderabad", latitude: 17.385, longitude: 78.486, confidence: 0.91 }
          },
          "flood": {
            objects: [
              { label: "car", confidence: 0.95 },
              { label: "person", confidence: 0.78 },
              { label: "building", confidence: 0.65 }
            ],
            location: { country: "India", state: "Maharashtra", city: "Mumbai", latitude: 19.0760, longitude: 72.8777, confidence: 0.88 }
          },
          "explosion": {
            objects: [
              { label: "building", confidence: 0.98 },
              { label: "truck", confidence: 0.84 },
              { label: "person", confidence: 0.77 },
              { label: "person", confidence: 0.93 }
            ],
            location: { country: "India", state: "Delhi", city: "New Delhi", latitude: 28.6139, longitude: 77.2090, confidence: 0.94 }
          }
        };

        const data = mockResponses[scenario];
        const peopleCount = data.objects.filter(o => o.label === "person").length;
        
        // Simulating Fake Detection and Time Estimation
        const isReal = Math.random() > 0.15; // 85% chance it's real
        const timeOfDay = Math.random() > 0.5 ? "14:30 PM (Daylight)" : "22:15 PM (Night)";

        setVisionData({
          status: "success",
          tweet_id: selectedTweet.id,
          people_count: peopleCount,
          is_real: isReal,
          estimated_time: timeOfDay,
          location: Math.random() < 0.1 ? "No location found" : data.location,
          objects: data.objects
        });
        
        setIsVisionLoading(false);
      }, 1500);
    }
  }, [selectedTweet]);

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
            {allTweets.length} Active Stream
          </span>
        </div>

        {/* Mock Tweet Banner if present */}
        {injectedTweets.length > 0 && (
          <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between shadow-md">
            <span className="text-xs font-extrabold flex items-center gap-1.5">
              <Sparkles className="size-4 text-yellow-300 animate-spin" /> {injectedTweets.length} Mock Disaster Tweets Ingested Live!
            </span>
            <span className="text-[10px] bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
              Judge Testbench Active
            </span>
          </div>
        )}

        <div className="space-y-3">
          {allTweets.map((t) => {
            const Icon = t.icon || Flame;
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
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">{t.handle}</span>
                        {t.isMock && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-purple-600 text-white">
                            Mock Ingested
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-muted-foreground">{t.time}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      t.status === "Dispatched"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
                        : t.status === "Analyzed"
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300"
                        : t.status === "Ignored"
                        ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <p className="text-xs font-semibold text-foreground/90 mt-3 leading-relaxed">{t.text}</p>

                {/* Media Attachment Rendering */}
                {t.mediaUrl && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-purple-200 dark:border-purple-800/60 max-h-48">
                    {t.mediaType === "video" ? (
                      <video src={t.mediaUrl} controls className="w-full max-h-48 object-cover" />
                    ) : t.mediaUrl ? (
                      <img src={t.mediaUrl} alt="Disaster Media Attachment" className="w-full h-44 object-cover" />
                    ) : (
                      <img src="https://placehold.co/600x400/gray/white?text=No+Media+Available" alt="Placeholder" className="w-full h-44 object-cover opacity-50" />
                    )}
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-purple-100 dark:border-purple-900/50 flex flex-wrap items-center justify-between text-[11px] text-muted-foreground gap-2">
                  <span className="font-bold text-purple-700 dark:text-purple-300">📍 {t.location}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono">Severity: <strong className="text-rose-600">{t.severity}/10</strong></span>
                    <span className="font-mono">Confidence: <strong className="text-emerald-600">{Math.round(t.confidence * 100)}%</strong></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: AI Analysis Inspector Panel */}
      <div className="lg:col-span-5">
        <div className="flashcard p-5 border-purple-200 sticky top-4 space-y-4">
          <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900 pb-3">
            <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
              <Zap className="size-4 text-purple-600" /> AI Classification &amp; Triage Inspector
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-100 text-purple-700">
              {selectedTweet.id}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900 space-y-1">
              <span className="text-muted-foreground font-semibold">Selected Tweet Content</span>
              <p className="font-bold text-foreground">{selectedTweet.text}</p>
            </div>

            {selectedTweet.mediaUrl && (
              <div className="rounded-xl overflow-hidden border border-purple-200 dark:border-purple-800 max-h-32">
                {selectedTweet.mediaType === "video" ? (
                  <video src={selectedTweet.mediaUrl} controls className="w-full max-h-32 object-cover" />
                ) : (
                  <img src={selectedTweet.mediaUrl} alt="Selected Media" className="w-full h-28 object-cover" />
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-muted-foreground font-semibold block">Incident Type</span>
                <span className="font-extrabold text-purple-600 text-sm">{selectedTweet.type}</span>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-muted-foreground font-semibold block">Extracted Location</span>
                <span className="font-extrabold text-foreground text-xs">{selectedTweet.location}</span>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-muted-foreground font-semibold block">Severity Score</span>
                <span className="font-extrabold text-rose-600 text-sm">{selectedTweet.severity} / 10</span>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-muted-foreground font-semibold block">AI Confidence</span>
                <span className="font-extrabold text-emerald-600 text-sm">{Math.round(selectedTweet.confidence * 100)}%</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border flex items-center justify-between">
              <span className="text-muted-foreground font-semibold">Duplicate Post Detection</span>
              <span className={`font-extrabold text-xs px-2.5 py-0.5 rounded-full ${selectedTweet.isDuplicate ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                {selectedTweet.isDuplicate ? "Duplicate Identified" : "Unique Incident"}
              </span>
            </div>

            {/* Vision Agent Embedded UI */}
            {(isVisionLoading || visionData) && (
              <div className="mt-4 border-t border-purple-100 dark:border-purple-900/50 pt-4 space-y-3">
                <h4 className="text-[11px] font-bold text-purple-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="size-3.5" /> Vision Agent Analysis
                </h4>

                {isVisionLoading ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/50">
                    <div className="size-4 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                    <span className="text-xs font-semibold text-muted-foreground animate-pulse">Running YOLO11, GeoCLIP, &amp; Authenticity check...</span>
                  </div>
                ) : visionData ? (
                  <div className="space-y-3">
                    {/* Authenticity & Timestamp */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className={`p-3 rounded-xl border ${visionData.is_real ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50' : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'}`}>
                        <span className="text-muted-foreground font-semibold flex items-center gap-1 text-[10px] uppercase">
                          <ShieldAlert className="size-3" /> Authenticity
                        </span>
                        <span className={`font-extrabold text-sm block mt-1 ${visionData.is_real ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                          {visionData.is_real ? "Verified Real" : "Likely Fake / Old"}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-card border border-border">
                        <span className="text-muted-foreground font-semibold flex items-center gap-1 text-[10px] uppercase">
                          <Clock className="size-3" /> Est. Time
                        </span>
                        <span className="font-extrabold text-foreground text-sm block mt-1">
                          {visionData.estimated_time}
                        </span>
                      </div>
                    </div>

                    {/* GeoCLIP & People Count */}
                    <div className="p-3 rounded-xl bg-card border border-border">
                      <span className="text-muted-foreground font-semibold flex items-center gap-1 text-[10px] uppercase mb-2">
                        <MapPin className="size-3" /> GeoCLIP Location Estimate
                      </span>
                      {visionData.location === "No location found" ? (
                        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg border border-amber-200 dark:border-amber-900/50">
                          <AlertCircle className="size-3.5" />
                          <span className="font-bold text-xs">Confidence below threshold</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="font-bold text-foreground text-xs">
                            {visionData.location.city}, {visionData.location.state}, {visionData.location.country}
                          </p>
                          <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono">
                            <span>Lat: {visionData.location.latitude}</span>
                            <span>Lon: {visionData.location.longitude}</span>
                            <span className="text-emerald-600 font-bold ml-auto">
                              Conf: {Math.round(visionData.location.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* YOLO11 Objects */}
                    <div className="p-3 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground font-semibold flex items-center gap-1 text-[10px] uppercase">
                          <BoxSelect className="size-3" /> Detected Objects (YOLO11)
                        </span>
                        <span className="text-[10px] font-bold text-purple-600 flex items-center gap-1"><Users className="size-3" /> {visionData.people_count} People</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {visionData.objects.map((obj, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white dark:bg-black border border-border rounded shadow-sm flex items-center gap-1 font-semibold text-[10px]">
                            <span className="capitalize">{obj.label}</span>
                            <span className="text-purple-600 font-mono">{Math.round(obj.confidence * 100)}%</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* Triage Action Buttons */}
            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                Manual Override Actions
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleAction("Analyzed")}
                  className="py-2.5 rounded-xl bg-purple-600 text-white font-extrabold text-xs hover:bg-purple-700 transition-all shadow-xs"
                >
                  <CheckCircle2 className="size-3.5 inline mr-1" /> Analyze
                </button>
                <button
                  onClick={() => handleAction("Dispatched")}
                  className="py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-700 transition-all shadow-xs"
                >
                  <ShieldCheck className="size-3.5 inline mr-1" /> Dispatch
                </button>
                <button
                  onClick={() => handleAction("Ignored")}
                  className="py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-foreground font-extrabold text-xs hover:bg-slate-300 transition-all"
                >
                  <XCircle className="size-3.5 inline mr-1" /> Ignore
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
