import type { ApiResponse } from "@/types/auth";

export interface TutorProfile {
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
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  bio: string | null;
  image: string | null;
  role: "ADMIN" | "TUTOR" | "STUDENT";
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  tutorProfile?: TutorProfile | null;
}

export interface PublicTutorProfile extends TutorProfile {
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string | null;
    image: string | null;
    role: "ADMIN" | "TUTOR" | "STUDENT";
  };
}

export interface UpdateProfilePayload {
  name: string;
  phoneNumber?: string | null;
  bio?: string | null;
  image?: string | null;
}

export interface UpsertTutorProfilePayload {
  headline: string;
  bio: string;
  hourlyRate: string;
  experience: number;
  education: string;
  languages: string[];
  profileImageUrl?: string | null;
}

export type UserProfileResponse = ApiResponse<UserProfile>;
export type PublicTutorProfileResponse = ApiResponse<PublicTutorProfile>;
