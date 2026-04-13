"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatSlotTitle } from "@/lib/slot-display";
import { fetchAdminBookings } from "@/services/admin";
import type { AdminBooking, Paginated } from "@/types/admin";
import type { BookingStatus } from "@/types/booking";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function statusLabel(status: BookingStatus) {
  if (status === "confirmed") return "Confirmed";
  if (status === "completed") return "Completed";
  return "Cancelled";
}

function statusBadgeVariant(
  status: BookingStatus,
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "confirmed") return "default";
  if (status === "completed") return "secondary";
  return "destructive";
}

export function AdminBookingsPage() {
  const [data, setData] = useState<Paginated<AdminBooking> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("");
  const [q, setQ] = useState("");
  const [qInput, setQInput] = useState("");
  const [detail, setDetail] = useState<AdminBooking | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAdminBookings({
        page,
        limit: 15,
        status: status || undefined,
        q: q || undefined,
      });
      setData(res);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [page, status, q]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
        <p className="text-muted-foreground text-sm">
          All platform bookings with status filters and student search.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="min-w-[200px] flex-1 space-y-2">
          <Label htmlFor="booking-search">Search student</Label>
          <div className="flex gap-2">
            <Input
              id="booking-search"
              placeholder="Name or email"
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setPage(1);
                  setQ(qInput.trim());
                }
              }}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setPage(1);
                setQ(qInput.trim());
              }}
            >
              Search
            </Button>
          </div>
        </div>
        <div className="w-full space-y-2 sm:w-48">
          <Label>Status</Label>
          <Select
            value={status || "all"}
            onValueChange={(v) => {
              setPage(1);
              setStatus(v === "all" ? "" : v);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border border-border/60">
        {loading && !data ? (
          <div className="space-y-2 p-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data?.items ?? []).map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    <div className="font-medium">{b.student.name}</div>
                    <div className="text-muted-foreground max-w-[180px] truncate text-xs">
                      {b.student.email}
                    </div>
                  </TableCell>
                  <TableCell>{b.tutor.name}</TableCell>
                  <TableCell className="max-w-[220px] text-sm">
                    {formatSlotTitle({
                      name: b.slotName,
                      date: b.date,
                      startTime: b.startTime,
                      endTime: b.endTime,
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant(b.status)}>
                      {statusLabel(b.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="tabular-nums">${b.totalPrice}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setDetail(b)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {data ? (
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <p className="text-muted-foreground">
            Page {data.page} of {data.totalPages} · {data.total} bookings
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= data.totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking details</DialogTitle>
          </DialogHeader>
          {detail ? (
            <dl className="grid gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Booking ID</dt>
                <dd className="font-mono text-xs break-all">{detail.id}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Student</dt>
                <dd>
                  {detail.student.name} ({detail.student.email})
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Tutor</dt>
                <dd>{detail.tutor.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Subject</dt>
                <dd>
                  {detail.subject
                    ? `${detail.subject.category.name} · ${detail.subject.name}`
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Slot</dt>
                <dd>
                  {formatSlotTitle({
                    name: detail.slotName,
                    date: detail.date,
                    startTime: detail.startTime,
                    endTime: detail.endTime,
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Duration</dt>
                <dd>{detail.duration} min</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Price</dt>
                <dd className="tabular-nums">${detail.totalPrice}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <Badge variant={statusBadgeVariant(detail.status)}>
                    {statusLabel(detail.status)}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Payment</dt>
                <dd>{detail.paymentMethod}</dd>
              </div>
              {detail.notes ? (
                <div>
                  <dt className="text-muted-foreground">Notes</dt>
                  <dd className="whitespace-pre-wrap">{detail.notes}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-muted-foreground">Created</dt>
                <dd>{new Date(detail.createdAt).toLocaleString()}</dd>
              </div>
            </dl>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
