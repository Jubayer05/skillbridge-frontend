"use client";

import {
  getSubjectById,
  getTutorsBySubject,
  listSubjects,
} from "@/services/subjectService";
import type { TutorProfileSummary } from "@/types/category";
import type { Subject } from "@/types/subject";
import { useCallback, useEffect, useState } from "react";

export function useSubjects(categoryId?: string) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
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
    void listSubjects(categoryId)
      .then((data) => {
        if (mounted) {
          setSubjects(data);
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
  }, [categoryId, refreshKey]);

  return { subjects, loading, error, refetch };
}

export function useSubjectById(id: string) {
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let mounted = true;
    if (!id) {
      setSubject(null);
      setLoading(false);
      setError(null);
      return () => {
        mounted = false;
      };
    }

    setLoading(true);
    setError(null);
    void getSubjectById(id)
      .then((data) => {
        if (mounted) {
          setSubject(data);
        }
      })
      .catch((err: unknown) => {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Something went wrong",
          );
          setSubject(null);
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

  return { subject, loading, error, refetch };
}

export function useTutorsBySubject(subjectId: string) {
  const [tutors, setTutors] = useState<TutorProfileSummary[]>([]);
  const [loading, setLoading] = useState(Boolean(subjectId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!subjectId) {
      setTutors([]);
      setLoading(false);
      setError(null);
      return () => {
        mounted = false;
      };
    }

    setLoading(true);
    setError(null);
    void getTutorsBySubject(subjectId)
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
  }, [subjectId]);

  return { tutors, loading, error };
}
