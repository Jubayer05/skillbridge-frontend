"use client";

import { SiteHeader } from "@/components/dashboard/site-header";
import { AppSidebar } from "@/components/shared/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  getAdminSidebarMenu,
  getStudentSidebarMenu,
  getTutorSidebarMenu,
} from "@/config/sidebar-menus";
import { useAuth } from "@/context/auth-context";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useSyncExternalStore } from "react";

const sidebarStyles = {
  "--sidebar-width": "calc(var(--spacing) * 72)",
  "--header-height": "calc(var(--spacing) * 12)",
} as React.CSSProperties;

// Returns false on the server / during hydration, true after mount.
// Prevents the sidebar from flashing between the SSR placeholder and the
// role-specific menu on the first client render.
function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function DashboardLayout({
  children,
  student,
  admin,
  tutor,
}: {
  children: ReactNode;
  student: ReactNode;
  admin: ReactNode;
  tutor: ReactNode;
}) {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const hasMounted = useHasMounted();

  // Before mount every render returns null for the user so server HTML and
  // the initial client hydration tree are identical (no error #418).
  const activeUser = hasMounted ? user : null;
  const path = pathname ?? "";

  useEffect(() => {
    if (!hasMounted) return;
    if (!user) {
      router.replace(`/auth/login?next=${encodeURIComponent(path || "/dashboard")}`);
    }
  }, [hasMounted, user, router, path]);

  useEffect(() => {
    if (!hasMounted || !user) return;
    if (user.role === "ADMIN" && path === "/dashboard") {
      router.replace("/admin");
    }
  }, [hasMounted, user, path, router]);

  if (hasMounted && !user) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground text-sm">Login required.</p>
      </div>
    );
  }

  const role = activeUser?.role;
  const isAdmin = role === "ADMIN";
  const isTutor = role === "TUTOR";
  const sidebarMenu = isAdmin
    ? getAdminSidebarMenu(activeUser)
    : isTutor
      ? getTutorSidebarMenu(activeUser)
      : getStudentSidebarMenu(activeUser);

  // At /dashboard use the role-specific parallel slot content.
  // Tutor availability and related routes live under the @tutor parallel segment
  // (`@tutor/tutor/...`), so for /tutor/* we must render that slot, not `children`.
  const isDashboard = path === "/dashboard";
  const dashboardSlot = isAdmin ? admin : isTutor ? tutor : student;
  const isTutorAppRoute = isTutor && path.startsWith("/tutor/");
  const content = isDashboard
    ? dashboardSlot
    : isTutorAppRoute
      ? tutor
      : children;

  return (
    <SidebarProvider style={sidebarStyles}>
      {hasMounted ? (
        <AppSidebar menu={sidebarMenu} variant="inset" />
      ) : (
        // Avoid SSR hydration mismatches from Radix-generated IDs in the sidebar.
        <div aria-hidden />
      )}
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {content}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
