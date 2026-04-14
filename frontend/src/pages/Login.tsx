import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = login(email, password);
    if (result.success) {
      // Redirect based on role
      const roleMap: Record<string, string> = {
        "student@lumio.tn": "/student/dashboard",
        "teacher@lumio.tn": "/teacher/dashboard",
        "parent@lumio.tn": "/parent/dashboard",
        "admin@lumio.tn": "/admin/dashboard",
      };
      navigate(roleMap[email.toLowerCase()] || "/dashboard");
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
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

          <h1 className="font-heading font-extrabold text-2xl text-foreground mb-2">Welcome back</h1>
          <p className="text-sm text-muted-foreground font-body mb-8">Sign in to your Lumio account</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm font-body text-destructive"
            >
              {error}
            </motion.div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label className="text-sm font-body font-medium text-foreground">Email</Label>
              <Input
                type="email"
                placeholder="you@lumio.tn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl font-body bg-muted/30 border-border"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-body font-medium text-foreground">Password</Label>
                <a href="#" className="text-xs text-primary font-body hover:underline">Forgot password?</a>
              </div>
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

            <Button variant="hero" size="lg" className="w-full" type="submit">
              Sign In
            </Button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border/50">
            <p className="text-xs font-body font-medium text-foreground mb-2">Demo accounts:</p>
            <div className="space-y-1 text-[11px] font-body text-muted-foreground">
              <p><span className="text-foreground font-medium">Student:</span> student@lumio.tn / student123</p>
              <p><span className="text-foreground font-medium">Teacher:</span> teacher@lumio.tn / teacher123</p>
              <p><span className="text-foreground font-medium">Parent:</span> parent@lumio.tn / parent123</p>
              <p><span className="text-foreground font-medium">Admin:</span> admin@lumio.tn / admin123</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground font-body text-center mt-8">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-primary rounded-l-[3rem] m-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-white opacity-[0.04]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full border border-primary-foreground/30" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full border border-primary-foreground/20" />
          <div className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full border border-primary-foreground/20" />
        </div>
        <div className="text-center text-primary-foreground px-12 relative z-10">
          <h2 className="font-heading font-extrabold text-3xl mb-4">Where every student is seen</h2>
          <p className="font-body text-sm opacity-70 max-w-sm mx-auto leading-relaxed">
            AI-powered focus tracking that helps students, teachers, and parents work together for better learning outcomes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
