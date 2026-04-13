"use client";

import type { MenuItem, NavbarAuth, NavbarLogo } from "@/types/navbar";
import { Book, Sunset, Trees, Zap } from "lucide-react";

export const defaultNavbarLogo: NavbarLogo = {
  url: "/",
  src: "/logo/logo-light.png",
  alt: "SkillBridge logo",
  title: "SkillBridge",
};

export const defaultNavbarMenu: MenuItem[] = [
  { title: "Home", url: "#" },
  {
    title: "Resources",
    url: "#",
    items: [
      {
        title: "Help Center",
        description: "Get all the answers you need right here",
        icon: <Zap className="size-5 shrink-0" />,
        url: "#",
      },
      {
        title: "Contact Us",
        description: "We are here to help you with any questions you have",
        icon: <Sunset className="size-5 shrink-0" />,
        url: "#",
      },
      {
        title: "Status",
        description: "Check the current status of our services and APIs",
        icon: <Trees className="size-5 shrink-0" />,
        url: "#",
      },
      {
        title: "Terms of Service",
        description: "Our terms and conditions for using our services",
        icon: <Book className="size-5 shrink-0" />,
        url: "#",
      },
    ],
  },
  {
    title: "Categories",
    url: "/categories",
  },
  {
    title: "Tutors",
    url: "/tutors",
  },
  {
    title: "Subjects",
    url: "/subjects",
  },
];

export const defaultNavbarAuth: NavbarAuth = {
  login: { title: "Login", url: "/auth/login" },
  signup: { title: "Sign up", url: "/auth/register" },
};
