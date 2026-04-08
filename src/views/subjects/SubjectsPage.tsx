"use client";

import SubjectList from "@/components/subject/SubjectList";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";

export default function SubjectsPage({
  categoryId,
}: {
  categoryId?: string;
}) {
  const { user } = useAuth();
  const canManage = user?.role === "ADMIN" || user?.role === "TUTOR";

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Subjects</h1>
          <p className="text-muted-foreground text-sm">
            Browse subjects and see which tutors teach them.
          </p>
        </div>
        {canManage ? (
          <Button asChild>
            <Link href="/dashboard/subjects/new">New subject</Link>
          </Button>
        ) : null}
      </div>
      <SubjectList categoryId={categoryId} />
    </div>
  );
}
