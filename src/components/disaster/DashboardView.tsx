import {
  AlertTriangle,
  Flame,
  Ambulance,
  Shield,
  Building2,
  AlertCircle,
  Timer,
  Activity,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const pieData = [
  { name: "Fire", value: 35, color: "#f43f5e" },
  { name: "Medical", value: 25, color: "#10b981" },
  { name: "Police", value: 20, color: "#3b82f6" },
  { name: "Flood", value: 12, color: "#06b6d4" },
  { name: "Gas Leak", value: 8, color: "#f59e0b" },
];

const timeData = [
  { time: "12:00", Incidents: 4, Resolved: 2 },
  { time: "12:15", Incidents: 7, Resolved: 4 },
  { time: "12:30", Incidents: 12, Resolved: 6 },
  { time: "12:45", Incidents: 10, Resolved: 9 },
  { time: "13:00", Incidents: 16, Resolved: 11 },
  { time: "13:15", Incidents: 14, Resolved: 13 },
];

const resourceUtilData = [
  { name: "Fire Trucks", Active: 14, Available: 6 },
  { name: "Ambulances", Active: 18, Available: 4 },
  { name: "Police Units", Active: 12, Available: 8 },
  { name: "Hazmat", Active: 5, Available: 3 },
];

const recentActivity = [
  { id: "act-1", title: "Fire detected near Central Railway Station", time: "2m ago", type: "fire", badge: "Critical" },
  { id: "act-2", title: "Ambulance #104 dispatched to Station Road", time: "4m ago", type: "medical", badge: "Dispatched" },
  { id: "act-3", title: "Police roadblock created on Express Avenue", time: "7m ago", type: "police", badge: "Secured" },
  { id: "act-4", title: "Chemical spill contained at Science Park", time: "12m ago", type: "hazard", badge: "Resolved" },
];

export function DashboardView({
  stats,
  incidentsCount,
}: {
  stats: { active: number; affected: number; deployed: number; total: number; avgEta: number; duplicates: number; flagged: number };
  incidentsCount: number;
}) {
  const cards = [
    { label: "Active Incidents", val: stats.active, icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-200" },
    { label: "Fire Trucks Available", val: "6 / 20", icon: Flame, color: "text-rose-600", bg: "bg-rose-600/10", border: "border-rose-200" },
    { label: "Ambulances Available", val: "4 / 22", icon: Ambulance, color: "text-emerald-600", bg: "bg-emerald-600/10", border: "border-emerald-200" },
    { label: "Police Units Available", val: "8 / 20", icon: Shield, color: "text-blue-600", bg: "bg-blue-600/10", border: "border-blue-200" },
    { label: "Hospitals Available", val: "4 Trauma Centers", icon: Building2, color: "text-purple-600", bg: "bg-purple-600/10", border: "border-purple-200" },
    { label: "High Priority Incidents", val: Math.ceil(stats.active * 0.4), icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-600/10", border: "border-amber-200" },
    { label: "Avg. Response Time", val: `${stats.avgEta.toFixed(1)}m`, icon: Timer, color: "text-indigo-600", bg: "bg-indigo-600/10", border: "border-indigo-200" },
  ];

  return (
    <div className="space-y-6 rise-in">
      {/* 7 Overview Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className={`flashcard p-4 flex flex-col justify-between ${c.border}`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{c.label}</span>
                <span className={`p-2 rounded-xl ${c.bg} ${c.color}`}>
                  <Icon className="size-4" />
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-extrabold tracking-tight text-foreground">{c.val}</p>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-muted-foreground">
                  <TrendingUp className="size-3 text-emerald-500" /> Live Telemetry
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Incident Statistics Charts */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Pie Chart */}
        <div className="lg:col-span-4 flashcard p-5">
          <h2 className="text-sm font-extrabold text-foreground flex items-center gap-2">
            <Activity className="size-4 text-purple-600" /> Incident Type Breakdown
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Distribution across reported emergency categories</p>
          <div className="h-[240px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e9d5ff" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
            {pieData.map((d) => (
              <span key={d.name} className="flex items-center gap-1.5 font-semibold">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name} ({d.value}%)
              </span>
            ))}
          </div>
        </div>

        {/* Line Chart */}
        <div className="lg:col-span-4 flashcard p-5">
          <h2 className="text-sm font-extrabold text-foreground flex items-center gap-2">
            <TrendingUp className="size-4 text-purple-600" /> Incidents Over Time
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time report rate vs resolution rate</p>
          <div className="h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e9d5ff" }} />
                <Line type="monotone" dataKey="Incidents" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Resolved" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="lg:col-span-4 flashcard p-5">
          <h2 className="text-sm font-extrabold text-foreground flex items-center gap-2">
            <Shield className="size-4 text-purple-600" /> Resource Utilization
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Active deployment vs reserve readiness</p>
          <div className="h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceUtilData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e9d5ff" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Active" fill="#9333ea" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Available" fill="#d8b4fe" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="flashcard p-5">
        <h2 className="text-sm font-extrabold text-foreground flex items-center gap-2">
          <CheckCircle2 className="size-4 text-purple-600" /> Recent Activity Timeline
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">Autonomous log of emergency events and agency actions</p>
        <div className="grid gap-3 mt-4 sm:grid-cols-2 lg:grid-cols-4">
          {recentActivity.map((act) => (
            <div key={act.id} className="p-3.5 rounded-xl border border-purple-100 bg-purple-50/30 dark:bg-purple-950/20 dark:border-purple-900/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-muted-foreground">{act.time}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                    {act.badge}
                  </span>
                </div>
                <p className="mt-2 text-xs font-bold text-foreground leading-snug">{act.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
