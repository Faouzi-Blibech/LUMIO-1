import { useState } from "react";
import { motion } from "framer-motion";
import { StudentLayout } from "@/components/student/StudentLayout";
import { RiskBadge } from "@/components/student/RiskBadge";
import { TrendingUp, Calendar } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
  PieChart, Pie, Cell, Legend
} from "recharts";

const ranges = ["7d", "30d", "All"] as const;

const trendData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  focus: Math.max(40, Math.min(100, 70 + Math.sin(i * 0.3) * 12 + (Math.random() - 0.5) * 8)),
}));

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

const StudentAnalytics = () => {
  const [range, setRange] = useState<typeof ranges[number]>("30d");

  return (
    <StudentLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-foreground">My Analytics</h1>
          <p className="text-sm text-muted-foreground font-body mt-1 flex items-center gap-2">
            Track your progress over time <RiskBadge tier="low" />
          </p>
        </div>
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

      {/* Focus Trend */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft mb-6"
      >
        <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-primary" /> Focus Trend
        </h2>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(241, 44%, 42%)" stopOpacity={0.12} />
                <stop offset="95%" stopColor="hsl(241, 44%, 42%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 92%)" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fontFamily: "Lexend" }} stroke="hsl(240, 8%, 50%)" interval={4} />
            <YAxis tick={{ fontSize: 11, fontFamily: "Lexend" }} stroke="hsl(240, 8%, 50%)" domain={[0, 100]} />
            <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(214, 20%, 92%)", fontFamily: "Lexend", fontSize: 12 }} />
            <ReferenceLine y={70} stroke="hsl(142, 72%, 42%)" strokeDasharray="4 4" />
            <Area type="monotone" dataKey="focus" stroke="hsl(241, 44%, 42%)" strokeWidth={2} fill="url(#analyticsGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Distraction Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
          transition={{ delay: 0.2 }}
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

export default StudentAnalytics;
