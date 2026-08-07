import React from "react";
import { Stethoscope, HeartPulse, BedDouble, Truck, Activity, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export function MedicalIntelligenceView() {
  const hospitals = [
    { name: "City General Hospital & Trauma Center", totalBeds: 450, availableBeds: 62, icuBeds: 8, status: "High Occupancy", dist: "1.4 km" },
    { name: "Metro Health Medical Institute", totalBeds: 320, availableBeds: 114, icuBeds: 24, status: "Optimal Capacity", dist: "3.2 km" },
    { name: "St. Jude Emergency Pavilion", totalBeds: 280, availableBeds: 45, icuBeds: 5, status: "Critical Triage", dist: "4.8 km" },
    { name: "Northside Community Hospital", totalBeds: 190, availableBeds: 78, icuBeds: 14, status: "Receiving Patients", dist: "7.1 km" },
  ];

  const triageQueue = [
    { id: "PAT-8091", severity: "Red (Immediate)", condition: "Severe Smoke Inhalation & Fractures", location: "Grand Central Plaza", eta: "4m", unit: "EMS-04" },
    { id: "PAT-8092", severity: "Yellow (Delayed)", condition: "Second-degree Burn & Lacerations", location: "Downtown Sector 4", eta: "8m", unit: "EMS-02" },
    { id: "PAT-8093", severity: "Red (Immediate)", condition: "Traumatic Chest Contusion", location: "Interstate 95 Mile 12", eta: "11m", unit: "EMS-07" },
    { id: "PAT-8094", severity: "Green (Minor)", condition: "Mild Dehydration & Abrasion", location: "Sector 7 Shelter", eta: "15m", unit: "EMS-01" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Stethoscope className="size-6 text-medical" /> Medical Intelligence & Hospital Operations
          </h2>
          <p className="text-xs text-muted-foreground">
            Real-time emergency triage status, trauma bed availability, and field ambulance dispatch routing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
            <Activity className="size-3.5 animate-pulse" /> Live Telemetry Synced
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="panel p-4 space-y-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
            <BedDouble className="size-4 text-medical" /> Total Available Beds
          </span>
          <div className="text-2xl font-bold tracking-tight">299</div>
          <p className="text-[11px] text-emerald-600 font-medium">Across 4 regional trauma centers</p>
        </div>

        <div className="panel p-4 space-y-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
            <HeartPulse className="size-4 text-rose-500" /> ICU Capacity
          </span>
          <div className="text-2xl font-bold tracking-tight">51 Beds</div>
          <p className="text-[11px] text-amber-600 font-medium">18 beds reserved for red triage</p>
        </div>

        <div className="panel p-4 space-y-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
            <Truck className="size-4 text-primary" /> Active Ambulances
          </span>
          <div className="text-2xl font-bold tracking-tight">14 / 18</div>
          <p className="text-[11px] text-primary font-medium">Avg response ETA: 3.4 mins</p>
        </div>

        <div className="panel p-4 space-y-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
            <ShieldCheck className="size-4 text-emerald-600" /> Survival Rating
          </span>
          <div className="text-2xl font-bold tracking-tight">98.4%</div>
          <p className="text-[11px] text-emerald-600 font-medium">+2.1% via AI green corridors</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel p-5 space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <BedDouble className="size-4 text-medical" /> Regional Hospital Bed Occupancy
          </h3>

          <div className="space-y-3">
            {hospitals.map((h, i) => {
              const pct = Math.round(((h.totalBeds - h.availableBeds) / h.totalBeds) * 100);
              return (
                <div key={i} className="rounded-xl border border-border/80 bg-surface p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">{h.name}</span>
                    <span className="text-muted-foreground">{h.dist} away</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Occupancy: {pct}%</span>
                    <span className="font-medium text-emerald-600">{h.availableBeds} free ({h.icuBeds} ICU)</span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full transition-all ${pct > 85 ? "bg-rose-500" : pct > 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel p-5 space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <HeartPulse className="size-4 text-rose-500" /> Active Emergency Triage Evacuation Queue
          </h3>

          <div className="space-y-3">
            {triageQueue.map((item, i) => (
              <div key={i} className="flex items-start justify-between rounded-xl border border-border bg-card p-3.5 text-xs shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{item.id}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      item.severity.includes("Red") ? "bg-rose-100 text-rose-700 border border-rose-200" :
                      item.severity.includes("Yellow") ? "bg-amber-100 text-amber-700 border border-amber-200" :
                      "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    }`}>
                      {item.severity}
                    </span>
                  </div>
                  <p className="font-medium text-foreground">{item.condition}</p>
                  <p className="text-[11px] text-muted-foreground">Location: {item.location}</p>
                </div>

                <div className="text-right space-y-1">
                  <span className="inline-block rounded-lg bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                    ETA: {item.eta}
                  </span>
                  <p className="text-[11px] text-muted-foreground">{item.unit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
