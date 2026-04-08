import { API_ENDPOINTS } from "@/config/apiConfig";
import type {
  PublicTutorProfile,
  PublicTutorProfileResponse,
  UpdateProfilePayload,
  UpsertTutorProfilePayload,
  UserProfile,
  UserProfileResponse,
} from "@/types/profile";

async function apiFetch<T>(
  url: string,
  options: RequestInit,
): Promise<{ message: string; data?: T; error?: string }> {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const json = (await response.json()) as {
    message: string;
    data?: T;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(json.message ?? json.error ?? "Request failed");
  }

  return json;
}

export const getMyProfile = async (): Promise<UserProfile> => {
  const response = (await apiFetch<UserProfile>(API_ENDPOINTS.profile.get, {
    method: "GET",
  })) as UserProfileResponse;

  if (!response.data) {
    throw new Error("Profile data was not returned");
  }

  return response.data;
};

export const updateMyProfile = async (
  payload: UpdateProfilePayload,
): Promise<UserProfile> => {
  const response = (await apiFetch<UserProfile>(API_ENDPOINTS.profile.update, {
    method: "PUT",
    body: JSON.stringify(payload),
  })) as UserProfileResponse;

  if (!response.data) {
    throw new Error("Updated profile data was not returned");
  }

  return response.data;
};

export const upsertMyTutorProfile = async (
  payload: UpsertTutorProfilePayload,
): Promise<PublicTutorProfile> => {
  const response = (await apiFetch<PublicTutorProfile>(
    API_ENDPOINTS.profile.tutorUpsert,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  )) as PublicTutorProfileResponse;

  if (!response.data) {
    throw new Error("Tutor profile data was not returned");
  }

  return response.data;
};

export const getTutorProfileByUserId = async (
  userId: string,
): Promise<PublicTutorProfile> => {
  const response = (await apiFetch<PublicTutorProfile>(
    API_ENDPOINTS.profile.tutorByUserId(userId),
    {
      method: "GET",
    },
  )) as PublicTutorProfileResponse;

  if (!response.data) {
    throw new Error("Tutor profile data was not returned");
  }

  return response.data;
};
