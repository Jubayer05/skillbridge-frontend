"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  mapFeaturedApiToItem,
  type FeatureTutorItem,
} from "@/lib/featured-tutors";
import { cn } from "@/lib/utils";
import { listFeaturedTutors } from "@/services/tutorService";
import { BookOpen, Star, Users } from "lucide-react";

export type { FeatureTutorItem };

/** This section never shows more than 8 tutor cards. */
const MAX_VISIBLE_TUTORS = 8;

function FeatureTutorGridSkeleton({ count }: { count: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col overflow-hidden rounded-xl border border-border/60"
        >
          <Skeleton className="aspect-4/3 w-full rounded-none" />
          <div className="space-y-3 p-4 sm:p-5">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface HomeFeatureTutorProps {
  title?: string;
  description?: string;
  /** When set, skips API fetch and shows this list (e.g. tests). Only the first 8 are shown. */
  tutors?: FeatureTutorItem[];
  /** Request size for the API; display is still capped at 8. Defaults to 8. */
  limit?: number;
  viewMoreHref?: string;
  viewMoreLabel?: string;
  className?: string;
}

export function HomeFeatureTutor({
  title = "Featured tutors",
  description = "Learn from experienced instructors across design, development, marketing, and more.",
  tutors: tutorsProp,
  limit = MAX_VISIBLE_TUTORS,
  viewMoreHref = "/categories",
  viewMoreLabel = "Browse categories",
  className,
}: HomeFeatureTutorProps) {
  const fetchLimit = Math.min(limit, MAX_VISIBLE_TUTORS);
  const controlled = tutorsProp !== undefined;
  const [remoteTutors, setRemoteTutors] = useState<FeatureTutorItem[]>([]);
  const [loadingRemote, setLoadingRemote] = useState(!controlled);
  const [fetchCompleted, setFetchCompleted] = useState(controlled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (controlled) return;

    let cancelled = false;

    const run = async () => {
      setLoadingRemote(true);
      setFetchCompleted(false);
      setError(null);
      try {
        const data = await listFeaturedTutors(fetchLimit);
        if (cancelled) return;
        setRemoteTutors(data.map(mapFeaturedApiToItem));
      } catch (err: unknown) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Could not load featured tutors",
        );
        setRemoteTutors([]);
      } finally {
        if (!cancelled) {
          setLoadingRemote(false);
          setFetchCompleted(true);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [controlled, fetchLimit]);

  const loading = controlled ? false : loadingRemote;
  const displayTutors = useMemo(
    () => (controlled ? (tutorsProp ?? []) : remoteTutors),
    [controlled, tutorsProp, remoteTutors],
  );

  const visibleTutors = useMemo(
    () => displayTutors.slice(0, MAX_VISIBLE_TUTORS),
    [displayTutors],
  );

  const showRemoteEmpty =
    !controlled && fetchCompleted && !error && displayTutors.length === 0;

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 px-6 py-12 shadow-sm backdrop-blur-sm sm:px-10 sm:py-16 md:px-14",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, var(--primary / 0.08), transparent)",
        }}
      />

      <div className="container relative mx-auto max-w-5xl">
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground sm:text-lg">
              {description}
            </p>
          )}
        </div>

        {loading ? (
          <FeatureTutorGridSkeleton count={fetchLimit} />
        ) : error ? (
          <p className="text-center text-sm text-destructive">{error}</p>
        ) : showRemoteEmpty ? (
          <p className="text-muted-foreground text-center text-sm">
            No tutor profiles yet. Check back soon.
          </p>
        ) : controlled && displayTutors.length === 0 ? (
          <p className="text-muted-foreground text-center text-sm">
            No tutors to show.
          </p>
        ) : (
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {visibleTutors.map((tutor) => {
              const cardClassName =
                "group flex flex-col rounded-xl border border-border/60 bg-background/80 shadow-sm transition-colors hover:border-border hover:bg-background hover:shadow-md focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none";
              const inner = (
                <>
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-t-xl bg-muted/50">
                    {/* eslint-disable-next-line @next/next/no-img-element -- dynamic tutor / CDN URLs */}
                    <img
                      src={tutor.avatar}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <h3 className="font-semibold text-foreground sm:text-lg">
                      {tutor.name}
                    </h3>
                    <p className="mt-0.5 text-sm font-medium text-primary">
                      {tutor.courseOffered}
                    </p>
                    <p
                      className="mt-2 line-clamp-2 text-sm text-muted-foreground"
                      title={tutor.description}
                    >
                      {tutor.description}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {tutor.rating != null && (
                        <span className="flex items-center gap-1">
                          <Star className="size-3.5 fill-amber-400 text-amber-400" />
                          {tutor.rating}
                        </span>
                      )}
                      {tutor.studentsCount != null &&
                        tutor.studentsCount > 0 && (
                          <span className="flex items-center gap-1">
                            <Users className="size-3.5" />
                            {tutor.studentsCount >= 1000
                              ? `${(tutor.studentsCount / 1000).toFixed(1)}k`
                              : tutor.studentsCount}{" "}
                            reviews
                          </span>
                        )}
                      {tutor.coursesCount != null &&
                        tutor.coursesCount > 0 && (
                          <span className="flex items-center gap-1">
                            <BookOpen className="size-3.5" />
                            {tutor.coursesCount} subjects
                          </span>
                        )}
                    </div>
                  </div>
                </>
              );
              return tutor.userId ? (
                <Link
                  key={tutor.id}
                  href={`/tutors/${encodeURIComponent(tutor.userId)}/slots`}
                  className={cardClassName}
                >
                  {inner}
                </Link>
              ) : (
                <div key={tutor.id} className={cardClassName}>
                  {inner}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-10 flex justify-center sm:mt-12">
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link href={viewMoreHref}>{viewMoreLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
