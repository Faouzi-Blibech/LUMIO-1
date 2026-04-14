import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-6"
      >
        <Link to="/" className="flex items-center gap-2 justify-center mb-10">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
            <img src="/assets/Logos/logo icon/lumio icon white.png" alt="Lumio" className="w-6 h-6 object-contain" />
          </div>
          <span className="font-heading font-bold text-2xl tracking-tight text-foreground">lumio</span>
        </Link>

        <h1 className="font-heading font-extrabold text-7xl text-gradient mb-4">404</h1>
        <h2 className="font-heading font-bold text-xl text-foreground mb-2">Page not found</h2>
        <p className="text-sm text-muted-foreground font-body mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button variant="hero-outline" size="lg" onClick={() => window.history.back()}>
            <ArrowLeft size={16} className="mr-1.5" /> Go Back
          </Button>
          <Button variant="hero" size="lg" asChild>
            <Link to="/">
              <Home size={16} className="mr-1.5" /> Home
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
