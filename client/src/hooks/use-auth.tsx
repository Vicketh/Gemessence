import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

interface User {
  id: number;
  username: string;
  fullName?: string | null;
  email: string;
  isVerified: boolean | null;
  isAdmin: boolean | null;
  isSuperUser: boolean | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  county: string | null;
  createdAt: Date | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: { username: string; password: string }) => void;
  register: (data: { fullName: string; email: string; phone: string; password: string }) => void;
  logout: () => void;
  isLoginPending: boolean;
  isRegisterPending: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const USER_KEY = "gem_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [isLoading] = useState(false);
  const [isLoginPending, setIsLoginPending] = useState(false);
  const [isRegisterPending, setIsRegisterPending] = useState(false);

  const saveUser = (u: any): User => {
    const mapped: User = {
      id: u.id,
      username: u.username,
      fullName: u.full_name ?? u.fullName ?? u.username,
      email: u.email,
      isVerified: u.is_verified ?? u.isVerified ?? false,
      isAdmin: u.is_admin ?? u.isAdmin ?? false,
      isSuperUser: u.is_super_user ?? u.isSuperUser ?? false,
      phone: u.phone ?? null,
      address: u.address ?? null,
      city: u.city ?? null,
      county: u.county ?? null,
      createdAt: u.created_at ? new Date(u.created_at) : (u.createdAt ? new Date(u.createdAt) : null),
    };
    setUser(mapped);
    localStorage.setItem(USER_KEY, JSON.stringify(mapped));
    return mapped;
  };

  const login = async (data: { username: string; password: string }) => {
    setIsLoginPending(true);
    try {
      // Try Express backend first (handles bcrypt), fall back to Supabase direct
      let u: any = null;
      if (API_BASE) {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          credentials: "include",
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: "Invalid credentials" }));
          throw new Error(err.message);
        }
        u = await res.json();
      } else {
        // Static/GitHub Pages mode — use Supabase
        const { loginUser } = await import("@/lib/supabase");
        u = await loginUser(data.username, data.password);
      }
      const mapped = saveUser(u);
      toast({ title: "Welcome back!", description: `Signed in as ${mapped.username}` });
      if (mapped.isAdmin || mapped.isSuperUser) {
        setLocation("/admin");
      } else {
        setLocation("/dashboard");
      }
    } catch (err: any) {
      toast({ title: "Login Failed", description: err.message || "Invalid credentials", variant: "destructive" });
    } finally {
      setIsLoginPending(false);
    }
  };

  const register = async (data: { fullName: string; email: string; phone: string; password: string }) => {
    setIsRegisterPending(true);
    try {
      let u: any = null;
      const payload = {
        ...data,
        username: data.email.split("@")[0].replace(/[^a-z0-9_-]/gi, "").toLowerCase() || data.fullName.replace(/\s+/g, "").toLowerCase(),
      };
      if (API_BASE) {
        const res = await fetch(`${API_BASE}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: "Registration failed" }));
          throw new Error(err.message);
        }
        u = await res.json();
      } else {
        const { registerUser } = await import("@/lib/supabase");
        u = await registerUser(payload);
      }
      saveUser(u);
      toast({ title: "Welcome to Gemessence!", description: "Your account has been created." });
      setLocation("/dashboard");
    } catch (err: any) {
      toast({ title: "Registration Failed", description: err.message || "Could not create account", variant: "destructive" });
    } finally {
      setIsRegisterPending(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    if (API_BASE) {
      fetch(`${API_BASE}/api/auth/logout`, { method: "POST", credentials: "include" }).catch(() => {});
    }
    toast({ title: "Signed out", description: "You have been logged out." });
    setLocation("/");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isLoginPending, isRegisterPending }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
