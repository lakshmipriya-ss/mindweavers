import { clock, typeMeta } from "./meta";
import type { Tweet } from "@/lib/disaster-sim";
import { CheckCheck, Copy, ShieldAlert } from "lucide-react";

const statusMeta = {
  new: { label: "Ingested", cls: "bg-accent text-accent-foreground", icon: CheckCheck },
  linked: { label: "New incident", cls: "bg-medical/12 text-medical", icon: CheckCheck },
  duplicate: { label: "Merged duplicate", cls: "bg-flood/12 text-flood", icon: Copy },
  flagged: { label: "Low confidence", cls: "bg-fire/12 text-fire", icon: ShieldAlert },
} as const;

export function TweetFeed({ tweets }: { tweets: Tweet[] }) {
  return (
    <section className="panel flex h-full flex-col overflow-hidden">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold">Live Social Feed</h2>
          <p className="text-xs text-muted-foreground">Tweet Listener Agent · mock X stream</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-medium text-fire">
          <span className="relative flex size-2">
            <span className="pulse-ring absolute inset-0 rounded-full bg-fire" />
            <span className="relative size-2 rounded-full bg-fire" />
          </span>
          Live
        </span>
      </header>
      <ul className="flex-1 space-y-2 overflow-y-auto p-3">
        {tweets.map((t) => {
          const s = statusMeta[t.status];
          const Icon = s.icon;
          return (
            <li key={t.id} className="rise-in rounded-lg border border-border bg-surface p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-xs font-semibold text-foreground">{t.handle}</span>
                <span className="shrink-0 text-[11px] text-muted-foreground">{clock(t.at)}</span>
              </div>
              <p className="mt-1 text-[13px] leading-snug text-foreground/90">{t.text}</p>
              <span
                className={`mt-2 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium ${s.cls}`}
              >
                <Icon className="size-3" />
                {s.label}
              </span>
            </li>
          );
        })}
        {tweets.length === 0 && (
          <li className="p-4 text-center text-xs text-muted-foreground">Waiting for reports…</li>
        )}
      </ul>
    </section>
  );
}

export function IncidentList({
  incidents,
}: {
  incidents: { id: string; code: string; type: keyof typeof typeMeta; location: string; severity: number; headline: string; reports: number; stage: string }[];
}) {
  return (
    <section className="panel overflow-hidden">
      <header className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">Clustered Incidents</h2>
        <p className="text-xs text-muted-foreground">Deduplicated by category + location</p>
      </header>
      <ul className="max-h-[320px] divide-y divide-border overflow-y-auto">
        {incidents.map((i) => {
          const m = typeMeta[i.type];
          const Icon = m.icon;
          return (
            <li key={i.id} className="flex gap-3 px-4 py-3">
              <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${m.bg}`}>
                <Icon className={`size-4 ${m.color}`} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">{i.code}</span>
                  <span className="text-xs text-muted-foreground">{i.location}</span>
                </div>
                <p className="truncate text-[13px] text-foreground/85">{i.headline}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Severity {i.severity}/10 · {i.reports} report{i.reports > 1 ? "s" : ""} · {i.stage}
                </p>
              </div>
            </li>
          );
        })}
        {incidents.length === 0 && (
          <li className="p-4 text-center text-xs text-muted-foreground">No incidents yet.</li>
        )}
      </ul>
    </section>
  );
}
