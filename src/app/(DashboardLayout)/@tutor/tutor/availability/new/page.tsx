import Link from "next/link";

import { TutorAvailabilitySlotForm } from "@/components/modules/availability/tutor-availability-slot-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TutorAvailabilityNewPage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/tutor/availability">← Availability</Link>
        </Button>
      </div>
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>New availability slot</CardTitle>
          <CardDescription>
            Choose a category and subject, then set date, time range, and price.
            Times use 24-hour format (HH:mm).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground text-sm leading-relaxed">
            If you need to create a new category or subject first, use the catalog:{" "}
            <Link
              href="/dashboard/categories/new"
              className="text-primary font-medium underline underline-offset-4 hover:no-underline"
            >
              New category
            </Link>
            {" · "}
            <Link
              href="/dashboard/subjects/new"
              className="text-primary font-medium underline underline-offset-4 hover:no-underline"
            >
              New subject
            </Link>
            .
          </p>
          <TutorAvailabilitySlotForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
