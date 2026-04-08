export type AvailabilitySlotStatus = "available" | "booked";

export type AvailabilitySlotSubject = {
  id: string;
  name: string;
  category: { id: string; name: string };
};

export interface AvailabilitySlot {
  id: string;
  tutorId: string;
  subjectId: string | null;
  subject: AvailabilitySlotSubject | null;
  date: string;
  startTime: string;
  endTime: string;
  startAt: string;
  endAt: string;
  price: string;
  status: AvailabilitySlotStatus;
  createdAt: string;
}

export type SlotTutor = {
  id: string;
  name: string;
  image: string | null;
};

export type PublicAvailabilitySlot = AvailabilitySlot & {
  tutor: SlotTutor;
};

export interface CreateAvailabilitySlotPayload {
  subjectId: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number | string;
  status?: AvailabilitySlotStatus;
}

export type UpdateAvailabilitySlotPayload = Partial<
  Omit<CreateAvailabilitySlotPayload, "status">
> & {
  subjectId?: string;
  status?: AvailabilitySlotStatus;
};
