"use client";
import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import api from "../lib/axios";

interface User {
  id?: string;
  name?: string;
  email?: string;
  photo?: string;
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  register: (
    name: string,
    email: string,
    password: string,
    photo: string
  ) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  function setCookie(name: string, value: string, days = 7) {
    if (typeof document === "undefined") return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; expires=${expires}; path=/; SameSite=Lax`;
  }

  function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="));
    return match ? decodeURIComponent(match.split("=")[1]) : null;
  }

  function deleteCookie(name: string) {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
  }

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return getCookie("token");
  });
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    setUser(res.data.user as User);
    setToken(res.data.token);
    setCookie("token", res.data.token);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    photo: string
  ) => {
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
      photo,
    });
    setUser(res.data.user as User);
    setToken(res.data.token);
    setCookie("token", res.data.token);
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    deleteCookie("token");
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        const res = await api.get("/auth/me", {});
        setUser(res.data.user);
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token, logout]);
  console.log(user);
  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};
