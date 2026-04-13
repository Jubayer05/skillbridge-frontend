"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { TutorReviewsSection } from "@/components/reviews/TutorReviewsSection";
import { StaticStars } from "@/components/reviews/StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getTutorPublicDetail } from "@/services/tutorsBrowse";
import type { TutorPublicDetail } from "@/types/tutor-discovery";

export function TutorPublicProfile({ tutorUserId }: { tutorUserId: string }) {
  const [detail, setDetail] = useState<TutorPublicDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getTutorPublicDetail(tutorUserId, { reviewsPage: 1, reviewsLimit: 10 })
      .then((d) => {
        if (!active) return;
        setDetail(d);
      })
      .catch((err: Error) => {
        if (!active) return;
        setError(err.message ?? "Could not load tutor");
        setDetail(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [tutorUserId]);

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full max-w-3xl" />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="p-4 md:p-6">
        <p className="text-destructive text-sm">
          {error ?? "This tutor does not have a public profile yet."}
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/tutors">Browse tutors</Link>
        </Button>
      </div>
    );
  }

  const profile = detail.tutor;
  const ratingNum =
    profile.rating != null && profile.rating !== ""
      ? Number(profile.rating)
      : null;

  return (
    <div className="space-y-10 p-4 md:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/tutors">← All tutors</Link>
        </Button>
      </div>

      <Card className="max-w-3xl border-border/80">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{profile.user.name}</CardTitle>
              <CardDescription className="mt-1 text-base">
                {profile.headline}
              </CardDescription>
            </div>
            {profile.isVerified ? (
              <Badge variant="secondary">Verified</Badge>
            ) : null}
          </div>
          <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span>
              <span className="text-foreground font-medium">
                ${profile.hourlyRate}
              </span>
              /hr
            </span>
            <span className="flex items-center gap-2">
              {ratingNum != null && !Number.isNaN(ratingNum) ? (
                <>
                  <StaticStars value={ratingNum} />
                  <span className="text-foreground font-medium tabular-nums">
                    {detail.averageRating ?? profile.rating}
                  </span>
                  <span>({profile.totalReviews} reviews)</span>
                </>
              ) : (
                <span>No ratings yet</span>
              )}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 text-sm leading-relaxed">
          {profile.categories.length > 0 ? (
            <div>
              <h3 className="text-foreground mb-2 font-semibold">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {profile.categories.map((c) => (
                  <Badge key={c.id} variant="outline">
                    {c.name}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <h3 className="text-foreground mb-2 font-semibold">About</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {profile.bio}
            </p>
            <ul className="text-muted-foreground mt-3 list-inside list-disc space-y-1">
              <li>
                Experience: {profile.experience} years
              </li>
              <li>Education: {profile.education}</li>
              {profile.languages.length > 0 ? (
                <li>Languages: {profile.languages.join(", ")}</li>
              ) : null}
            </ul>
          </div>

          {profile.subjects.length > 0 ? (
            <div>
              <h3 className="text-foreground mb-2 font-semibold">Subjects</h3>
              <ul className="text-muted-foreground space-y-1">
                {profile.subjects.map((s) => (
                  <li key={s.id}>
                    <span className="text-foreground font-medium">
                      {s.name}
                    </span>{" "}
                    · {s.category.name}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="rounded-lg border border-dashed border-border/80 bg-muted/30 p-4">
            <h3 className="text-foreground font-semibold">Availability</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Calendar view is coming soon. Open available slots to book a
              session.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild size="lg">
              <Link href={`/tutors/${encodeURIComponent(tutorUserId)}/slots`}>
                Book session
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={`/tutors/${encodeURIComponent(tutorUserId)}/slots`}>
                View availability
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="max-w-4xl space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Reviews</h2>
          <p className="text-muted-foreground text-sm">
            Feedback from students after completed sessions.
          </p>
        </div>
        <TutorReviewsSection
          key={tutorUserId}
          tutorUserId={tutorUserId}
          initialReviews={detail.reviews}
        />
      </section>
    </div>
  );
}
