import { DashboardSectionLayout } from "@/components/layout/dashboard-section-layout";
import type { ReactNode } from "react";

export default function TutorLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardSectionLayout section="tutor">{children}</DashboardSectionLayout>
  );
}
