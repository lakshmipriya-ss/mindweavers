import { useState } from "react";
import { AlertTriangle, Flame, ShieldAlert, Ambulance, MapPin, Clock, Building2, CheckCircle2, ChevronRight } from "lucide-react";

type IncidentDetailItem = {
  id: string;
  code: string;
  type: string;
  severity: number;
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
    id: "inc-101",
    code: "INC-4021",
    type: "Structural Fire",
    severity: 9,
    time: "12:44 PM",
    status: "Active Suppression & Evacuation",
    location: "Vijayawada Railway Station Platform 3",
    assignedFire: ["Engine Unit #401", "Ladder Truck #402"],
    assignedMedical: ["Ambulance #104", "Ambulance #105"],
    assignedPolice: ["Police Squad #201"],
    recommendedHospital: "City General Hospital Trauma Unit",
    etaCompletion: "8 minutes",
    aiReasoning: [
      "Tweet Listener ingested report of heavy smoke on platform 3 with 0.94 confidence.",
      "Fire Agent rated structural risk at Severity 9 due to wood concourse roof.",
      "Medical Agent reserved 6 ICU beds at City General Trauma Center.",
      "Traffic Agent preempted Signal #14 to green on Station Road for zero-delay ambulance transit.",
    ],
  },
  {
    id: "inc-102",
    code: "INC-4022",
    type: "Multi-Vehicle Collision",
    severity: 7,
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
  const defaultInc: IncidentDetailItem = sampleIncidents[0]!;
  const [selectedInc, setSelectedInc] = useState<IncidentDetailItem>(defaultInc);

  return (
    <div className="grid gap-6 lg:grid-cols-12 rise-in font-sans">
      {/* Incident Selector List */}
      <div className="lg:col-span-4 space-y-3">
        <div className="flashcard p-4">
          <h2 className="text-sm font-extrabold text-foreground flex items-center gap-2">
            <AlertTriangle className="size-4 text-purple-600" /> Select Incident for Deep Dive
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Active triage records</p>
        </div>

        <div className="space-y-2.5">
          {incidents.map((inc) => {
            const isSelected = selectedInc.id === inc.id;
            return (
              <div
                key={inc.id}
                onClick={() => setSelectedInc(inc)}
                className={`flashcard p-4 cursor-pointer transition-all ${
                  isSelected
                    ? "border-purple-500 bg-purple-50/40 dark:bg-purple-950/30 ring-2 ring-purple-400/30"
                    : "hover:border-purple-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-extrabold text-purple-700 dark:text-purple-300">{inc.code}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700">
                    Sev {inc.severity}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-foreground mt-1">{inc.type}</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">📍 {inc.location}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Incident Deep Dive Inspector */}
      <div className="lg:col-span-8 space-y-5">
        <div className="flashcard p-5 border-purple-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between border-b border-purple-100 dark:border-purple-900 pb-3 gap-2">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-purple-600">{selectedInc.code} Inspector</span>
              <h2 className="text-base font-extrabold text-foreground flex items-center gap-2 mt-0.5">
                <Flame className="size-5 text-rose-600" /> {selectedInc.type} — {selectedInc.location}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-700">
              {selectedInc.status}
            </span>
          </div>

          {/* Assigned Units */}
          <div className="grid gap-3 sm:grid-cols-3 text-xs font-semibold">
            <div className="p-3.5 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900 space-y-1">
              <span className="text-muted-foreground font-bold flex items-center gap-1"><Flame className="size-3.5 text-rose-500" /> Fire Units</span>
              {selectedInc.assignedFire.map((u) => (
                <p key={u} className="font-extrabold text-foreground">{u}</p>
              ))}
            </div>
            <div className="p-3.5 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900 space-y-1">
              <span className="text-muted-foreground font-bold flex items-center gap-1"><Ambulance className="size-3.5 text-emerald-500" /> Medical Units</span>
              {selectedInc.assignedMedical.map((u) => (
                <p key={u} className="font-extrabold text-foreground">{u}</p>
              ))}
            </div>
            <div className="p-3.5 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900 space-y-1">
              <span className="text-muted-foreground font-bold flex items-center gap-1"><ShieldAlert className="size-3.5 text-blue-500" /> Police Squads</span>
              {selectedInc.assignedPolice.map((u) => (
                <p key={u} className="font-extrabold text-foreground">{u}</p>
              ))}
            </div>
          </div>

          {/* AI Reasoning Panel */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50/50 via-card to-purple-50/30 dark:from-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-2">
            <h4 className="text-xs font-extrabold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-purple-600" /> AI Recommendation Reasoning Chain
            </h4>
            <ul className="space-y-1.5 text-xs text-foreground/90 font-medium pl-1">
              {selectedInc.aiReasoning.map((r, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <ChevronRight className="size-3.5 text-purple-500 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
