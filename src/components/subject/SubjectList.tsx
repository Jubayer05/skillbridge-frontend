"use client";

import SubjectCard from "@/components/subject/SubjectCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategoryById } from "@/hooks/useCategories";
import { useSubjects } from "@/hooks/useSubjects";
import { usePathname, useRouter } from "next/navigation";

function SubjectListSkeleton() {
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

export default function SubjectList({
  categoryId,
}: {
  categoryId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { subjects, loading, error } = useSubjects(categoryId);
  const base = (pathname ?? "").startsWith("/dashboard/")
    ? "/dashboard/subjects"
    : "/subjects";
  const { category: filterCategory } = useCategoryById(
    categoryId ?? "",
  );

  if (loading) {
    return <SubjectListSkeleton />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-4">
      {categoryId ? (
        <p className="text-muted-foreground text-sm">
          Showing subjects in{" "}
          <span className="text-foreground font-medium">
            {filterCategory?.name ?? "this category"}
          </span>
        </p>
      ) : null}
      {subjects.length === 0 ? (
        <p className="text-muted-foreground text-sm">No subjects found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onClick={() => {
                router.push(`${base}/${subject.id}`);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
