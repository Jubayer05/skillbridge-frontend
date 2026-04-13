import type { Role } from "@/types/auth";
import type { Booking } from "@/types/booking";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  banned: boolean;
  banReason: string | null;
  banExpires: string | null;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AdminBooking = Booking & {
  student: { id: string; name: string; email: string };
};

export type AdminStats = {
  usersByRole: { role: Role; count: number }[];
  totalBookings: number;
  totalRevenue: string;
  recentActivities: {
    type: "user_registered" | "booking_created" | "booking_completed";
    at: string;
    title: string;
    description: string;
  }[];
};
