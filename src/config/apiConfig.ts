/**
 * Use same-origin API paths by default so auth/session cookies stay first-party
 * in production deployments (e.g. Vercel), avoiding cross-site cookie drops.
 */
const isBrowser = typeof window !== "undefined";
const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
const backendOrigin = (process.env.BACKEND_URL ?? "http://localhost:4000").replace(
  /\/$/,
  "",
);

function resolveServerBaseUrl(): string {
  if (!configuredApiUrl) return `${backendOrigin}/api/v1`;
  if (/^https?:\/\//i.test(configuredApiUrl)) {
    return configuredApiUrl.replace(/\/$/, "");
  }
  if (configuredApiUrl.startsWith("/")) {
    return `${backendOrigin}${configuredApiUrl}`;
  }
  return `${backendOrigin}/${configuredApiUrl}`;
}

const BASE_URL = isBrowser ? "/api/v1" : resolveServerBaseUrl();
const AUTH_BASE_URL = BASE_URL.replace(/\/api\/v1$/, "/api/auth");

function withQuery(
  base: string,
  params: Record<string, string | number | null | undefined>,
): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || String(v).trim() === "") continue;
    q.set(k, String(v));
  }
  const qs = q.toString();
  return qs ? `${base}?${qs}` : base;
}

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
      return withQuery(`${BASE_URL}/tutors`, {
        page: params?.page,
        limit: params?.limit,
        categoryId: params?.categoryId,
        minPrice: params?.minPrice,
        maxPrice: params?.maxPrice,
        minRating: params?.minRating,
        q: params?.q?.trim(),
        sort: params?.sort,
      });
    },
    detail: (
      userId: string,
      params?: { reviewsPage?: number; reviewsLimit?: number },
    ) => {
      return withQuery(`${BASE_URL}/tutors/${encodeURIComponent(userId)}`, {
        reviewsPage: params?.reviewsPage,
        reviewsLimit: params?.reviewsLimit,
      });
    },
    reviews: (userId: string, params?: { page?: number; limit?: number }) => {
      return withQuery(
        `${BASE_URL}/tutors/${encodeURIComponent(userId)}/reviews`,
        {
          page: params?.page,
          limit: params?.limit,
        },
      );
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
  payments: {
    sslcommerzInit: `${BASE_URL}/payments/sslcommerz/init`,
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
