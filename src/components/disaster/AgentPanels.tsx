import { AGENT_LABEL, type AgentId, type AgentMessage } from "@/lib/disaster-sim";
import { clock } from "./meta";
import { Bot, Brain, Flame, Ambulance, Shield, Car, MapPin, Gauge, Radio } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const agentIcon: Record<AgentId, LucideIcon> = {
  listener: Radio,
  classifier: Brain,
  geo: MapPin,
  severity: Gauge,
  fire: Flame,
  medical: Ambulance,
  police: Shield,
  traffic: Car,
  coordinator: Bot,
};

const agentColor: Record<AgentId, string> = {
  listener: "text-muted-foreground",
  classifier: "text-traffic",
  geo: "text-flood",
  severity: "text-warnx",
  fire: "text-fire",
  medical: "text-medical",
  police: "text-police",
  traffic: "text-traffic",
  coordinator: "text-primary",
};

const toneCls: Record<AgentMessage["tone"], string> = {
  info: "border-border",
  action: "border-traffic/40",
  warn: "border-fire/40",
  ok: "border-medical/40",
};

export function AgentConversation({ messages }: { messages: AgentMessage[] }) {
  return (
    <section className="panel flex h-full flex-col overflow-hidden">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold">Agent-to-Agent Conversation</h2>
          <p className="text-xs text-muted-foreground">Structured messages between autonomous agents</p>
        </div>
        <span className="rounded-md bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
          {messages.length} messages
        </span>
      </header>
      <ul className="flex-1 space-y-2 overflow-y-auto p-3">
        {messages.map((m) => {
          const Icon = agentIcon[m.from];
          return (
            <li key={m.id} className={`rise-in rounded-lg border bg-surface p-3 ${toneCls[m.tone]}`}>
              <div className="flex items-center gap-2">
                <Icon className={`size-4 ${agentColor[m.from]}`} />
                <span className="text-xs font-semibold">{AGENT_LABEL[m.from]}</span>
                <span className="text-[11px] text-muted-foreground">
                  → {m.to === "all" ? "broadcast" : AGENT_LABEL[m.to]}
                </span>
                <span className="ml-auto text-[11px] text-muted-foreground">{clock(m.at)}</span>
              </div>
              <p className="mt-1 text-[13px] leading-snug">{m.text}</p>
              {m.reason && (
                <ul className="mt-1.5 space-y-0.5">
                  {m.reason.map((r) => (
                    <li key={r} className="text-[11px] text-muted-foreground">• {r}</li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
        {messages.length === 0 && (
          <li className="p-4 text-center text-xs text-muted-foreground">Agents are idle…</li>
        )}
      </ul>
    </section>
  );
}

const NETWORK: { id: AgentId; angle: number }[] = [
  { id: "listener", angle: -90 },
  { id: "classifier", angle: -45 },
  { id: "geo", angle: 0 },
  { id: "severity", angle: 45 },
  { id: "fire", angle: 90 },
  { id: "medical", angle: 135 },
  { id: "police", angle: 180 },
  { id: "traffic", angle: 225 },
];

export function AgentNetwork({ messages }: { messages: AgentMessage[] }) {
  const recent = new Set(messages.slice(0, 4).map((m) => m.from));
  return (
    <section className="panel p-4">
      <h2 className="text-sm font-semibold">AI Agent Network</h2>
      <p className="text-xs text-muted-foreground">Coordinator orchestrates 8 specialist agents</p>
      <div className="relative mx-auto mt-4 aspect-square w-full max-w-[300px]">
        <span className="absolute left-1/2 top-1/2 flex size-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-center">
          <Bot className="size-5 text-primary" />
          <span className="mt-0.5 text-[11px] font-semibold text-primary">Coordinator</span>
        </span>
        <span className="absolute left-1/2 top-1/2 size-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-border" />
        {NETWORK.map((n) => {
          const Icon = agentIcon[n.id];
          const rad = (n.angle * Math.PI) / 180;
          const left = 50 + 40 * Math.cos(rad);
          const top = 50 + 40 * Math.sin(rad);
          const hot = recent.has(n.id);
          return (
            <span
              key={n.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              <span
                className={`flex size-10 items-center justify-center rounded-full border bg-card transition-shadow ${
                  hot ? "border-primary/50 shadow-glow" : "border-border shadow-panel"
                }`}
              >
                <Icon className={`size-4 ${agentColor[n.id]}`} />
              </span>
              <span className="mt-1 block whitespace-nowrap text-[10px] font-medium text-muted-foreground">
                {AGENT_LABEL[n.id]}
              </span>
            </span>
          );
        })}
      </div>
    </section>
  );
}
