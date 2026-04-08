"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/useCategories";
import type {
  CreateSubjectPayload,
  UpdateSubjectPayload,
} from "@/types/subject";
import { Loader2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

export default function SubjectForm({
  initialValues,
  onSubmit,
  loading,
  submitLabel,
}: {
  initialValues?: { name: string; description: string; categoryId: string };
  onSubmit: (
    payload: CreateSubjectPayload | UpdateSubjectPayload,
  ) => Promise<void>;
  loading: boolean;
  submitLabel: string;
}) {
  const { categories, loading: categoriesLoading } = useCategories();
  const [name, setName] = useState(initialValues?.name ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [categoryId, setCategoryId] = useState(
    initialValues?.categoryId ?? "",
  );
  const [nameError, setNameError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name);
      setDescription(initialValues.description);
      setCategoryId(initialValues.categoryId);
    }
  }, [initialValues]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError("Name is required");
      return;
    }
    setNameError(null);
    if (!categoryId) {
      setCategoryError("Category is required");
      return;
    }
    setCategoryError(null);

    const trimmedDesc = description.trim();
    const payload: CreateSubjectPayload | UpdateSubjectPayload =
      initialValues !== undefined
        ? {
            name: trimmedName,
            categoryId,
            description: trimmedDesc,
          }
        : trimmedDesc !== ""
          ? {
              name: trimmedName,
              categoryId,
              description: trimmedDesc,
            }
          : { name: trimmedName, categoryId };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subject-name">Name</Label>
        <Input
          id="subject-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError) setNameError(null);
          }}
          aria-invalid={Boolean(nameError)}
          disabled={loading}
        />
        {nameError ? (
          <p className="text-destructive text-sm">{nameError}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject-category">Category</Label>
        <select
          id="subject-category"
          className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            if (categoryError) setCategoryError(null);
          }}
          disabled={loading || categoriesLoading}
          aria-invalid={Boolean(categoryError)}
        >
          <option value="">
            {categoriesLoading ? "Loading categories…" : "Select a category"}
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {categoryError ? (
          <p className="text-destructive text-sm">{categoryError}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject-description">Description (optional)</Label>
        <Textarea
          id="subject-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          disabled={loading}
        />
      </div>
      <Button type="submit" disabled={loading || categoriesLoading}>
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Saving…
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}
