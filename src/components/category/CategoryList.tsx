"use client";

import CategoryCard from "@/components/category/CategoryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/useCategories";
import { usePathname, useRouter } from "next/navigation";

function CategoryListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-xl border p-4">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}

export default function CategoryList() {
  const router = useRouter();
  const pathname = usePathname();
  const { categories, loading, error } = useCategories();
  const path = pathname ?? "";
  const base = path.startsWith("/admin/categories")
    ? "/admin/categories"
    : path.startsWith("/dashboard/")
      ? "/dashboard/categories"
      : "/categories";

  if (loading) {
    return <CategoryListSkeleton />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (categories.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">No categories yet.</p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onClick={() => {
            router.push(`${base}/${category.id}`);
          }}
        />
      ))}
    </div>
  );
}
