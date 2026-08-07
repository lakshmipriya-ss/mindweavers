import type { Resource, SimState } from "@/lib/disaster-sim";
import { kindMeta } from "./meta";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  tone = "text-muted-foreground",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  delta: string;
  tone?: string;
}) {
  return (
    <div className="panel card-hover-effect p-4 border border-rose-100/60 bg-gradient-to-b from-card to-rose-50/20">
      <div className="flex items-center gap-2">
        <Icon className={`size-4 ${tone}`} />
        <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground">{value}</p>
      <p className={`mt-0.5 text-xs font-semibold ${tone}`}>{delta}</p>
    </div>
  );
}

export function ResourcePanel({ resources }: { resources: Resource[] }) {
  const kinds = ["fire", "ambulance", "police", "traffic"] as const;
  return (
    <section className="panel p-4">
      <h2 className="text-sm font-semibold">Resource Overview</h2>
      <p className="text-xs text-muted-foreground">Autonomous nearest-available routing</p>
      <ul className="mt-3 space-y-3">
        {kinds.map((k) => {
          const pool = resources.filter((r) => r.kind === k);
          const busy = pool.filter((r) => r.status !== "available").length;
          const m = kindMeta[k];
          const Icon = m.icon;
          const pct = pool.length ? (busy / pool.length) * 100 : 0;
          return (
            <li key={k}>
              <div className="flex items-center gap-2 text-xs">
                <Icon className={`size-4 ${m.color}`} />
                <span className="font-medium">{m.label}</span>
                <span className="ml-auto text-muted-foreground">
                  {busy}/{pool.length} deployed
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const STAGES = ["detected", "analyzed", "allocated", "dispatched", "resolved"] as const;

export function ResponseTimeline({ state }: { state: SimState }) {
  const latest = state.incidents[0];
  const reached = latest ? STAGES.indexOf(latest.stage) : -1;
  return (
    <section className="panel p-4">
      <h2 className="text-sm font-semibold">Disaster Response Timeline</h2>
      <p className="text-xs text-muted-foreground">
        {latest ? `${latest.code} · ${latest.location}` : "Awaiting first incident"}
      </p>
      <ol className="mt-4 flex items-start justify-between gap-1">
        {STAGES.map((s, idx) => {
          const done = idx <= reached;
          return (
            <li key={s} className="flex flex-1 flex-col items-center text-center">
              <span className="flex w-full items-center">
                <span className={`h-0.5 flex-1 ${idx === 0 ? "opacity-0" : done ? "bg-primary" : "bg-border"}`} />
                <span
                  className={`size-3 shrink-0 rounded-full border-2 ${
                    done ? "border-primary bg-primary" : "border-border bg-card"
                  }`}
                />
                <span
                  className={`h-0.5 flex-1 ${
                    idx === STAGES.length - 1 ? "opacity-0" : idx < reached ? "bg-primary" : "bg-border"
                  }`}
                />
              </span>
              <span className={`mt-1.5 text-[11px] font-medium capitalize ${done ? "text-foreground" : "text-muted-foreground"}`}>
                {s}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
