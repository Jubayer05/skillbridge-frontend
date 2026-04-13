import type { AuthUser } from "@/types/auth";
import type { AppSidebarMenuProps } from "@/types/sidebar";

export function getAdminSidebarMenu(
  user: AuthUser | null,
): AppSidebarMenuProps {
  return {
    navMain: [
      {
        title: "Overview",
        url: "/admin",
        icon: "LayoutDashboard",
        isActive: true,
        items: [{ title: "Dashboard", url: "/admin" }],
      },
      {
        title: "Management",
        url: "/admin/users",
        icon: "Users",
        isActive: false,
        items: [
          { title: "Users", url: "/admin/users" },
          { title: "Bookings", url: "/admin/bookings" },
          { title: "Categories", url: "/admin/categories" },
        ],
      },
      {
        title: "Subjects",
        url: "/dashboard/subjects",
        icon: "FolderTree",
        isActive: false,
        items: [{ title: "All subjects", url: "/dashboard/subjects" }],
      },
      {
        title: "Account",
        url: "/dashboard/profile",
        icon: "Settings",
        isActive: false,
        items: [{ title: "Profile", url: "/dashboard/profile" }],
      },
    ],
    projects: [],
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
          { title: "Bookings", url: "/dashboard/bookings" },
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
        title: "Bookings",
        url: "/dashboard/bookings",
        icon: "ClipboardList",
        isActive: false,
        items: [{ title: "All bookings", url: "/dashboard/bookings" }],
      },
      {
        title: "Reviews",
        url: "/tutor/reviews",
        icon: "Star",
        isActive: false,
        items: [{ title: "Student feedback", url: "/tutor/reviews" }],
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
