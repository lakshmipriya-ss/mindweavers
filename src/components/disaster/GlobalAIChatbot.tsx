import { useState, useRef, useEffect } from "react";
import { Bot, MessageSquare, X, Send, Sparkles, RefreshCw, Zap, ShieldCheck } from "lucide-react";

type ChatMessage = {
  id: string;
  sender: "user" | "ai";
  agentName?: string;
  text: string;
  time: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: "m-1",
    sender: "ai",
    agentName: "Neural AI Commander",
    text: "Hello Commander. I am your Multi-Agent Disaster Response Assistant. How can I assist with triage, resource dispatch, or scenario analysis today?",
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  },
];

const quickPrompts = [
  "Summarize active high-severity incidents",
  "Check ambulance availability near Railway Station",
  "Recommend emergency traffic corridor routes",
];

export function GlobalAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    // AI Response Simulation
    setTimeout(() => {
      let aiText = "";
      const lower = query.toLowerCase();

      if (lower.includes("severity") || lower.includes("incidents") || lower.includes("summary")) {
        aiText = "Active Status: 14 total incidents recorded. 4 high-severity incidents active (Fire near Railway Station, Collapse on Market Rd). 24 total units currently deployed with an average ETA of 3.8m.";
      } else if (lower.includes("ambulance") || lower.includes("medical") || lower.includes("hospital")) {
        aiText = "Medical Intelligence Report: 4 Ambulances available. City General Trauma Center has 14 ICU beds reserved. Red-triage priority route active via Station Rd.";
      } else if (lower.includes("traffic") || lower.includes("corridor") || lower.includes("route")) {
        aiText = "Traffic Intelligence Report: Green Express Corridor active on Route B. Signals #12, #14 preempted to green for emergency units.";
      } else {
        aiText = `Analyzing "${query}": Multi-agent pipeline (Fire, Medical, Police, Traffic, Hospital) consulted. All units report readiness; Coordinator approved standard response priorities.`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        agentName: "Neural AI Commander",
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-xl hover:scale-105 active:scale-95 transition-all border border-purple-300/40 group"
        >
          <span className="relative flex size-3">
            <span className="pulse-ring absolute inset-0 rounded-full bg-white" />
            <span className="relative size-3 rounded-full bg-white" />
          </span>
          <Bot className="size-5" />
          <span>AI Commander Chat</span>
          <Sparkles className="size-4 text-yellow-300 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* Floating Chatbot Window */}
      {isOpen && (
        <div className="w-[380px] sm:w-[420px] h-[540px] flashcard flex flex-col border-purple-300 shadow-2xl bg-card/95 backdrop-blur-xl rise-in overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-purple-100 dark:border-purple-900 bg-gradient-to-r from-purple-600 to-indigo-700 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
                <Bot className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold flex items-center gap-1.5 leading-none">
                  Neural AI Commander <ShieldCheck className="size-4 text-emerald-300" />
                </h3>
                <p className="text-[11px] text-purple-200 mt-0.5">Multi-Agent Emergency Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                {m.sender === "ai" && (
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 mb-1 flex items-center gap-1">
                    <Bot className="size-3" /> {m.agentName}
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
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 px-1">{m.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 p-2">
                <RefreshCw className="size-3.5 animate-spin" /> Neural agents analyzing telemetry...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 border-t border-purple-100 dark:border-purple-900 bg-purple-50/30 dark:bg-purple-950/20 shrink-0 flex gap-1.5 overflow-x-auto text-[11px]">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-800 bg-card hover:bg-purple-100 font-medium text-purple-700 dark:text-purple-300 transition-all shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-purple-100 dark:border-purple-900 flex gap-2 shrink-0 bg-card">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask AI Commander..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <button
              onClick={() => handleSend()}
              className="p-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 active:scale-95 transition-all shadow-md"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
