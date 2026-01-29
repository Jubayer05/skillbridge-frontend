"use client";

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  type LucideIcon,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { AppSidebarMenuProps } from "@/types/sidebar";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  SquareTerminal,
  Bot,
  BookOpen,
  Settings: Settings2,
  Settings2,
  Frame,
  PieChart,
  Map,
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
};

function resolveIcon(name: string | undefined): LucideIcon | undefined {
  if (!name) return undefined;
  return ICON_MAP[name] ?? ICON_MAP[name.replace(/\s/g, "")];
}

const defaultMenu: AppSidebarMenuProps = {
  navMain: [],
  projects: [],
  user: { name: "User", email: "user@example.com", avatar: "" },
};

export function AppSidebar({
  menu = defaultMenu,
  ...sidebarProps
}: React.ComponentProps<typeof Sidebar> & {
  menu?: AppSidebarMenuProps;
}) {
  const navMainResolved = React.useMemo(
    () =>
      menu.navMain.map((item) => ({
        ...item,
        icon: resolveIcon(item.icon),
      })),
    [menu.navMain],
  );

  const projectsResolved = React.useMemo(
    () =>
      (menu.projects ?? []).map((item) => ({
        ...item,
        icon: resolveIcon(item.icon) ?? Frame,
      })),
    [menu.projects],
  );

  const teamsResolved = React.useMemo(
    () =>
      (menu.teams ?? []).map((item) => ({
        ...item,
        logo: resolveIcon(item.logo) ?? Frame,
      })),
    [menu.teams],
  );

  return (
    <Sidebar collapsible="icon" {...sidebarProps}>
      {teamsResolved.length > 0 && (
        <SidebarHeader>
          <TeamSwitcher teams={teamsResolved} />
        </SidebarHeader>
      )}
      <SidebarContent>
        {navMainResolved.length > 0 && <NavMain items={navMainResolved} />}
        {projectsResolved.length > 0 && (
          <NavProjects projects={projectsResolved} />
        )}
      </SidebarContent>
      {menu.user && (
        <SidebarFooter>
          <NavUser user={menu.user} />
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  );
}
