import { API_ENDPOINTS } from "@/config/apiConfig";
import { apiFetch } from "@/lib/api-fetch";
import type {
  CreateReviewPayload,
  PaginatedReviews,
  PaginatedTutorDashboardReviews,
  Review,
} from "@/types/review";

export async function createReview(
  payload: CreateReviewPayload,
): Promise<Review> {
  const res = await apiFetch<Review>(API_ENDPOINTS.reviews.create, {
    method: "POST",
    body: JSON.stringify({
      bookingId: payload.bookingId,
      rating: payload.rating,
      ...(payload.comment?.trim()
        ? { comment: payload.comment.trim() }
        : {}),
    }),
  });
  if (!res.data) throw new Error("Review was not returned");
  return res.data;
}

export async function getReviewById(reviewId: string): Promise<Review> {
  const res = await apiFetch<Review>(
    API_ENDPOINTS.reviews.byId(reviewId),
    { method: "GET" },
  );
  if (!res.data) throw new Error("Review was not returned");
  return res.data;
}

/** Requires tutor session cookie. */
export async function listMyTutorDashboardReviews(params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedTutorDashboardReviews> {
  const search = new URLSearchParams();
  if (params?.page != null) search.set("page", String(params.page));
  if (params?.limit != null) search.set("limit", String(params.limit));
  const query = search.toString();
  const url = query
    ? `${API_ENDPOINTS.profile.tutorMyReviews}?${query}`
    : API_ENDPOINTS.profile.tutorMyReviews;

  const res = await apiFetch<PaginatedTutorDashboardReviews>(url, {
    method: "GET",
  });
  if (!res.data) {
    throw new Error("Reviews were not returned");
  }
  return res.data;
}

export async function listTutorReviews(
  tutorUserId: string,
  params?: { page?: number; limit?: number },
): Promise<PaginatedReviews> {
  const res = await apiFetch<PaginatedReviews>(
    API_ENDPOINTS.tutors.reviews(tutorUserId, params),
    { method: "GET" },
  );
  if (!res.data) {
    throw new Error("Reviews were not returned");
  }
  return res.data;
}
