import { API_ENDPOINTS } from "@/config/apiConfig";
import { apiFetch } from "@/lib/api-fetch";
import { normalizeBooking } from "@/lib/normalize-booking";
import type { Booking, BookingStatus } from "@/types/booking";

export async function listBookings(params?: {
  status?: BookingStatus;
  from?: string;
  to?: string;
}): Promise<Booking[]> {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.from) search.set("from", params.from);
  if (params?.to) search.set("to", params.to);
  const query = search.toString();
  const url = query
    ? `${API_ENDPOINTS.bookings.list}?${query}`
    : API_ENDPOINTS.bookings.list;

  const res = await apiFetch<Booking[]>(url);
  return (res.data ?? []).map((b) => normalizeBooking(b));
}

export async function cancelBooking(bookingId: string): Promise<Booking> {
  const res = await apiFetch<Booking>(API_ENDPOINTS.bookings.cancel(bookingId), {
    method: "PATCH",
  });
  if (!res.data) throw new Error("Booking data was not returned");
  return normalizeBooking(res.data);
}

export async function completeBooking(bookingId: string): Promise<Booking> {
  const res = await apiFetch<Booking>(
    API_ENDPOINTS.bookings.complete(bookingId),
    {
      method: "PATCH",
    },
  );
  if (!res.data) throw new Error("Booking data was not returned");
  return normalizeBooking(res.data);
}

