export interface BackendIncidentResult {
  incident_type: string;
  severity: string;
  location: string;
  strategic_priority: string;
  department_responses?: Record<string, any>;
  historical_lessons?: string;
  flowchart_mermaid?: string;
  latitude?: number;
  longitude?: number;
}

const DEFAULT_API_BASE = "http://localhost:8000";

export async function checkBackendHealth(baseUrl = DEFAULT_API_BASE): Promise<boolean> {
  try {
    const res = await fetch(`${baseUrl}/health`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function processIncidentWithBackend(
  tweetText: string,
  baseUrl = DEFAULT_API_BASE
): Promise<BackendIncidentResult | null> {
  try {
    const res = await fetch(`${baseUrl}/process_incident`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: Date.now().toString(), text: tweetText }),
      signal: AbortSignal.timeout(600000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn("Backend API request failed, falling back to local multi-agent simulator.", err);
    return null;
  }
}

export async function fetchHistoricalLessons(baseUrl = DEFAULT_API_BASE): Promise<string> {
  try {
    const res = await fetch(`${baseUrl}/historical_lessons`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return "";
    const data = await res.json();
    return data.lessons || "";
  } catch {
    return "- Structural Fire: Check hydrant pressure in Sector 4 before deploying heavy ladders.\n- Flash Flood: Activate elevated highway to prevent ambulance gridlock.\n- Hazmat Spill: Deploy Level-A chemical suits before civilian extraction.";
  }
}
