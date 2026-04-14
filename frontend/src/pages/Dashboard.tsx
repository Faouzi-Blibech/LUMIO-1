import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, School, Users, ShieldCheck, ArrowRight } from "lucide-react";

const roles = [
  {
    title: "Student",
    description: "Track your focus, earn XP, and view study analytics.",
    icon: GraduationCap,
    path: "/student/dashboard",
    gradient: "from-primary to-secondary",
    bgLight: "bg-primary/8",
  },
  {
    title: "Teacher",
    description: "Monitor students, manage classes, and view risk assessments.",
    icon: School,
    path: "/teacher/dashboard",
    gradient: "from-secondary to-primary",
    bgLight: "bg-secondary/8",
  },
  {
    title: "Parent",
    description: "View your child's progress and get home support tips.",
    icon: Users,
    path: "/parent/dashboard",
    gradient: "from-success to-secondary",
    bgLight: "bg-success/8",
  },
  {
    title: "Admin",
    description: "School-wide statistics, teacher management, and settings.",
    icon: ShieldCheck,
    path: "/admin/dashboard",
    gradient: "from-warning to-primary",
    bgLight: "bg-warning/8",
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-16">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-6"
      >
        <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
          <img src="/assets/Logos/logo icon/lumio icon white.png" alt="Lumio" className="w-6 h-6 object-contain" />
        </div>
        <span className="font-heading font-bold text-2xl tracking-tight text-foreground">lumio</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-heading font-extrabold text-3xl text-foreground mb-2 text-center"
      >
        Choose your dashboard
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-sm text-muted-foreground font-body mb-12 text-center"
      >
        Select a role to explore the Lumio platform
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl w-full">
        {roles.map((role, i) => (
          <motion.div
            key={role.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
          >
            <Link
              to={role.path}
              className="group block bg-card rounded-2xl p-6 border border-border/50 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl ${role.bgLight} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                <role.icon size={22} className="text-primary" />
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground mb-1">{role.title}</h3>
              <p className="text-sm text-muted-foreground font-body mb-4 leading-relaxed">{role.description}</p>
              <span className="text-xs font-body font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                Open Dashboard <ArrowRight size={14} />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-xs text-muted-foreground font-body mt-12"
      >
        © 2026 Lumio — by Unblur
      </motion.p>
    </div>
  );
};

export default Dashboard;
