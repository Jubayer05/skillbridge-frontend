"use client";

import CategoryForm from "@/components/category/CategoryForm";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategoryById } from "@/hooks/useCategories";
import { updateCategory } from "@/services/categoryService";
import type {
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types/category";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

function paramId(value: string | string[] | undefined): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value[0]) return value[0];
  return "";
}

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = paramId(params?.categoryId);
  const { category, loading, error } = useCategoryById(categoryId);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSubmit = async (
    payload: CreateCategoryPayload | UpdateCategoryPayload,
  ) => {
    if (!categoryId) return;
    setSaving(true);
    setSaveError(null);
    try {
      await updateCategory(categoryId, payload);
      router.push(`/categories/${categoryId}`);
    } catch (err: unknown) {
      setSaveError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!categoryId) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground text-sm">Invalid category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Edit category
        </h1>
        <p className="text-muted-foreground text-sm">
          Update the name or description for this category.
        </p>
      </div>
      {error ? <p className="text-red-500 text-sm">{error}</p> : null}
      {saveError ? <p className="text-destructive text-sm">{saveError}</p> : null}
      {loading ? (
        <div className="max-w-lg space-y-3">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : category ? (
        <CategoryForm
          initialValues={{
            name: category.name,
            description: category.description ?? "",
          }}
          onSubmit={handleSubmit}
          loading={saving}
          submitLabel="Save changes"
        />
      ) : null}
    </div>
  );
}
