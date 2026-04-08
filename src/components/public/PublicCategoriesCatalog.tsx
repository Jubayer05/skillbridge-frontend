"use client";

import { ChevronDown, Clock, DollarSign, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { listPublicAvailabilitySlotsBySubject } from "@/services/availability";
import { listCategories } from "@/services/categoryService";
import type { Category } from "@/types/category";
import type { PublicAvailabilitySlot } from "@/types/availability";
import { cn } from "@/lib/utils";

type SubjectRow = NonNullable<Category["subjects"]>[number];

function formatTimeRange(start: string, end: string) {
  return `${start}–${end}`;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

function TutorMini({ slot }: { slot: PublicAvailabilitySlot }) {
  const tutor = slot.tutor;
  return (
    <div className="flex items-center gap-2">
      {tutor.image ? (
        <Image
          src={tutor.image}
          alt=""
          width={20}
          height={20}
          className="rounded-full"
        />
      ) : (
        <div className="bg-muted text-muted-foreground flex size-5 items-center justify-center rounded-full text-[10px]">
          {initials(tutor.name)}
        </div>
      )}
      <span className="text-foreground text-sm font-medium">{tutor.name}</span>
    </div>
  );
}

function SlotCard({ slot }: { slot: PublicAvailabilitySlot }) {
  return (
    <Card className="bg-background/80">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-base font-semibold">
              {slot.date}{" "}
              <span className="text-muted-foreground font-normal">
                {formatTimeRange(slot.startTime, slot.endTime)}
              </span>
            </CardTitle>
            <TutorMini slot={slot} />
          </div>
          <Badge variant="secondary" className="gap-1">
            <DollarSign className="size-3.5" />
            {slot.price}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {slot.subject ? (
          <div className="rounded-lg border bg-muted/20 px-3 py-2">
            <p className="text-muted-foreground text-xs">
              {slot.subject.category.name}
            </p>
            <p className="text-primary text-sm font-semibold">
              {slot.subject.name}
            </p>
          </div>
        ) : null}
        <div className="text-muted-foreground flex flex-wrap gap-3 text-xs">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            UTC
          </span>
          <span className="capitalize">{slot.status}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function SubjectCard({
  subject,
  open,
  loading,
  slotsCount,
  onToggle,
}: {
  subject: SubjectRow;
  open: boolean;
  loading: boolean;
  slotsCount: number;
  onToggle: () => void;
}) {
  const slots = subject.availableSlotsCount ?? 0;
  const tutors = subject.availableTutorsCount ?? 0;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "group text-left focus-visible:ring-ring w-full rounded-xl focus-visible:ring-2 focus-visible:outline-none",
      )}
    >
      <Card
        className={cn(
          "h-full border-border/60 bg-card/40 transition-all hover:bg-card/60",
          open && "border-primary/30 bg-primary/5 shadow-sm",
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <CardTitle className="truncate text-base font-semibold">
                {subject.name}
              </CardTitle>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge className="bg-primary/10 text-primary border border-primary/20">
                  {slots} slots
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Users className="size-3.5" />
                  <span className="text-foreground font-semibold">{tutors}</span>
                  tutors
                </Badge>
              </div>
            </div>
            <div className="text-muted-foreground flex items-center gap-2">
              {loading ? (
                <span className="text-xs">Loading…</span>
              ) : open ? (
                <span className="text-xs">{slotsCount} shown</span>
              ) : null}
              <ChevronDown
                className={cn(
                  "size-4 transition-transform",
                  open && "rotate-180",
                )}
                aria-hidden
              />
            </div>
          </div>
        </CardHeader>
      </Card>
    </button>
  );
}

export function PublicCategoriesCatalog() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [openSubjectId, setOpenSubjectId] = useState<string | null>(null);
  const [slotsBySubject, setSlotsBySubject] = useState<
    Record<string, PublicAvailabilitySlot[]>
  >({});
  const [loadingSubjectId, setLoadingSubjectId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setError(null);
    void listCategories()
      .then((data) => {
        if (!active) return;
        setCategories(data);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Could not load categories");
        setCategories([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const onToggleSubject = async (categoryId: string, subject: SubjectRow) => {
    const nextOpen = openSubjectId === subject.id ? null : subject.id;
    setOpenSubjectId(nextOpen);
    if (!nextOpen) return;

    if (slotsBySubject[subject.id]) return;

    setLoadingSubjectId(subject.id);
    try {
      const slots = await listPublicAvailabilitySlotsBySubject({
        subjectId: subject.id,
        status: "available",
      });
      setSlotsBySubject((prev) => ({ ...prev, [subject.id]: slots }));
    } catch {
      setSlotsBySubject((prev) => ({ ...prev, [subject.id]: [] }));
    } finally {
      setLoadingSubjectId(null);
    }
  };

  if (categories === null) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="space-y-2">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-6 w-40" />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
          <p className="text-muted-foreground text-sm">
            Pick a subject to see all available tutor slots.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <a href="#top">Browse</a>
        </Button>
      </div>

      {error ? (
        <p className="text-destructive text-sm">{error}</p>
      ) : null}

      <div className="space-y-10">
        {categories.map((category) => (
          <section key={category.id} className="space-y-4">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-lg font-semibold tracking-tight">
                {category.name}
              </h2>
              <div className="text-muted-foreground text-xs">
                {(category.subjects ?? []).length} subjects
              </div>
            </div>

            {category.subjects && category.subjects.length > 0 ? (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {category.subjects.map((subject) => {
                    const open = openSubjectId === subject.id;
                    const loading = loadingSubjectId === subject.id;
                    const slots = slotsBySubject[subject.id] ?? null;
                    return (
                      <SubjectCard
                        key={subject.id}
                        subject={subject}
                        open={open}
                        loading={loading}
                        slotsCount={slots?.length ?? 0}
                        onToggle={() =>
                          void onToggleSubject(category.id, subject)
                        }
                      />
                    );
                  })}
                </div>

                {(() => {
                  const openSubject =
                    category.subjects?.find((s) => s.id === openSubjectId) ??
                    null;
                  if (!openSubject) return null;

                  const loading = loadingSubjectId === openSubject.id;
                  const slots = slotsBySubject[openSubject.id] ?? null;

                  return (
                    <div className="rounded-2xl border border-border/60 bg-muted/10 p-4">
                      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
                        <div>
                          <p className="text-muted-foreground text-xs">
                            Slots for
                          </p>
                          <p className="text-foreground font-semibold">
                            {openSubject.name}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary border border-primary/20"
                        >
                          {(slots ?? []).length} available
                        </Badge>
                      </div>

                      {loading ? (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          <Skeleton className="h-28 w-full" />
                          <Skeleton className="h-28 w-full" />
                          <Skeleton className="h-28 w-full" />
                          <Skeleton className="h-28 w-full" />
                        </div>
                      ) : slots && slots.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          {slots.map((slot) => (
                            <SlotCard key={slot.id} slot={slot} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          No available slots for this subject right now.
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No subjects in this category yet.
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

