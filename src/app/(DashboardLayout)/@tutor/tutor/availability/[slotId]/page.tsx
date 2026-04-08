"use client";

import { useParams } from "next/navigation";

import { TutorAvailabilitySlotDetail } from "@/components/modules/availability/tutor-availability-slot-detail";

export default function TutorAvailabilitySlotPage() {
  const params = useParams();
  const slotId =
    params && typeof params.slotId === "string" ? params.slotId : "";

  if (!slotId) {
    return null;
  }

  return <TutorAvailabilitySlotDetail key={slotId} slotId={slotId} />;
}
