import { API_ENDPOINTS } from "@/config/apiConfig";
import { apiFetch } from "@/lib/api-fetch";
import type {
  AvailabilitySlot,
  AvailabilitySlotStatus,
  CreateAvailabilitySlotPayload,
  PublicAvailabilitySlot,
  UpdateAvailabilitySlotPayload,
} from "@/types/availability";

/** Public list — no auth. Use for tutor discovery (e.g. home → tutor slots). */
export async function listAvailabilitySlotsByTutor(
  tutorId: string,
  options?: { status?: AvailabilitySlotStatus },
): Promise<AvailabilitySlot[]> {
  const params = new URLSearchParams({ tutorId });
  if (options?.status) {
    params.set("status", options.status);
  }
  const url = `${API_ENDPOINTS.availability.slots}?${params.toString()}`;
  const res = await apiFetch<AvailabilitySlot[]>(url, { method: "GET" });
  if (!res.data) {
    throw new Error("Availability slots were not returned");
  }
  return res.data;
}

export async function listPublicAvailabilitySlotsBySubject(params: {
  subjectId: string;
  status?: AvailabilitySlotStatus;
  tutorId?: string;
  date?: string;
}): Promise<PublicAvailabilitySlot[]> {
  const search = new URLSearchParams({ subjectId: params.subjectId });
  if (params.status) search.set("status", params.status);
  if (params.tutorId) search.set("tutorId", params.tutorId);
  if (params.date) search.set("date", params.date);

  const url = `${API_ENDPOINTS.availability.publicSlots}?${search.toString()}`;
  const res = await apiFetch<PublicAvailabilitySlot[]>(url, { method: "GET" });
  if (!res.data) {
    throw new Error("Availability slots were not returned");
  }
  return res.data;
}

export async function createAvailabilitySlot(
  payload: CreateAvailabilitySlotPayload,
): Promise<AvailabilitySlot> {
  const res = await apiFetch<AvailabilitySlot>(API_ENDPOINTS.availability.slots, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.data) {
    throw new Error("Slot data was not returned");
  }
  return res.data;
}

export async function getAvailabilitySlotById(
  slotId: string,
): Promise<AvailabilitySlot> {
  const res = await apiFetch<AvailabilitySlot>(
    API_ENDPOINTS.availability.slotById(slotId),
    { method: "GET" },
  );
  if (!res.data) {
    throw new Error("Slot data was not returned");
  }
  return res.data;
}

export async function updateAvailabilitySlot(
  slotId: string,
  payload: UpdateAvailabilitySlotPayload,
): Promise<AvailabilitySlot> {
  const res = await apiFetch<AvailabilitySlot>(
    API_ENDPOINTS.availability.slotById(slotId),
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  if (!res.data) {
    throw new Error("Slot data was not returned");
  }
  return res.data;
}

export async function deleteAvailabilitySlot(slotId: string): Promise<void> {
  await apiFetch<null>(API_ENDPOINTS.availability.slotById(slotId), {
    method: "DELETE",
  });
}
