import type { AuthUser } from "@/types/auth";
import type { AppSidebarMenuProps } from "@/types/sidebar";

export function getAdminSidebarMenu(
  user: AuthUser | null,
): AppSidebarMenuProps {
  return {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: "LayoutDashboard",
        isActive: true,
        items: [
          { title: "Overview", url: "/dashboard" },
          { title: "Analytics", url: "/admin/analytics" },
          { title: "Activity", url: "/admin/activity" },
        ],
      },
      {
        title: "My learning",
        url: "/admin/learning",
        icon: "BookOpen",
        items: [
          { title: "Courses", url: "/admin/courses" },
          { title: "Bookmarks", url: "/admin/bookmarks" },
        ],
      },
      {
        title: "Settings",
        url: "/admin/settings",
        icon: "Settings",
        items: [
          { title: "Profile", url: "/admin/settings/profile" },
          { title: "Notifications", url: "/admin/settings/notifications" },
        ],
      },
      {
        title: "Catalog",
        url: "/dashboard/categories",
        icon: "FolderTree",
        items: [
          { title: "Categories", url: "/dashboard/categories" },
          { title: "Subjects", url: "/dashboard/subjects" },
        ],
      },
    ],
    projects: [
      {
        name: "In progress",
        url: "/admin/learning?filter=in-progress",
        icon: "Frame",
      },
      {
        name: "Completed",
        url: "/admin/learning?filter=completed",
        icon: "PieChart",
      },
    ],
    user: {
      name: user?.name ?? "Admin",
      email: user?.email ?? "",
      avatar: "",
    },
  };
}

export function getStudentSidebarMenu(
  user: AuthUser | null,
): AppSidebarMenuProps {
  return {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: "LayoutDashboard",
        isActive: true,
        items: [
          { title: "Overview", url: "/dashboard" },
          { title: "Profile", url: "/dashboard/profile" },
        ],
      },
      {
        title: "My learning",
        url: "/student/learning",
        icon: "BookOpen",
        items: [
          { title: "Courses", url: "/student/courses" },
          { title: "Bookmarks", url: "/student/bookmarks" },
        ],
      },
      {
        title: "Settings",
        url: "/student/settings",
        icon: "Settings",
        items: [
          { title: "Profile", url: "/dashboard/profile" },
          { title: "Notifications", url: "/student/settings/notifications" },
        ],
      },
    ],
    projects: [
      {
        name: "In progress",
        url: "/student/learning?filter=in-progress",
        icon: "Frame",
      },
      {
        name: "Completed",
        url: "/student/learning?filter=completed",
        icon: "PieChart",
      },
    ],
    user: {
      name: user?.name ?? "Student",
      email: user?.email ?? "",
      avatar: "",
    },
  };
}

// Tutor availability pages live under `@tutor/tutor/availability/*` → `/tutor/availability/...`.
export function getTutorSidebarMenu(
  user: AuthUser | null,
): AppSidebarMenuProps {
  return {
    navMain: [
      {
        title: "Availability",
        url: "/tutor/availability",
        icon: "Calendar",
        isActive: true,
        items: [
          { title: "My slots", url: "/tutor/availability" },
          { title: "New slot", url: "/tutor/availability/new" },
        ],
      },
      {
        title: "Catalog",
        url: "/dashboard/categories",
        icon: "FolderTree",
        items: [
          { title: "Categories", url: "/dashboard/categories" },
          { title: "Subjects", url: "/dashboard/subjects" },
        ],
      },
      {
        title: "Settings",
        url: "/dashboard/profile",
        icon: "Settings",
        items: [{ title: "Profile", url: "/dashboard/profile" }],
      },
    ],
    projects: [],
    user: {
      name: user?.name ?? "Tutor",
      email: user?.email ?? "",
      avatar: "",
    },
  };
}
