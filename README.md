# Agent Rescue Team

This is actually a **very strong 24-hour hackathon problem** because it demonstrates what Agentic AI is good at:

-  Multiple AI agents 

-  Communication between agents 

-  Autonomous decision making 

-  Real-time data processing 

-  Practical social impact 

Let's break it down like you're 10 years old.

---

# Imagine This...

A big earthquake happens in a city.

People immediately start tweeting things like:

> "Building collapsed near Central Mall!!"

> "Need ambulance at MG Road!"

> "Gas leak near Railway Station"

> "Huge fire in Sector 8"

Thousands of these posts come every minute.

No human can read all of them fast enough.

So we create **AI agents**.

Each AI agent acts like one emergency department.

---

# The Agents

### 🚒 Fire Department Agent

Knows only about

-  fires 

-  explosions 

-  gas leaks 

-  smoke 

-  chemical accidents 

When it sees

> "Factory exploded"

it immediately says

"I need 3 fire trucks."

---

### 🚑 Medical Agent

Looks for

-  injured people 

-  unconscious people 

-  ambulance requests 

-  hospitals 

-  first aid 

If someone tweets

> "10 injured people"

it sends ambulances.

---

### 👮 Police Agent

Looks for

-  crowd control 

-  road block 

-  theft 

-  riots 

-  evacuation 

If someone tweets

> "Bridge collapsed"

it closes roads and redirects traffic.

---

# What is "Situational Awareness"?

Imagine Google Maps for emergencies.

Instead of each department working alone,

they all know

-  where fire is 

-  where ambulances are 

-  where roads are blocked 

-  where police already are 

Everyone shares information.

That's called

> **Situational Awareness**

---

# Example

Tweet:

> Huge fire after gas cylinder blast at Gandhi Nagar. Two people injured.

Fire Agent reads

"I'll send fire trucks."

Medical Agent reads

"I'll send ambulance."

Police Agent reads

"I'll block the road."

No human tells them.

They decide automatically.

---

# What is Autonomous Resource Routing?

Suppose

Fire Station A

is already busy.

Instead of asking a human,

the AI checks

Fire Station B

is only 4 km away.

It automatically sends

Fire Truck #7.

That's resource routing.

---

# Mock Twitter Feed

Real Twitter API is difficult.

Instead

Create fake tweets like

```

```

```

08:00

Fire near Airport.

---------------------

08:01

Need ambulance near Bus Stand.

---------------------

08:02

Building collapse.

---------------------

08:03

Road blocked because of flood.

---------------------

08:04

Smoke seen near hospital.

---------------------

08:05

Gas leak near school.

```

Every 3 seconds

a new tweet appears.

Looks real.

---

# System Flow

```

```

```

             Mock Twitter Feed

                    │

          Disaster Detection Agent

                    │

      -----------------------------

      │             │            │

 Fire Agent   Medical Agent  Police Agent

      │             │            │

      -----------------------------

             Coordinator Agent

                    │

          Resource Allocation

                    │

          Dashboard Updates

```

---

# Better Architecture (More Agents)

Instead of only three agents

Create many.

---

## 1. Tweet Listener Agent

Reads incoming tweets.

---

## 2. NLP Classification Agent

Figures out

Fire?

Medical?

Flood?

Earthquake?

Chemical leak?

---

## 3. Location Extraction Agent

Finds

```

```

```

MG Road

Airport

School

Hospital

Sector 12

```

using NLP.

---

## 4. Severity Agent

Scores disaster

```

```

```

Small Fire

Medium Fire

Critical Fire

```

Score

```

```

```

1-10

```

---

## 5. Fire Agent

Assigns fire trucks.

---

## 6. Medical Agent

Assigns ambulances.

---

## 7. Police Agent

Assigns police vehicles.

---

## 8. Traffic Agent

Checks blocked roads.

Suggests better route.

---

## 9. Coordinator Agent

The boss.

It asks

```

```

```

Fire?

Ready?

Medical?

Ready?

Police?

Ready?

```

Then approves deployment.

---

## 10. Dashboard Agent

Updates

Map

Timeline

Status

Resources

---

# AI Models You Can Use

For tweet understanding:

-  GPT-5.5 / OpenAI API 

-  Gemini 

-  Llama 3 

-  Mistral 

---

For location extraction

```

```

```

spaCy

or

OpenAI Structured Outputs

```

---

For routing

Simple algorithm

```

```

```

Nearest available station

```

or

```

```

```

Shortest Path

```

using

NetworkX.

---

# Technologies

Frontend

-  React 

-  Next.js 

-  Tailwind CSS 

Backend

-  FastAPI 

-  Node.js 

Agents

-  LangGraph 

-  CrewAI 

-  Pydantic AI 

-  Google ADK 

-  AutoGen 

Database

-  PostgreSQL 

-  Firebase 

Maps

-  Leaflet 

-  OpenStreetMap 

-  Google Maps API 

---

# Make it Hackathon-Winning

Most teams will stop here.

You can go much further.

---

## Idea 1 — Duplicate Tweet Detection

People post

```

```

```

Fire!!

Fire!!

Huge fire!!

Building burning!!

```

about the same event.

Cluster them into

ONE incident.

---

## Idea 2 — Fake Tweet Detection

Someone posts

```

```

```

Alien attack in Chennai.

```

AI marks it as

"Low confidence"

instead of dispatching resources.

---

## Idea 3 — Image Verification

If tweet contains

📷

AI checks

Is it actually fire?

Use a vision model.

---

## Idea 4 — Drone Agent

Pretend drones exist.

Coordinator asks

"Drone Agent,

go verify."

Drone returns

```

```

```

Confirmed fire.

Severity 9/10.

```

---

## Idea 5 — Hospital Capacity Agent

Instead of nearest hospital

find

nearest hospital

with

available beds.

---

## Idea 6 — Prediction Agent

Fire spreading?

Predict

next affected area.

---

## Idea 7 — Volunteer Agent

Nearby volunteers receive

```

```

```

Please help evacuate nearby civilians.

```

---

## Idea 8 — Relief Distribution Agent

Food

Water

Medicine

Blankets

assigned automatically after disaster.

---

## Idea 9 — Explainable AI

Every deployment includes a reason:

```

```

```

Ambulance 5 dispatched.

Reason:

• 7 injured reported

• Hospital 2.3 km away

• ETA 4 minutes

```

Judges love transparency.

---

## Idea 10 — Commander Chat

Emergency officials can ask:

> "Show me all active fires."

> "How many ambulances are free?"

> "Which hospital is overloaded?"

An AI assistant answers using your live system state.

---

# What Judges Will Love

- **True agent-to-agent communication:** Show Fire, Medical, Police, and Coordinator exchanging structured messages, not just calling one AI multiple times. 

- **Live simulation:** A continuously updating disaster feed with dynamic decisions. 

- **Interactive dashboard:** Map, incident cards, resource status, and decision logs. 

- **Explainable decisions:** Every action has a visible rationale. 

- **Scalability:** Mention that new agents (weather, drones, NGOs, utility companies) can be added without redesigning the system. 

## A realistic 24-hour scope

Don't try to build everything. Aim for this core demo:

-  A mock Twitter/X feed generates disaster reports every few seconds. 

-  An NLP agent classifies the incident and extracts location and severity. 

-  Fire, Medical, and Police agents independently decide what resources they need. 

-  A Coordinator agent resolves conflicts and dispatches the nearest available resources. 

-  A React dashboard displays incidents on a map, resource movements, and a live conversation between agents. 

That is achievable in 24 hours, clearly demonstrates **agentic AI**, and gives you plenty to showcase during the demo. Since you're already planning to use an agentic AI framework for the hackathon, this architecture is an excellent fit and can be expanded later with additional agents like weather, drones, hospitals, or utility services.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/26ccd326-f7f0-47f1-b0ba-74cfddd1562a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
