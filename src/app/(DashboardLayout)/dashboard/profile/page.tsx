"use client";

import { StudentProfileForm } from "@/components/modules/profile/student-profile-form";
import { TutorProfileForm } from "@/components/modules/profile/tutor-profile-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";
import { useSyncExternalStore } from "react";

function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/** Shared profile URL for all roles; form depends on `user.role`. */
export default function DashboardProfilePage() {
  const { user } = useAuth();
  const hasMounted = useHasMounted();

  if (!hasMounted) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full max-w-2xl" />
      </div>
    );
  }

  if (user?.role === "TUTOR") {
    return <TutorProfileForm />;
  }

  return <StudentProfileForm />;
}
