import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import type { ReactNode } from "react";

export default function GeneralLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen max-w-7xl mx-auto">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
