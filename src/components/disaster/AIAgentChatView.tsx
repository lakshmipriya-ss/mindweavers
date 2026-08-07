import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, RefreshCw, Zap, ShieldCheck, HelpCircle, Activity, CheckCircle2, MessageSquare } from "lucide-react";

type ChatMessage = {
  id: string;
  sender: "user" | "ai";
  agentName?: string;
  text: string;
  time: string;
  badge?: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: "m-1",
    sender: "ai",
    agentName: "Neural AI Commander",
    text: "Welcome Commander. I am your AI Emergency Assistant. You can ask me any question about live disaster operations, request quick status summaries, or trigger fast-access questions using the side panel.",
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    badge: "System Ready",
  },
];

const fastAccessQuestions = [
  {
    label: "📊 Executive Summary",
    query: "Give me an executive summary of current emergency operations.",
    answer: "Executive Summary: 14 active emergency incidents being handled. 4 High Priority (Railway Station Fire, City Hospital Collision). 24 total units deployed with 3.8m average ETA. All agency readiness confirmed at 94%.",
  },
  {
    label: "🚨 High Severity Incidents",
    query: "List all high severity incidents and their status.",
    answer: "High Severity Incidents: 1) Railway Station Fire (Severity 9/10) - 2 Fire Engine units & 2 Ambulances dispatched. 2) City Hospital Crossing Collision (Severity 7/10) - Paramedic crew & Police patrol on scene.",
  },
  {
    label: "🚑 Ambulance Readiness",
    query: "What is the current medical and hospital bed availability?",
    answer: "Medical Readiness: 4 Ambulances available on standby. City General Trauma Center has 14 ICU beds open. 6 Red-Triage beds reserved for Railway Station incident casualties.",
  },
  {
    label: "🚦 Express Traffic Routes",
    query: "Show active emergency green corridors and detour routes.",
    answer: "Traffic Intelligence: Emergency Green Express Corridor active on Station Road (Route B). Traffic Signals #12 & #14 preempted to green. Roadblocks active on Express Ave.",
  },
  {
    label: "🚒 Fire Department Fleet",
    query: "What is the status of the fire engine fleet?",
    answer: "Fire Fleet Status: 6 Fire Engines available at Station 4 HQ. Units #401 & #402 deployed to Railway Station. Hazmat Tender #403 on standby.",
  },
  {
    label: "🛡 Law Enforcement Status",
    query: "What is the status of police perimeters and security?",
    answer: "Police Security: 300m safety perimeter established around Railway Station main entrance. Police Patrol Units #201 & #202 managing pedestrian crowd control.",
  },
];

export function AIAgentChatView() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSend = (textQuery?: string, customAnswer?: string) => {
    const query = textQuery || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textQuery) setInput("");
    setIsThinking(true);

    setTimeout(() => {
      let responseText = customAnswer;
      if (!responseText) {
        const lower = query.toLowerCase();
        if (lower.includes("summary") || lower.includes("status")) {
          responseText = "Quick Summary: 14 active incidents, 4 critical events, 24 units deployed with 3.8m average ETA. Multi-agent consensus active.";
        } else if (lower.includes("fire")) {
          responseText = "Fire Department Report: Fire near Railway Station platform 3 classified as Severity 9. 2 Fire Engines & 1 Ladder Truck deployed.";
        } else if (lower.includes("medical") || lower.includes("ambulance") || lower.includes("hospital")) {
          responseText = "Medical Services Report: 4 Ambulances available. 14 ICU beds open at City General Trauma Center.";
        } else {
          responseText = `AI Commander Analysis for "${query}": Telemetry evaluated across Fire, Medical, Police, and Traffic multi-agent pipelines. All operational metrics within normal safety bounds.`;
        }
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        agentName: "Neural AI Commander",
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        badge: "Neural Verified",
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, 800);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12 rise-in">
      {/* Middle Column: Clean AI Chatbot Interface */}
      <div className="lg:col-span-8 flex flex-col h-[720px] flashcard p-5 border-purple-200">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-purple-100 pb-4 dark:border-purple-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-600 text-white shadow-md">
              <Bot className="size-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
                AI Commander Chatbot <ShieldCheck className="size-4 text-emerald-500" />
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Direct natural language interface to the Multi-Agent Command Center</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300 flex items-center gap-1.5">
            <Sparkles className="size-3 text-purple-600 animate-spin" /> Neural Model Synced
          </span>
        </div>

        {/* Message History Thread */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2 font-sans">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              {m.sender === "ai" && (
                <span className="text-[11px] font-extrabold text-purple-600 dark:text-purple-400 mb-1 flex items-center gap-1">
                  <Bot className="size-3.5" /> {m.agentName}
                </span>
              )}
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-xs font-semibold leading-relaxed shadow-xs ${
                  m.sender === "user"
                    ? "bg-purple-600 text-white rounded-br-none"
                    : "bg-purple-50/60 dark:bg-purple-950/40 text-foreground border border-purple-100 dark:border-purple-900 rounded-bl-none"
                }`}
              >
                {m.text}
                {m.badge && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-200/60 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200">
                      {m.badge}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 px-1 font-mono">{m.time}</span>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs font-bold text-purple-600 p-3 bg-purple-50/40 rounded-xl max-w-xs">
              <RefreshCw className="size-3.5 animate-spin" /> Neural Commander processing response...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Interactive Prompt Bar */}
        <div className="pt-3 border-t border-purple-100 dark:border-purple-900 flex gap-2 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask AI Commander any question about live operations or dispatch priorities..."
            className="flex-1 px-4 py-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-background text-xs font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
          <button
            onClick={() => handleSend()}
            className="px-6 py-3 rounded-xl bg-purple-600 text-white font-extrabold text-xs flex items-center gap-2 shadow-md hover:bg-purple-700 active:scale-95 transition-all"
          >
            <Send className="size-4" /> Send
          </button>
        </div>
      </div>

      {/* Right Column: Corner Quick Status & Fast Access Tab */}
      <div className="lg:col-span-4 space-y-5">
        {/* Quick Status Flashcard */}
        <div className="flashcard p-5 border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
              <Activity className="size-4 text-purple-600" /> Quick Status Tab
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
              Live Operations
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900 flex justify-between items-center">
              <span className="text-muted-foreground font-semibold">Active Emergencies</span>
              <span className="font-extrabold text-purple-600">14 Active</span>
            </div>
            <div className="p-3 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900 flex justify-between items-center">
              <span className="text-muted-foreground font-semibold">Avg Response ETA</span>
              <span className="font-extrabold text-emerald-600">3.8 minutes</span>
            </div>
            <div className="p-3 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900 flex justify-between items-center">
              <span className="text-muted-foreground font-semibold">AI Agency Consensus</span>
              <span className="font-extrabold text-indigo-600">94% Agreement</span>
            </div>
          </div>
        </div>

        {/* Fast Access Questions Panel */}
        <div className="flashcard p-5 border-purple-200 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
              <HelpCircle className="size-4 text-purple-600" /> Fast Access Questions
            </h3>
            <span className="text-[10px] text-muted-foreground font-semibold">1-Click Instant Answers</span>
          </div>
          <p className="text-xs text-muted-foreground leading-snug">
            Click any fast-access question below to ask the AI Commander instantly:
          </p>

          <div className="space-y-2 pt-1">
            {fastAccessQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q.query, q.answer)}
                className="w-full text-left p-3 rounded-xl border border-purple-100 dark:border-purple-900 bg-card hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-950/40 transition-all group flex items-center justify-between"
              >
                <span className="text-xs font-bold text-foreground group-hover:text-purple-700 dark:group-hover:text-purple-300">
                  {q.label}
                </span>
                <Zap className="size-3.5 text-purple-400 group-hover:text-purple-600 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
