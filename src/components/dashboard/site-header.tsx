"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getCategoryById } from "@/services/categoryService";
import { getSubjectById } from "@/services/subjectService";
import { ModeToggle } from "../shared/ModeToggle";

function humanizeSegment(segment: string): string {
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function SiteHeader() {
  const pathname = usePathname();
  const segments = (pathname ?? "").split("/").filter(Boolean);
  const segmentsKey = segments.join("/");

  const [resolvedLabels, setResolvedLabels] = useState<Record<string, string>>(
    {},
  );

  const isUuid = (value: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      value,
    );

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (segments.length === 0) return;

      const next: Record<string, string> = {};

      for (let i = 0; i < segments.length; i += 1) {
        const segment = segments[i]!;
        if (!isUuid(segment)) continue;

        const prev = segments[i - 1];
        try {
          if (prev === "categories") {
            const cat = await getCategoryById(segment);
            next[segment] = cat.name;
          } else if (prev === "subjects") {
            const subj = await getSubjectById(segment);
            next[segment] = subj.name;
          }
        } catch {
          // keep fallback label
        }
      }

      if (!active) return;
      if (Object.keys(next).length === 0) return;
      setResolvedLabels((current) => {
        let changed = false;
        for (const [k, v] of Object.entries(next)) {
          if (current[k] !== v) {
            changed = true;
            break;
          }
        }
        return changed ? { ...current, ...next } : current;
      });
    };

    void run();

    return () => {
      active = false;
    };
  }, [pathname, segmentsKey]);

  const crumbs = useMemo(
    () =>
      segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const label = resolvedLabels[segment] ?? humanizeSegment(segment);
        const isLast = index === segments.length - 1;
        return { segment, href, label, isLast };
      }),
    [segments, resolvedLabels],
  );

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full min-w-0 items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 shrink-0" />
        <Separator
          orientation="vertical"
          className="mx-2 shrink-0 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb className="min-w-0">
          <BreadcrumbList className="flex-nowrap">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {crumbs.length > 0 && (
              <BreadcrumbSeparator className="text-muted-foreground [&>svg]:hidden">
                <span aria-hidden className="px-0.5 select-none">
                  &gt;
                </span>
              </BreadcrumbSeparator>
            )}
            {crumbs.map((crumb) => (
              <span key={crumb.href} className="contents">
                <BreadcrumbItem className="min-w-0">
                  {crumb.isLast ? (
                    <BreadcrumbPage className="truncate font-medium">
                      {crumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild className="truncate">
                      <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!crumb.isLast && (
                  <BreadcrumbSeparator className="text-muted-foreground [&>svg]:hidden">
                    <span aria-hidden className="px-0.5 select-none">
                      &gt;
                    </span>
                  </BreadcrumbSeparator>
                )}
              </span>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
