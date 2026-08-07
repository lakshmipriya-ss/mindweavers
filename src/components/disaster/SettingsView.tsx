import React, { useState, useEffect } from "react";
import { Settings, Server, Cpu, Database, RefreshCcw, CheckCircle2, XCircle, Sliders } from "lucide-react";
import { checkBackendHealth } from "@/lib/api";

export function SettingsView() {
  const [backendUrl, setBackendUrl] = useState("http://localhost:8000");
  const [model, setModel] = useState("phi3.5:latest");
  const [intervalMs, setIntervalMs] = useState("3000");
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking");

  const verifyHealth = async () => {
    setBackendStatus("checking");
    const ok = await checkBackendHealth(backendUrl);
    setBackendStatus(ok ? "online" : "offline");
  };

  useEffect(() => {
    verifyHealth();
  }, [backendUrl]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="size-6 text-primary" /> System Settings & Mindweavers Config
        </h2>
        <p className="text-xs text-muted-foreground">
          Configure API endpoints, LLM model parameters, feed simulation intervals, and historical dataset bindings.
        </p>
      </div>

      <div className="panel p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2 border-b border-border pb-2">
            <Server className="size-4 text-primary" /> FastAPI Backend Connection
          </h3>

          <div className="grid gap-4 sm:grid-cols-3 items-center">
            <label className="text-xs font-semibold text-foreground sm:col-span-1">
              Backend Endpoint URL
            </label>
            <div className="sm:col-span-2 flex gap-2">
              <input
                type="text"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                className="flex-1 rounded-xl border border-border bg-card px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
              />
              <button
                onClick={verifyHealth}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-accent"
              >
                <RefreshCcw className="size-3.5" /> Re-check
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-surface p-3 border border-border text-xs">
            <span className="font-semibold text-muted-foreground">Backend Status:</span>
            {backendStatus === "checking" && <span className="text-amber-600 font-semibold">Checking...</span>}
            {backendStatus === "online" && (
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="size-4" /> Connected to FastAPI (http://localhost:8000)
              </span>
            )}
            {backendStatus === "offline" && (
              <span className="flex items-center gap-1 text-rose-600 font-semibold">
                <XCircle className="size-4" /> Offline (Using built-in client-side multi-agent simulation)
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2 border-b border-border pb-2">
            <Cpu className="size-4 text-primary" /> Neural LLM Orchestration
          </h3>

          <div className="grid gap-4 sm:grid-cols-3 items-center">
            <label className="text-xs font-semibold text-foreground sm:col-span-1">
              Active LLM Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="sm:col-span-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
            >
              <option value="phi3.5:latest">Ollama - phi3.5:latest (Recommended)</option>
              <option value="llama3:latest">Ollama - Llama 3 8B</option>
              <option value="gpt-4o-mini">OpenAI - GPT-4o Mini (Cloud)</option>
              <option value="rule-based-mock">Rule-Based Multi-Agent Fallback Simulator</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2 border-b border-border pb-2">
            <Sliders className="size-4 text-primary" /> Feed Simulation Controls
          </h3>

          <div className="grid gap-4 sm:grid-cols-3 items-center">
            <label className="text-xs font-semibold text-foreground sm:col-span-1">
              Social Feed Update Speed (ms)
            </label>
            <select
              value={intervalMs}
              onChange={(e) => setIntervalMs(e.target.value)}
              className="sm:col-span-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
            >
              <option value="1500">1.5 seconds (Fast Triage)</option>
              <option value="3000">3.0 seconds (Balanced Standard)</option>
              <option value="5000">5.0 seconds (Slow Observation)</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2 border-b border-border pb-2">
            <Database className="size-4 text-primary" /> Historical Post-Mortem Datasets
          </h3>

          <div className="rounded-xl bg-surface p-3.5 border border-border text-xs space-y-1">
            <p className="font-semibold text-foreground">Loaded Dataset: historical_analysis_dataset.csv</p>
            <p className="text-muted-foreground">
              Contains post-mortem reviews from past disaster responses. Lessons are automatically injected into agent prompt context to optimize dispatch strategies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
