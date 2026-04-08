"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getSubjectById } from "@/services/subjectService";
import { listPublicAvailabilitySlotsBySubject } from "@/services/availability";
import type { PublicAvailabilitySlot } from "@/types/availability";

export function CategorySubjectSlots({
  categoryId,
  subjectId,
  backHref,
}: {
  categoryId: string;
  subjectId: string;
  backHref?: string;
}) {
  const [slots, setSlots] = useState<PublicAvailabilitySlot[] | null>(null);
  const [title, setTitle] = useState<string>("Subject");
  const [categoryName, setCategoryName] = useState<string>("Category");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setSlots(null);

    void (async () => {
      try {
        const [subject, data] = await Promise.all([
          getSubjectById(subjectId),
          listPublicAvailabilitySlotsBySubject({
            subjectId,
            status: "available",
          }),
        ]);
        if (!active) return;
        setTitle(subject.name);
        setCategoryName(subject.category?.name ?? "Category");
        setSlots(data);
      } catch (err: unknown) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Could not load slots");
        setSlots([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [subjectId]);

  if (loading) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-24 w-full max-w-2xl" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <p className="text-destructive text-sm">{error}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href={`/categories/${encodeURIComponent(categoryId)}`}>
            Back to category
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link
            href={
              backHref ?? `/categories/${encodeURIComponent(categoryId)}`
            }
          >
            ← Category
          </Link>
        </Button>
      </div>

      <div>
        <p className="text-muted-foreground text-sm">{categoryName}</p>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Available slots from all tutors for this subject.
        </p>
      </div>

      {!slots || slots.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No open slots right now. Check back later.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot) => (
            <li key={slot.id}>
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="text-base font-medium">
                        {slot.date}{" "}
                        <span className="text-muted-foreground font-normal">
                          {slot.startTime}–{slot.endTime}
                        </span>
                      </CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-2">
                        {slot.tutor.image ? (
                          <Image
                            src={slot.tutor.image}
                            alt=""
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                        ) : (
                          <span className="bg-muted inline-block size-5 rounded-full" />
                        )}
                        <span className="text-foreground font-medium">
                          {slot.tutor.name}
                        </span>
                      </CardDescription>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      ${slot.price}
                    </span>
                  </div>

                  {slot.subject ? (
                    <div className="mt-3 space-y-1">
                      <p className="text-muted-foreground text-xs">
                        {slot.subject.category.name}
                      </p>
                      <p className="text-primary text-base font-semibold tracking-tight">
                        {slot.subject.name}
                      </p>
                    </div>
                  ) : null}
                </CardHeader>
                <CardContent />
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

