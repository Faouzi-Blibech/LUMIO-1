import { motion } from "framer-motion";
import { StudentLayout } from "@/components/student/StudentLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Zap, Clock, Target, Brain, TrendingUp, Home } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";

const timelineData = Array.from({ length: 30 }, (_, i) => ({
  min: i + 1,
  focus: Math.max(30, Math.min(100, 75 + Math.sin(i * 0.5) * 15 + (Math.random() - 0.5) * 10)),
}));

const tips = [
  "Great session! Your focus improved in the second half — try longer sessions to build on that momentum.",
  "You showed strong focus during minutes 10–20. Consider scheduling harder topics during that window.",
  "A short 5-minute break after 25 minutes can help maintain high focus throughout longer sessions.",
];

const SessionSummary = () => {
  const avgFocus = 82;
  const duration = "30 min";
  const xpEarned = 85;

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-heading font-extrabold text-3xl text-foreground mb-2">
            Session Complete! 🎉
          </h1>
          <p className="text-muted-foreground font-body">
            Mathematics · Today at 10:30 AM
          </p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Target, label: "Avg Focus", value: `${avgFocus}%`, color: "text-primary" },
            { icon: Clock, label: "Duration", value: duration, color: "text-secondary" },
            { icon: Zap, label: "XP Earned", value: `+${xpEarned}`, color: "text-success" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft text-center"
            >
              <stat.icon size={20} className={`${stat.color} mx-auto mb-2`} />
              <p className="font-heading font-extrabold text-2xl text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-body mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Focus Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft mb-8"
        >
          <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" /> Focus Timeline
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="summaryGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(241, 44%, 42%)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(241, 44%, 42%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="min" tick={{ fontSize: 11, fontFamily: "Lexend" }} stroke="hsl(240, 8%, 50%)" label={{ value: "Minutes", position: "insideBottom", offset: -4, fontSize: 11, fontFamily: "Lexend" }} />
              <YAxis tick={{ fontSize: 11, fontFamily: "Lexend" }} stroke="hsl(240, 8%, 50%)" domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(214, 20%, 92%)", fontFamily: "Lexend", fontSize: 12 }} />
              <ReferenceLine y={70} stroke="hsl(142, 72%, 42%)" strokeDasharray="4 4" label={{ value: "Healthy", position: "right", fontSize: 10, fill: "hsl(142, 72%, 42%)" }} />
              <Area type="monotone" dataKey="focus" stroke="hsl(241, 44%, 42%)" strokeWidth={2} fill="url(#summaryGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* AI Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft mb-8"
        >
          <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
            <Brain size={16} className="text-primary" /> AI Insights
          </h2>
          <div className="space-y-3">
            {tips.map((tip, i) => (
              <div key={i} className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-sm font-body leading-relaxed text-foreground">
                {tip}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Link to="/student/dashboard">
            <Button variant="outline" size="lg" className="rounded-2xl">
              <Home size={16} className="mr-1.5" /> Dashboard
            </Button>
          </Link>
          <Link to="/student/session">
            <Button variant="hero" size="lg">
              Start Another Session
            </Button>
          </Link>
        </div>
      </div>
    </StudentLayout>
  );
};

export default SessionSummary;
