import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type UserRole = "student" | "teacher" | "parent" | "admin";

interface User {
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isAuthenticated: boolean;
}

// Demo credentials for all 4 roles
const DEMO_USERS: Record<string, { password: string; name: string; role: UserRole }> = {
  "student@lumio.tn": { password: "student123", name: "Ahmed Ben Ali", role: "student" },
  "teacher@lumio.tn": { password: "teacher123", name: "Ms. Trabelsi", role: "teacher" },
  "parent@lumio.tn": { password: "parent123", name: "Fatma Ben Ali", role: "parent" },
  "admin@lumio.tn": { password: "admin123", name: "Dr. Amira Khelifi", role: "admin" },
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("lumio_user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("lumio_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("lumio_user");
    }
  }, [user]);

  const login = (email: string, password: string) => {
    const entry = DEMO_USERS[email.toLowerCase()];
    if (!entry) return { success: false, error: "Account not found" };
    if (entry.password !== password) return { success: false, error: "Wrong password" };

    setUser({ email: email.toLowerCase(), name: entry.name, role: entry.role });
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Route guard component
export const RequireAuth = ({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles: UserRole[];
}) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    } else if (user && !allowedRoles.includes(user.role)) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, user, allowedRoles, navigate]);

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};
