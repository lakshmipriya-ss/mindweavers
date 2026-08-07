import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useSimulation } from "@/hooks/use-simulation";
import { stats } from "@/lib/disaster-sim";
import { DashboardView } from "@/components/disaster/DashboardView";
import { LiveFeedView, type TweetItem } from "@/components/disaster/LiveFeedView";
import { AIAgentChatView } from "@/components/disaster/AIAgentChatView";
import { SituationMap, DispatchLog } from "@/components/disaster/SituationMap";
import { MedicalIntelligenceView } from "@/components/disaster/MedicalIntelligenceView";
import { TrafficIntelligenceView } from "@/components/disaster/TrafficIntelligenceView";
import { SimulationControlsView } from "@/components/disaster/SimulationControlsView";
import { SettingsView } from "@/components/disaster/SettingsView";
import { MockTweetGeneratorSidebar } from "@/components/disaster/MockTweetGeneratorSidebar";
import {
  ShieldAlert,
  LayoutDashboard,
  Rss,
  Bot,
  MapPin,
  Stethoscope,
  Car,
  Sliders,
  Settings,
  Bell,
  Sun,
  Moon,
  Radio,
  Pause,
  Play,
  MessageSquare,
  Sparkles,
  Flame,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DisasterFlow — Mindweavers Multi-Agent AI Emergency Command Center" },
      {
        name: "description",
        content:
          "Emergency Disaster Response Multi-Agent Command Dashboard. Autonomous triage, live feed classification, AI agent chatbot, and simulation controls.",
      },
    ],
  }),
  component: Dashboard,
});

export type TabType =
  | "dashboard"
  | "live-feed"
  | "ai-chatbot"
  | "incident-map"
  | "medical"
  | "traffic"
  | "simulation-controls"
  | "settings";

function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [isDark, setIsDark] = useState(false);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [timeStr, setTimeStr] = useState<string>("");
  const [notifCount, setNotifCount] = useState(3);
  const [isMockSidebarOpen, setIsMockSidebarOpen] = useState(false);
  const [injectedMockTweets, setInjectedMockTweets] = useState<TweetItem[]>([]);

  const { state, running, setRunning, advance, reset, injectIncident } = useSimulation(3000 / simSpeed);
  const s = stats(state);

  // Live Clock Update
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString());
    }, 1000);
    setTimeStr(new Date().toLocaleTimeString());
    return () => clearInterval(timer);
  }, []);

  // Light / Dark Theme toggle effect
  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleInjectTweetPayload = (payload: {
    handle: string;
    text: string;
    location: string;
    type: string;
    severity: number;
    mediaUrl?: string | undefined;
    mediaType?: "image" | "video" | undefined;
  }) => {
    injectIncident(payload);
    const newMockTweetItem: TweetItem = {
      id: `mock-tw-${Date.now()}`,
      handle: payload.handle,
      time: "Just now",
      text: payload.text,
      icon: Flame,
      type: payload.type,
      location: payload.location,
      severity: payload.severity,
      confidence: 0.96,
      isDuplicate: false,
      status: "New",
      isMock: true,
      mediaUrl: payload.mediaUrl,
      mediaType: payload.mediaType,
    };
    setInjectedMockTweets((prev) => [newMockTweetItem, ...prev]);
    setActiveTab("live-feed");
  };

  const navItems: { id: TabType; label: string; icon: any }[] = [
    { id: "dashboard", label: "🏠 Dashboard", icon: LayoutDashboard },
    { id: "live-feed", label: "🐦 Live Feed", icon: Rss },
    { id: "ai-chatbot", label: "💬 AI Chatbot", icon: MessageSquare },
    { id: "incident-map", label: "🗺 Incident Map", icon: MapPin },
    { id: "medical", label: "🩺 Medical Intelligence", icon: Stethoscope },
    { id: "traffic", label: "🚦 Traffic Intelligence", icon: Car },
    { id: "simulation-controls", label: "⚙ Simulation Controls", icon: Sliders },
    { id: "settings", label: "⚙ System Settings", icon: Settings },
  ];

  return (
    <div className={`min-h-screen bg-background flex flex-row font-sans overflow-x-hidden ${isDark ? "dark" : ""}`}>
      {/* Icon-Only Light Purple Navigation Sidebar Rail */}
      <aside className="w-16 md:w-20 sticky top-0 h-screen nav-rail-purple py-6 flex flex-col items-center justify-between shrink-0 z-40 transition-all">
        <div className="flex flex-col items-center gap-6">
          {/* Brand Shield Logo */}
          <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-500/35 animate-float cursor-pointer" onClick={() => setActiveTab("dashboard")}>
            <ShieldAlert className="size-6" />
          </div>

          {/* Icon Nav Items with Hover Tooltips */}
          <nav className="flex flex-col items-center gap-3.5 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={item.label}
                  className={`nav-icon-btn group ${isActive ? "active" : ""}`}
                >
                  <Icon className="size-5" />
                  {/* Tooltip on Hover */}
                  <span className="absolute left-16 z-50 hidden group-hover:flex items-center rounded-xl bg-slate-900/90 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white shadow-xl whitespace-nowrap rise-in border border-slate-700/50">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Quick Play/Pause Control */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => setRunning(!running)}
            title={running ? "Pause Simulation" : "Resume Simulation"}
            className={`flex size-12 items-center justify-center rounded-2xl transition-all duration-300 shadow-md ${
              running
                ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 hover:bg-rose-200 border border-rose-200"
                : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/25 active:scale-95"
            }`}
          >
            {running ? <Pause className="size-5" /> : <Play className="size-5" />}
          </button>
        </div>
      </aside>

      {/* Main Right Content Workspace */}
      <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-w-[1700px] mx-auto min-w-0">
        {/* Global Header */}
        <header className="flashcard mb-6 p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card/90 backdrop-blur-md border border-purple-200/70 shadow-sm rise-in">
          <div className="flex items-center gap-3.5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md">
              <ShieldAlert className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-extrabold tracking-tight text-foreground">
                  DisasterFlow — Mindweavers AI Command
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 dark:bg-purple-900/60 px-3 py-0.5 text-xs font-extrabold text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-xs animate-pulse-subtle">
                  <Radio className="size-3 text-purple-600 animate-pulse" /> Neural Multi-Agent Active
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Autonomous Emergency Operations Command Center
              </p>
            </div>
          </div>

          {/* Clean Header Actions: Live Clock, Notifications, Theme Toggle & Profile */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            {/* Live HH:mm:ss Clock */}
            <div className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 font-mono font-extrabold text-purple-700 dark:text-purple-300">
              {timeStr}
            </div>

            {/* Notifications Bell */}
            <button
              onClick={() => setNotifCount(0)}
              className="relative p-2 rounded-xl border border-border bg-card text-foreground hover:bg-accent transition-all"
              title="Notifications"
            >
              <Bell className="size-4" />
              {notifCount > 0 && (
                <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-extrabold text-white">
                  {notifCount}
                </span>
              )}
            </button>

            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition-all"
              title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
            >
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>

            {/* User Profile Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <div className="flex size-8 items-center justify-center rounded-full bg-purple-600 text-white font-extrabold text-xs">
                CD
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-extrabold text-foreground leading-none">Commander</p>
                <p className="text-[10px] text-muted-foreground">Director Staff</p>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Views Container */}
        <div key={activeTab} className="rise-in">
          {activeTab === "dashboard" && <DashboardView stats={s} incidentsCount={state.incidents.length} />}
          {activeTab === "live-feed" && <LiveFeedView injectedTweets={injectedMockTweets} />}
          {activeTab === "ai-chatbot" && <AIAgentChatView />}
          {activeTab === "incident-map" && (
            <div className="grid gap-6 lg:grid-cols-12 rise-in">
              <div className="lg:col-span-7">
                <SituationMap incidents={state.incidents} resources={state.resources} />
              </div>
              <div className="lg:col-span-5">
                <DispatchLog incidents={state.incidents} />
              </div>
            </div>
          )}
          {activeTab === "medical" && <MedicalIntelligenceView />}
          {activeTab === "traffic" && <TrafficIntelligenceView />}
          {activeTab === "simulation-controls" && (
            <SimulationControlsView
              running={running}
              setRunning={setRunning}
              advance={advance}
              reset={reset}
              simSpeed={simSpeed}
              setSimSpeed={setSimSpeed}
            />
          )}
          {activeTab === "settings" && <SettingsView />}
        </div>
      </main>

      {/* Floating Right-Bottom Corner Trigger Button for Mock Disaster Generator */}
      {!isMockSidebarOpen && (
        <button
          onClick={() => setIsMockSidebarOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4.5 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all border border-purple-300/40 group"
        >
          <span className="relative flex size-3">
            <span className="pulse-ring absolute inset-0 rounded-full bg-white" />
            <span className="relative size-3 rounded-full bg-white" />
          </span>
          <Sparkles className="size-4 text-yellow-300 group-hover:rotate-12 transition-transform" />
          <span>📝 Mock Disaster Generator</span>
        </button>
      )}

      {/* Mock Disaster Tweet Generator Right Corner Sidebar Drawer */}
      <MockTweetGeneratorSidebar
        isOpen={isMockSidebarOpen}
        onClose={() => setIsMockSidebarOpen(false)}
        onInjectTweet={handleInjectTweetPayload}
        onSwitchToLiveFeed={() => setActiveTab("live-feed")}
      />
    </div>
  );
}
