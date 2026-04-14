import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { KpiCard } from "@/components/student/KpiCard";
import {
  Users, GraduationCap, Layers, Brain, TrendingUp, AlertTriangle, Clock, Activity
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell, Legend
} from "recharts";

const schoolFocusTrend = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  focus: Math.max(55, Math.min(90, 72 + Math.sin(i * 0.25) * 8 + (Math.random() - 0.5) * 5)),
}));

const focusDistribution = [
  { name: "Excellent (≥80%)", value: 145, color: "hsl(142, 72%, 42%)" },
  { name: "Good (60-79%)", value: 210, color: "hsl(38, 92%, 50%)" },
  { name: "Needs Attention (<60%)", value: 45, color: "hsl(0, 72%, 51%)" },
];

const recentAlerts = [
  { severity: "info", message: "Focus score improved 5% across Grade 3", time: "1 hour ago" },
  { severity: "warning", message: "3 new at-risk students identified this week", time: "3 hours ago" },
  { severity: "success", message: "Ms. Trabelsi's class avg focus at 82% (highest)", time: "5 hours ago" },
  { severity: "alert", message: "Professional referral triggered for student #247", time: "Yesterday" },
  { severity: "info", message: "Weekly school report generated and sent", time: "Yesterday" },
];

const AdminDashboard = () => {
  return (
    <AdminLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-heading font-extrabold text-2xl text-foreground">School Dashboard</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">
          École Pilote Monastir · April 14, 2026
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard icon={Users} label="Total Students" value="400" change="+12" borderColor="border-l-primary" />
        <KpiCard icon={GraduationCap} label="Total Teachers" value="18" change="+1" borderColor="border-l-secondary" />
        <KpiCard icon={Layers} label="Total Classes" value="24" change="+2" borderColor="border-l-warning" />
        <KpiCard icon={Brain} label="School Avg Focus" value="74%" change="+3%" borderColor="border-l-success" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Focus Trend */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft"
        >
          <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" /> School Focus Trend
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={schoolFocusTrend}>
              <defs>
                <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(241, 44%, 42%)" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="hsl(241, 44%, 42%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 92%)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fontFamily: "Lexend" }} stroke="hsl(240, 8%, 50%)" interval={4} />
              <YAxis tick={{ fontSize: 11, fontFamily: "Lexend" }} stroke="hsl(240, 8%, 50%)" domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(214, 20%, 92%)", fontFamily: "Lexend", fontSize: 12 }} />
              <ReferenceLine y={70} stroke="hsl(142, 72%, 42%)" strokeDasharray="4 4" />
              <Area type="monotone" dataKey="focus" stroke="hsl(241, 44%, 42%)" strokeWidth={2} fill="url(#adminGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Focus Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft"
        >
          <h2 className="font-heading font-bold text-foreground mb-4">Focus Distribution</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={focusDistribution}
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {focusDistribution.map((entry, i) => (
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
      </div>

      {/* Statistics Summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft mb-6"
      >
        <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
          <Activity size={16} className="text-primary" /> Today's Summary
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: "Active Sessions Today", value: "45" },
            { label: "Avg Session Duration", value: "32 min" },
            { label: "HW Completion Rate", value: "78%" },
            { label: "At-Risk Students", value: "12" },
            { label: "Referrals (30d)", value: "3" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-3 rounded-xl bg-muted/20">
              <p className="font-heading font-extrabold text-xl text-foreground">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground font-body mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft"
      >
        <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle size={16} className="text-warning" /> Recent School Alerts
        </h2>
        <div className="space-y-3">
          {recentAlerts.map((alert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.04 }}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/20 transition-colors"
            >
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                alert.severity === "alert" ? "bg-destructive" :
                alert.severity === "warning" ? "bg-warning" :
                alert.severity === "success" ? "bg-success" :
                "bg-primary"
              }`} />
              <div className="flex-1">
                <p className="text-sm font-body text-foreground">{alert.message}</p>
                <p className="text-[11px] text-muted-foreground font-body mt-0.5 flex items-center gap-1">
                  <Clock size={10} /> {alert.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminDashboard;
