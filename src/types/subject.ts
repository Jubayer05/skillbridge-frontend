export type Subject = {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
  };
  _count?: {
    /** Unique tutors with ≥1 availability slot for this subject. */
    tutorProfiles: number;
  };
};

export type CreateSubjectPayload = {
  name: string;
  categoryId: string;
  description?: string;
};

export type UpdateSubjectPayload = Partial<CreateSubjectPayload>;
