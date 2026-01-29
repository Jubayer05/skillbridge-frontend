import { DashboardSectionLayout } from "@/components/layout/dashboard-section-layout";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardSectionLayout section="admin">{children}</DashboardSectionLayout>
  );
}
