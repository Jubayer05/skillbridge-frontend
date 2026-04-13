"use client";

import { StaticStars } from "@/components/reviews/StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { TutorProfileSummary } from "@/types/category";
import type { TutorListItem } from "@/types/tutor-discovery";
import Link from "next/link";

function avatarUrl(t: TutorListItem) {
  const name = t.user.name;
  if (t.profileImageUrl?.trim()) return t.profileImageUrl.trim();
  if (t.user.image?.trim()) return t.user.image.trim();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=e2e8f0&color=64748b`;
}

function ratingNum(rating: string | null) {
  if (rating == null || rating === "") return null;
  const n = Number.parseFloat(rating);
  return Number.isFinite(n) ? n : null;
}

export function TutorDiscoveryCard({
  tutor,
  variant = "grid",
}: {
  tutor: TutorListItem;
  variant?: "grid" | "list";
}) {
  const href = `/tutors/${encodeURIComponent(tutor.userId)}`;
  const r = ratingNum(tutor.rating);
  const img = avatarUrl(tutor);

  if (variant === "list") {
    return (
      <Card className="border-border/60 overflow-hidden">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-stretch">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt=""
            className="h-36 w-full shrink-0 rounded-lg object-cover sm:h-auto sm:w-40"
          />
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold">{tutor.user.name}</h3>
                {tutor.isVerified ? (
                  <Badge variant="secondary">Verified</Badge>
                ) : null}
              </div>
              <p className="text-primary mt-0.5 text-sm font-medium">
                {tutor.headline}
              </p>
              <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                {tutor.bio}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {tutor.categories.slice(0, 5).map((c) => (
                  <Badge key={c.id} variant="outline" className="font-normal">
                    {c.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                <span>
                  <span className="text-foreground font-semibold">
                    ${tutor.hourlyRate}
                  </span>
                  /hr
                </span>
                {r != null ? (
                  <span className="flex items-center gap-2">
                    <StaticStars value={r} />
                    <span className="text-foreground font-medium tabular-nums">
                      {tutor.rating}
                    </span>
                    <span>({tutor.totalReviews})</span>
                  </span>
                ) : (
                  <span>New tutor</span>
                )}
              </div>
              <Button asChild size="sm">
                <Link href={href}>View profile</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-border/60 transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
        />
        {tutor.isVerified ? (
          <Badge className="absolute right-2 top-2" variant="secondary">
            Verified
          </Badge>
        ) : null}
      </div>
      <CardHeader className="space-y-1 pb-2">
        <h3 className="line-clamp-1 font-semibold leading-tight">
          {tutor.user.name}
        </h3>
        <p className="text-primary line-clamp-2 text-sm font-medium">
          {tutor.headline}
        </p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2 pb-3">
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {tutor.bio}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {tutor.categories.slice(0, 3).map((c) => (
            <Badge key={c.id} variant="outline" className="text-xs font-normal">
              {c.name}
            </Badge>
          ))}
          {tutor.categories.length > 3 ? (
            <Badge variant="outline" className="text-xs font-normal">
              +{tutor.categories.length - 3}
            </Badge>
          ) : null}
        </div>
        <div className="text-muted-foreground mt-auto flex flex-wrap items-center gap-3 text-xs">
          <span>
            <span className="text-foreground text-sm font-semibold">
              ${tutor.hourlyRate}
            </span>
            /hr
          </span>
          {r != null ? (
            <span className="flex items-center gap-1.5">
              <StaticStars value={r} />
              <span className="text-foreground font-medium">{tutor.rating}</span>
              <span>({tutor.totalReviews})</span>
            </span>
          ) : (
            <span>No ratings yet</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild className="w-full" variant="secondary">
          <Link href={href}>View profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

/** Compact card for category / subject “tutors with slots” lists. */
export default function TutorCard({ tutor }: { tutor: TutorProfileSummary }) {
  const href = `/tutors/${encodeURIComponent(tutor.userId)}`;
  const r = ratingNum(tutor.rating);
  const img =
    tutor.profileImageUrl?.trim() ||
    tutor.user.image?.trim() ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.user.name)}&size=400&background=e2e8f0&color=64748b`;

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt=""
            className="size-14 shrink-0 rounded-lg object-cover"
          />
          <div className="min-w-0">
            <h3 className="font-semibold leading-tight">{tutor.user.name}</h3>
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {tutor.headline}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pb-3 text-sm">
        <div className="text-muted-foreground flex flex-wrap items-center gap-3">
          <span>
            <span className="text-foreground font-medium">
              ${tutor.hourlyRate}
            </span>
            /hr
          </span>
          {r != null ? (
            <span className="flex items-center gap-1">
              <StaticStars value={r} />
              <span className="text-foreground">{tutor.rating}</span>
              <span>({tutor.totalReviews})</span>
            </span>
          ) : null}
        </div>
        {tutor.isVerified ? (
          <Badge variant="secondary" className="text-xs">
            Verified
          </Badge>
        ) : null}
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild variant="secondary" size="sm" className="w-full">
          <Link href={href}>View profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
