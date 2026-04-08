"use client";

import SubjectDetail from "@/components/subject/SubjectDetail";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { deleteSubject } from "@/services/subjectService";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

function paramId(value: string | string[] | undefined): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value[0]) return value[0];
  return "";
}

export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const subjectId = paramId(params?.subjectId);
  const canManage = user?.role === "ADMIN" || user?.role === "TUTOR";
  const isAdmin = user?.role === "ADMIN";
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!subjectId) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground text-sm">Invalid subject.</p>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!isAdmin) return;
    if (!window.confirm("Delete this subject? This cannot be undone.")) {
      return;
    }
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteSubject(subjectId);
      router.push("/subjects");
    } catch (err: unknown) {
      setDeleteError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {canManage ? (
        <div className="flex flex-wrap items-center gap-2 border-b px-4 pt-4 pb-2 md:px-6">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/subjects/${subjectId}/edit`}>Edit</Link>
          </Button>
          {isAdmin ? (
            <Button
              variant="destructive"
              size="sm"
              type="button"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          ) : null}
        </div>
      ) : null}
      {deleteError ? (
        <p className="text-destructive px-4 text-sm md:px-6">{deleteError}</p>
      ) : null}
      <SubjectDetail subjectId={subjectId} />
    </div>
  );
}
