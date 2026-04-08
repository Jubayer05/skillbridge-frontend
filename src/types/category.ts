export type SubjectSummary = {
  id: string;
  name: string;
  availableSlotsCount?: number;
  availableTutorsCount?: number;
};

export type Category = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    /** Tutors (with a profile) who have ≥1 slot for a subject in this category. */
    tutorProfiles: number;
    subjects: number;
  };
  subjects?: SubjectSummary[];
};

export type CreateCategoryPayload = {
  name: string;
  description?: string;
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export type TutorProfileSummary = {
  id: string;
  userId: string;
  headline: string;
  hourlyRate: string;
  rating: string | null;
  totalReviews: number;
  profileImageUrl: string | null;
  isVerified: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
};
