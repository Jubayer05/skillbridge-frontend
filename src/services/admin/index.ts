import { API_ENDPOINTS } from "@/config/apiConfig";
import { apiFetch } from "@/lib/api-fetch";
import type {
  AdminBooking,
  AdminStats,
  AdminUser,
  Paginated,
} from "@/types/admin";
import type { Role } from "@/types/auth";

function buildUsersUrl(params: {
  page?: number;
  limit?: number;
  role?: Role | "";
  q?: string;
}): string {
  const u = new URL(API_ENDPOINTS.admin.users);
  if (params.page != null) u.searchParams.set("page", String(params.page));
  if (params.limit != null) u.searchParams.set("limit", String(params.limit));
  if (params.role) u.searchParams.set("role", params.role);
  if (params.q?.trim()) u.searchParams.set("q", params.q.trim());
  return u.toString();
}

function buildBookingsUrl(params: {
  page?: number;
  limit?: number;
  status?: string;
  q?: string;
}): string {
  const u = new URL(API_ENDPOINTS.admin.bookings);
  if (params.page != null) u.searchParams.set("page", String(params.page));
  if (params.limit != null) u.searchParams.set("limit", String(params.limit));
  if (params.status) u.searchParams.set("status", params.status);
  if (params.q?.trim()) u.searchParams.set("q", params.q.trim());
  return u.toString();
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const res = await apiFetch<AdminStats>(API_ENDPOINTS.admin.stats);
  if (!res.data) throw new Error("No stats data");
  return res.data;
}

export async function fetchAdminUsers(params: {
  page?: number;
  limit?: number;
  role?: Role | "";
  q?: string;
}): Promise<Paginated<AdminUser>> {
  const res = await apiFetch<Paginated<AdminUser>>(buildUsersUrl(params));
  if (!res.data) throw new Error("No users data");
  return res.data;
}

export async function patchAdminUser(
  id: string,
  body: {
    role?: Role;
    banned?: boolean;
    banReason?: string;
    isActive?: boolean;
  },
): Promise<AdminUser> {
  const res = await apiFetch<AdminUser>(API_ENDPOINTS.admin.user(id), {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  if (!res.data) throw new Error("No user data");
  return res.data;
}

export async function fetchAdminBookings(params: {
  page?: number;
  limit?: number;
  status?: string;
  q?: string;
}): Promise<Paginated<AdminBooking>> {
  const res = await apiFetch<Paginated<AdminBooking>>(
    buildBookingsUrl(params),
  );
  if (!res.data) throw new Error("No bookings data");
  return res.data;
}
