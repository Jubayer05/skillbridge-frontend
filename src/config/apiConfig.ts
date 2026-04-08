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
