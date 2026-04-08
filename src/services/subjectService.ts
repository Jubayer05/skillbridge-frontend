import { API_ENDPOINTS } from "@/config/apiConfig";
import { apiFetch } from "@/lib/api-fetch";
import type {
  CreateSubjectPayload,
  Subject,
  UpdateSubjectPayload,
} from "@/types/subject";
import type { TutorProfileSummary } from "@/types/category";

export async function listSubjects(categoryId?: string): Promise<Subject[]> {
  const url = categoryId
    ? `${API_ENDPOINTS.subject.list}?categoryId=${encodeURIComponent(categoryId)}`
    : API_ENDPOINTS.subject.list;
  const res = await apiFetch<Subject[]>(url, { method: "GET" });
  if (!res.data) {
    throw new Error("Data was not returned");
  }
  return res.data;
}

export async function getSubjectById(id: string): Promise<Subject> {
  const res = await apiFetch<Subject>(API_ENDPOINTS.subject.byId(id), {
    method: "GET",
  });
  if (!res.data) {
    throw new Error("Data was not returned");
  }
  return res.data;
}

export async function createSubject(
  payload: CreateSubjectPayload,
): Promise<Subject> {
  const res = await apiFetch<Subject>(API_ENDPOINTS.subject.create, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.data) {
    throw new Error("Data was not returned");
  }
  return res.data;
}

export async function updateSubject(
  id: string,
  payload: UpdateSubjectPayload,
): Promise<Subject> {
  const res = await apiFetch<Subject>(API_ENDPOINTS.subject.update(id), {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (!res.data) {
    throw new Error("Data was not returned");
  }
  return res.data;
}

export async function deleteSubject(id: string): Promise<void> {
  await apiFetch<null>(API_ENDPOINTS.subject.delete(id), {
    method: "DELETE",
  });
}

export async function getTutorsBySubject(
  id: string,
): Promise<TutorProfileSummary[]> {
  const res = await apiFetch<TutorProfileSummary[]>(
    API_ENDPOINTS.subject.tutors(id),
    { method: "GET" },
  );
  if (!res.data) {
    throw new Error("Data was not returned");
  }
  return res.data;
}
