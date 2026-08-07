/**
 * DisasterFlow simulation engine.
 *
 * A rule-based multi-agent pipeline that runs entirely in the browser:
 *   Tweet Listener -> Classification -> Location -> Severity -> Dedupe/Trust
 *   -> Fire / Medical / Police / Traffic agents -> Coordinator -> Dispatch
 *
 * Every agent emits a structured message with an explainable rationale so the
 * dashboard can render true agent-to-agent communication.
 */

export type IncidentType = "fire" | "medical" | "flood" | "collapse" | "traffic" | "chemical" | "unknown";

export type AgentId =
  | "listener"
  | "classifier"
  | "geo"
  | "severity"
  | "fire"
  | "medical"
  | "police"
  | "traffic"
  | "coordinator";

export type ResourceKind = "fire" | "ambulance" | "police" | "traffic";

export type Tweet = {
  id: string;
  handle: string;
  text: string;
  at: number;
  status: "new" | "linked" | "duplicate" | "flagged";
  incidentId?: string;
};

export type Dispatch = {
  id: string;
  resourceId: string;
  kind: ResourceKind;
  label: string;
  station: string;
  etaMin: number;
  reason: string[];
};

export type IncidentStage = "detected" | "analyzed" | "allocated" | "dispatched" | "resolved";

export type Incident = {
  id: string;
  code: string;
  type: IncidentType;
  location: string;
  x: number; // map percentage
  y: number;
  severity: number; // 1-10
  confidence: number; // 0-1
  headline: string;
  reports: number;
  stage: IncidentStage;
  createdAt: number;
  dispatches: Dispatch[];
  injured: number;
};

export type AgentMessage = {
  id: string;
  from: AgentId;
  to: AgentId | "all";
  text: string;
  reason?: string[] | undefined;
  incidentId?: string | undefined;
  at: number;
  tone: "info" | "action" | "warn" | "ok";
};

export type Resource = {
  id: string;
  kind: ResourceKind;
  label: string;
  station: string;
  x: number;
  y: number;
  status: "available" | "enroute" | "onsite";
  incidentId?: string | undefined;
};

export type SimState = {
  tweets: Tweet[];
  incidents: Incident[];
  messages: AgentMessage[];
  resources: Resource[];
  tick: number;
};

export const AGENT_LABEL: Record<AgentId, string> = {
  listener: "Tweet Listener",
  classifier: "NLP Classifier",
  geo: "Location Agent",
  severity: "Severity Agent",
  fire: "Fire Agent",
  medical: "Medical Agent",
  police: "Police Agent",
  traffic: "Traffic Agent",
  coordinator: "AI Coordinator",
};

export const TYPE_LABEL: Record<IncidentType, string> = {
  fire: "Fire",
  medical: "Medical",
  flood: "Flood",
  collapse: "Structure Collapse",
  traffic: "Accident",
  chemical: "Chemical / Gas",
  unknown: "Unverified",
};

/* ------------------------------------------------------------------ mock feed */

type Seed = { handle: string; text: string; location?: string; hoax?: boolean };

const LOCATIONS: Record<string, { x: number; y: number }> = {
  "MG Road": { x: 30, y: 34 },
  "Central Mall": { x: 55, y: 22 },
  "Airport Road": { x: 78, y: 18 },
  "Sector 8": { x: 20, y: 66 },
  "Railway Station": { x: 62, y: 60 },
  "Gandhi Nagar": { x: 42, y: 48 },
  "River Bridge": { x: 72, y: 44 },
  "Hill Road": { x: 14, y: 24 },
  "City Hospital": { x: 50, y: 78 },
  "Bus Stand": { x: 34, y: 80 },
  "Sector 12": { x: 86, y: 70 },
};

const SEEDS: Seed[] = [
  { handle: "@ravi_blr", text: "Huge fire after gas cylinder blast at Gandhi Nagar. Two people injured!!" },
  { handle: "@citywatch", text: "Fire!! Fire near Gandhi Nagar, thick black smoke everywhere" },
  { handle: "@nisha_k", text: "Need ambulance near Bus Stand, 3 injured after bike collision" },
  { handle: "@trafficmate", text: "Building collapsed near Central Mall, people trapped inside" },
  { handle: "@mohit.singh", text: "Road blocked because of flood water at Sector 8, cars stuck" },
  { handle: "@arjun_p", text: "Smoke seen near City Hospital, staff evacuating patients" },
  { handle: "@meera.d", text: "Gas leak near Railway Station, strong smell, please avoid area" },
  { handle: "@localhero", text: "Massive crowd gathering at MG Road after accident, need police" },
  { handle: "@sana_r", text: "Water level rising fast near River Bridge, road submerged" },
  { handle: "@dev_ops_guy", text: "Landslide reported on Hill Road, 2 vehicles buried" },
  { handle: "@kiran.v", text: "Bridge collapsed at River Bridge!! traffic completely stopped" },
  { handle: "@ufo_truth", text: "ALIEN SPACESHIP landing over Sector 12 confirmed!!!", hoax: true },
  { handle: "@anita_m", text: "Factory exploded at Airport Road, 10 injured people lying outside" },
  { handle: "@rahul7", text: "Same fire at Airport Road still spreading, second unit needed" },
  { handle: "@priya.s", text: "Unconscious man near MG Road footpath, first aid needed urgently" },
  { handle: "@newsflashx", text: "Godzilla spotted near Central Mall, everyone run", hoax: true },
  { handle: "@vikas.j", text: "Chemical tanker leaking near Sector 12, burning eyes, evacuate" },
  { handle: "@shreya", text: "Riot like situation at Bus Stand, shops being damaged" },
];

/* ---------------------------------------------------------------- classifiers */

const RULES: { type: IncidentType; words: string[] }[] = [
  { type: "chemical", words: ["gas leak", "chemical", "tanker", "toxic", "fumes"] },
  { type: "fire", words: ["fire", "smoke", "blast", "explod", "burning", "cylinder"] },
  { type: "collapse", words: ["collapse", "trapped", "landslide", "buried", "building down"] },
  { type: "flood", words: ["flood", "water level", "submerged", "rain water"] },
  { type: "traffic", words: ["accident", "collision", "bike", "traffic", "road blocked", "riot", "crowd"] },
  { type: "medical", words: ["ambulance", "injured", "unconscious", "first aid", "bleeding", "patients"] },
];

const HOAX_WORDS = ["alien", "spaceship", "godzilla", "ufo", "dragon", "zombie"];

function classify(text: string): IncidentType {
  const t = text.toLowerCase();
  for (const rule of RULES) if (rule.words.some((w) => t.includes(w))) return rule.type;
  return "unknown";
}

function extractLocation(text: string): string | null {
  const t = text.toLowerCase();
  for (const name of Object.keys(LOCATIONS)) if (t.includes(name.toLowerCase())) return name;
  return null;
}

function countInjured(text: string): number {
  const m = text.match(/(\d+)\s*(injured|people|casualt)/i);
  if (m) return Number(m[1]);
  if (/two\s+people/i.test(text)) return 2;
  if (/unconscious|bleeding|first aid/i.test(text)) return 1;
  return 0;
}

function scoreSeverity(text: string, type: IncidentType, injured: number): number {
  const t = text.toLowerCase();
  let s = 3;
  if (["fire", "chemical", "collapse"].includes(type)) s += 2;
  if (/huge|massive|explod|blast|trapped|collapse|spreading/.test(t)) s += 2;
  if (/evacuat|urgent|fast|completely/.test(t)) s += 1;
  s += Math.min(3, Math.ceil(injured / 3));
  return Math.max(1, Math.min(10, s));
}

/* ----------------------------------------------------------------- resources */

const STATIONS: { kind: ResourceKind; station: string; x: number; y: number; count: number; prefix: string }[] = [
  { kind: "fire", station: "Fire Station A", x: 26, y: 20, count: 3, prefix: "Truck" },
  { kind: "fire", station: "Fire Station B", x: 70, y: 74, count: 3, prefix: "Truck" },
  { kind: "ambulance", station: "City Hospital", x: 50, y: 82, count: 4, prefix: "Ambulance" },
  { kind: "ambulance", station: "North Clinic", x: 60, y: 14, count: 3, prefix: "Ambulance" },
  { kind: "police", station: "Central Police HQ", x: 40, y: 40, count: 4, prefix: "Patrol" },
  { kind: "traffic", station: "Traffic Control", x: 82, y: 40, count: 3, prefix: "Traffic Unit" },
];

export function initialResources(): Resource[] {
  const out: Resource[] = [];
  let n = 1;
  for (const s of STATIONS) {
    for (let i = 1; i <= s.count; i++) {
      out.push({
        id: `r${n}`,
        kind: s.kind,
        label: `${s.prefix} #${n}`,
        station: s.station,
        x: s.x,
        y: s.y,
        status: "available",
      });
      n++;
    }
  }
  return out;
}

export function emptyState(): SimState {
  return { tweets: [], incidents: [], messages: [], resources: initialResources(), tick: 0 };
}

/* --------------------------------------------------------------------- utils */

let seq = 0;
const uid = (p: string) => `${p}${Date.now().toString(36)}${(seq++).toString(36)}`;
const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);
const km = (d: number) => Math.round(d * 0.28 * 10) / 10;

function msg(
  from: AgentId,
  to: AgentId | "all",
  text: string,
  opts: { reason?: string[]; incidentId?: string; tone?: AgentMessage["tone"]; at: number },
): AgentMessage {
  return {
    id: uid("m"),
    from,
    to,
    text,
    reason: opts.reason,
    incidentId: opts.incidentId,
    at: opts.at,
    tone: opts.tone ?? "info",
  };
}

/* --------------------------------------------------------- needs per incident */

function needsFor(type: IncidentType, severity: number, injured: number) {
  const need: { kind: ResourceKind; qty: number; agent: AgentId; why: string }[] = [];
  if (["fire", "chemical"].includes(type))
    need.push({ kind: "fire", qty: severity >= 8 ? 2 : 1, agent: "fire", why: "active fire / leak containment" });
  if (type === "collapse")
    need.push({ kind: "fire", qty: 1, agent: "fire", why: "rescue & cutting equipment required" });
  if (injured > 0 || ["medical", "collapse", "traffic"].includes(type))
    need.push({
      kind: "ambulance",
      qty: injured >= 6 ? 2 : 1,
      agent: "medical",
      why: injured > 0 ? `${injured} casualties reported` : "casualty risk at scene",
    });
  if (severity >= 5 || ["traffic", "collapse", "chemical"].includes(type))
    need.push({ kind: "police", qty: 1, agent: "police", why: "crowd control & perimeter" });
  if (["flood", "traffic", "collapse"].includes(type))
    need.push({ kind: "traffic", qty: 1, agent: "traffic", why: "road closure & rerouting" });
  return need;
}

/* ------------------------------------------------------------------ the tick */

export function step(prev: SimState): SimState {
  const now = Date.now();
  const state: SimState = {
    tweets: [...prev.tweets],
    incidents: prev.incidents.map((i) => ({ ...i })),
    messages: [...prev.messages],
    resources: prev.resources.map((r) => ({ ...r })),
    tick: prev.tick + 1,
  };
  const push = (m: AgentMessage) => state.messages.unshift(m);

  // 1. Tweet Listener Agent -------------------------------------------------
  const seed = SEEDS[prev.tick % SEEDS.length]!;
  const tweet: Tweet = { id: uid("t"), handle: seed.handle, text: seed.text, at: now, status: "new" };
  state.tweets.unshift(tweet);

  // 2. NLP Classification + trust ------------------------------------------
  const hoax = HOAX_WORDS.some((w) => seed.text.toLowerCase().includes(w));
  const type = classify(seed.text);
  const location = extractLocation(seed.text);

  if (hoax || type === "unknown" || !location) {
    tweet.status = "flagged";
    push(
      msg("classifier", "coordinator", `Report from ${seed.handle} held back — low confidence.`, {
        at: now,
        tone: "warn",
        reason: [
          hoax ? "Implausible entity detected in text" : "No known disaster category matched",
          location ? `Location parsed: ${location}` : "No mappable location found",
          "Confidence 0.2 — no resources dispatched",
        ],
      }),
    );
    return trim(state);
  }

  const injured = countInjured(seed.text);
  const severity = scoreSeverity(seed.text, type, injured);
  const pos = LOCATIONS[location]!;

  // 3. Duplicate clustering -------------------------------------------------
  const existing = state.incidents.find(
    (i) => i.location === location && i.type === type && i.stage !== "resolved",
  );

  if (existing) {
    tweet.status = "duplicate";
    tweet.incidentId = existing.id;
    existing.reports += 1;
    existing.confidence = Math.min(0.99, existing.confidence + 0.08);
    existing.severity = Math.max(existing.severity, severity);
    push(
      msg("classifier", "coordinator", `Duplicate report merged into ${existing.code}.`, {
        at: now,
        incidentId: existing.id,
        tone: "ok",
        reason: [
          `Same category (${TYPE_LABEL[type]}) and location (${location})`,
          `Corroborating reports: ${existing.reports}`,
          `Confidence raised to ${(existing.confidence * 100).toFixed(0)}%`,
        ],
      }),
    );
    return trim(state);
  }

  // 4. New incident --------------------------------------------------------
  const incident: Incident = {
    id: uid("i"),
    code: `INC-${String(state.incidents.length + 101)}`,
    type,
    location,
    x: pos.x,
    y: pos.y,
    severity,
    confidence: 0.72,
    headline: seed.text.replace(/!+/g, "").slice(0, 90),
    reports: 1,
    stage: "detected",
    createdAt: now,
    dispatches: [],
    injured,
  };
  state.incidents.unshift(incident);
  tweet.status = "linked";
  tweet.incidentId = incident.id;

  push(
    msg("listener", "classifier", `New signal from ${seed.handle}: "${seed.text.slice(0, 60)}…"`, {
      at: now,
      incidentId: incident.id,
    }),
  );
  push(
    msg("classifier", "all", `${incident.code} classified as ${TYPE_LABEL[type]}.`, {
      at: now,
      incidentId: incident.id,
      reason: [`Keyword match on category ${TYPE_LABEL[type]}`, "Confidence 0.72"],
    }),
  );
  push(
    msg("geo", "coordinator", `Location resolved: ${location}.`, {
      at: now,
      incidentId: incident.id,
      reason: ["Named-entity match against city gazetteer", `Grid ${pos.x.toFixed(0)}/${pos.y.toFixed(0)}`],
    }),
  );
  push(
    msg("severity", "coordinator", `Severity scored ${severity}/10.`, {
      at: now,
      incidentId: incident.id,
      tone: severity >= 8 ? "warn" : "info",
      reason: [
        `Category baseline for ${TYPE_LABEL[type]}`,
        injured > 0 ? `${injured} casualties mentioned` : "No casualties mentioned",
        "Intensity language in report",
      ],
    }),
  );
  incident.stage = "analyzed";

  // 5. Department agents bid ----------------------------------------------
  const needs = needsFor(type, severity, injured);
  for (const n of needs) {
    push(
      msg(n.agent, "coordinator", `Requesting ${n.qty} × ${labelFor(n.kind)} for ${incident.code}.`, {
        at: now,
        incidentId: incident.id,
        tone: "action",
        reason: [n.why, `Severity ${severity}/10 at ${location}`],
      }),
    );
  }

  // 6. Coordinator: autonomous nearest-available routing -------------------
  incident.stage = "allocated";
  for (const n of needs) {
    for (let q = 0; q < n.qty; q++) {
      const candidates = state.resources
        .filter((r) => r.kind === n.kind && r.status === "available")
        .sort((a, b) => dist(a, incident) - dist(b, incident));
      const chosen = candidates[0];
      if (!chosen) {
        push(
          msg("coordinator", n.agent, `No ${labelFor(n.kind)} available for ${incident.code}.`, {
            at: now,
            incidentId: incident.id,
            tone: "warn",
            reason: ["All units of this type are engaged", "Queued for next release"],
          }),
        );
        continue;
      }
      const d = km(dist(chosen, incident));
      const eta = Math.max(2, Math.round(d * 1.6));
      chosen.status = "enroute";
      chosen.incidentId = incident.id;
      incident.dispatches.push({
        id: uid("d"),
        resourceId: chosen.id,
        kind: chosen.kind,
        label: chosen.label,
        station: chosen.station,
        etaMin: eta,
        reason: [n.why, `${chosen.station} is nearest available (${d} km)`, `ETA ${eta} min`],
      });
      push(
        msg("coordinator", n.agent, `${chosen.label} dispatched to ${incident.code}.`, {
          at: now,
          incidentId: incident.id,
          tone: "ok",
          reason: [n.why, `${chosen.station} nearest available — ${d} km`, `ETA ${eta} minutes`],
        }),
      );
    }
  }
  incident.stage = "dispatched";

  // 7. Progress older incidents -------------------------------------------
  for (const i of state.incidents) {
    if (i.id === incident.id || i.stage === "resolved") continue;
    if (now - i.createdAt > 24000) {
      i.stage = "resolved";
      for (const r of state.resources) {
        if (r.incidentId === i.id) {
          r.status = "available";
          r.incidentId = undefined;
        }
      }
      push(
        msg("coordinator", "all", `${i.code} resolved. Units released back to stations.`, {
          at: now,
          incidentId: i.id,
          tone: "ok",
          reason: [`${i.dispatches.length} units returned to available pool`],
        }),
      );
    } else if (now - i.createdAt > 9000) {
      for (const r of state.resources) if (r.incidentId === i.id && r.status === "enroute") r.status = "onsite";
    }
  }

  return trim(state);
}

function labelFor(kind: ResourceKind) {
  return kind === "fire" ? "fire truck" : kind === "ambulance" ? "ambulance" : kind === "police" ? "patrol unit" : "traffic unit";
}

function trim(s: SimState): SimState {
  return {
    ...s,
    tweets: s.tweets.slice(0, 40),
    messages: s.messages.slice(0, 80),
    incidents: s.incidents.slice(0, 24),
  };
}

/* ---------------------------------------------------------------- selectors */

export function stats(s: SimState) {
  const active = s.incidents.filter((i) => i.stage !== "resolved");
  const deployed = s.resources.filter((r) => r.status !== "available").length;
  const etas = s.incidents.flatMap((i) => i.dispatches.map((d) => d.etaMin));
  const avgEta = etas.length ? etas.reduce((a, b) => a + b, 0) / etas.length : 0;
  const handled = s.incidents.length;
  const dispatched = s.incidents.filter((i) => i.dispatches.length > 0).length;
  return {
    active: active.length,
    affected: s.incidents.reduce((a, i) => a + i.injured * 9 + i.severity * 12, 0),
    deployed,
    total: s.resources.length,
    avgEta,
    success: handled ? Math.round((dispatched / handled) * 100) : 100,
    flagged: s.tweets.filter((t) => t.status === "flagged").length,
    duplicates: s.tweets.filter((t) => t.status === "duplicate").length,
  };
}
