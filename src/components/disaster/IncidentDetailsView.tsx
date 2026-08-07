import { useState } from "react";
import { AlertTriangle, ShieldCheck, Flame, Ambulance, Shield, Building2, CheckCircle2, Clock, MapPin, Users } from "lucide-react";

type IncidentDetailItem = {
  id: string;
  type: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  severity: number;
  victims: number;
  time: string;
  status: string;
  location: string;
  assignedFire: string[];
  assignedMedical: string[];
  assignedPolice: string[];
  recommendedHospital: string;
  etaCompletion: string;
  aiReasoning: string[];
};

const sampleIncidents: IncidentDetailItem[] = [
  {
    id: "INC-2026-081",
    type: "Fire & Structure Collapse",
    priority: "CRITICAL",
    severity: 9,
    victims: 14,
    time: "12:42 PM",
    status: "Units Dispatched & Active",
    location: "Central Railway Station Platform 3",
    assignedFire: ["Engine #401", "Ladder #402"],
    assignedMedical: ["Ambulance #104", "Ambulance #105"],
    assignedPolice: ["Police Patrol #201", "Traffic Unit #202"],
    recommendedHospital: "City General Trauma Center",
    etaCompletion: "18 minutes",
    aiReasoning: [
      "Fire severity is rated CRITICAL (9/10) due to multistory commercial density.",
      "Station 4 (Nearest Fire Station) has 2 available trucks with 3.5m ETA.",
      "City General Hospital has 14 available ICU beds and Red-Triage capacity.",
      "Traffic Agent recommends Route B via Station Express Road with signal preemption.",
      "Coordinator Agent autonomously approved emergency dispatch.",
    ],
  },
  {
    id: "INC-2026-082",
    type: "Multi-Vehicle Collision",
    priority: "HIGH",
    severity: 7,
    victims: 6,
    time: "12:45 PM",
    status: "Medical Triage En Route",
    location: "City Hospital Crossing",
    assignedFire: ["Rescue Tender #403"],
    assignedMedical: ["Ambulance #106"],
    assignedPolice: ["Police Patrol #203"],
    recommendedHospital: "St. Jude Regional Hospital",
    etaCompletion: "12 minutes",
    aiReasoning: [
      "Incident severity rated HIGH (7/10) with 6 injured casualties.",
      "Paramedic Crew from Station 1 dispatched via Express Corridor.",
      "St. Jude Regional Hospital confirmed 8 trauma beds open.",
      "Police established perimeter to clear rubbernecking congestion.",
    ],
  },
];

export function IncidentDetailsView() {
  const [incidents] = useState<IncidentDetailItem[]>(sampleIncidents);
  const [selectedInc, setSelectedInc] = useState<IncidentDetailItem>(sampleIncidents[0]);

  return (
    <div className="grid gap-6 lg:grid-cols-12 rise-in">
      {/* Incident Selector List */}
      <div className="lg:col-span-4 space-y-3">
        <div className="flashcard p-4">
          <h2 className="text-sm font-extrabold text-foreground flex items-center gap-2">
            <AlertTriangle className="size-4 text-purple-600" /> Select Incident for Deep Dive
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Active triage records</p>
        </div>

        {incidents.map((inc) => {
          const isSelected = selectedInc.id === inc.id;
          return (
            <div
              key={inc.id}
              onClick={() => setSelectedInc(inc)}
              className={`flashcard p-4 cursor-pointer transition-all ${
                isSelected
                  ? "border-purple-500 bg-purple-50/40 dark:bg-purple-950/30 shadow-md ring-2 ring-purple-400/30"
                  : "hover:border-purple-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-extrabold text-purple-600">{inc.id}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${inc.priority === "CRITICAL" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>
                  {inc.priority}
                </span>
              </div>
              <p className="mt-2 text-xs font-bold text-foreground">{inc.type}</p>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-muted-foreground">
                <MapPin className="size-3 text-purple-500" /> {inc.location}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Incident Details Inspector */}
      <div className="lg:col-span-8 space-y-6">
        {/* Main Details Flashcard */}
        <div className="flashcard p-6 border-purple-200 space-y-6">
          <div className="flex items-center justify-between border-b border-purple-100 pb-4 dark:border-purple-900">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-foreground">{selectedInc.id}</span>
                <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-700">
                  Priority: {selectedInc.priority}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                <MapPin className="size-3.5 text-purple-600" /> {selectedInc.location} · Reported {selectedInc.time}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground block font-medium">Severity Score</span>
              <span className="text-2xl font-extrabold text-rose-600">{selectedInc.severity} / 10</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900">
              <span className="text-muted-foreground font-semibold flex items-center gap-1">
                <Users className="size-3.5 text-purple-600" /> Victims Affected
              </span>
              <p className="text-base font-extrabold text-foreground mt-1">{selectedInc.victims} Estimated</p>
            </div>
            <div className="p-3.5 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900">
              <span className="text-muted-foreground font-semibold flex items-center gap-1">
                <Clock className="size-3.5 text-purple-600" /> Est. Completion
              </span>
              <p className="text-base font-extrabold text-foreground mt-1">{selectedInc.etaCompletion}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900">
              <span className="text-muted-foreground font-semibold flex items-center gap-1">
                <Building2 className="size-3.5 text-purple-600" /> Recommended Hospital
              </span>
              <p className="text-xs font-extrabold text-foreground mt-1 truncate">{selectedInc.recommendedHospital}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900">
              <span className="text-muted-foreground font-semibold flex items-center gap-1">
                <CheckCircle2 className="size-3.5 text-emerald-600" /> Current Status
              </span>
              <p className="text-xs font-extrabold text-emerald-600 mt-1 truncate">{selectedInc.status}</p>
            </div>
          </div>

          {/* Assigned Units Breakdown */}
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 dark:bg-rose-950/20">
              <h4 className="font-extrabold text-rose-700 flex items-center gap-1.5 mb-2">
                <Flame className="size-4" /> Fire Department Units
              </h4>
              <ul className="space-y-1 font-semibold text-foreground">
                {selectedInc.assignedFire.map((u) => (
                  <li key={u} className="flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-rose-500" /> {u}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 dark:bg-emerald-950/20">
              <h4 className="font-extrabold text-emerald-700 flex items-center gap-1.5 mb-2">
                <Ambulance className="size-4" /> Medical Ambulances
              </h4>
              <ul className="space-y-1 font-semibold text-foreground">
                {selectedInc.assignedMedical.map((u) => (
                  <li key={u} className="flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-emerald-500" /> {u}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 dark:bg-blue-950/20">
              <h4 className="font-extrabold text-blue-700 flex items-center gap-1.5 mb-2">
                <Shield className="size-4" /> Police &amp; Traffic Units
              </h4>
              <ul className="space-y-1 font-semibold text-foreground">
                {selectedInc.assignedPolice.map((u) => (
                  <li key={u} className="flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-blue-500" /> {u}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* AI Recommendation Panel */}
        <div className="flashcard p-6 border-purple-200 bg-gradient-to-br from-card via-purple-50/30 to-purple-100/20 dark:to-purple-950/30">
          <h3 className="text-base font-extrabold text-foreground flex items-center gap-2 mb-2">
            <ShieldCheck className="size-5 text-purple-600" /> AI Recommendation Reasoning Panel
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Autonomous chain-of-thought explanation generated by Multi-Agent Coordinator</p>

          <div className="space-y-3">
            {selectedInc.aiReasoning.map((step, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-card border border-purple-100 dark:border-purple-900 flex items-start gap-3 shadow-xs">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white font-extrabold text-xs">
                  {idx + 1}
                </span>
                <p className="text-xs font-bold text-foreground leading-relaxed pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
