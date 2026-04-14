import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex">
      {/* Left - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-primary rounded-r-[3rem] m-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-white opacity-[0.04]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full border border-primary-foreground/30" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full border border-primary-foreground/20" />
          <div className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full border border-primary-foreground/20" />
        </div>
        <div className="text-center text-primary-foreground px-12 relative z-10">
          <img
            src="/assets/Logos/logo/lumio logo white version.png"
            alt="Lumio"
            className="h-12 mx-auto mb-8 object-contain"
          />
          <h2 className="font-heading font-extrabold text-3xl mb-4">
            Join the future of learning
          </h2>
          <p className="font-body text-sm opacity-70 max-w-sm mx-auto leading-relaxed">
            AI-powered focus tracking that connects students, teachers, and parents for better outcomes.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <img src="/assets/Logos/logo icon/lumio icon white.png" alt="Lumio" className="w-5 h-5 object-contain" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-foreground">lumio</span>
          </Link>

          <h1 className="font-heading font-extrabold text-2xl text-foreground mb-2">Create your account</h1>
          <p className="text-sm text-muted-foreground font-body mb-8">Get started with Lumio in seconds</p>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label className="text-sm font-body font-medium text-foreground">Full Name</Label>
              <Input
                type="text"
                placeholder="Ahmed Ben Ali"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-xl font-body bg-muted/30 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-body font-medium text-foreground">Email</Label>
              <Input
                type="email"
                placeholder="you@school.tn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl font-body bg-muted/30 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-body font-medium text-foreground">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl font-body bg-muted/30 border-border pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button variant="hero" size="lg" className="w-full">
              Create Account
            </Button>
          </form>

          <p className="text-sm text-muted-foreground font-body text-center mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
