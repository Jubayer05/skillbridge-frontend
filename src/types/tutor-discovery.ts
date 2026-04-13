import type { PaginatedReviews } from "@/types/review";

export type TutorListItem = {
  id: string;
  userId: string;
  headline: string;
  bio: string;
  hourlyRate: string;
  rating: string | null;
  totalReviews: number;
  profileImageUrl: string | null;
  isVerified: boolean;
  createdAt: string;
  user: { id: string; name: string; image: string | null };
  categories: { id: string; name: string }[];
};

export type PaginatedTutorList = {
  items: TutorListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type TutorPublicDetailTutor = {
  id: string;
  userId: string;
  headline: string;
  bio: string;
  hourlyRate: string;
  experience: number;
  education: string;
  languages: string[];
  rating: string | null;
  totalReviews: number;
  profileImageUrl: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string | null;
    image: string | null;
    role: string;
  };
  categories: { id: string; name: string }[];
  subjects: { id: string; name: string; category: { id: string; name: string } }[];
};

export type TutorPublicDetail = {
  tutor: TutorPublicDetailTutor;
  reviews: PaginatedReviews;
  averageRating: string | null;
};

export type TutorBrowseSort =
  | "rating_desc"
  | "price_asc"
  | "price_desc"
  | "newest";
