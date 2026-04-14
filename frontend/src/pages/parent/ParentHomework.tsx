import { useState } from "react";
import { motion } from "framer-motion";
import { ParentLayout } from "@/components/parent/ParentLayout";
import { BookOpen, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const assignments = [
  { id: 1, title: "Chapter 5 Exercises", subject: "Mathematics", due: "Apr 15, 2026", status: "pending" as const, grade: null },
  { id: 2, title: "Lab Report: Motion", subject: "Physics", due: "Apr 14, 2026", status: "submitted" as const, grade: null },
  { id: 3, title: "Essay: Modern Poetry", subject: "Arabic Literature", due: "Apr 12, 2026", status: "graded" as const, grade: 88 },
  { id: 4, title: "Cell Structure Diagram", subject: "Biology", due: "Apr 10, 2026", status: "graded" as const, grade: 72 },
  { id: 5, title: "Equation Practice Set", subject: "Mathematics", due: "Apr 8, 2026", status: "graded" as const, grade: 95 },
  { id: 6, title: "French Composition", subject: "French", due: "Apr 6, 2026", status: "overdue" as const, grade: null },
];

const statusConfig = {
  pending: { label: "Pending", icon: Clock, className: "text-warning bg-warning/10 border-warning/20" },
  submitted: { label: "Submitted", icon: CheckCircle2, className: "text-secondary bg-secondary/10 border-secondary/20" },
  graded: { label: "Graded", icon: CheckCircle2, className: "text-success bg-success/10 border-success/20" },
  overdue: { label: "Overdue", icon: AlertCircle, className: "text-destructive bg-destructive/10 border-destructive/20" },
};

const tabs = ["All", "Pending", "Submitted", "Graded"] as const;

const ParentHomework = () => {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("All");

  const filtered = activeTab === "All"
    ? assignments
    : assignments.filter(a => a.status === activeTab.toLowerCase());

  return (
    <ParentLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-heading font-extrabold text-2xl text-foreground">Homework</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">
          Ahmed's assignments · View only
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex bg-muted/50 rounded-xl p-1 mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-body font-medium rounded-lg transition-all ${
              activeTab === tab ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Assignment List — READ ONLY (no Submit button) */}
      <div className="space-y-3">
        {filtered.map((hw, i) => {
          const status = statusConfig[hw.status];
          const StatusIcon = status.icon;
          return (
            <motion.div
              key={hw.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl p-5 border border-border/50 shadow-soft flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
                  <BookOpen size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-body font-medium text-foreground">{hw.title}</p>
                  <p className="text-xs text-muted-foreground font-body">{hw.subject} · Due {hw.due}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {hw.grade !== null && (
                  <div className="text-right">
                    <p className={`text-sm font-heading font-bold ${
                      hw.grade >= 80 ? "text-success" : hw.grade >= 60 ? "text-warning" : "text-destructive"
                    }`}>
                      {hw.grade}%
                    </p>
                    <p className="text-[10px] text-muted-foreground font-body">Grade</p>
                  </div>
                )}

                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-medium border ${status.className}`}>
                  <StatusIcon size={12} />
                  {status.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <BookOpen size={32} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-body">No assignments found in this category.</p>
        </div>
      )}
    </ParentLayout>
  );
};

export default ParentHomework;
