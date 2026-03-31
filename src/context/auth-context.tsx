"use client";

import type { AuthUser } from "@/types/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

interface AuthContextValue {
  user: AuthUser | null;
  setAuth: (user: AuthUser) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const COOKIE_NAME = "skillbridge-user";

function readUserCookie(): AuthUser | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match.split("=")[1]));
  } catch {
    return null;
  }
}

function writeUserCookie(user: AuthUser) {
  const value = encodeURIComponent(JSON.stringify(user));
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

function deleteUserCookie() {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}

// ---------------------------------------------------------------------------
// External store — module-level so mutations (setAuth / clearAuth) are
// visible to all useSyncExternalStore subscribers on the same page.
// ---------------------------------------------------------------------------
const listeners = new Set<() => void>();
let _user: AuthUser | null = null;

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

// During SSR (getServerSnapshot) always return null so the server-rendered
// HTML matches the initial client render — preventing hydration error #418.
function getServerSnapshot(): null {
  return null;
}

// During client rendering return the in-memory value.
function getClientSnapshot(): AuthUser | null {
  return _user;
}

// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialise _user from the cookie once after hydration is complete.
  // Using useEffect means server and initial client renders both see null,
  // which keeps the hydrated HTML consistent.
  useEffect(() => {
    _user = readUserCookie();
    notifyListeners();
  }, []);

  const user = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const setAuth = useCallback((newUser: AuthUser) => {
    writeUserCookie(newUser);
    _user = newUser;
    notifyListeners();
  }, []);

  const clearAuth = useCallback(() => {
    deleteUserCookie();
    _user = null;
    notifyListeners();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
