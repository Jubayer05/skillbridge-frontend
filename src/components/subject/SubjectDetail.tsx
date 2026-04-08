"use client";

import TutorCard from "@/components/tutor/TutorCard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubjectById, useTutorsBySubject } from "@/hooks/useSubjects";
import type { ReactNode } from "react";

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-lg font-semibold tracking-tight">{children}</h2>
  );
}

export default function SubjectDetail({
  subjectId,
}: {
  subjectId: string;
}) {
  const {
    subject,
    loading: subjectLoading,
    error: subjectError,
  } = useSubjectById(subjectId);
  const {
    tutors,
    loading: tutorsLoading,
    error: tutorsError,
  } = useTutorsBySubject(subjectId);

  return (
    <div className="space-y-8 p-4 md:p-6">
      <section className="space-y-4">
        {subjectLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-1/2 max-w-md" />
            <Skeleton className="h-20 w-full max-w-2xl" />
            <Skeleton className="h-6 w-40" />
          </div>
        ) : subjectError ? (
          <p className="text-red-500">{subjectError}</p>
        ) : subject ? (
          <>
            <div>
              <p className="text-muted-foreground text-sm">
                {subject.category ? (
                  <>
                    Category:{" "}
                    <span className="text-foreground font-medium">
                      {subject.category.name}
                    </span>
                  </>
                ) : null}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {subject.name}
                </h1>
                {subject._count?.tutorProfiles !== undefined ? (
                  <Badge variant="secondary">
                    {subject._count.tutorProfiles} tutor
                    {subject._count.tutorProfiles === 1 ? "" : "s"} with slots
                  </Badge>
                ) : null}
              </div>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm whitespace-pre-wrap">
                {subject.description ?? "No description"}
              </p>
            </div>
          </>
        ) : null}
      </section>

      <section className="space-y-4">
        <div>
          <SectionTitle>Tutors with availability</SectionTitle>
          <p className="text-muted-foreground mt-1 text-sm">
            Tutors who have at least one slot for this subject.
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
            No tutors have published slots for this subject yet.
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
