import { useState } from "react";
import { Flame, Ambulance, Shield, CheckCircle2, RotateCcw, Lock } from "lucide-react";

type ResourceRow = {
  id: string;
  unit: string;
  status: "Available" | "Deployed" | "Reserved";
  location: string;
  eta: string;
  availability: string;
};

const initialFire: ResourceRow[] = [
  { id: "f-1", unit: "Fire Engine #401", status: "Deployed", location: "Railway Station Rd", eta: "3.5m", availability: "High Demand" },
  { id: "f-2", unit: "Ladder Truck #402", status: "Deployed", location: "Railway Station Rd", eta: "3.5m", availability: "High Demand" },
  { id: "f-3", unit: "Hazmat Tender #403", status: "Available", location: "Station 4 HQ", eta: "0.0m", availability: "Ready" },
  { id: "f-4", unit: "Rescue Squad #404", status: "Reserved", location: "Station 2 Reserve", eta: "5.0m", availability: "On Standby" },
];

const initialMedical: ResourceRow[] = [
  { id: "m-1", unit: "Ambulance #104", status: "Deployed", location: "City Hospital Cross", eta: "4.2m", availability: "In Transit" },
  { id: "m-2", unit: "Ambulance #105", status: "Deployed", location: "Railway Station Rd", eta: "3.0m", availability: "In Transit" },
  { id: "m-3", unit: "ICU Transport #106", status: "Available", location: "Metro Hospital", eta: "0.0m", availability: "Ready" },
  { id: "m-4", unit: "Paramedic Van #107", status: "Available", location: "Northside Clinic", eta: "0.0m", availability: "Ready" },
];

const initialPolice: ResourceRow[] = [
  { id: "p-1", unit: "Police Patrol #201", status: "Deployed", location: "Zone 3 - Railway", eta: "2.0m", availability: "Perimeter Control" },
  { id: "p-2", unit: "Traffic Unit #202", status: "Deployed", location: "Zone 1 - Express Rd", eta: "1.5m", availability: "Signal Preempted" },
  { id: "p-3", unit: "SWAT Van #203", status: "Available", location: "Central HQ", eta: "0.0m", availability: "Ready" },
  { id: "p-4", unit: "K9 Unit #204", status: "Reserved", location: "Zone 4 - HQ", eta: "6.0m", availability: "On Standby" },
];

export function ResourcesView() {
  const [fire, setFire] = useState<ResourceRow[]>(initialFire);
  const [medical, setMedical] = useState<ResourceRow[]>(initialMedical);
  const [police, setPolice] = useState<ResourceRow[]>(initialPolice);

  const updateStatus = (
    listSetter: React.Dispatch<React.SetStateAction<ResourceRow[]>>,
    id: string,
    newStatus: "Available" | "Deployed" | "Reserved"
  ) => {
    listSetter((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const renderTable = (
    title: string,
    icon: any,
    color: string,
    data: ResourceRow[],
    listSetter: React.Dispatch<React.SetStateAction<ResourceRow[]>>
  ) => {
    const Icon = icon;
    return (
      <div className="flashcard p-5 border-purple-200">
        <div className="flex items-center gap-2 mb-4">
          <span className={`p-2 rounded-xl bg-purple-100 dark:bg-purple-900/50 ${color}`}>
            <Icon className="size-5" />
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">Fleet status &amp; direct command actions</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-purple-100 dark:border-purple-900 text-muted-foreground font-bold">
                <th className="py-2.5 px-3">Vehicle / Unit</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Current Location</th>
                <th className="py-2.5 px-3">ETA</th>
                <th className="py-2.5 px-3">Availability</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50 dark:divide-purple-950/40">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-purple-50/30 dark:hover:bg-purple-950/20 transition-all">
                  <td className="py-3 px-3 font-extrabold text-foreground">{row.unit}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        row.status === "Available"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
                          : row.status === "Deployed"
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground font-semibold">{row.location}</td>
                  <td className="py-3 px-3 font-mono font-bold text-foreground">{row.eta}</td>
                  <td className="py-3 px-3 text-muted-foreground font-medium">{row.availability}</td>
                  <td className="py-3 px-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => updateStatus(listSetter, row.id, "Deployed")}
                        className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-bold text-[11px] shadow-xs hover:bg-purple-700 active:scale-95 transition-all flex items-center gap-1"
                      >
                        <CheckCircle2 className="size-3" /> Assign
                      </button>
                      <button
                        onClick={() => updateStatus(listSetter, row.id, "Available")}
                        className="px-2.5 py-1 rounded-lg border border-border bg-card text-foreground font-semibold text-[11px] hover:bg-accent active:scale-95 transition-all flex items-center gap-1"
                      >
                        <RotateCcw className="size-3 text-muted-foreground" /> Recall
                      </button>
                      <button
                        onClick={() => updateStatus(listSetter, row.id, "Reserved")}
                        className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 font-bold text-[11px] hover:bg-amber-200 active:scale-95 transition-all flex items-center gap-1"
                      >
                        <Lock className="size-3" /> Reserve
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 rise-in">
      {renderTable("Fire Department Fleet", Flame, "text-rose-500", fire, setFire)}
      {renderTable("Medical Emergency Ambulances", Ambulance, "text-emerald-500", medical, setMedical)}
      {renderTable("Police & Traffic Security Units", Shield, "text-blue-500", police, setPolice)}
    </div>
  );
}
