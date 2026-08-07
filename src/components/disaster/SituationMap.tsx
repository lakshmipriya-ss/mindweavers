import type { Incident, Resource } from "@/lib/disaster-sim";
import { kindMeta, severityTone, typeMeta } from "./meta";

/** Stylised city map: incidents pulse, resources drift toward their scene. */
export function SituationMap({
  incidents,
  resources,
}: {
  incidents: Incident[];
  resources: Resource[];
}) {
  const active = incidents.filter((i) => i.stage !== "resolved");
  const byId = new Map(incidents.map((i) => [i.id, i]));

  return (
    <section className="panel overflow-hidden">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold">Live Situational Map</h2>
          <p className="text-xs text-muted-foreground">Shared awareness layer · all agents read this</p>
        </div>
        <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
          {[
            { k: "Fire", c: "bg-fire" },
            { k: "Medical", c: "bg-medical" },
            { k: "Flood", c: "bg-flood" },
            { k: "Traffic", c: "bg-traffic" },
          ].map(({ k, c }) => (
            <span key={k} className="flex items-center gap-1">
              <span className={`size-2 rounded-full ${c}`} />
              {k}
            </span>
          ))}
        </div>
      </header>

      <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface">
        <svg className="absolute inset-0 size-full" viewBox="0 0 100 56" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="6" height="6" patternUnits="userSpaceOnUse">
              <path d="M6 0H0V6" fill="none" stroke="var(--border)" strokeWidth="0.2" />
            </pattern>
          </defs>
          <rect width="100" height="56" fill="url(#grid)" />
          <path d="M0 40 Q 30 30 55 42 T 100 34" fill="none" stroke="var(--flood)" strokeOpacity="0.35" strokeWidth="2.5" />
          <path d="M8 0 L 20 56" stroke="var(--border)" strokeWidth="1.4" />
          <path d="M0 20 L 100 14" stroke="var(--border)" strokeWidth="1.4" />
          <path d="M60 0 L 70 56" stroke="var(--border)" strokeWidth="1.4" />
        </svg>

        {resources
          .filter((r) => r.status !== "available")
          .map((r) => {
            const target = r.incidentId ? byId.get(r.incidentId) : undefined;
            const x = target ? (r.x + target.x * 2) / 3 : r.x;
            const y = target ? (r.y + target.y * 2) / 3 : r.y;
            const m = kindMeta[r.kind];
            const Icon = m.icon;
            return (
              <span
                key={r.id}
                title={`${r.label} → ${target?.code ?? "station"}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-md border border-border bg-card p-1 shadow-panel transition-all duration-1000 ease-out"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <Icon className={`size-3.5 ${m.color}`} />
              </span>
            );
          })}

        {active.map((i) => {
          const m = typeMeta[i.type];
          const Icon = m.icon;
          return (
            <span
              key={i.id}
              title={`${i.code} · ${i.location} · severity ${i.severity}`}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${i.x}%`, top: `${i.y}%` }}
            >
              <span className={`pulse-ring absolute inset-0 rounded-full ${m.color.replace("text-", "bg-")}/50`} />
              <span
                className={`relative flex size-8 items-center justify-center rounded-full border border-border bg-card shadow-panel`}
              >
                <Icon className={`size-4 ${m.color}`} />
              </span>
              <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-card px-1.5 py-0.5 text-[10px] font-medium shadow-panel">
                {i.location}
              </span>
            </span>
          );
        })}
      </div>
    </section>
  );
}

export function DispatchLog({ incidents }: { incidents: Incident[] }) {
  const rows = incidents.flatMap((i) => i.dispatches.map((d) => ({ i, d }))).slice(0, 8);
  return (
    <section className="panel overflow-hidden">
      <header className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">Explainable Dispatch Log</h2>
        <p className="text-xs text-muted-foreground">Every deployment carries its rationale</p>
      </header>
      <ul className="max-h-[340px] divide-y divide-border overflow-y-auto">
        {rows.map(({ i, d }) => {
          const m = kindMeta[d.kind];
          const Icon = m.icon;
          const tone = severityTone(i.severity);
          return (
            <li key={d.id} className="px-4 py-3">
              <div className="flex items-center gap-2">
                <Icon className={`size-4 ${m.color}`} />
                <span className="text-[13px] font-semibold">{d.label}</span>
                <span className="text-xs text-muted-foreground">→ {i.code} · {i.location}</span>
                <span className={`ml-auto rounded-md px-1.5 py-0.5 text-[11px] font-medium ${tone.cls}`}>
                  {tone.label}
                </span>
              </div>
              <ul className="mt-1.5 space-y-0.5 pl-6">
                {d.reason.map((r) => (
                  <li key={r} className="text-[11px] text-muted-foreground">• {r}</li>
                ))}
              </ul>
            </li>
          );
        })}
        {rows.length === 0 && (
          <li className="p-4 text-center text-xs text-muted-foreground">No dispatches yet.</li>
        )}
      </ul>
    </section>
  );
}
