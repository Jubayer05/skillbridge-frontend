const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";
const AUTH_BASE_URL = BASE_URL.replace(/\/api\/v1$/, "/api/auth");

export const API_ENDPOINTS = {
  auth: {
    /**
     * Better Auth get-session. Query flags are required for dashboard polling:
     * - disableRefresh: otherwise every poll extends the session (sliding window) and it never expires while the tab is open.
     * - disableCookieCache: read the real DB expiry, not a cached cookie payload.
     */
    getSession: `${AUTH_BASE_URL}/get-session?disableRefresh=true&disableCookieCache=true`,
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
} as const;
