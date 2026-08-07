import { useState, useEffect } from "react";
import {
  Flame,
  Droplets,
  Activity,
  AlertTriangle,
  Building2,
  Car,
  Train,
  Plane,
  FlaskConical,
  Wind,
  CloudRain,
  Mountain,
  Zap,
  X,
  RotateCcw,
  Sparkles,
  MapPin,
  Plus,
  Minus,
  Upload,
  Play,
  Pause,
  Send,
  Sliders,
  CheckCircle2,
} from "lucide-react";

type DisasterType =
  | "Fire"
  | "Flood"
  | "Earthquake"
  | "Explosion"
  | "Gas Leak"
  | "Building Collapse"
  | "Road Accident"
  | "Train Derailment"
  | "Airport Emergency"
  | "Chemical Spill"
  | "Cyclone"
  | "Urban Flood"
  | "Landslide"
  | "Power Outage";

const disasterIcons: Record<DisasterType, any> = {
  Fire: Flame,
  Flood: Droplets,
  Earthquake: Activity,
  Explosion: Flame,
  "Gas Leak": FlaskConical,
  "Building Collapse": Building2,
  "Road Accident": Car,
  "Train Derailment": Train,
  "Airport Emergency": Plane,
  "Chemical Spill": FlaskConical,
  Cyclone: Wind,
  "Urban Flood": CloudRain,
  Landslide: Mountain,
  "Power Outage": Zap,
};

const commonLocations = [
  "Vijayawada Railway Station",
  "Central Airport",
  "City General Hospital",
  "St. Jude Public School",
  "Metro Shopping Mall",
  "Industrial Sector 4 Factory",
  "Interstate Bus Stand",
  "Central Metro Station",
  "Express Highway 16",
  "Green Valley Apartment Complex",
];

const scenarioTemplates = [
  { name: "Factory Fire", type: "Fire" as DisasterType, location: "Industrial Sector 4 Factory", severity: 9, tone: "Panic" },
  { name: "Urban Flood", type: "Urban Flood" as DisasterType, location: "Market Road Suburb", severity: 7, tone: "Witness" },
  { name: "Train Accident", type: "Train Derailment" as DisasterType, location: "Vijayawada Railway Station", severity: 10, tone: "News Reporter" },
  { name: "Building Collapse", type: "Building Collapse" as DisasterType, location: "Green Valley Apartment Complex", severity: 8, tone: "Witness" },
  { name: "Gas Leak", type: "Gas Leak" as DisasterType, location: "St. Jude Public School", severity: 8, tone: "Panic" },
  { name: "Airport Emergency", type: "Airport Emergency" as DisasterType, location: "Central Airport Terminal 2", severity: 9, tone: "Police" },
  { name: "Cyclone", type: "Cyclone" as DisasterType, location: "Coastal Road", severity: 9, tone: "Witness" },
  { name: "Chemical Spill", type: "Chemical Spill" as DisasterType, location: "Science Park Lab", severity: 8, tone: "Fire Department" },
];

export function MockTweetGeneratorSidebar({
  isOpen,
  onClose,
  onInjectTweet,
}: {
  isOpen: boolean;
  onClose: () => void;
  onInjectTweet: (tweet: { handle: string; text: string; location: string; type: string; severity: number }) => void;
}) {
  const [disasterType, setDisasterType] = useState<DisasterType>("Fire");
  const [severity, setSeverity] = useState(8);
  const [location, setLocation] = useState("Vijayawada Railway Station");
  const [adults, setAdults] = useState(5);
  const [children, setChildren] = useState(2);
  const [critical, setCritical] = useState(1);
  const [missing, setMissing] = useState(0);
  const [traffic, setTraffic] = useState("Road Blocked");
  const [weather, setWeather] = useState("Rain");
  const [language, setLanguage] = useState("English");
  const [tone, setTone] = useState("Panic");
  const [mediaType, setMediaType] = useState<"none" | "image" | "video">("none");
  const [previewTweet, setPreviewTweet] = useState("");
  const [hashtags, setHashtags] = useState<string[]>(["#Fire", "#Emergency", "#Rescue"]);
  const [fakeNews, setFakeNews] = useState(false);
  const [duplicateMode, setDuplicateMode] = useState(false);
  const [autoFeed, setAutoFeed] = useState(false);
  const [intervalSec, setIntervalSec] = useState(3);
  const [batchSize, setBatchSize] = useState(1);
  const [escalationMode, setEscalationMode] = useState(false);

  // Generate AI Tweet Text based on form options
  const generateTweetText = () => {
    let prefix = "🚨 EMERGENCY REPORT: ";
    if (fakeNews) {
      prefix = "⚠ UNVERIFIED RUMOR: ";
    }

    let text = `${prefix}`;

    if (tone === "Panic") {
      text += `HELP! Massive ${disasterType.toLowerCase()} reported near ${location}! People appear trapped! Victims: ${adults + children} injured. Please send emergency services immediately!`;
    } else if (tone === "Witness") {
      text += `Witnessed ${disasterType.toLowerCase()} at ${location}. Traffic condition: ${traffic}. Weather is ${weather}. Rescue crews needed!`;
    } else if (tone === "News Reporter") {
      text += `BREAKING: ${disasterType} reported at ${location}. Estimated casualties: ${adults + children}. Traffic is ${traffic}. Updates to follow.`;
    } else {
      text += `${disasterType} incident ongoing at ${location}. Severity: ${severity}/10. Priority dispatch requested.`;
    }

    const tags = [`#${disasterType.replace(/\s+/g, "")}`, "#Emergency", "#Rescue", "#DisasterFlow"];
    setHashtags(tags);
    setPreviewTweet(`${text} ${tags.join(" ")}`);
  };

  useEffect(() => {
    generateTweetText();
  }, [disasterType, severity, location, adults, children, traffic, weather, tone, fakeNews]);

  // Auto Feed Stream timer
  useEffect(() => {
    let timer: any;
    if (autoFeed) {
      timer = setInterval(() => {
        onInjectTweet({
          handle: fakeNews ? "@unverified_source" : "@citizen_reporter",
          text: previewTweet,
          location,
          type: disasterType,
          severity,
        });
      }, intervalSec * 1000);
    }
    return () => clearInterval(timer);
  }, [autoFeed, intervalSec, previewTweet, location, disasterType, severity]);

  const resetForm = () => {
    setDisasterType("Fire");
    setSeverity(8);
    setLocation("Vijayawada Railway Station");
    setAdults(5);
    setChildren(2);
    setCritical(1);
    setMissing(0);
    setTraffic("Road Blocked");
    setWeather("Rain");
    setLanguage("English");
    setTone("Panic");
    setMediaType("none");
    setFakeNews(false);
    setDuplicateMode(false);
    setAutoFeed(false);
    setEscalationMode(false);
  };

  const handleInject = () => {
    if (duplicateMode) {
      // Inject 3 similar duplicate tweets
      const duplicates = [
        previewTweet,
        `Duplicate Report: ${disasterType} at ${location}! Smoke and fire spreading fast! #Emergency`,
        `Urgent: ${disasterType} confirmed near ${location}. Multiple casualties reported!`,
      ];
      duplicates.forEach((text, i) => {
        setTimeout(() => {
          onInjectTweet({
            handle: `@witness_${i + 1}`,
            text,
            location,
            type: disasterType,
            severity,
          });
        }, i * 300);
      });
    } else {
      onInjectTweet({
        handle: fakeNews ? "@unverified_source" : "@citizen_alert",
        text: previewTweet,
        location,
        type: disasterType,
        severity,
      });
    }
  };

  const applyTemplate = (t: typeof scenarioTemplates[0]) => {
    setDisasterType(t.type);
    setLocation(t.location);
    setSeverity(t.severity);
    setTone(t.tone);
  };

  const getSeverityBadgeClass = () => {
    if (severity >= 8) return "bg-rose-500 text-white";
    if (severity >= 6) return "bg-amber-500 text-white";
    if (severity >= 4) return "bg-yellow-500 text-slate-900";
    return "bg-emerald-500 text-white";
  };

  const getSeverityLabel = () => {
    if (severity >= 8) return "Critical";
    if (severity >= 6) return "High";
    if (severity >= 4) return "Medium";
    return "Low";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-card/95 backdrop-blur-2xl border-l border-purple-300 dark:border-purple-900 shadow-2xl flex flex-col font-sans rise-in">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-purple-100 dark:border-purple-900 bg-gradient-to-r from-purple-700 to-indigo-800 text-white flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold flex items-center gap-2 leading-none">
              📝 Mock Disaster Generator
            </h2>
            <p className="text-xs text-purple-200 mt-0.5">Judge Testbench &amp; Scenario Injector</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetForm}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-xs font-semibold flex items-center gap-1"
            title="Reset Form"
          >
            <RotateCcw className="size-4" /> Reset
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            title="Collapse Sidebar"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      {/* Form Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs font-semibold">
        {/* Scenario Templates Quick Cards */}
        <div>
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
            One-Click Scenario Templates
          </span>
          <div className="grid grid-cols-2 gap-2">
            {scenarioTemplates.map((t) => (
              <button
                key={t.name}
                onClick={() => applyTemplate(t)}
                className="p-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-left transition-all flex items-center justify-between group"
              >
                <span className="font-extrabold text-foreground group-hover:text-purple-700">{t.name}</span>
                <Sparkles className="size-3.5 text-purple-400 group-hover:text-purple-600" />
              </button>
            ))}
          </div>
        </div>

        {/* Disaster Type */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground">Disaster Type</label>
          <select
            value={disasterType}
            onChange={(e) => setDisasterType(e.target.value as DisasterType)}
            className="w-full p-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-background text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            {Object.keys(disasterIcons).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Severity Slider */}
        <div className="space-y-2.5 p-4 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground">Severity Level (1–10)</label>
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold shadow-xs ${getSeverityBadgeClass()}`}>
              Level {severity} — {getSeverityLabel()}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={severity}
            onChange={(e) => setSeverity(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer"
          />
        </div>

        {/* Location Methods */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-foreground">Location Selection</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Search location (e.g., Vijayawada Railway Station)..."
            className="w-full p-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
          <div className="flex gap-2">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 p-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-background text-xs font-semibold text-foreground"
            >
              {commonLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <button
              onClick={() => setLocation("Lat: 16.5062, Long: 80.6480 (Vijayawada Junction)")}
              className="px-3 py-2.5 rounded-xl bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-extrabold text-xs flex items-center gap-1 hover:bg-purple-200"
            >
              <MapPin className="size-3.5" /> Pick Map
            </button>
          </div>
        </div>

        {/* Number of Victims Stepper */}
        <div className="space-y-2.5 p-4 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900">
          <label className="text-xs font-bold text-foreground">Number of Victims Breakdown</label>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-border">
              <span>Adults</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setAdults(Math.max(0, adults - 1))} className="p-1 rounded bg-muted"><Minus className="size-3" /></button>
                <span className="font-extrabold w-4 text-center">{adults}</span>
                <button onClick={() => setAdults(adults + 1)} className="p-1 rounded bg-muted"><Plus className="size-3" /></button>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-border">
              <span>Children</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setChildren(Math.max(0, children - 1))} className="p-1 rounded bg-muted"><Minus className="size-3" /></button>
                <span className="font-extrabold w-4 text-center">{children}</span>
                <button onClick={() => setChildren(children + 1)} className="p-1 rounded bg-muted"><Plus className="size-3" /></button>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-border">
              <span>Critical</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setCritical(Math.max(0, critical - 1))} className="p-1 rounded bg-muted"><Minus className="size-3" /></button>
                <span className="font-extrabold w-4 text-center">{critical}</span>
                <button onClick={() => setCritical(critical + 1)} className="p-1 rounded bg-muted"><Plus className="size-3" /></button>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-border">
              <span>Missing</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setMissing(Math.max(0, missing - 1))} className="p-1 rounded bg-muted"><Minus className="size-3" /></button>
                <span className="font-extrabold w-4 text-center">{missing}</span>
                <button onClick={() => setMissing(missing + 1)} className="p-1 rounded bg-muted"><Plus className="size-3" /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Environment Options: Traffic, Weather, Language, Tone */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-foreground">Traffic Condition</label>
            <select value={traffic} onChange={(e) => setTraffic(e.target.value)} className="w-full p-2.5 mt-1 rounded-xl border border-purple-200 dark:border-purple-800 bg-background text-xs font-semibold">
              <option value="Normal">Normal</option>
              <option value="Moderate">Moderate</option>
              <option value="Heavy">Heavy</option>
              <option value="Road Blocked">Road Blocked</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-foreground">Weather</label>
            <select value={weather} onChange={(e) => setWeather(e.target.value)} className="w-full p-2.5 mt-1 rounded-xl border border-purple-200 dark:border-purple-800 bg-background text-xs font-semibold">
              <option value="Sunny">Sunny</option>
              <option value="Rain">Rain</option>
              <option value="Storm">Storm</option>
              <option value="Wind">Wind</option>
              <option value="Fog">Fog</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-foreground">Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full p-2.5 mt-1 rounded-xl border border-purple-200 dark:border-purple-800 bg-background text-xs font-semibold">
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Telugu">Telugu</option>
              <option value="Tamil">Tamil</option>
              <option value="Kannada">Kannada</option>
              <option value="Malayalam">Malayalam</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-foreground">Tweet Tone</label>
            <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full p-2.5 mt-1 rounded-xl border border-purple-200 dark:border-purple-800 bg-background text-xs font-semibold">
              <option value="Citizen">Citizen</option>
              <option value="Witness">Witness</option>
              <option value="News Reporter">News Reporter</option>
              <option value="Police">Police</option>
              <option value="Fire Department">Fire Department</option>
              <option value="Panic">Panic</option>
            </select>
          </div>
        </div>

        {/* Media Upload Mock */}
        <div className="p-3.5 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="size-4 text-purple-600" />
            <span className="font-bold">Media Upload Mock</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setMediaType(mediaType === "image" ? "none" : "image")}
              className={`px-3 py-1 rounded-lg text-xs font-extrabold ${mediaType === "image" ? "bg-purple-600 text-white" : "bg-card border border-border"}`}
            >
              Image
            </button>
            <button
              onClick={() => setMediaType(mediaType === "video" ? "none" : "video")}
              className={`px-3 py-1 rounded-lg text-xs font-extrabold ${mediaType === "video" ? "bg-purple-600 text-white" : "bg-card border border-border"}`}
            >
              Video
            </button>
          </div>
        </div>

        {/* Generated Tweet Preview Card */}
        <div className="flashcard p-4 border-purple-300 bg-purple-50/50 dark:bg-purple-950/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
              <Sparkles className="size-3.5" /> Generated AI Tweet Preview
            </span>
            <button onClick={generateTweetText} className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-bold text-[10px] hover:bg-purple-700">
              ✨ Regenerate
            </button>
          </div>
          <p className="text-xs font-semibold text-foreground leading-relaxed pt-1">{previewTweet}</p>
        </div>

        {/* Advanced Simulation Toggles */}
        <div className="space-y-3 p-4 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Judge Simulation Modes
          </span>

          <div className="flex items-center justify-between">
            <span className="font-bold">Fake News Simulation</span>
            <input type="checkbox" checked={fakeNews} onChange={(e) => setFakeNews(e.target.checked)} className="size-4 accent-purple-600 cursor-pointer" />
          </div>

          <div className="flex items-center justify-between">
            <span className="font-bold">Duplicate Tweet Generator</span>
            <input type="checkbox" checked={duplicateMode} onChange={(e) => setDuplicateMode(e.target.checked)} className="size-4 accent-purple-600 cursor-pointer" />
          </div>

          <div className="flex items-center justify-between">
            <span className="font-bold">Dynamic Incident Escalation</span>
            <input type="checkbox" checked={escalationMode} onChange={(e) => setEscalationMode(e.target.checked)} className="size-4 accent-purple-600 cursor-pointer" />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-purple-200 dark:border-purple-800">
            <span className="font-bold">Auto Feed Stream</span>
            <div className="flex items-center gap-2">
              <select value={intervalSec} onChange={(e) => setIntervalSec(Number(e.target.value))} className="p-1 rounded bg-background text-[11px]">
                <option value={1}>1s</option>
                <option value={3}>3s</option>
                <option value={5}>5s</option>
                <option value={10}>10s</option>
              </select>
              <input type="checkbox" checked={autoFeed} onChange={(e) => setAutoFeed(e.target.checked)} className="size-4 accent-purple-600 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-purple-100 dark:border-purple-900 bg-card flex flex-col gap-2 shrink-0">
        <button
          onClick={handleInject}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Send className="size-4" /> 🚀 Inject Into Live Feed &amp; Trigger AI Agents
        </button>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <button
            onClick={() => {
              for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                  onInjectTweet({
                    handle: `@batch_reporter_${i + 1}`,
                    text: `${disasterType} reported at ${location} - Incident #${i + 1}`,
                    location,
                    type: disasterType,
                    severity,
                  });
                }, i * 200);
              }
            }}
            className="p-2 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold hover:bg-purple-100"
          >
            ⚡ Generate 10 Tweets
          </button>

          <button
            onClick={() => setAutoFeed(!autoFeed)}
            className={`p-2 rounded-lg font-bold flex items-center justify-center gap-1 ${autoFeed ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}
          >
            {autoFeed ? <Pause className="size-3" /> : <Play className="size-3" />}
            {autoFeed ? "Stop Auto Feed" : "Start Auto Feed"}
          </button>
        </div>
      </div>
    </div>
  );
}
