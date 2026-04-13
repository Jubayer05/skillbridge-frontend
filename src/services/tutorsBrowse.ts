import { API_ENDPOINTS } from "@/config/apiConfig";
import { apiFetch } from "@/lib/api-fetch";
import type {
  PaginatedTutorList,
  TutorBrowseSort,
  TutorPublicDetail,
} from "@/types/tutor-discovery";

export async function listTutors(params?: {
  page?: number;
  limit?: number;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  q?: string;
  sort?: TutorBrowseSort;
}): Promise<PaginatedTutorList> {
  const res = await apiFetch<PaginatedTutorList>(
    API_ENDPOINTS.tutors.list(params),
    { method: "GET" },
  );
  if (!res.data) throw new Error("Tutors list was not returned");
  return res.data;
}

export async function getTutorPublicDetail(
  userId: string,
  params?: { reviewsPage?: number; reviewsLimit?: number },
): Promise<TutorPublicDetail> {
  const res = await apiFetch<TutorPublicDetail>(
    API_ENDPOINTS.tutors.detail(userId, params),
    { method: "GET" },
  );
  if (!res.data) throw new Error("Tutor details were not returned");
  return res.data;
}
