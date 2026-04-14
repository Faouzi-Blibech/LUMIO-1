import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for individual students getting started.",
    features: [
      "1 student account",
      "Basic focus tracking",
      "3 sessions per week",
      "Session summaries",
      "Limited AI tips",
    ],
    cta: "Get Started",
    variant: "hero-outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: "9",
    description: "For students who want unlimited access and advanced analytics.",
    features: [
      "1 student + 1 parent account",
      "Unlimited sessions",
      "Full analytics dashboard",
      "AI study recommendations",
      "XP & gamification",
      "Homework tracking",
      "Parent progress view",
    ],
    cta: "Start Free Trial",
    variant: "hero" as const,
    popular: true,
  },
  {
    name: "School",
    price: "Custom",
    description: "For schools and institutions deploying Lumio across classrooms.",
    features: [
      "Unlimited students & teachers",
      "Admin dashboard",
      "Live class monitoring",
      "Risk assessment pipeline",
      "Professional referral system",
      "API access",
      "Dedicated support",
      "Custom branding",
    ],
    cta: "Contact Sales",
    variant: "hero-outline" as const,
    popular: false,
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-xl mx-auto mb-16"
          >
            <span className="text-xs font-body font-medium text-primary tracking-widest uppercase">
              Pricing
            </span>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-foreground mt-3 mb-4 tracking-tight">
              Simple, <span className="text-gradient">transparent</span> pricing
            </h1>
            <p className="text-muted-foreground font-body">
              Start free and scale as your needs grow. No hidden fees.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-card rounded-2xl p-8 border shadow-soft transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 ${
                  plan.popular
                    ? "border-primary/30 ring-2 ring-primary/10"
                    : "border-border/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-primary text-primary-foreground text-xs font-heading font-bold">
                      <Zap size={12} /> Most Popular
                    </span>
                  </div>
                )}

                <h3 className="font-heading font-bold text-xl text-foreground mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground font-body mb-6">{plan.description}</p>

                <div className="mb-6">
                  {plan.price === "Custom" ? (
                    <span className="font-heading font-extrabold text-3xl text-foreground">Custom</span>
                  ) : (
                    <>
                      <span className="font-heading font-extrabold text-4xl text-foreground">${plan.price}</span>
                      <span className="text-sm text-muted-foreground font-body">/month</span>
                    </>
                  )}
                </div>

                <Button variant={plan.variant} size="lg" className="w-full mb-8" asChild>
                  <Link to="/signup">{plan.cta}</Link>
                </Button>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-sm font-body text-foreground">
                      <Check size={14} className="text-success shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
