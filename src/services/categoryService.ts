import { API_ENDPOINTS } from "@/config/apiConfig";
import { apiFetch } from "@/lib/api-fetch";
import type {
  Category,
  CreateCategoryPayload,
  TutorProfileSummary,
  UpdateCategoryPayload,
} from "@/types/category";

export async function listCategories(): Promise<Category[]> {
  const res = await apiFetch<Category[]>(API_ENDPOINTS.category.list, {
    method: "GET",
  });
  if (!res.data) {
    throw new Error("Data was not returned");
  }
  return res.data;
}

export async function getCategoryById(id: string): Promise<Category> {
  const res = await apiFetch<Category>(API_ENDPOINTS.category.byId(id), {
    method: "GET",
  });
  if (!res.data) {
    throw new Error("Data was not returned");
  }
  return res.data;
}

export async function createCategory(
  payload: CreateCategoryPayload,
): Promise<Category> {
  const res = await apiFetch<Category>(API_ENDPOINTS.category.create, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.data) {
    throw new Error("Data was not returned");
  }
  return res.data;
}

export async function updateCategory(
  id: string,
  payload: UpdateCategoryPayload,
): Promise<Category> {
  const res = await apiFetch<Category>(API_ENDPOINTS.category.update(id), {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (!res.data) {
    throw new Error("Data was not returned");
  }
  return res.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await apiFetch<null>(API_ENDPOINTS.category.delete(id), {
    method: "DELETE",
  });
}

export async function getTutorsByCategory(
  id: string,
): Promise<TutorProfileSummary[]> {
  const res = await apiFetch<TutorProfileSummary[]>(
    API_ENDPOINTS.category.tutors(id),
    { method: "GET" },
  );
  if (!res.data) {
    throw new Error("Data was not returned");
  }
  return res.data;
}
