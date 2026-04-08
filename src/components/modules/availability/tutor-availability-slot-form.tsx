"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import { useCategories } from "@/hooks/useCategories";
import { rememberAvailabilitySlot } from "@/lib/tutor-availability-recent";
import {
  createAvailabilitySlot,
  updateAvailabilitySlot,
} from "@/services/availability";
import { listSubjects } from "@/services/subjectService";
import type { AvailabilitySlot, AvailabilitySlotStatus } from "@/types/availability";
import type { Subject } from "@/types/subject";

const timeRegex = /^([01]?\d|2[0-3]):[0-5]\d$/;

const slotFormSchema = z
  .object({
    categoryId: z.string().uuid("Select a category"),
    subjectId: z.string().uuid("Select a subject"),
    date: z
      .string()
      .min(1, "Date is required")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
    startTime: z
      .string()
      .min(1, "Start time is required")
      .regex(timeRegex, "Use 24h HH:mm"),
    endTime: z
      .string()
      .min(1, "End time is required")
      .regex(timeRegex, "Use 24h HH:mm"),
    price: z
      .string()
      .min(1, "Price is required")
      .regex(/^\d+(\.\d{1,2})?$/, "Up to 2 decimal places"),
    status: z.enum(["available", "booked"]),
  })
  .refine(
    (data) => {
      const [sh, sm] = data.startTime.split(":").map(Number);
      const [eh, em] = data.endTime.split(":").map(Number);
      if (
        sh === undefined ||
        sm === undefined ||
        eh === undefined ||
        em === undefined
      ) {
        return false;
      }
      return eh * 60 + em > sh * 60 + sm;
    },
    { message: "End time must be after start time", path: ["endTime"] },
  );

export type TutorAvailabilitySlotFormValues = z.infer<typeof slotFormSchema>;

export function TutorAvailabilitySlotForm({
  mode,
  slot,
  onUpdated,
}: {
  mode: "create" | "edit";
  slot?: AvailabilitySlot;
  onUpdated?: (slot: AvailabilitySlot) => void;
}) {
  const router = useRouter();
  const { categories, loading: categoriesLoading } = useCategories();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const skipNextSubjectReset = useRef(true);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TutorAvailabilitySlotFormValues>({
    resolver: zodResolver(slotFormSchema),
    defaultValues:
      mode === "edit" && slot
        ? {
            categoryId: slot.subject?.category.id ?? "",
            subjectId: slot.subject?.id ?? "",
            date: slot.date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            price: slot.price,
            status: slot.status,
          }
        : {
            categoryId: "",
            subjectId: "",
            date: "",
            startTime: "",
            endTime: "",
            price: "",
            status: "available",
          },
  });

  const categoryId = watch("categoryId");

  useEffect(() => {
    if (!categoryId || !z.string().uuid().safeParse(categoryId).success) {
      setSubjects([]);
      return;
    }
    let cancelled = false;
    setSubjectsLoading(true);
    void listSubjects(categoryId)
      .then((data) => {
        if (!cancelled) setSubjects(data);
      })
      .catch(() => {
        if (!cancelled) setSubjects([]);
      })
      .finally(() => {
        if (!cancelled) setSubjectsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  useEffect(() => {
    if (skipNextSubjectReset.current) {
      skipNextSubjectReset.current = false;
      return;
    }
    setValue("subjectId", "");
  }, [categoryId, setValue]);

  const onSubmit = (data: TutorAvailabilitySlotFormValues) => {
    if (mode === "create") {
      const body: {
        subjectId: string;
        date: string;
        startTime: string;
        endTime: string;
        price: number | string;
        status?: AvailabilitySlotStatus;
      } = {
        subjectId: data.subjectId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        price: data.price,
      };
      if (data.status !== "available") {
        body.status = data.status;
      }
      return createAvailabilitySlot(body)
        .then((created) => {
          rememberAvailabilitySlot(created);
          toast.success("Availability slot created");
          router.push(`/tutor/availability/${created.id}`);
        })
        .catch((err: Error) => {
          toast.error(err.message ?? "Could not create slot");
        });
    }

    if (!slot) return;

    return updateAvailabilitySlot(slot.id, {
      subjectId: data.subjectId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      price: data.price,
      status: data.status,
    })
      .then((updated) => {
        rememberAvailabilitySlot(updated);
        toast.success("Slot updated");
        onUpdated?.(updated);
      })
      .catch((err: Error) => {
        toast.error(err.message ?? "Could not update slot");
      });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex max-w-lg flex-col gap-5"
    >
      <div className="grid gap-2">
        <Label htmlFor="categoryId">Category</Label>
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || undefined}
              onValueChange={field.onChange}
              disabled={categoriesLoading}
            >
              <SelectTrigger id="categoryId" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.categoryId && (
          <p className="text-sm text-destructive">{errors.categoryId.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="subjectId">Subject</Label>
        <Controller
          name="subjectId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || undefined}
              onValueChange={field.onChange}
              disabled={
                !categoryId ||
                !z.string().uuid().safeParse(categoryId).success ||
                subjectsLoading
              }
            >
              <SelectTrigger id="subjectId" className="w-full">
                <SelectValue
                  placeholder={
                    !categoryId
                      ? "Select a category first"
                      : subjectsLoading
                        ? "Loading subjects…"
                        : "Select a subject"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.subjectId && (
          <p className="text-sm text-destructive">{errors.subjectId.message}</p>
        )}
        {categoryId &&
          z.string().uuid().safeParse(categoryId).success &&
          !subjectsLoading &&
          subjects.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No subjects in this category yet. Create one from the catalog.
            </p>
          )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" {...register("date")} />
        {errors.date && (
          <p className="text-sm text-destructive">{errors.date.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="startTime">Start time</Label>
          <Input id="startTime" type="time" {...register("startTime")} />
          {errors.startTime && (
            <p className="text-sm text-destructive">{errors.startTime.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="endTime">End time</Label>
          <Input id="endTime" type="time" {...register("endTime")} />
          {errors.endTime && (
            <p className="text-sm text-destructive">{errors.endTime.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          inputMode="decimal"
          placeholder="e.g. 45 or 45.00"
          {...register("price")}
        />
        {errors.price && (
          <p className="text-sm text-destructive">{errors.price.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.status && (
          <p className="text-sm text-destructive">{errors.status.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {mode === "create" ? "Create slot" : "Save changes"}
      </Button>
    </form>
  );
}
