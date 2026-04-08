"use client";

import SubjectForm from "@/components/subject/SubjectForm";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubjectById } from "@/hooks/useSubjects";
import { updateSubject } from "@/services/subjectService";
import type {
  CreateSubjectPayload,
  UpdateSubjectPayload,
} from "@/types/subject";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

function paramId(value: string | string[] | undefined): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value[0]) return value[0];
  return "";
}

export default function EditSubjectPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = paramId(params?.subjectId);
  const { subject, loading, error } = useSubjectById(subjectId);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSubmit = async (
    payload: CreateSubjectPayload | UpdateSubjectPayload,
  ) => {
    if (!subjectId) return;
    setSaving(true);
    setSaveError(null);
    try {
      await updateSubject(subjectId, payload);
      router.push(`/dashboard/subjects/${subjectId}`);
    } catch (err: unknown) {
      setSaveError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!subjectId) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground text-sm">Invalid subject.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit subject</h1>
        <p className="text-muted-foreground text-sm">
          Update name, category, or description.
        </p>
      </div>
      {error ? <p className="text-red-500 text-sm">{error}</p> : null}
      {saveError ? <p className="text-destructive text-sm">{saveError}</p> : null}
      {loading ? (
        <div className="max-w-lg space-y-3">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : subject ? (
        <SubjectForm
          initialValues={{
            name: subject.name,
            description: subject.description ?? "",
            categoryId: subject.categoryId,
          }}
          onSubmit={handleSubmit}
          loading={saving}
          submitLabel="Save changes"
        />
      ) : null}
    </div>
  );
}
