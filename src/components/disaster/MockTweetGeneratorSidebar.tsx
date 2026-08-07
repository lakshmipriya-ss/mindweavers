import { useState, useRef, useEffect } from "react";
import {
  Flame,
  Droplets,
  Activity,
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
  Sparkles,
  Upload,
  Send,
  Bot,
  ListFilter,
  Image as ImageIcon,
  Video as VideoIcon,
  Trash2,
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

const sampleMediaPresets = [
  {
    type: "image",
    label: "🔥 Fire Scene Photo",
    url: "https://images.unsplash.com/photo-1599401736636-f365d9561081?auto=format&fit=crop&w=600&q=80",
  },
  {
    type: "image",
    label: "🌊 Urban Flood Photo",
    url: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80",
  },
  {
    type: "image",
    label: "💥 Explosion Scene Photo",
    url: "https://images.unsplash.com/photo-1566378246598-5b11a0d486cc?auto=format&fit=crop&w=600&q=80",
  },
];

const scenarioTemplates = [
  { name: "Factory Fire", type: "Fire" as DisasterType, location: "Industrial Sector 4 Factory", severity: 9, tone: "Panic", mediaUrl: sampleMediaPresets[0]?.url },
  { name: "Urban Flood", type: "Urban Flood" as DisasterType, location: "Market Road Suburb", severity: 7, tone: "Witness", mediaUrl: sampleMediaPresets[1]?.url },
  { name: "Train Accident", type: "Train Derailment" as DisasterType, location: "Vijayawada Railway Station", severity: 10, tone: "News Reporter", mediaUrl: sampleMediaPresets[2]?.url },
  { name: "Building Collapse", type: "Building Collapse" as DisasterType, location: "Green Valley Apartment Complex", severity: 8, tone: "Witness" },
  { name: "Gas Leak", type: "Gas Leak" as DisasterType, location: "St. Jude Public School", severity: 8, tone: "Panic" },
  { name: "Airport Emergency", type: "Airport Emergency" as DisasterType, location: "Central Airport Terminal 2", severity: 9, tone: "Police" },
];

type ChatItem = {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
  generatedTweet?: {
    handle: string;
    text: string;
    location: string;
    type: string;
    severity: number;
    mediaUrl?: string | undefined;
    mediaType?: "image" | "video" | undefined;
  };
};

export function MockTweetGeneratorSidebar({
  isOpen,
  onClose,
  onInjectTweet,
  onSwitchToLiveFeed,
}: {
  isOpen: boolean;
  onClose: () => void;
  onInjectTweet: (tweet: { handle: string; text: string; location: string; type: string; severity: number; mediaUrl?: string | undefined; mediaType?: "image" | "video" | undefined }) => void;
  onSwitchToLiveFeed: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"chatbot" | "wizard">("chatbot");
  const [disasterType, setDisasterType] = useState<DisasterType>("Fire");
  const [severity, setSeverity] = useState(8);
  const [location, setLocation] = useState("Vijayawada Railway Station");
  const [tone, setTone] = useState("Panic");
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState<string | null>(sampleMediaPresets[0]?.url || null);
  const [uploadedMediaType, setUploadedMediaType] = useState<"image" | "video">("image");
  const [fakeNews] = useState(false);

  // Chatbot State
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([
    {
      id: "bot-1",
      sender: "bot",
      text: "Hello Commander! I am your Mock Disaster Generator Bot. Describe any emergency or pick preset scenarios below. You can also upload disaster images and videos!",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVid = file.type.startsWith("video");
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedMediaUrl(event.target?.result as string);
      setUploadedMediaType(isVid ? "video" : "image");
    };
    reader.readAsDataURL(file);
  };

  const generateTweetFromWizard = () => {
    let prefix = "🚨 EMERGENCY REPORT: ";
    if (fakeNews) prefix = "⚠ UNVERIFIED RUMOR: ";

    let text = `${prefix}`;
    if (tone === "Panic") {
      text += `HELP! Severe ${disasterType.toLowerCase()} at ${location}! Smoke spreading fast. Send emergency crews now! #Emergency #${disasterType.replace(/\s+/g, "")}`;
    } else if (tone === "News Reporter") {
      text += `BREAKING: ${disasterType} reported at ${location}. Multiple emergency response units requested. #${disasterType.replace(/\s+/g, "")} #DisasterFlow`;
    } else {
      text += `${disasterType} ongoing at ${location}. Severity: ${severity}/10. Priority dispatch initiated. #Emergency`;
    }
    return text;
  };

  const handleInjectFromWizard = () => {
    const text = generateTweetFromWizard();
    const tweetPayload = {
      handle: fakeNews ? "@unverified_source" : "@citizen_alert",
      text,
      location,
      type: disasterType,
      severity,
      mediaUrl: uploadedMediaUrl || undefined,
      mediaType: uploadedMediaUrl ? uploadedMediaType : undefined,
    };
    onInjectTweet(tweetPayload);
    onSwitchToLiveFeed();
  };

  const handleChatSubmit = (customQuery?: string) => {
    const query = customQuery || chatInput;
    if (!query.trim()) return;

    const userMsg: ChatItem = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    if (!customQuery) setChatInput("");

    setTimeout(() => {
      let inferredType: DisasterType = "Fire";
      const qLower = query.toLowerCase();
      if (qLower.includes("flood")) inferredType = "Flood";
      else if (qLower.includes("train")) inferredType = "Train Derailment";
      else if (qLower.includes("explosion") || qLower.includes("blast")) inferredType = "Explosion";
      else if (qLower.includes("gas") || qLower.includes("leak")) inferredType = "Gas Leak";

      const generatedText = `🚨 MOCK DISASTER TWEET: "${query}" - Emergency reported near Vijayawada Junction. Urgent dispatch requested! #Emergency #${inferredType.replace(/\s+/g, "")}`;

      const generatedTweetObj = {
        handle: "@judge_scenario_test",
        text: generatedText,
        location: "Vijayawada Junction",
        type: inferredType,
        severity: 9,
        mediaUrl: uploadedMediaUrl || sampleMediaPresets[0]?.url || undefined,
        mediaType: uploadedMediaType,
      };

      const botMsg: ChatItem = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: `Generated Tweet for Scenario: "${query}". Click below to inject directly into the Live Feed with attached media!`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        generatedTweet: generatedTweetObj,
      };

      setChatHistory((prev) => [...prev, botMsg]);
    }, 600);
  };

  const applyTemplate = (t: typeof scenarioTemplates[0]) => {
    setDisasterType(t.type);
    setLocation(t.location);
    setSeverity(t.severity);
    setTone(t.tone);
    if (t.mediaUrl) {
      setUploadedMediaUrl(t.mediaUrl);
      setUploadedMediaType("image");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-card/95 backdrop-blur-2xl border-l border-purple-300 dark:border-purple-900 shadow-2xl flex flex-col font-sans rise-in">
      {/* Docked Sidebar Header */}
      <div className="p-4 border-b border-purple-100 dark:border-purple-900 bg-gradient-to-r from-purple-700 to-indigo-800 text-white flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold flex items-center gap-2 leading-none">
              📝 Mock Disaster Generator
            </h2>
            <p className="text-xs text-purple-200 mt-0.5">Judge Scenario Chatbot &amp; Media Injector</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          title="Close Sidebar"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Tab Switcher: Chatbot vs Option Wizard */}
      <div className="p-2 bg-purple-50/60 dark:bg-purple-950/40 border-b border-purple-100 dark:border-purple-900 flex gap-2 shrink-0">
        <button
          onClick={() => setActiveTab("chatbot")}
          className={`flex-1 py-2 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
            activeTab === "chatbot"
              ? "bg-purple-600 text-white shadow-md"
              : "bg-card text-muted-foreground hover:bg-purple-100 dark:hover:bg-purple-900/40"
          }`}
        >
          <Bot className="size-4" /> 🤖 Disaster Chatbot
        </button>
        <button
          onClick={() => setActiveTab("wizard")}
          className={`flex-1 py-2 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
            activeTab === "wizard"
              ? "bg-purple-600 text-white shadow-md"
              : "bg-card text-muted-foreground hover:bg-purple-100 dark:hover:bg-purple-900/40"
          }`}
        >
          <ListFilter className="size-4" /> 🎯 Option Selector
        </button>
      </div>

      {/* TAB 1: Disaster Chatbot */}
      {activeTab === "chatbot" && (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans text-xs">
            {chatHistory.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                {m.sender === "bot" && (
                  <span className="text-[10px] font-extrabold text-purple-600 dark:text-purple-400 mb-1 flex items-center gap-1">
                    <Bot className="size-3" /> Mock Tweet Bot
                  </span>
                )}
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl font-semibold leading-relaxed shadow-xs ${
                    m.sender === "user"
                      ? "bg-purple-600 text-white rounded-br-none"
                      : "bg-purple-50 dark:bg-purple-950/40 text-foreground border border-purple-100 dark:border-purple-900 rounded-bl-none"
                  }`}
                >
                  {m.text}

                  {/* Injectable Tweet Preview Box inside Chat */}
                  {m.generatedTweet && (
                    <div className="mt-3 p-3 rounded-xl bg-card border border-purple-200 dark:border-purple-800 text-xs space-y-2">
                      <p className="font-extrabold text-purple-700 dark:text-purple-300">{m.generatedTweet.text}</p>
                      
                      {/* Attached Media Thumbnail Preview */}
                      {m.generatedTweet.mediaUrl && (
                        <div className="relative rounded-lg overflow-hidden border border-purple-200 dark:border-purple-800 max-h-36">
                          {m.generatedTweet.mediaType === "video" ? (
                            <div className="relative bg-slate-900 flex items-center justify-center p-4 text-white">
                              <VideoIcon className="size-8 text-purple-400 animate-pulse" />
                              <span className="text-[10px] ml-2 font-bold">Video Attached</span>
                            </div>
                          ) : (
                            <img src={m.generatedTweet.mediaUrl} alt="Disaster Preview" className="w-full h-28 object-cover" />
                          )}
                        </div>
                      )}

                      <button
                        onClick={() => {
                          onInjectTweet(m.generatedTweet!);
                          onSwitchToLiveFeed();
                        }}
                        className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-xs hover:brightness-110 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                      >
                        <Send className="size-3.5" /> 🚀 Inject to Live Feed &amp; Open Live Tab
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 px-1">{m.time}</span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 border-t border-purple-100 dark:border-purple-900 bg-purple-50/40 dark:bg-purple-950/20 shrink-0 flex gap-1.5 overflow-x-auto text-[11px]">
            <button onClick={() => handleChatSubmit("Generate factory fire near Industrial Sector 4")} className="whitespace-nowrap px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-800 bg-card hover:bg-purple-100 font-bold text-purple-700 dark:text-purple-300 shrink-0">
              🔥 Factory Fire
            </button>
            <button onClick={() => handleChatSubmit("Generate train derailment near Railway Station")} className="whitespace-nowrap px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-800 bg-card hover:bg-purple-100 font-bold text-purple-700 dark:text-purple-300 shrink-0">
              🚆 Train Derailment
            </button>
            <button onClick={() => handleChatSubmit("Generate urban flood near Market Road")} className="whitespace-nowrap px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-800 bg-card hover:bg-purple-100 font-bold text-purple-700 dark:text-purple-300 shrink-0">
              🌊 Urban Flood
            </button>
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 border-t border-purple-100 dark:border-purple-900 bg-card flex gap-2 shrink-0">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleChatSubmit()}
              placeholder="Type disaster scenario (e.g. Chemical leak at lab)..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <button
              onClick={() => handleChatSubmit()}
              className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 active:scale-95 transition-all shadow-md"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Option Selector Wizard */}
      {activeTab === "wizard" && (
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs font-semibold">
          {/* Preset Scenario Cards */}
          <div>
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
              One-Click Presets
            </span>
            <div className="grid grid-cols-2 gap-2">
              {scenarioTemplates.map((t) => (
                <button
                  key={t.name}
                  onClick={() => applyTemplate(t)}
                  className="p-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/20 hover:bg-purple-100 text-left transition-all flex items-center justify-between group"
                >
                  <span className="font-extrabold text-foreground group-hover:text-purple-700">{t.name}</span>
                  <Sparkles className="size-3 text-purple-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Disaster Type & Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-foreground">Disaster Type</label>
              <select
                value={disasterType}
                onChange={(e) => setDisasterType(e.target.value as DisasterType)}
                className="w-full p-2.5 mt-1 rounded-xl border border-purple-200 dark:border-purple-800 bg-background text-xs font-bold"
              >
                {Object.keys(disasterIcons).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-foreground">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 mt-1 rounded-xl border border-purple-200 dark:border-purple-800 bg-background text-xs font-semibold"
              >
                {commonLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Severity Slider */}
          <div className="p-3 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900 space-y-2">
            <div className="flex justify-between items-center">
              <span>Severity Level (1-10)</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-600 text-white">
                Level {severity}
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

          {/* Image & Video Upload Dropzone */}
          <div className="p-3.5 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5">
                <Upload className="size-4 text-purple-600" /> Upload Image / Video
              </span>
              {uploadedMediaUrl && (
                <button
                  onClick={() => setUploadedMediaUrl(null)}
                  className="text-rose-600 text-[10px] font-bold flex items-center gap-0.5 hover:underline"
                >
                  <Trash2 className="size-3" /> Remove
                </button>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Preset Samples or Uploaded Preview */}
            <div className="flex gap-2 items-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 p-2.5 rounded-xl border border-dashed border-purple-300 dark:border-purple-700 bg-card hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <ImageIcon className="size-4" /> Browse Local File
              </button>
            </div>

            {/* Media Thumbnail Preview */}
            {uploadedMediaUrl && (
              <div className="relative rounded-xl overflow-hidden border border-purple-200 dark:border-purple-800 max-h-32 mt-2">
                {uploadedMediaType === "video" ? (
                  <video src={uploadedMediaUrl} controls className="w-full max-h-32 object-cover" />
                ) : (
                  <img src={uploadedMediaUrl} alt="Disaster Preview" className="w-full h-28 object-cover" />
                )}
              </div>
            )}
          </div>

          {/* Generated Preview */}
          <div className="flashcard p-3 border-purple-300 bg-purple-50/50 dark:bg-purple-950/30 space-y-1.5">
            <span className="text-[11px] font-extrabold text-purple-700 dark:text-purple-300">
              Preview Tweet
            </span>
            <p className="text-xs font-bold text-foreground">{generateTweetFromWizard()}</p>
          </div>

          {/* Inject Button */}
          <button
            onClick={handleInjectFromWizard}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Send className="size-4" /> 🚀 Inject into Live Feed &amp; Open Live Feed Tab
          </button>
        </div>
      )}
    </div>
  );
}
