import { TutorsBrowsePage } from "@/components/tutor/TutorsBrowsePage";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

function BrowseFallback() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <Skeleton className="mb-8 h-10 w-64" />
      <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
        <Skeleton className="h-96 rounded-xl" />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TutorsBrowseRoutePage() {
  return (
    <Suspense fallback={<BrowseFallback />}>
      <TutorsBrowsePage />
    </Suspense>
  );
}
