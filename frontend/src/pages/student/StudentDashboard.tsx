import { useState } from "react";
import { motion } from "framer-motion";
import { StudentLayout } from "@/components/student/StudentLayout";
import { KpiCard } from "@/components/student/KpiCard";
import { RiskBadge } from "@/components/student/RiskBadge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Target, Clock, Zap, BookOpen, Play, TrendingUp, ArrowRight,
  CheckCircle2, Calendar
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
  PieChart, Pie, Cell, Legend
} from "recharts";

const ranges = ["7d", "30d", "All"] as const;

const weeklyFocus = Array.from({ length: 7 }, (_, i) => ({
  day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
  focus: Math.max(50, Math.min(100, 72 + Math.sin(i * 0.8) * 12 + (Math.random() - 0.5) * 6)),
}));

const monthlyFocus = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  focus: Math.max(40, Math.min(100, 70 + Math.sin(i * 0.3) * 12 + (Math.random() - 0.5) * 8)),
}));

const recentSessions = [
  { subject: "Mathematics", date: "Today, 10:30 AM", duration: "30 min", focus: 85, xp: 85 },
  { subject: "Physics", date: "Today, 8:00 AM", duration: "25 min", focus: 78, xp: 62 },
  { subject: "Arabic Lit.", date: "Yesterday, 6:00 PM", duration: "40 min", focus: 91, xp: 110 },
  { subject: "Biology", date: "Yesterday, 3:00 PM", duration: "20 min", focus: 64, xp: 38 },
  { subject: "French", date: "Apr 12, 4:30 PM", duration: "35 min", focus: 82, xp: 78 },
];

const upcomingHomework = [
  { title: "Chapter 5 Exercises", subject: "Mathematics", due: "Apr 15", status: "pending" as const },
  { title: "Lab Report: Motion", subject: "Physics", due: "Apr 16", status: "pending" as const },
  { title: "Essay Draft", subject: "Arabic Lit.", due: "Apr 18", status: "pending" as const },
];

const distractionData = [
  { name: "Fatigue", value: 35, color: "hsl(0, 72%, 51%)" },
  { name: "Difficulty", value: 28, color: "hsl(38, 92%, 50%)" },
  { name: "Environment", value: 22, color: "hsl(216, 52%, 55%)" },
  { name: "Unknown", value: 15, color: "hsl(240, 8%, 50%)" },
];

// Simple heatmap grid (4 weeks x 7 days)
const heatmapData = Array.from({ length: 28 }, (_, i) => ({
  day: i,
  sessions: Math.floor(Math.random() * 4),
  avgFocus: Math.floor(50 + Math.random() * 50),
}));

const getBarColor = (focus: number) => {
  if (focus >= 80) return "bg-success";
  if (focus >= 60) return "bg-warning";
  return "bg-destructive";
};

const StudentDashboard = () => {
  const [range, setRange] = useState<typeof ranges[number]>("7d");

  const focusData = range === "7d" ? weeklyFocus : monthlyFocus;

  return (
    <StudentLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-foreground">
            Good morning, Ahmed 👋
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1 flex items-center gap-2">
            Here's your learning overview <RiskBadge tier="low" />
          </p>
        </div>
        <Link to="/student/session">
          <Button variant="hero" size="lg">
            <Play size={16} className="mr-1.5" /> Start Session
          </Button>
        </Link>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard icon={Target} label="Avg Focus" value="82%" change="+5%" borderColor="border-l-primary" />
        <KpiCard icon={Clock} label="Study Time" value="12.5h" change="+2.1h" borderColor="border-l-secondary" />
        <KpiCard icon={Zap} label="Total XP" value="1,240" change="+85" borderColor="border-l-warning" />
        <KpiCard icon={BookOpen} label="Sessions" value="18" change="+3" borderColor="border-l-success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Focus Trend Chart with range selector */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border/50 shadow-soft"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" /> Focus Trend
            </h2>
            <div className="flex bg-muted/50 rounded-xl p-1">
              {ranges.map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-4 py-1.5 text-xs font-body font-medium rounded-lg transition-all ${
                    range === r ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={focusData}>
              <defs>
                <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(241, 44%, 42%)" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="hsl(241, 44%, 42%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 92%)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fontFamily: "Lexend" }} stroke="hsl(240, 8%, 50%)" interval={range === "7d" ? 0 : 4} />
              <YAxis tick={{ fontSize: 11, fontFamily: "Lexend" }} stroke="hsl(240, 8%, 50%)" domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(214, 20%, 92%)", fontFamily: "Lexend", fontSize: 12 }} />
              <ReferenceLine y={70} stroke="hsl(142, 72%, 42%)" strokeDasharray="4 4" />
              <Area type="monotone" dataKey="focus" stroke="hsl(241, 44%, 42%)" strokeWidth={2} fill="url(#dashGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Upcoming Homework */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
              <Calendar size={16} className="text-primary" /> Upcoming
            </h2>
            <Link to="/student/homework" className="text-xs text-primary font-body font-medium hover:underline">
              See all
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingHomework.map((hw, i) => (
              <motion.div
                key={hw.title}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                  <Clock size={14} className="text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body font-medium text-foreground truncate">{hw.title}</p>
                  <p className="text-[11px] text-muted-foreground font-body">{hw.subject} · Due {hw.due}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Sessions with focus bars */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-2xl border border-border/50 shadow-soft mb-6"
      >
        <div className="p-6 pb-3 flex items-center justify-between">
          <h2 className="font-heading font-bold text-foreground">Recent Sessions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left text-xs font-body font-medium text-muted-foreground px-6 py-3 uppercase tracking-wider">Subject</th>
                <th className="text-left text-xs font-body font-medium text-muted-foreground px-6 py-3 uppercase tracking-wider">Date</th>
                <th className="text-left text-xs font-body font-medium text-muted-foreground px-6 py-3 uppercase tracking-wider">Duration</th>
                <th className="text-left text-xs font-body font-medium text-muted-foreground px-6 py-3 uppercase tracking-wider">Focus</th>
                <th className="text-left text-xs font-body font-medium text-muted-foreground px-6 py-3 uppercase tracking-wider">XP</th>
              </tr>
            </thead>
            <tbody>
              {recentSessions.map((s, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 + i * 0.04 }}
                  className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-6 py-3.5 text-sm font-body font-medium text-foreground">{s.subject}</td>
                  <td className="px-6 py-3.5 text-sm font-body text-muted-foreground">{s.date}</td>
                  <td className="px-6 py-3.5 text-sm font-body text-muted-foreground">{s.duration}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-muted/50 overflow-hidden">
                        <div className={`h-full rounded-full ${getBarColor(s.focus)}`} style={{ width: `${s.focus}%` }} />
                      </div>
                      <span className={`text-sm font-heading font-bold ${
                        s.focus >= 80 ? "text-success" : s.focus >= 60 ? "text-warning" : "text-destructive"
                      }`}>
                        {s.focus}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-sm font-body text-primary font-medium flex items-center gap-1">
                      <Zap size={12} /> +{s.xp}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Analytics Section — merged from StudentAnalytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distraction Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft"
        >
          <h2 className="font-heading font-bold text-foreground mb-4">Distraction Causes</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={distractionData}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {distractionData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                formatter={(value: string) => <span className="text-xs font-body text-muted-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Session Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft"
        >
          <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
            <Calendar size={16} className="text-primary" /> Session Frequency
          </h2>
          <div className="grid grid-cols-7 gap-1.5 mt-4">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <div key={i} className="text-center text-[10px] font-body text-muted-foreground mb-1">{d}</div>
            ))}
            {heatmapData.map((cell, i) => {
              const opacity = cell.sessions === 0 ? 0.05 : (cell.avgFocus / 100) * 0.8 + 0.2;
              return (
                <div
                  key={i}
                  className="aspect-square rounded-md"
                  style={{ backgroundColor: `hsl(241 44% 42% / ${opacity})` }}
                  title={`${cell.sessions} sessions, ${cell.avgFocus}% avg focus`}
                />
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-4 justify-end">
            <span className="text-[10px] font-body text-muted-foreground">Less</span>
            {[0.05, 0.2, 0.4, 0.6, 0.8].map((o, i) => (
              <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: `hsl(241 44% 42% / ${o})` }} />
            ))}
            <span className="text-[10px] font-body text-muted-foreground">More</span>
          </div>
        </motion.div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
