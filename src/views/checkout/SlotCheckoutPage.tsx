"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-context";
import { formatSlotTitle } from "@/lib/slot-display";
import { getPublicAvailabilitySlotById } from "@/services/availability";
import { initSslcommerzPayment } from "@/services/paymentService";
import type { PublicAvailabilitySlot } from "@/types/availability";

function paramId(value: string | string[] | undefined): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value[0]) return value[0];
  return "";
}

export default function SlotCheckoutPage() {
  return (
    <ProtectedRoute roles={["STUDENT"]}>
      <SlotCheckoutInner />
    </ProtectedRoute>
  );
}

function SlotCheckoutInner() {
  const params = useParams();
  const slotId = useMemo(() => paramId(params?.slotId), [params]);

  if (!slotId) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground text-sm">Invalid slot.</p>
      </div>
    );
  }

  return <SlotCheckoutForSlot key={slotId} slotId={slotId} />;
}

function SlotCheckoutForSlot({ slotId }: { slotId: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [slot, setSlot] = useState<PublicAvailabilitySlot | null>(null);
  const [loadingSlot, setLoadingSlot] = useState(true);
  const [slotError, setSlotError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getPublicAvailabilitySlotById(slotId)
      .then((data) => {
        if (!active) return;
        setSlot(data);
        setSlotError(null);
        setLoadingSlot(false);
      })
      .catch((err: Error) => {
        if (!active) return;
        setSlotError(err.message ?? "Could not load slot");
        setSlot(null);
        setLoadingSlot(false);
      });
    return () => {
      active = false;
    };
  }, [slotId]);

  const canBook = slot?.status === "available";

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/categories">← Back</Link>
        </Button>
      </div>

      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription>
            Confirm your booking. You can pay with{" "}
            <span className="font-medium">SSLCommerz (Sandbox)</span> or choose
            cash on delivery.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-lg border bg-muted/20 p-4 text-sm">
            <p className="text-muted-foreground">Student</p>
            <p className="font-medium">{user?.name ?? "Student"}</p>
            <p className="text-muted-foreground mt-3">Session</p>
            {loadingSlot ? (
              <Skeleton className="mt-1 h-5 w-full max-w-md" />
            ) : slotError ? (
              <p className="text-destructive text-sm">{slotError}</p>
            ) : slot ? (
              <>
                <p className="font-medium">{formatSlotTitle(slot)}</p>
                <p className="text-muted-foreground mt-2">Tutor</p>
                <p className="font-medium">{slot.tutor.name}</p>
                {slot.subject ? (
                  <>
                    <p className="text-muted-foreground mt-2">Subject</p>
                    <p className="font-medium">
                      {slot.subject.category.name} · {slot.subject.name}
                    </p>
                  </>
                ) : null}
                <p className="text-muted-foreground mt-2">Price</p>
                <p className="font-medium">${slot.price}</p>
                {!canBook ? (
                  <p className="text-amber-600 dark:text-amber-500 mt-3 text-sm">
                    This slot is no longer available to book.
                  </p>
                ) : null}
              </>
            ) : null}
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Notes (optional)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any instructions for the tutor…"
            />
          </div>

          {/* <Button
            type="button"
            disabled={submitting || loadingSlot || !slot || !canBook}
            className="w-full"
            onClick={() => {
              setSubmitting(true);
              createBooking({
                availabilitySlotId: slotId,
                paymentMethod: "COD",
                ...(notes.trim() ? { notes: notes.trim() } : {}),
              })
                .then(() => {
                  toast.success("Booking confirmed");
                  router.push("/categories");
                })
                .catch((err: Error) => {
                  toast.error(err.message ?? "Could not create booking");
                })
                .finally(() => setSubmitting(false));
            }}
          >
            Confirm booking
          </Button> */}

          <Button
            type="button"
            variant="secondary"
            disabled={submitting || loadingSlot || !slot || !canBook}
            className="w-full"
            onClick={() => {
              setSubmitting(true);
              initSslcommerzPayment({
                availabilitySlotId: slotId,
                ...(notes.trim() ? { notes: notes.trim() } : {}),
              })
                .then(({ gatewayUrl }) => {
                  window.location.href = gatewayUrl;
                })
                .catch((err: Error) => {
                  toast.error(err.message ?? "Could not start payment");
                  setSubmitting(false);
                });
            }}
          >
            Pay with SSLCommerz (Sandbox)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
