const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";
const AUTH_BASE_URL = BASE_URL.replace(/\/api\/v1$/, "/api/auth");

export const API_ENDPOINTS = {
  auth: {
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`,
    verifyEmail: `${BASE_URL}/auth/verify-email`,
    verifyEmailToken: (token: string, callbackURL: string) =>
      `${AUTH_BASE_URL}/verify-email?token=${encodeURIComponent(token)}&callbackURL=${encodeURIComponent(callbackURL)}`,
    forgotPassword: `${BASE_URL}/auth/forgot-password`,
    resetPassword: `${BASE_URL}/auth/reset-password`,
    updatePassword: `${BASE_URL}/auth/update-password`,
    logout: `${BASE_URL}/auth/logout`,
  },
  profile: {
    get: `${BASE_URL}/profile`,
    update: `${BASE_URL}/profile`,
    tutorUpsert: `${BASE_URL}/tutor/profile`,
    tutorByUserId: (userId: string) => `${BASE_URL}/tutor/profile/${userId}`,
    /** Signed-in tutor’s reviews (auth). */
    tutorMyReviews: `${BASE_URL}/tutor/reviews`,
  },
  tutor: {
    featured: (limit?: number) =>
      limit != null
        ? `${BASE_URL}/tutor/featured?limit=${encodeURIComponent(String(limit))}`
        : `${BASE_URL}/tutor/featured`,
  },
  upload: {
    single: `${BASE_URL}/upload/single`,
  },
  availability: {
    slots: `${BASE_URL}/availability/slots`,
    slotById: (slotId: string) =>
      `${BASE_URL}/availability/slots/${encodeURIComponent(slotId)}`,
    publicSlots: `${BASE_URL}/availability/public/slots`,
    publicSlotById: (slotId: string) =>
      `${BASE_URL}/availability/public/slots/${encodeURIComponent(slotId)}`,
  },
  reviews: {
    create: `${BASE_URL}/reviews`,
    byId: (id: string) =>
      `${BASE_URL}/reviews/${encodeURIComponent(id)}`,
    adminDelete: (id: string) =>
      `${BASE_URL}/admin/reviews/${encodeURIComponent(id)}`,
  },
  admin: {
    users: `${BASE_URL}/admin/users`,
    user: (id: string) =>
      `${BASE_URL}/admin/users/${encodeURIComponent(id)}`,
    bookings: `${BASE_URL}/admin/bookings`,
    stats: `${BASE_URL}/admin/stats`,
  },
  tutors: {
    list: (params?: {
      page?: number;
      limit?: number;
      categoryId?: string;
      minPrice?: number;
      maxPrice?: number;
      minRating?: number;
      q?: string;
      sort?: string;
    }) => {
      const u = new URL(`${BASE_URL}/tutors`);
      if (params?.page != null) u.searchParams.set("page", String(params.page));
      if (params?.limit != null)
        u.searchParams.set("limit", String(params.limit));
      if (params?.categoryId)
        u.searchParams.set("categoryId", params.categoryId);
      if (params?.minPrice != null)
        u.searchParams.set("minPrice", String(params.minPrice));
      if (params?.maxPrice != null)
        u.searchParams.set("maxPrice", String(params.maxPrice));
      if (params?.minRating != null)
        u.searchParams.set("minRating", String(params.minRating));
      if (params?.q?.trim()) u.searchParams.set("q", params.q.trim());
      if (params?.sort) u.searchParams.set("sort", params.sort);
      return u.toString();
    },
    detail: (
      userId: string,
      params?: { reviewsPage?: number; reviewsLimit?: number },
    ) => {
      const u = new URL(
        `${BASE_URL}/tutors/${encodeURIComponent(userId)}`,
      );
      if (params?.reviewsPage != null)
        u.searchParams.set("reviewsPage", String(params.reviewsPage));
      if (params?.reviewsLimit != null)
        u.searchParams.set("reviewsLimit", String(params.reviewsLimit));
      return u.toString();
    },
    reviews: (userId: string, params?: { page?: number; limit?: number }) => {
      const u = new URL(
        `${BASE_URL}/tutors/${encodeURIComponent(userId)}/reviews`,
      );
      if (params?.page != null) u.searchParams.set("page", String(params.page));
      if (params?.limit != null)
        u.searchParams.set("limit", String(params.limit));
      return u.toString();
    },
  },
  bookings: {
    list: `${BASE_URL}/bookings`,
    create: `${BASE_URL}/bookings`,
    byId: (id: string) => `${BASE_URL}/bookings/${encodeURIComponent(id)}`,
    cancel: (id: string) =>
      `${BASE_URL}/bookings/${encodeURIComponent(id)}/cancel`,
    complete: (id: string) =>
      `${BASE_URL}/bookings/${encodeURIComponent(id)}/complete`,
  },
  category: {
    list: `${BASE_URL}/categories`,
    create: `${BASE_URL}/categories`,
    byId: (id: string) =>
      `${BASE_URL}/categories/${encodeURIComponent(id)}`,
    update: (id: string) =>
      `${BASE_URL}/categories/${encodeURIComponent(id)}`,
    delete: (id: string) =>
      `${BASE_URL}/categories/${encodeURIComponent(id)}`,
    tutors: (id: string) =>
      `${BASE_URL}/categories/${encodeURIComponent(id)}/tutors`,
  },
  subject: {
    list: `${BASE_URL}/subjects`,
    create: `${BASE_URL}/subjects`,
    byId: (id: string) =>
      `${BASE_URL}/subjects/${encodeURIComponent(id)}`,
    update: (id: string) =>
      `${BASE_URL}/subjects/${encodeURIComponent(id)}`,
    delete: (id: string) =>
      `${BASE_URL}/subjects/${encodeURIComponent(id)}`,
    tutors: (id: string) =>
      `${BASE_URL}/subjects/${encodeURIComponent(id)}/tutors`,
  },
} as const;
