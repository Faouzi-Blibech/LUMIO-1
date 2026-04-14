import { motion } from "framer-motion";
import { Eye, BarChart3, Lightbulb, BookOpen, Trophy, Bell } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Live Focus Tracking",
    description: "Browser-based eye tracking during study sessions. See real-time focus scores without any video leaving the device.",
  },
  {
    icon: BarChart3,
    title: "Session Analytics",
    description: "Automatic session analysis with focus stats, variance tracking, and engagement patterns over time.",
  },
  {
    icon: Lightbulb,
    title: "AI Recommendations",
    description: "Personalized study strategies generated for students, teaching tips for educators, and home support for parents.",
  },
  {
    icon: BookOpen,
    title: "Homework Management",
    description: "Submit assignments, receive grades, and get automatic struggle detection when students need extra help.",
  },
  {
    icon: Trophy,
    title: "Gamification & XP",
    description: "Earn points for consistent study sessions. Achievement badges keep students motivated and engaged.",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Real-time notifications for teachers when risk thresholds are crossed. Weekly summary reports via email.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-body font-medium text-primary tracking-widest uppercase"
          >
            Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground mt-3 mb-4 tracking-tight"
          >
            Everything you need to support{" "}
            <span className="text-gradient">every learner</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground font-body"
          >
            Lumio brings students, teachers, and parents together with AI-powered tools designed for attention-diverse classrooms.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group p-8 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mb-5 group-hover:bg-primary/12 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
