"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Subject } from "@/types/subject";

export default function SubjectCard({
  subject,
  onClick,
}: {
  subject: Subject;
  onClick: () => void;
}) {
  const tutorCount = subject._count?.tutorProfiles ?? 0;
  const categoryName = subject.category?.name ?? "Category";

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left focus-visible:ring-ring rounded-xl focus-visible:ring-2 focus-visible:outline-none"
    >
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-lg leading-tight">{subject.name}</CardTitle>
          <Badge variant="outline">{categoryName}</Badge>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {subject.description ?? "No description"}
          </p>
          <p className="text-muted-foreground text-xs">
            {tutorCount} tutor{tutorCount === 1 ? "" : "s"}
          </p>
        </CardContent>
      </Card>
    </button>
  );
}
