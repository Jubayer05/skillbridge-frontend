"use client";

import { API_ENDPOINTS } from "@/config/apiConfig";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const POLL_MS = 3000;

/**
 * The Next.js middleware only sees the client `skillbridge-user` cookie (long TTL),
 * not the Better Auth session on the API domain. When the server session expires,
 * the user would still pass middleware until something talks to the backend.
 *
 * Poll Better Auth `get-session` (with disableRefresh + disableCookieCache in the URL)
 * so we only *read* session state — without that, each poll would refresh the sliding
 * session and it would never expire while this component is mounted.
 */
export function DashboardSessionWatcher() {
  const { user, clearAuth } = useAuth();
  const router = useRouter();
  const warnedRef = useRef(false);

  useEffect(() => {
    if (!user) return;

    const check = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.auth.getSession, {
          credentials: "include",
          cache: "no-store",
        });
        const data: unknown = await res.json();

        const session =
          data &&
          typeof data === "object" &&
          "session" in data &&
          (data as { session?: unknown }).session;

        if (!session) {
          if (!warnedRef.current) {
            warnedRef.current = true;
            toast.message("Session expired", {
              description: "Please sign in again.",
            });
          }
          clearAuth();
          router.push("/auth/login");
          router.refresh();
        }
      } catch {
        // Network errors — do not clear auth
      }
    };

    void check();
    const id = setInterval(check, POLL_MS);
    return () => clearInterval(id);
  }, [user, clearAuth, router]);

  return null;
}
