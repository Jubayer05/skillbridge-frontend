import { API_ENDPOINTS } from "@/config/apiConfig";
import { apiFetch } from "@/lib/api-fetch";

export async function initSslcommerzPayment(input: {
  availabilitySlotId: string;
  notes?: string;
}): Promise<{ gatewayUrl: string; bookingId: string }> {
  const res = await apiFetch<{ gatewayUrl: string; bookingId: string }>(
    API_ENDPOINTS.payments.sslcommerzInit,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
  if (!res.data?.gatewayUrl) {
    throw new Error("Payment gateway URL was not returned");
  }
  return res.data;
}

