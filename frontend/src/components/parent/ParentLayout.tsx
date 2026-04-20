import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Dashboard", path: "/parent/dashboard" },
  { label: "Homework", path: "/parent/homework" },
  { label: "Settings", path: "/parent/settings" },
];

interface ParentLayoutProps {
  children: React.ReactNode;
}

export const ParentLayout = ({ children }: ParentLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-primary rounded-lg flex items-center justify-center">
              <img src="/assets/Logos/logo icon/lumio icon white.png" alt="Lumio" className="w-5 h-5 object-contain" />
            </div>
            <span className="font-heading font-bold text-base tracking-tight text-foreground">lumio</span>
            <span className="text-xs font-body font-medium text-success bg-success/8 px-2 py-0.5 rounded-lg">Parent</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 text-sm font-body font-medium rounded-xl transition-colors ${
                    isActive
                      ? "text-primary bg-primary/8"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-muted/50 text-muted-foreground transition-colors">
              <Bell size={16} />
            </button>
            <div className="w-8 h-8 rounded-xl bg-success/10 flex items-center justify-center font-heading font-bold text-success text-sm">
              {user?.name?.charAt(0) || "F"}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl hover:bg-destructive/15 text-muted-foreground hover:text-destructive hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all duration-300"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};
