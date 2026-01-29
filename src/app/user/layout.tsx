import { AppSidebar } from "@/components/sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { ReactNode } from "react";

const sidebarStyles = {
  "--sidebar-width": "calc(var(--spacing) * 72)",
  "--header-height": "calc(var(--spacing) * 12)",
} as React.CSSProperties;

const userSidebarMenu = {
  navMain: [
    {
      title: "Dashboard",
      url: "/user/dashboard",
      icon: "LayoutDashboard",
      isActive: true,
      items: [
        { title: "Overview", url: "/user/dashboard" },
        { title: "Analytics", url: "/user/analytics" },
        { title: "Activity", url: "/user/activity" },
      ],
    },
    {
      title: "My learning",
      url: "/user/learning",
      icon: "BookOpen",
      items: [
        { title: "Courses", url: "/user/courses" },
        { title: "Bookmarks", url: "/user/bookmarks" },
      ],
    },
    {
      title: "Settings",
      url: "/user/settings",
      icon: "Settings",
      items: [
        { title: "Profile", url: "/user/settings/profile" },
        { title: "Notifications", url: "/user/settings/notifications" },
      ],
    },
  ],
  projects: [
    {
      name: "In progress",
      url: "/user/learning?filter=in-progress",
      icon: "Frame",
    },
    {
      name: "Completed",
      url: "/user/learning?filter=completed",
      icon: "PieChart",
    },
  ],
  user: {
    name: "User",
    email: "user@example.com",
    avatar: "",
  },
};

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider style={sidebarStyles}>
      <AppSidebar menu={userSidebarMenu} variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
