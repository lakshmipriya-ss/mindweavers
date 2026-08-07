import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: true,
  theme: "default",
  securityLevel: "loose",
});

export const Mermaid = ({ chart }: { chart: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && chart) {
      ref.current.removeAttribute("data-processed");
      ref.current.innerHTML = chart;
      try {
        mermaid.contentLoaded();
      } catch (e) {
        console.error("Mermaid parsing error", e);
      }
    }
  }, [chart]);

  return <div className="mermaid overflow-x-auto p-4 bg-white/50 rounded-xl my-2" ref={ref}>{chart}</div>;
};
