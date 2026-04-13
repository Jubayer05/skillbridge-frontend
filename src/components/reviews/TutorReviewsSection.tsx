"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { listTutorReviews } from "@/services/reviews";
import type { PaginatedReviews } from "@/types/review";
import type { Review } from "@/types/review";

import { ReviewCard } from "./ReviewCard";

const PAGE_SIZE = 10;

export function TutorReviewsSection({
  tutorUserId,
  initialReviews,
}: {
  tutorUserId: string;
  /** When set (e.g. from GET /tutors/:id), skips the first-page fetch. */
  initialReviews?: PaginatedReviews | null;
}) {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(
    () => initialReviews?.totalPages ?? 0,
  );
  const [total, setTotal] = useState(() => initialReviews?.total ?? 0);
  const [items, setItems] = useState<Review[]>(
    () => initialReviews?.data ?? [],
  );
  const [loading, setLoading] = useState(() => !initialReviews);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialReviews && page === 1) {
      setTotalPages(initialReviews.totalPages);
      setTotal(initialReviews.total);
      setItems(initialReviews.data);
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);
    void listTutorReviews(tutorUserId, { page, limit: PAGE_SIZE })
      .then((res) => {
        if (!active) return;
        setTotalPages(res.totalPages);
        setTotal(res.total);
        setItems((prev) => (page === 1 ? res.data : [...prev, ...res.data]));
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Could not load reviews");
        if (page === 1) setItems([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // initialReviews only seeds page 1; omit from deps to avoid resets when the
    // parent re-renders with a new object reference.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- see above
  }, [tutorUserId, page]);

  if (loading && page === 1) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-36 w-full" />
      </div>
    );
  }

  if (error) {
    return <p className="text-destructive text-sm">{error}</p>;
  }

  if (total === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No reviews yet. Completed sessions can be reviewed by students.
      </p>
    );
  }

  const showCarousel = items.length >= 3;

  if (showCarousel) {
    return (
      <div className="space-y-4">
        <div className="relative px-10 md:px-12">
          <Carousel
            opts={{ align: "start", loop: false }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {items.map((r) => (
                <CarouselItem
                  key={r.id}
                  className="pl-2 md:basis-1/2 md:pl-4 lg:basis-1/2"
                >
                  <ReviewCard review={r} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>
        {page < totalPages ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
          >
            {loading ? "Loading…" : "Load more reviews"}
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="grid gap-4 md:grid-cols-2">
        {items.map((r) => (
          <li key={r.id}>
            <ReviewCard review={r} />
          </li>
        ))}
      </ul>
      {page < totalPages ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => p + 1)}
          disabled={loading}
        >
          {loading ? "Loading…" : "Load more reviews"}
        </Button>
      ) : null}
    </div>
  );
}
