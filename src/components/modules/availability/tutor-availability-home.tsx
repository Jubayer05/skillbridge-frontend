"use client";

import Link from "next/link";
import { Copy } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { copyToClipboard } from "@/lib/copy-to-clipboard";
import {
  forgetAvailabilitySlotId,
  getRecentAvailabilitySlots,
} from "@/lib/tutor-availability-recent";
import { getAvailabilitySlotById } from "@/services/availability";

const uuidSchema = z.string().uuid("Enter a valid slot ID (UUID)");

export function TutorAvailabilityHome() {
  const router = useRouter();
  const pathname = usePathname();
  const [recentBump, setRecentBump] = useState(0);
  const [slotIdInput, setSlotIdInput] = useState("");
  const [isOpening, setIsOpening] = useState(false);

  const recent = useMemo(() => {
    void pathname;
    void recentBump;
    return getRecentAvailabilitySlots();
  }, [pathname, recentBump]);

  const refreshRecent = useCallback(() => {
    setRecentBump((n) => n + 1);
  }, []);

  const openById = () => {
    const parsed = uuidSchema.safeParse(slotIdInput.trim());
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid ID");
      return;
    }
    setIsOpening(true);
    getAvailabilitySlotById(parsed.data)
      .then(() => {
        router.push(`/tutor/availability/${parsed.data}`);
      })
      .catch((err: Error) => {
        toast.error(err.message ?? "Could not open slot");
      })
      .finally(() => {
        setIsOpening(false);
      });
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Availability</h1>
          <p className="text-muted-foreground text-sm">
            Create and manage your tutoring slots. After you create or open a
            slot, its ID is on that page and in the address bar. Recent slots
            below also show the ID so you can copy it.
          </p>
        </div>
        <Button asChild>
          <Link href="/tutor/availability/new">New slot</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Open by slot ID</CardTitle>
          <CardDescription>
            Paste the UUID from the slot page, from the address bar (
            <span className="font-mono break-all">
              {`…/tutor/availability/<uuid>`}
            </span>
            ), or from a recent slot below.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="slotId">Slot ID</Label>
            <Input
              id="slotId"
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              value={slotIdInput}
              onChange={(e) => setSlotIdInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") openById();
              }}
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            disabled={isOpening}
            onClick={openById}
          >
            Open
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent on this device</CardTitle>
          <CardDescription>
            Slots you created or opened here (stored in the browser, not loaded
            from the list API).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No slots yet. Create one or open an existing slot by ID.
            </p>
          ) : (
            <ul className="space-y-3">
              {recent.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-col gap-2 rounded-md border px-3 py-3 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link
                      href={`/tutor/availability/${row.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {row.date} · {row.startTime}–{row.endTime}
                    </Link>
                    <span className="text-muted-foreground capitalize">
                      {row.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <code
                      className="bg-muted text-muted-foreground max-w-full min-w-0 flex-1 overflow-x-auto rounded px-2 py-1 font-mono text-xs break-all"
                      title={row.id}
                    >
                      {row.id}
                    </code>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="shrink-0 gap-1"
                      onClick={() => {
                        copyToClipboard(row.id)
                          .then(() => {
                            toast.success("Slot ID copied");
                          })
                          .catch(() => {
                            toast.error("Could not copy to clipboard");
                          });
                      }}
                    >
                      <Copy className="size-3.5" aria-hidden />
                      Copy
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive shrink-0"
                      onClick={() => {
                        forgetAvailabilitySlotId(row.id);
                        refreshRecent();
                      }}
                    >
                      Forget
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
