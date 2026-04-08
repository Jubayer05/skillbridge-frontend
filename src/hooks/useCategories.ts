"use client";

import {
  getCategoryById,
  getTutorsByCategory,
  listCategories,
} from "@/services/categoryService";
import type { Category, TutorProfileSummary } from "@/types/category";
import { useCallback, useEffect, useState } from "react";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    void listCategories()
      .then((data) => {
        if (mounted) {
          setCategories(data);
        }
      })
      .catch((err: unknown) => {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Something went wrong",
          );
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, [refreshKey]);

  return { categories, loading, error, refetch };
}

export function useCategoryById(id: string) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let mounted = true;
    if (!id) {
      setCategory(null);
      setLoading(false);
      setError(null);
      return () => {
        mounted = false;
      };
    }

    setLoading(true);
    setError(null);
    void getCategoryById(id)
      .then((data) => {
        if (mounted) {
          setCategory(data);
        }
      })
      .catch((err: unknown) => {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Something went wrong",
          );
          setCategory(null);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [id, refreshKey]);

  return { category, loading, error, refetch };
}

export function useTutorsByCategory(categoryId: string) {
  const [tutors, setTutors] = useState<TutorProfileSummary[]>([]);
  const [loading, setLoading] = useState(Boolean(categoryId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!categoryId) {
      setTutors([]);
      setLoading(false);
      setError(null);
      return () => {
        mounted = false;
      };
    }

    setLoading(true);
    setError(null);
    void getTutorsByCategory(categoryId)
      .then((data) => {
        if (mounted) {
          setTutors(data);
        }
      })
      .catch((err: unknown) => {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Something went wrong",
          );
          setTutors([]);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [categoryId]);

  return { tutors, loading, error };
}
