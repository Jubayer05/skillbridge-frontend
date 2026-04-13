"use client";

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Calendar,
  ClipboardList,
  Command,
  FolderTree,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { defaultNavbarLogo } from "@/config/navbar";
import { NavMain } from "@/components/shared/sidebar/nav-main";
import { NavProjects } from "@/components/shared/sidebar/nav-projects";
import { NavUser } from "@/components/shared/sidebar/nav-user";
import { TeamSwitcher } from "@/components/shared/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { AppSidebarMenuProps } from "@/types/sidebar";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  SquareTerminal,
  Bot,
  BookOpen,
  Calendar,
  ClipboardList,
  Star,
  Settings: Settings2,
  Settings2,
  Frame,
  PieChart,
  Map,
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
  FolderTree,
  Users,
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
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                href={defaultNavbarLogo.url}
                className="flex min-w-0 items-center gap-2 overflow-hidden"
              >
                <span className="relative flex h-8 w-[120px] shrink-0 items-center group-data-[collapsible=icon]:hidden">
                  <Image
                    src={defaultNavbarLogo.src}
                    alt={defaultNavbarLogo.alt}
                    width={120}
                    height={32}
                    className="h-8 w-auto max-w-[120px] object-contain object-left dark:hidden"
                    priority
                  />
                  <Image
                    src="/logo/logo-dark.png"
                    alt={defaultNavbarLogo.alt}
                    width={120}
                    height={32}
                    className="hidden h-8 w-auto max-w-[120px] object-contain object-left dark:inline-block"
                    priority
                  />
                </span>
                <span className="relative hidden size-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-sidebar-border bg-sidebar group-data-[collapsible=icon]:flex">
                  <Image
                    src={defaultNavbarLogo.src}
                    alt=""
                    width={32}
                    height={32}
                    className="size-8 object-contain dark:hidden"
                    aria-hidden
                  />
                  <Image
                    src="/logo/logo-dark.png"
                    alt=""
                    width={32}
                    height={32}
                    className="hidden size-8 object-contain dark:block"
                    aria-hidden
                  />
                </span>
                <span className="sr-only">{defaultNavbarLogo.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {teamsResolved.length > 0 && <TeamSwitcher teams={teamsResolved} />}
      </SidebarHeader>
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
