"use client";

import { Copy } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { TutorAvailabilitySlotForm } from "@/components/modules/availability/tutor-availability-slot-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { copyToClipboard } from "@/lib/copy-to-clipboard";
import {
  forgetAvailabilitySlotId,
  rememberAvailabilitySlot,
} from "@/lib/tutor-availability-recent";
import {
  deleteAvailabilitySlot,
  getAvailabilitySlotById,
} from "@/services/availability";
import type { AvailabilitySlot } from "@/types/availability";

export function TutorAvailabilitySlotDetail({ slotId }: { slotId: string }) {
  const router = useRouter();
  const [slot, setSlot] = useState<AvailabilitySlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    getAvailabilitySlotById(slotId)
      .then((data) => {
        if (!active) return;
        setSlot(data);
        rememberAvailabilitySlot(data);
      })
      .catch((err: Error) => {
        if (!active) return;
        setError(err.message ?? "Failed to load slot");
        setSlot(null);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slotId]);

  const onDelete = () => {
    if (
      !window.confirm(
        "Delete this availability slot? This cannot be undone.",
      )
    ) {
      return;
    }
    setDeleting(true);
    deleteAvailabilitySlot(slotId)
      .then(() => {
        forgetAvailabilitySlotId(slotId);
        toast.success("Slot deleted");
        router.push("/tutor/availability");
      })
      .catch((err: Error) => {
        toast.error(err.message ?? "Could not delete slot");
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full max-w-lg" />
      </div>
    );
  }

  if (error || !slot) {
    return (
      <div className="p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Slot not available</CardTitle>
            <CardDescription>{error ?? "Unknown error"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/tutor/availability">Back to availability</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-1 -ml-2">
            <Link href="/tutor/availability">← Availability</Link>
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">
            Slot · {slot.date}
            {slot.subject && (
              <span className="text-muted-foreground block text-base font-normal">
                {slot.subject.category.name} · {slot.subject.name}
              </span>
            )}
          </h1>
        </div>
        <Button
          type="button"
          variant="destructive"
          disabled={deleting}
          onClick={onDelete}
        >
          Delete slot
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Slot ID</CardTitle>
          <CardDescription>
            Same value as in your browser address bar after{" "}
            <span className="font-mono">/tutor/availability/</span>. Copy it if
            you need to open this slot from another device.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <code className="bg-muted text-foreground max-w-full flex-1 overflow-x-auto rounded-md border px-3 py-2 font-mono text-sm break-all">
            {slot.id}
          </code>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 gap-1.5"
            onClick={() => {
              copyToClipboard(slot.id)
                .then(() => {
                  toast.success("Slot ID copied");
                })
                .catch(() => {
                  toast.error("Could not copy to clipboard");
                });
            }}
          >
            <Copy className="size-4" aria-hidden />
            Copy ID
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>
            {slot.subject ? (
              <>
                {slot.subject.category.name} · {slot.subject.name} ·{" "}
              </>
            ) : (
              <span className="text-amber-600 dark:text-amber-500">
                No subject linked ·{" "}
              </span>
            )}
            {slot.startTime}–{slot.endTime} · ${slot.price} ·{" "}
            <span className="capitalize">{slot.status}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-1 text-sm">
          <p>Starts (UTC): {new Date(slot.startAt).toISOString()}</p>
          <p>Ends (UTC): {new Date(slot.endAt).toISOString()}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit slot</CardTitle>
          <CardDescription>
            Update time, price, or status. End time must be after start time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TutorAvailabilitySlotForm
            key={`${slot.id}-${slot.subjectId ?? ""}-${slot.startAt}-${slot.endAt}-${slot.price}-${slot.status}`}
            mode="edit"
            slot={slot}
            onUpdated={(s) => setSlot(s)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
