import { redirect } from "next/navigation";

/** Sidebar and bookmarks may use `/tutor/dashboard`; home lives at `/dashboard`. */
export default function TutorDashboardAliasPage() {
  redirect("/dashboard");
}
