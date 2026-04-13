"use client";

import CategoryDetail from "@/components/category/CategoryDetail";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { deleteCategory } from "@/services/categoryService";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

function paramId(
  value: string | string[] | undefined,
): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value[0]) return value[0];
  return "";
}

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const categoriesBase = pathname.startsWith("/admin/categories")
    ? "/admin/categories"
    : "/dashboard/categories";
  const { user } = useAuth();
  const categoryId = paramId(params?.categoryId);
  const canManage = user?.role === "ADMIN" || user?.role === "TUTOR";
  const isAdminRole = user?.role === "ADMIN";
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!categoryId) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground text-sm">Invalid category.</p>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!isAdminRole) return;
    if (!window.confirm("Delete this category? This cannot be undone.")) {
      return;
    }
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteCategory(categoryId);
      router.push(
        pathname.startsWith("/admin/categories")
          ? "/admin/categories"
          : "/dashboard/categories",
      );
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
            <Link href={`${categoriesBase}/${categoryId}/edit`}>Edit</Link>
          </Button>
          {isAdminRole ? (
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
      <CategoryDetail categoryId={categoryId} />
    </div>
  );
}
