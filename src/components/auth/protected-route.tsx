"use client";

import { useAuth } from "@/context/auth-context";
import type { Role } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedRoute({
  roles,
  children,
}: {
  roles: readonly Role[] | Role[];
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
      return;
    }
    if (!roles.includes(user.role)) {
      router.replace("/dashboard");
    }
  }, [user, roles, router]);

  if (!user || !roles.includes(user.role)) {
    return (
      <div className="text-muted-foreground p-6 text-sm">Checking access…</div>
    );
  }

  return <>{children}</>;
}
