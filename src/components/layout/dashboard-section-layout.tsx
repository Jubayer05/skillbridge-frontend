import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Section = "user" | "tutor" | "admin";

interface DashboardSectionLayoutProps {
  section: Section;
  children: ReactNode;
  className?: string;
}

const sectionLabels: Record<Section, string> = {
  user: "User",
  tutor: "Tutor",
  admin: "Admin",
};

export function DashboardSectionLayout({
  section,
  children,
  className,
}: DashboardSectionLayoutProps) {
  return (
    <div
      className={cn("flex min-h-0 flex-1 flex-col", className)}
      data-section={section}
    >
      <section
        className="flex flex-1 flex-col"
        aria-label={sectionLabels[section]}
      >
        {children}
      </section>
    </div>
  );
}
