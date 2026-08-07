import type { IncidentType, ResourceKind } from "@/lib/disaster-sim";
import { AlertTriangle, Ambulance, Car, Droplets, Flame, FlaskConical, Shield, Building2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const typeMeta: Record<IncidentType, { icon: LucideIcon; color: string; bg: string }> = {
  fire: { icon: Flame, color: "text-fire", bg: "bg-fire/10" },
  medical: { icon: Ambulance, color: "text-medical", bg: "bg-medical/10" },
  flood: { icon: Droplets, color: "text-flood", bg: "bg-flood/10" },
  collapse: { icon: Building2, color: "text-warnx", bg: "bg-warnx/10" },
  traffic: { icon: Car, color: "text-traffic", bg: "bg-traffic/10" },
  chemical: { icon: FlaskConical, color: "text-warnx", bg: "bg-warnx/10" },
  unknown: { icon: AlertTriangle, color: "text-muted-foreground", bg: "bg-muted" },
};

export const kindMeta: Record<ResourceKind, { icon: LucideIcon; color: string; label: string }> = {
  fire: { icon: Flame, color: "text-fire", label: "Fire Units" },
  ambulance: { icon: Ambulance, color: "text-medical", label: "Ambulances" },
  police: { icon: Shield, color: "text-police", label: "Police Units" },
  traffic: { icon: Car, color: "text-traffic", label: "Traffic Units" },
};

export function severityTone(severity: number) {
  if (severity >= 8) return { label: "Critical", cls: "bg-fire/12 text-fire" };
  if (severity >= 6) return { label: "High", cls: "bg-warnx/15 text-warnx" };
  if (severity >= 4) return { label: "Medium", cls: "bg-flood/12 text-flood" };
  return { label: "Low", cls: "bg-medical/12 text-medical" };
}

export const clock = (at: number) =>
  new Date(at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
