import { useMemo } from "react";
import type { Incident, Resource } from "@/lib/disaster-sim";
import { kindMeta, typeMeta } from "./meta";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { renderToString } from "react-dom/server";

// Generic Chennai Metro bounding box to map arbitrary 0-100 x/y coordinates to real GPS
const CHENNAI_BOUNDS = { minLat: 12.90, maxLat: 13.15, minLng: 80.15, maxLng: 80.35 };
const CENTER_LAT = (CHENNAI_BOUNDS.minLat + CHENNAI_BOUNDS.maxLat) / 2;
const CENTER_LNG = (CHENNAI_BOUNDS.minLng + CHENNAI_BOUNDS.maxLng) / 2;

function getLatLng(x: number, y: number): [number, number] {
  const lat = CHENNAI_BOUNDS.maxLat - (y / 100) * (CHENNAI_BOUNDS.maxLat - CHENNAI_BOUNDS.minLat);
  const lng = CHENNAI_BOUNDS.minLng + (x / 100) * (CHENNAI_BOUNDS.maxLng - CHENNAI_BOUNDS.minLng);
  return [lat, lng];
}

const createCustomIcon = (IconComponent: any, colorClass: string, isPulsing: boolean) => {
  // Map Tailwind color classes to hex for inline styling since Tailwind classes might not render perfectly in pure string HTML outside React tree context
  let colorHex = "#94a3b8"; // default slate
  if (colorClass.includes("fire") || colorClass.includes("rose")) colorHex = "#f43f5e";
  else if (colorClass.includes("medical") || colorClass.includes("emerald")) colorHex = "#10b981";
  else if (colorClass.includes("flood") || colorClass.includes("cyan")) colorHex = "#06b6d4";
  else if (colorClass.includes("traffic") || colorClass.includes("amber")) colorHex = "#f59e0b";
  else if (colorClass.includes("police") || colorClass.includes("blue")) colorHex = "#3b82f6";

  const svgString = renderToString(<IconComponent size={16} color={colorHex} />);
  
  const pulseHtml = isPulsing 
    ? `<div style="position: absolute; inset: 0; border-radius: 50%; background-color: ${colorHex}; opacity: 0.3; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` 
    : "";

  return L.divIcon({
    className: "custom-leaflet-icon",
    html: `
      <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        ${pulseHtml}
        <div style="position: relative; z-index: 10; width: 32px; height: 32px; border-radius: 50%; background-color: #0f111a; border: 2px solid #1e293b; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);">
          ${svgString}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

export function SituationMap({
  incidents,
  resources,
}: {
  incidents: Incident[];
  resources: Resource[];
}) {
  const active = incidents.filter((i) => i.stage !== "resolved");
  const byId = useMemo(() => new Map(incidents.map((i) => [i.id, i])), [incidents]);

  return (
    <section className="panel overflow-hidden flex flex-col h-full border border-purple-900/40">
      <header className="flex items-center justify-between border-b border-border px-4 py-3 bg-card shrink-0">
        <div>
          <h2 className="text-sm font-semibold">Live Situational Map</h2>
          <p className="text-xs text-muted-foreground">Chennai Regional Command Center</p>
        </div>
        <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
          {[
            { k: "Fire", c: "bg-fire" },
            { k: "Medical", c: "bg-medical" },
            { k: "Flood", c: "bg-flood" },
            { k: "Traffic", c: "bg-traffic" },
          ].map(({ k, c }) => (
            <span key={k} className="flex items-center gap-1 font-semibold">
              <span className={`size-2 rounded-full ${c}`} />
              {k}
            </span>
          ))}
        </div>
      </header>

      <div className="relative w-full flex-1 z-0 bg-[#0a0a0a]">
        <MapContainer 
          center={[CENTER_LAT, CENTER_LNG]} 
          zoom={12} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          attributionControl={false}
        >
          {/* High-tech Dark Mode Map Tiles */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Render Active Incidents */}
          {active.map((i) => {
            const m = typeMeta[i.type];
            const icon = createCustomIcon(m.icon, m.color, true);
            const pos = getLatLng(i.x, i.y);

            return (
              <Marker key={`inc-${i.id}`} position={pos} icon={icon}>
                <Tooltip direction="top" offset={[0, -20]} opacity={1} className="custom-tooltip">
                  <div className="font-sans text-xs">
                    <strong className="block text-sm mb-1">{i.location}</strong>
                    <span className="block text-slate-400">{i.code} • Severity {i.severity}/10</span>
                  </div>
                </Tooltip>
              </Marker>
            );
          })}

          {/* Render Deployed Resources */}
          {resources
            .filter((r) => r.status !== "available")
            .map((r) => {
              const target = r.incidentId ? byId.get(r.incidentId) : undefined;
              const x = target ? (r.x + target.x * 2) / 3 : r.x;
              const y = target ? (r.y + target.y * 2) / 3 : r.y;
              const pos = getLatLng(x, y);
              
              const m = kindMeta[r.kind];
              const icon = createCustomIcon(m.icon, m.color, false);

              return (
                <Marker key={`res-${r.id}`} position={pos} icon={icon}>
                  <Tooltip direction="bottom" offset={[0, 20]} opacity={1}>
                    <div className="font-sans text-xs font-semibold">
                      {r.label} {target ? `→ ${target.code}` : "(Patrol)"}
                    </div>
                  </Tooltip>
                </Marker>
              );
            })}
        </MapContainer>

        {/* Global style overrides for Leaflet Tooltips to match dark theme */}
        <style dangerouslySetInnerHTML={{__html: `
          .leaflet-tooltip {
            background-color: #12141D !important;
            border: 1px solid #334155 !important;
            color: #f8fafc !important;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5) !important;
            border-radius: 8px !important;
          }
          .leaflet-tooltip-top:before {
            border-top-color: #334155 !important;
          }
          .leaflet-tooltip-bottom:before {
            border-bottom-color: #334155 !important;
          }
          @keyframes ping {
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }
        `}} />
      </div>
    </section>
  );
}

export function DispatchLog({ incidents }: { incidents: Incident[] }) {
  const rows = incidents.flatMap((i) => i.dispatches.map((d) => ({ i, d }))).slice(0, 8);
  return (
    <section className="panel flex flex-col h-full border border-purple-900/40">
      <header className="border-b border-border px-4 py-3 shrink-0">
        <h2 className="text-sm font-semibold">Dispatch Activity</h2>
      </header>
      <div className="flex-1 overflow-auto p-2 space-y-1">
        {rows.map(({ i, d }, idx) => (
          <div key={idx} className="flex items-center gap-3 rounded hover:bg-white/5 px-2 py-1.5 transition-colors">
            <span className="flex-1 truncate text-xs font-medium">{d.label}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest px-2 py-0.5 rounded-full bg-surface border border-border">
              {d.station} → {i.code}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
