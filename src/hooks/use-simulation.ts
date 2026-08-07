import { useCallback, useEffect, useRef, useState } from "react";
import { emptyState, step, type SimState } from "@/lib/disaster-sim";

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

  return { state, running, setRunning, advance, reset };
}
