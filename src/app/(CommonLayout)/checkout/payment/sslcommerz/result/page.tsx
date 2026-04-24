 "use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <Suspense>
      <ResultClient />
    </Suspense>
  );
}

function ResultClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const status = (sp.get("status") ?? "").toLowerCase();
  const bookingId = sp.get("bookingId") ?? "";

  useEffect(() => {
    if (!status) return;
    if (status === "success") toast.success("Payment successful");
    else if (status === "failed") toast.error("Payment failed");
    else if (status === "cancelled") toast.message("Payment cancelled");

    if (status === "success") {
      const t = window.setTimeout(() => router.push("/categories"), 1200);
      return () => window.clearTimeout(t);
    }
  }, [router, status]);

  return (
    <div className="p-4 md:p-6">
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Payment result</CardTitle>
          <CardDescription>
            {status ? `Status: ${status}` : "No status returned from payment gateway."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {bookingId ? (
            <p className="text-sm text-muted-foreground">Booking ID: {bookingId}</p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/categories">Go to categories</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

