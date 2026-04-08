"use client";

import CategoryForm from "@/components/category/CategoryForm";
import { createCategory } from "@/services/categoryService";
import type {
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types/category";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    payload: CreateCategoryPayload | UpdateCategoryPayload,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const name = payload.name?.trim();
      if (!name) {
        setError("Name is required");
        setLoading(false);
        return;
      }
      await createCategory({
        name,
        ...(payload.description !== undefined
          ? { description: payload.description }
          : {}),
      });
      router.push("/dashboard/categories");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          New category
        </h1>
        <p className="text-muted-foreground text-sm">
          Create a category tutors and subjects can be grouped under.
        </p>
      </div>
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
      <CategoryForm
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="Create category"
      />
    </div>
  );
}
