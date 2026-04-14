import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  HoverCard, HoverCardContent, HoverCardTrigger
} from "@/components/ui/hover-card";
import { Search, Plus, Users, Brain, AlertTriangle, BookOpen } from "lucide-react";

const teachers = [
  {
    name: "Ms. Trabelsi",
    subject: "Mathematics",
    classes: [
      { name: "3ème Sc A", students: 32, avgFocus: 78, atRisk: 3, hwPending: 5, lastSession: "Today 10:00" },
      { name: "3ème Sc B", students: 30, avgFocus: 82, atRisk: 1, hwPending: 3, lastSession: "Today 11:30" },
    ],
    totalStudents: 62,
    avgFocus: 80,
  },
  {
    name: "Mr. Riahi",
    subject: "Physics",
    classes: [
      { name: "3ème Sc A", students: 32, avgFocus: 71, atRisk: 5, hwPending: 8, lastSession: "Today 9:00" },
      { name: "4ème Math", students: 28, avgFocus: 68, atRisk: 4, hwPending: 6, lastSession: "Yesterday 14:00" },
    ],
    totalStudents: 60,
    avgFocus: 70,
  },
  {
    name: "Ms. Mansouri",
    subject: "French",
    classes: [
      { name: "3ème Sc B", students: 30, avgFocus: 85, atRisk: 0, hwPending: 2, lastSession: "Today 8:30" },
    ],
    totalStudents: 30,
    avgFocus: 85,
  },
  {
    name: "Mr. Gharbi",
    subject: "Arabic Lit.",
    classes: [
      { name: "3ème Sc A", students: 32, avgFocus: 76, atRisk: 2, hwPending: 4, lastSession: "Yesterday 10:00" },
      { name: "3ème Sc B", students: 30, avgFocus: 79, atRisk: 1, hwPending: 3, lastSession: "Yesterday 11:00" },
    ],
    totalStudents: 62,
    avgFocus: 77,
  },
  {
    name: "Ms. Bakir",
    subject: "Biology",
    classes: [
      { name: "3ème Sc A", students: 32, avgFocus: 73, atRisk: 3, hwPending: 7, lastSession: "Today 14:00" },
    ],
    totalStudents: 32,
    avgFocus: 73,
  },
];

const AdminTeachers = () => {
  const [search, setSearch] = useState("");

  const filtered = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-foreground">Teachers</h1>
          <p className="text-sm text-muted-foreground font-body mt-1">{teachers.length} teachers registered</p>
        </div>
        <Button variant="hero" size="default">
          <Plus size={16} className="mr-1.5" /> Add Teacher
        </Button>
      </motion.div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11 rounded-xl font-body bg-muted/30 border-border"
        />
      </div>

      {/* Teacher Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl border border-border/50 shadow-soft overflow-hidden"
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50 bg-muted/20">
              <th className="text-left text-xs font-body font-medium text-muted-foreground px-6 py-4 uppercase tracking-wider">Teacher</th>
              <th className="text-left text-xs font-body font-medium text-muted-foreground px-6 py-4 uppercase tracking-wider">Subject</th>
              <th className="text-left text-xs font-body font-medium text-muted-foreground px-6 py-4 uppercase tracking-wider">Classes</th>
              <th className="text-left text-xs font-body font-medium text-muted-foreground px-6 py-4 uppercase tracking-wider">Students</th>
              <th className="text-left text-xs font-body font-medium text-muted-foreground px-6 py-4 uppercase tracking-wider">Avg Focus</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((teacher, i) => (
              <motion.tr
                key={teacher.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.04 }}
                className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center font-heading font-bold text-primary text-sm">
                      {teacher.name.split(" ")[0].charAt(0)}{teacher.name.split(" ")[1]?.charAt(0) || ""}
                    </div>
                    <span className="text-sm font-body font-medium text-foreground">{teacher.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-body text-muted-foreground">{teacher.subject}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.classes.map((cls) => (
                      <HoverCard key={cls.name} openDelay={200}>
                        <HoverCardTrigger asChild>
                          <button className="text-xs font-body font-medium text-primary bg-primary/8 px-2.5 py-1 rounded-lg hover:bg-primary/12 transition-colors">
                            {cls.name}
                          </button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-64 p-4" align="start">
                          <h4 className="font-heading font-bold text-sm text-foreground mb-1">{cls.name}</h4>
                          <p className="text-xs text-muted-foreground font-body mb-3">Subject: {teacher.subject}</p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-body">
                              <span className="flex items-center gap-1.5 text-muted-foreground"><Users size={12} /> Students</span>
                              <span className="font-medium text-foreground">{cls.students}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-body">
                              <span className="flex items-center gap-1.5 text-muted-foreground"><Brain size={12} /> Avg Focus</span>
                              <span className={`font-heading font-bold ${cls.avgFocus >= 75 ? "text-success" : cls.avgFocus >= 60 ? "text-warning" : "text-destructive"}`}>{cls.avgFocus}%</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-body">
                              <span className="flex items-center gap-1.5 text-muted-foreground"><AlertTriangle size={12} /> At-Risk</span>
                              <span className="font-medium text-foreground">{cls.atRisk} students</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-body">
                              <span className="flex items-center gap-1.5 text-muted-foreground"><BookOpen size={12} /> HW Pending</span>
                              <span className="font-medium text-foreground">{cls.hwPending}</span>
                            </div>
                            <div className="pt-1.5 border-t border-border/50 text-[11px] text-muted-foreground font-body">
                              Last session: {cls.lastSession}
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-heading font-bold text-foreground">{teacher.totalStudents}</td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-heading font-bold ${
                    teacher.avgFocus >= 75 ? "text-success" : teacher.avgFocus >= 60 ? "text-warning" : "text-destructive"
                  }`}>
                    {teacher.avgFocus}%
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Users size={32} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-body">No teachers match your search.</p>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminTeachers;
