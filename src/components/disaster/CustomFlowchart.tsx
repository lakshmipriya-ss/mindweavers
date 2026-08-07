import { BackendIncidentResult } from "@/lib/api";
import { AlertTriangle, BrainCircuit, Zap, Bot } from "lucide-react";

export function CustomFlowchart({ data }: { data: BackendIncidentResult }) {
  const departments = data.department_responses ? Object.entries(data.department_responses) : [];

  return (
    <div className="flex flex-col items-center py-6 font-sans w-full max-w-2xl mx-auto text-slate-300">
      
      {/* STEP 1: Incoming Alert */}
      <div className="w-full rounded-2xl border-2 border-orange-500/50 bg-[#12141D] p-5 shadow-[0_0_20px_rgba(249,115,22,0.1)] relative">
        <h4 className="text-[10px] font-extrabold text-orange-400 tracking-[0.2em] uppercase text-center mb-4">
          • STEP 1 — INCOMING ALERT
        </h4>
        <div className="flex items-center justify-center gap-2 mb-6">
          <AlertTriangle className="size-5 text-orange-500" />
          <h2 className="text-lg font-bold text-white">{data.incident_type} Detected</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex flex-col gap-1 border-r border-slate-800 pr-4">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Location</span>
            <span className="text-orange-400 font-medium">📍 {data.location}</span>
          </div>
          <div className="flex flex-col gap-1 pl-2">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Severity</span>
            <span className="text-orange-400 font-medium">{data.severity}</span>
          </div>
          <div className="flex flex-col gap-1 border-r border-slate-800 pr-4 mt-2">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Source</span>
            <span className="text-slate-300 font-medium">Social Media / Emergency Feed</span>
          </div>
          <div className="flex flex-col gap-1 pl-2 mt-2">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Timestamp</span>
            <span className="text-slate-300 font-medium">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* CONNECTOR */}
      <div className="flex flex-col items-center h-16 relative w-full">
        <div className="w-px h-full bg-gradient-to-b from-orange-500/50 to-purple-500/50"></div>
        <div className="absolute top-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-[#12141D] border border-slate-700 backdrop-blur-md">
          <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase flex items-center gap-2">
            ▼ NLP classification & severity triage
          </span>
        </div>
      </div>

      {/* STEP 2: AI Dispatcher */}
      <div className="w-full rounded-2xl border-2 border-slate-500/50 bg-[#12141D] p-5 shadow-[0_0_30px_rgba(168,85,247,0.15)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500 via-transparent to-transparent pointer-events-none"></div>
        
        <h4 className="text-[10px] font-extrabold text-slate-300 tracking-[0.2em] uppercase text-center mb-4 z-10 relative">
          • STEP 2 — AI DISPATCHER
        </h4>
        
        <div className="flex flex-col items-center justify-center gap-1 mb-6 z-10 relative">
          <BrainCircuit className="size-8 text-pink-400 mb-2" />
          <h2 className="text-lg font-bold text-white">AI Dispatcher Agent</h2>
          <p className="text-[10px] text-slate-500 tracking-wide">Phi3.5 LLM • Multi-Agent Orchestrator • Ollama Local</p>
        </div>
        
        <div className="border-t border-slate-800 border-dashed pt-4 mb-4 z-10 relative">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Model</span>
            <span className="text-slate-300">phi3.5:latest (2.2GB)</span>
          </div>
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Temperature</span>
            <span className="text-slate-300">0.1 (Deterministic)</span>
          </div>
          <div className="flex justify-between items-center text-xs mb-4">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Agencies Dispatched</span>
            <span className="text-slate-300">{departments.length} departments</span>
          </div>
        </div>

        <div className="w-full p-4 rounded-xl bg-purple-950/20 border border-purple-900/50 z-10 relative">
          <div className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest flex items-center gap-2 mb-2">
            <Zap className="size-3" /> STRATEGIC PRIORITY
          </div>
          <p className="text-sm text-purple-200 font-medium">{data.strategic_priority}</p>
        </div>
      </div>

      {/* CONNECTOR */}
      {departments.length > 0 && (
        <div className="flex flex-col items-center h-16 relative w-full">
          <div className="w-px h-full bg-gradient-to-b from-purple-500/50 to-blue-500/50"></div>
          <div className="absolute top-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-[#12141D] border border-slate-700 backdrop-blur-md">
            <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase flex items-center gap-2">
              ▼ parallel dispatch to domain agents
            </span>
          </div>
        </div>
      )}

      {/* STEP 3: Domain Agent Responses */}
      {departments.length > 0 && (
        <div className="w-full">
          <h4 className="text-[10px] font-extrabold text-blue-400 tracking-[0.2em] uppercase text-center mb-6">
            • STEP 3 — DOMAIN AGENT RESPONSES
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
            {departments.map(([dept, details]: [string, any], idx) => {
              const isFire = dept.includes("Fire");
              const isMed = dept.includes("Medical");
              const color = isFire ? "orange" : isMed ? "emerald" : "indigo";
              
              // Tailwind dynamic class workaround for bg/border colors
              let borderClass = "border-indigo-500/30 hover:border-indigo-500/60";
              let textClass = "text-indigo-400";
              let bgClass = "bg-indigo-500";
              if (isFire) {
                borderClass = "border-orange-500/30 hover:border-orange-500/60";
                textClass = "text-orange-400";
                bgClass = "bg-orange-500";
              } else if (isMed) {
                borderClass = "border-emerald-500/30 hover:border-emerald-500/60";
                textClass = "text-emerald-400";
                bgClass = "bg-emerald-500";
              }

              return (
                <div key={idx} className={`p-5 rounded-2xl border ${borderClass} bg-[#12141D] relative overflow-hidden group transition-colors shadow-lg`}>
                  <div className={`absolute top-0 left-0 w-1 h-full ${bgClass}`}></div>
                  <h3 className={`text-sm font-bold ${textClass} flex items-center gap-2 mb-3`}>
                    <Bot className="size-4" /> {dept} Agent
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(details).map(([key, val]: [string, any], i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">{key.replace(/_/g, ' ')}</span>
                        <span className="text-xs text-slate-300 font-medium">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
    </div>
  );
}
