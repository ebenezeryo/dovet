import React, { createContext, useContext, useState, useEffect } from "react";
import type { DovetUser, UserRole } from "./types";
import { toast } from "sonner";

export const DEMO_USERS: Record<UserRole, DovetUser> = {
  admin: {
    id: "admin-001",
    fullName: "Dr. Elizabeth Vance",
    email: "principal@dovetacademy.io",
    role: "admin",
    schoolName: "Dovet International Academy",
    subdomain: "dovet-academy",
    schoolLogo: null,
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
  teacher: {
    id: "teacher-001",
    fullName: "Mrs. Olu Adebayo",
    email: "o.adebayo@dovetacademy.io",
    role: "teacher",
    schoolName: "Dovet International Academy",
    subdomain: "dovet-academy",
    schoolLogo: null,
    avatarUrl: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80",
  },
  student: {
    id: "student-001",
    fullName: "Jack Sterling",
    email: "j.sterling@dovetacademy.io",
    role: "student",
    schoolName: "Dovet International Academy",
    subdomain: "dovet-academy",
    schoolLogo: null,
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  },
  parent: {
    id: "parent-001",
    fullName: "Chief & Mrs. Adeyemi",
    email: "parent.adeyemi@gmail.com",
    role: "parent",
    schoolName: "Dovet International Academy",
    subdomain: "dovet-academy",
    childId: "student-001",
    schoolLogo: null,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
};

interface AuthContextType {
  user: DovetUser | null;
  token: string | null;
  isLoading: boolean;
  isOnline: boolean;
  login: (token: string, user: DovetUser) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  brandColor: string;
  setBrandColor: (color: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DovetUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [brandColor, setBrandColorState] = useState<string>("#3C594E");

  // Track connection state for the whole app lifetime
  useEffect(() => {
    const goOnline  = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online",  goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online",  goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const applyBrandColor = (color: string) => {
    setBrandColorState(color);
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--brand-primary", color);
    }
  };

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("dovet_token");
      const storedUser = localStorage.getItem("dovet_user");
      const storedBrand = localStorage.getItem("dovet_brand_color");

      if (storedBrand) {
        applyBrandColor(storedBrand);
      }

      if (storedToken && storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setToken(storedToken);
      }
    } catch {
      localStorage.removeItem("dovet_token");
      localStorage.removeItem("dovet_user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: DovetUser) => {
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem("dovet_token", newToken);
    localStorage.setItem("dovet_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("dovet_token");
    localStorage.removeItem("dovet_user");
    toast.success("Logged out successfully");
  };

  const switchRole = (role: UserRole) => {
    const demoUser = DEMO_USERS[role];
    const demoToken = `demo-token-${role}-${Date.now()}`;
    login(demoToken, demoUser);
    toast.info(`Switched to demo ${role.toUpperCase()} account`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isOnline,
        login,
        logout,
        switchRole,
        brandColor,
        setBrandColor: applyBrandColor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      token: null,
      isLoading: false,
      isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
      login: (newToken, newUser) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("dovet_token", newToken);
          localStorage.setItem("dovet_user", JSON.stringify(newUser));
        }
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("dovet_token");
          localStorage.removeItem("dovet_user");
        }
      },
      switchRole: (role: UserRole) => {
        if (typeof window !== "undefined") {
          const demoUser = DEMO_USERS[role];
          const demoToken = `demo-token-${role}-${Date.now()}`;
          localStorage.setItem("dovet_token", demoToken);
          localStorage.setItem("dovet_user", JSON.stringify(demoUser));
        }
      },
      brandColor: "#3C594E",
      setBrandColor: () => {},
    };
  }
  return context;
}
