"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Category } from "@/types/category";

export default function CategoryCard({
  category,
  onClick,
}: {
  category: Category;
  onClick: () => void;
}) {
  const subjectCount = category._count?.subjects ?? 0;
  const tutorCount = category._count?.tutorProfiles ?? 0;
  const subjects = category.subjects ?? [];
  const preview = subjects.slice(0, 6);

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left focus-visible:ring-ring rounded-xl focus-visible:ring-2 focus-visible:outline-none"
    >
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-lg leading-tight">{category.name}</CardTitle>
          <Badge variant="secondary">{tutorCount} tutors</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {category.description ?? "No description"}
          </p>
          {preview.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {preview.map((s) => (
                <Link
                  key={s.id}
                  href={`/categories/${encodeURIComponent(category.id)}/subjects/${encodeURIComponent(s.id)}`}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-muted text-muted-foreground hover:text-foreground inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs transition-colors"
                >
                  <span className="truncate">{s.name}</span>
                  <span className="text-foreground/70 font-medium">
                    {s.availableSlotsCount ?? 0}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-xs">
              No subjects in this category yet.
            </p>
          )}
          <p className="text-muted-foreground text-xs">
            {subjectCount} subject{subjectCount === 1 ? "" : "s"}
          </p>
        </CardContent>
      </Card>
    </button>
  );
}
