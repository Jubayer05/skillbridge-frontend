"use client";

import SubjectForm from "@/components/subject/SubjectForm";
import { createSubject } from "@/services/subjectService";
import type {
  CreateSubjectPayload,
  UpdateSubjectPayload,
} from "@/types/subject";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateSubjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    payload: CreateSubjectPayload | UpdateSubjectPayload,
  ) => {
    setLoading(true);
    setError(null);
    try {
      if (!payload.categoryId) {
        setError("Category is required");
        setLoading(false);
        return;
      }
      const name = payload.name?.trim();
      if (!name) {
        setError("Name is required");
        setLoading(false);
        return;
      }
      const created = await createSubject({
        name,
        categoryId: payload.categoryId,
        ...(payload.description !== undefined
          ? { description: payload.description }
          : {}),
      });
      router.push(`/subjects/${created.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New subject</h1>
        <p className="text-muted-foreground text-sm">
          Add a subject under an existing category.
        </p>
      </div>
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
      <SubjectForm
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="Create subject"
      />
    </div>
  );
}
