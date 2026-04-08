import { API_ENDPOINTS } from "@/config/apiConfig";
import { apiFetch } from "@/lib/api-fetch";

export type FeaturedTutor = {
  id: string;
  userId: string;
  headline: string;
  bio: string;
  hourlyRate: string;
  rating: string | null;
  totalReviews: number;
  profileImageUrl: string | null;
  isVerified: boolean;
  subjectsCount: number;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
};

export async function listFeaturedTutors(
  limit = 8,
): Promise<FeaturedTutor[]> {
  const res = await apiFetch<FeaturedTutor[]>(
    API_ENDPOINTS.tutor.featured(limit),
    { method: "GET" },
  );
  if (!res.data) {
    throw new Error("Featured tutors were not returned");
  }
  return res.data;
}
