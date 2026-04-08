"use client";

import TutorCard from "@/components/tutor/TutorCard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategoryById, useTutorsByCategory } from "@/hooks/useCategories";
import type { ReactNode } from "react";

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-lg font-semibold tracking-tight">{children}</h2>
  );
}

export default function CategoryDetail({
  categoryId,
}: {
  categoryId: string;
}) {
  const {
    category,
    loading: categoryLoading,
    error: categoryError,
  } = useCategoryById(categoryId);
  const {
    tutors,
    loading: tutorsLoading,
    error: tutorsError,
  } = useTutorsByCategory(categoryId);

  return (
    <div className="space-y-8 p-4 md:p-6">
      <section className="space-y-4">
        {categoryLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-1/2 max-w-md" />
            <Skeleton className="h-20 w-full max-w-2xl" />
            <Skeleton className="h-6 w-full max-w-lg" />
          </div>
        ) : categoryError ? (
          <p className="text-red-500">{categoryError}</p>
        ) : category ? (
          <>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {category.name}
                </h1>
                {category._count?.tutorProfiles !== undefined ? (
                  <Badge variant="secondary">
                    {category._count.tutorProfiles} tutor
                    {category._count.tutorProfiles === 1 ? "" : "s"} with slots
                  </Badge>
                ) : null}
              </div>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm whitespace-pre-wrap">
                {category.description ?? "No description"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-sm font-medium">
                Subjects
              </p>
              {category.subjects && category.subjects.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {category.subjects.map((s) => (
                    <span
                      key={s.id}
                      className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-sm"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No subjects in this category yet.
                </p>
              )}
            </div>
          </>
        ) : null}
      </section>

      <section className="space-y-4">
        <div>
          <SectionTitle>Tutors with availability</SectionTitle>
          <p className="text-muted-foreground mt-1 text-sm">
            Tutors who have at least one slot for a subject in this category.
          </p>
        </div>
        {tutorsLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        ) : tutorsError ? (
          <p className="text-red-500">{tutorsError}</p>
        ) : tutors.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No tutors have published slots for subjects in this category yet.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {tutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
