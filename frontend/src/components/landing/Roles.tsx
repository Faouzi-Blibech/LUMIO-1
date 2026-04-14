import { motion } from "framer-motion";
import { GraduationCap, School, Users } from "lucide-react";

const roles = [
  {
    icon: GraduationCap,
    title: "For Students",
    description: "Track your focus in real-time, earn XP, get personalized study tips, and watch your progress grow.",
    features: ["Live focus score", "Self-help tips", "Progress charts", "Gamification"],
    color: "primary",
  },
  {
    icon: School,
    title: "For Teachers",
    description: "Monitor your entire class's attention instantly, identify struggling students, and get AI-powered intervention recommendations.",
    features: ["Class dashboard", "Risk assessment", "Distraction insights", "Homework management"],
    color: "secondary",
  },
  {
    icon: Users,
    title: "For Parents",
    description: "Stay informed about your child's focus and progress with simple summaries and actionable home support tips.",
    features: ["Focus overview", "Home support tips", "Homework alerts", "Privacy-first design"],
    color: "primary",
  },
];

export function Roles() {
  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-body font-medium text-primary tracking-widest uppercase">
            Built for everyone
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground mt-3 mb-4 tracking-tight">
            One platform, <span className="text-gradient">three experiences</span>
          </h2>
          <p className="text-muted-foreground font-body">
            Lumio adapts to each user's role, showing exactly what matters most.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {roles.map((role, i) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="bg-card rounded-2xl p-8 border border-border/50 shadow-card hover:shadow-elevated transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl bg-${role.color}/10 flex items-center justify-center mb-6`}>
                <role.icon className={`w-7 h-7 text-${role.color}`} />
              </div>
              <h3 className="font-heading font-bold text-xl text-foreground mb-3">{role.title}</h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed mb-6">{role.description}</p>
              <ul className="space-y-2.5">
                {role.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm font-body text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
