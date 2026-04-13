"use client";

import { TutorDiscoveryCard } from "@/components/tutor/TutorCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/useCategories";
import { listTutors } from "@/services/tutorsBrowse";
import type { PaginatedTutorList, TutorBrowseSort } from "@/types/tutor-discovery";
import { LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function parseNum(s: string | null): number | undefined {
  if (s == null || s === "") return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

export function TutorsBrowsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, loading: catLoading } = useCategories();

  const [data, setData] = useState<PaginatedTutorList | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");

  const page = Math.max(1, parseNum(searchParams.get("page")) ?? 1);
  const limit = Math.min(48, Math.max(1, parseNum(searchParams.get("limit")) ?? 12));
  const categoryId = searchParams.get("categoryId") ?? "";
  const minPrice = parseNum(searchParams.get("minPrice"));
  const maxPrice = parseNum(searchParams.get("maxPrice"));
  const minRating = parseNum(searchParams.get("minRating"));
  const q = searchParams.get("q") ?? "";
  const sort = (searchParams.get("sort") as TutorBrowseSort | null) ?? "rating_desc";

  const validSort: TutorBrowseSort =
    sort === "price_asc" ||
    sort === "price_desc" ||
    sort === "newest" ||
    sort === "rating_desc"
      ? sort
      : "rating_desc";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listTutors({
        page,
        limit,
        categoryId: categoryId || undefined,
        minPrice,
        maxPrice,
        minRating,
        q: q || undefined,
        sort: validSort,
      });
      setData(res);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to load tutors");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    limit,
    categoryId,
    minPrice,
    maxPrice,
    minRating,
    q,
    validSort,
  ]);

  useEffect(() => {
    void load();
  }, [load]);

  const pushFilters = (next: Record<string, string | undefined>) => {
    const p = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v === undefined || v === "") p.delete(k);
      else p.set(k, v);
    }
    if (!("page" in next)) p.set("page", "1");
    router.push(`/tutors?${p.toString()}`);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Find a tutor</h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Browse verified instructors, filter by subject area, price, and rating.
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-72 lg:shrink-0">
          <div className="bg-card space-y-5 rounded-xl border border-border/60 p-4 md:p-5">
            <h2 className="font-semibold">Filters</h2>

            <div className="space-y-2">
              <Label htmlFor="tutor-q">Search</Label>
              <div className="flex gap-2">
                <Input
                  id="tutor-q"
                  name="q"
                  defaultValue={q}
                  placeholder="Name or headline"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const v = (e.target as HTMLInputElement).value;
                      pushFilters({ q: v || undefined });
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    const el = document.getElementById(
                      "tutor-q",
                    ) as HTMLInputElement | null;
                    pushFilters({ q: el?.value?.trim() || undefined });
                  }}
                >
                  Go
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={categoryId || "all"}
                disabled={catLoading}
                onValueChange={(v) =>
                  pushFilters({ categoryId: v === "all" ? undefined : v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="min-p">Min $/hr</Label>
                <Input
                  id="min-p"
                  type="number"
                  min={0}
                  step={1}
                  defaultValue={minPrice ?? ""}
                  onBlur={(e) => {
                    const v = e.target.value;
                    pushFilters({
                      minPrice: v === "" ? undefined : v,
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-p">Max $/hr</Label>
                <Input
                  id="max-p"
                  type="number"
                  min={0}
                  step={1}
                  defaultValue={maxPrice ?? ""}
                  onBlur={(e) => {
                    const v = e.target.value;
                    pushFilters({
                      maxPrice: v === "" ? undefined : v,
                    });
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Min rating</Label>
              <Select
                value={
                  minRating != null ? String(minRating) : "any"
                }
                onValueChange={(v) =>
                  pushFilters({
                    minRating: v === "any" ? undefined : v,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="3">3+ stars</SelectItem>
                  <SelectItem value="4">4+ stars</SelectItem>
                  <SelectItem value="4.5">4.5+ stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sort by</Label>
              <Select
                value={validSort}
                onValueChange={(v) =>
                  pushFilters({ sort: v as TutorBrowseSort })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating_desc">Rating (high to low)</SelectItem>
                  <SelectItem value="price_asc">Price (low to high)</SelectItem>
                  <SelectItem value="price_desc">Price (high to low)</SelectItem>
                  <SelectItem value="newest">Newest profiles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push("/tutors")}
            >
              Clear filters
            </Button>
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-muted-foreground text-sm">
              {loading
                ? "Loading…"
                : data
                  ? `${data.total} tutor${data.total === 1 ? "" : "s"} found`
                  : ""}
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="icon"
                variant={view === "grid" ? "secondary" : "ghost"}
                aria-label="Grid view"
                onClick={() => setView("grid")}
              >
                <LayoutGrid className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant={view === "list" ? "secondary" : "ghost"}
                aria-label="List view"
                onClick={() => setView("list")}
              >
                <List className="size-4" />
              </Button>
            </div>
          </div>

          {loading && !data ? (
            <div
              className={
                view === "grid"
                  ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                  : "space-y-4"
              }
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))}
            </div>
          ) : data?.items.length === 0 ? (
            <p className="text-muted-foreground py-12 text-center text-sm">
              No tutors match your filters.{" "}
              <Link href="/tutors" className="text-primary underline">
                Reset
              </Link>
            </p>
          ) : view === "grid" ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {data?.items.map((t) => (
                <TutorDiscoveryCard key={t.id} tutor={t} variant="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {data?.items.map((t) => (
                <TutorDiscoveryCard key={t.id} tutor={t} variant="list" />
              ))}
            </div>
          )}

          {data && data.totalPages > 1 ? (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1 || loading}
                onClick={() => {
                  const p = new URLSearchParams(searchParams.toString());
                  p.set("page", String(page - 1));
                  router.push(`/tutors?${p.toString()}`);
                }}
              >
                Previous
              </Button>
              <span className="text-muted-foreground text-sm tabular-nums">
                Page {page} of {data.totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages || loading}
                onClick={() => {
                  const p = new URLSearchParams(searchParams.toString());
                  p.set("page", String(page + 1));
                  router.push(`/tutors?${p.toString()}`);
                }}
              >
                Next
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
