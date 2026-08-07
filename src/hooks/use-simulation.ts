import { useCallback, useEffect, useRef, useState } from "react";
import { emptyState, step, type SimState, type IncidentType, type Incident } from "@/lib/disaster-sim";

export function useSimulation(intervalMs = 3000) {
  const [state, setState] = useState<SimState>(() => emptyState());
  const [running, setRunning] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback(() => setState((s) => step(s)), []);

  useEffect(() => {
    if (!running) return;
    advance();
    timer.current = setInterval(advance, intervalMs);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, intervalMs, advance]);

  const reset = useCallback(() => setState(emptyState()), []);

  const injectIncident = useCallback(
    (payload: { handle: string; text: string; location: string; type: string; severity: number }) => {
      setState((prev) => {
        const id = `inc-${Date.now()}`;
        let mappedType: IncidentType = "fire";
        const tLower = payload.type.toLowerCase();
        if (tLower.includes("flood")) mappedType = "flood";
        else if (tLower.includes("medical") || tLower.includes("accident")) mappedType = "medical";
        else if (tLower.includes("collapse")) mappedType = "collapse";
        else if (tLower.includes("traffic")) mappedType = "traffic";
        else if (tLower.includes("chemical") || tLower.includes("leak")) mappedType = "chemical";

        const newTweet = {
          id: `tw-${Date.now()}`,
          handle: payload.handle,
          text: payload.text,
          at: Date.now(),
          status: "new" as const,
          incidentId: id,
        };

        const newIncident: Incident = {
          id,
          code: `INC-${Math.floor(100 + Math.random() * 900)}`,
          type: mappedType,
          location: payload.location,
          x: Math.floor(15 + Math.random() * 70),
          y: Math.floor(15 + Math.random() * 70),
          severity: payload.severity,
          confidence: 0.95,
          headline: payload.text.slice(0, 50) + "...",
          reports: 1,
          stage: "detected" as const,
          createdAt: Date.now(),
          dispatches: [],
          injured: 2,
        };

        return {
          ...prev,
          tick: prev.tick + 1,
          incidents: [newIncident, ...prev.incidents],
          tweets: [newTweet, ...prev.tweets],
        };
      });
    },
    []
  );

  return { state, running, setRunning, advance, reset, injectIncident };
}
