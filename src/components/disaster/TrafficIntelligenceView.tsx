import React from "react";
import { Navigation, Route, AlertOctagon, ShieldAlert, CheckCircle2, Car, ShieldCheck } from "lucide-react";

export function TrafficIntelligenceView() {
  const corridors = [
    { name: "Corridor Alpha (Interstate 95 -> City General)", status: "Active Green Light Priority", flowRate: "94% clear", distance: "6.2 km", timeSaved: "11 mins" },
    { name: "Corridor Beta (Grand Central Plaza -> Metro Health)", status: "Active Green Light Priority", flowRate: "88% clear", distance: "3.4 km", timeSaved: "7 mins" },
    { name: "Corridor Gamma (Industrial Zone -> St. Jude)", status: "Diverted / Heavy Debris", flowRate: "52% bottleneck", distance: "8.1 km", timeSaved: "2 mins" },
  ];

  const closures = [
    { road: "Main Street & 5th Avenue Intersection", cause: "Debris & Fallen High-Voltage Line", divert: "Reroute via 7th Boulevard", severity: "Closed" },
    { road: "North Highway Bridge Crossing", cause: "Rising Floodwater Level", divert: "Use South Bypass Overpass", severity: "Closed" },
    { road: "Commercial Avenue Exit 14", cause: "Emergency Cordon / Active Police Perimeter", divert: "Authorized Vehicles Only", severity: "Restricted" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Navigation className="size-6 text-traffic" /> Traffic Intelligence & Green Corridors
          </h2>
          <p className="text-xs text-muted-foreground">
            Dynamic emergency green corridors, signal preemptions, road closure diversions, and transit priority logistics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 border border-amber-200">
            <Car className="size-3.5" /> 14 Smart Signals Preempted
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel p-5 space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Route className="size-4 text-traffic" /> Emergency Green Express Corridors
          </h3>

          <div className="space-y-3">
            {corridors.map((c, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">{c.name}</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-800 border border-emerald-200">
                    {c.flowRate}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Status: <strong className="text-foreground">{c.status}</strong></span>
                  <span className="font-medium text-primary">Saved {c.timeSaved}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-5 space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <AlertOctagon className="size-4 text-rose-500" /> Active Road Closures & Automated Detours
          </h3>

          <div className="space-y-3">
            {closures.map((cl, i) => (
              <div key={i} className="rounded-xl border border-border bg-surface p-4 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">{cl.road}</span>
                  <span className="rounded bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                    {cl.severity}
                  </span>
                </div>
                <p className="text-muted-foreground">Reason: {cl.cause}</p>
                <p className="font-semibold text-primary flex items-center gap-1">
                  <ShieldCheck className="size-3 text-emerald-600" /> Recommended Detour: {cl.divert}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
