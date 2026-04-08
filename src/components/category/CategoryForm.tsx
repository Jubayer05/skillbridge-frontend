"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types/category";
import { Loader2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

export default function CategoryForm({
  initialValues,
  onSubmit,
  loading,
  submitLabel,
}: {
  initialValues?: { name: string; description: string };
  onSubmit: (
    payload: CreateCategoryPayload | UpdateCategoryPayload,
  ) => Promise<void>;
  loading: boolean;
  submitLabel: string;
}) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name);
      setDescription(initialValues.description);
    }
  }, [initialValues]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError("Name is required");
      return;
    }
    setNameError(null);
    const trimmedDesc = description.trim();
    const payload: CreateCategoryPayload | UpdateCategoryPayload =
      initialValues !== undefined
        ? { name: trimmed, description: trimmedDesc }
        : trimmedDesc !== ""
          ? { name: trimmed, description: trimmedDesc }
          : { name: trimmed };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category-name">Name</Label>
        <Input
          id="category-name"
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
        <Label htmlFor="category-description">Description (optional)</Label>
        <Textarea
          id="category-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          disabled={loading}
        />
      </div>
      <Button type="submit" disabled={loading}>
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
