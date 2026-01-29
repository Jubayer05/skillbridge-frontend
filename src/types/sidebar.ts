/**
 * Sidebar menu config types for passing from layout (serializable).
 * Use icon keys that match keys in the sidebar icon map in AppSidebar.
 */

export interface SidebarNavMainItem {
  title: string;
  url: string;
  icon?: string;
  isActive?: boolean;
  items?: { title: string; url: string }[];
}

export interface SidebarProjectItem {
  name: string;
  url: string;
  icon: string;
}

export interface SidebarUser {
  name: string;
  email: string;
  avatar: string;
}

export interface SidebarTeamItem {
  name: string;
  logo: string;
  plan: string;
}

export interface AppSidebarMenuProps {
  navMain: SidebarNavMainItem[];
  projects?: SidebarProjectItem[];
  user?: SidebarUser;
  teams?: SidebarTeamItem[];
}
