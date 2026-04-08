"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { listAvailabilitySlotsByTutor } from "@/services/availability";
import { getTutorProfileByUserId } from "@/services/profile";
import type { AvailabilitySlot } from "@/types/availability";

export function TutorPublicSlots({ tutorUserId }: { tutorUserId: string }) {
  const [slots, setSlots] = useState<AvailabilitySlot[] | null>(null);
  const [tutorName, setTutorName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setSlots(null);
    setTutorName(null);

    void (async () => {
      try {
        const data = await listAvailabilitySlotsByTutor(tutorUserId, {
          status: "available",
        });
        if (!active) return;
        setSlots(data);
      } catch (err: unknown) {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : "Could not load availability",
        );
        setSlots([]);
      } finally {
        if (active) setLoading(false);
      }

      try {
        const profile = await getTutorProfileByUserId(tutorUserId);
        if (active) setTutorName(profile.user.name);
      } catch {
        /* synthetic / slot-only tutors may have no profile row */
      }
    })();

    return () => {
      active = false;
    };
  }, [tutorUserId]);

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
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  const displayName = tutorName ?? "Tutor";

  return (
    <div className="space-y-8 p-4 md:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">← Home</Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {displayName}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Open availability slots you can book.
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
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <CardTitle className="text-base font-medium">
                      {slot.date}{" "}
                      <span className="text-muted-foreground font-normal">
                        {slot.startTime}–{slot.endTime}
                      </span>
                    </CardTitle>
                    <span className="text-muted-foreground text-xs capitalize">
                      {slot.status}
                    </span>
                  </div>
                  {slot.subject ? (
                    <div className="mt-2 space-y-1">
                      <p className="text-muted-foreground text-xs">
                        {slot.subject.category.name}
                      </p>
                      <p className="text-primary text-base font-semibold tracking-tight">
                        {slot.subject.name}
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground mt-2 text-xs">
                      Subject not linked
                    </p>
                  )}
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                  <span className="text-foreground font-medium">
                    ${slot.price}
                  </span>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
