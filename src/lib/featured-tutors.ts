import type { FeaturedTutor } from "@/services/tutorService";

export type FeatureTutorItem = {
  id: string;
  /** Tutor user id — links to public slots page when set. */
  userId?: string;
  name: string;
  avatar: string;
  courseOffered: string;
  description: string;
  rating?: number;
  studentsCount?: number;
  coursesCount?: number;
};

export function mapFeaturedApiToItem(t: FeaturedTutor): FeatureTutorItem {
  const ratingRaw =
    t.rating != null && t.rating !== "" ? Number.parseFloat(t.rating) : NaN;
  const rating = Number.isFinite(ratingRaw) ? ratingRaw : undefined;
  const name = t.user.name;
  const avatar =
    t.profileImageUrl?.trim() ||
    t.user.image?.trim() ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=e2e8f0&color=64748b`;

  return {
    id: t.id,
    userId: t.userId,
    name,
    avatar,
    courseOffered: t.headline,
    description: t.bio,
    rating,
    studentsCount: t.totalReviews,
    coursesCount: t.subjectsCount,
  };
}

/** Server-side fetch for the home page (no browser CORS). Returns null if the request fails so the client can retry. */
export async function fetchFeaturedTutorsForHome(
  limit = 8,
): Promise<FeatureTutorItem[] | null> {
  const base = (
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:4000/api/v1"
  ).replace(/\/$/, "");

  try {
    const res = await fetch(`${base}/tutor/featured?limit=${limit}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return null;
    }
    const body = (await res.json()) as {
      data?: FeaturedTutor[];
    };
    const raw = body.data;
    if (!Array.isArray(raw)) {
      return null;
    }
    return raw.map(mapFeaturedApiToItem);
  } catch {
    return null;
  }
}
