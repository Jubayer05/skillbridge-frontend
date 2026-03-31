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
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
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
  const hasMounted = useHasMounted();

  // Before mount every render returns null for the user so server HTML and
  // the initial client hydration tree are identical (no error #418).
  const activeUser = hasMounted ? user : null;

  const role = activeUser?.role;
  const isAdmin = role === "ADMIN";
  const isTutor = role === "TUTOR";
  const sidebarMenu = isAdmin
    ? getAdminSidebarMenu(activeUser)
    : isTutor
      ? getTutorSidebarMenu(activeUser)
      : getStudentSidebarMenu(activeUser);

  // At /dashboard use the role-specific parallel slot content.
  // For every other route (sub-pages) render the actual page via children.
  const isDashboard = pathname === "/dashboard";
  const dashboardSlot = isAdmin ? admin : isTutor ? tutor : student;
  const content = isDashboard ? dashboardSlot : children;

  return (
    <SidebarProvider style={sidebarStyles}>
      <AppSidebar menu={sidebarMenu} variant="inset" />
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
