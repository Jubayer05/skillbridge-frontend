export type BookingStatus = "confirmed" | "completed" | "cancelled";

export type Booking = {
  id: string;
  studentId: string;
  tutorProfileId: string;
  availabilitySlotId: string;
  slotName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalPrice: string;
  status: BookingStatus;
  paymentMethod: "COD" | "SSLCOMMERZ";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  tutor: {
    userId: string;
    name: string;
    image: string | null;
    profileImageUrl: string | null;
    headline: string;
    hourlyRate: string;
  };
  subject: {
    id: string;
    name: string;
    category: { id: string; name: string };
  } | null;
  /** Set after the student submits a review for this booking. */
  reviewId: string | null;
};

export type CreateBookingPayload = {
  availabilitySlotId: string;
  paymentMethod?: "COD" | "SSLCOMMERZ";
  notes?: string;
};

