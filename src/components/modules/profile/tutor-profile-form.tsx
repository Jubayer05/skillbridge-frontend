"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { getMyProfile, upsertMyTutorProfile } from "@/services/profile";
import { uploadSinglePhoto } from "@/services/upload";
import type { UserProfile } from "@/types/profile";

const tutorProfileSchema = z.object({
  headline: z.string().trim().min(1, "Headline is required").max(150),
  bio: z.string().trim().min(1, "Bio is required").max(3000),
  hourlyRate: z
    .string()
    .trim()
    .min(1, "Hourly rate is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Use a valid amount with up to 2 decimals"),
  experience: z
    .number()
    .int("Experience must be a whole number")
    .min(0, "Experience cannot be negative"),
  education: z.string().trim().min(1, "Education is required").max(255),
  languages: z.string().trim().min(1, "Add at least one language"),
  profileImageUrl: z.string().optional().nullable(),
});

type TutorProfileFormValues = z.infer<typeof tutorProfileSchema>;

export function TutorProfileForm() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<TutorProfileFormValues>({
    resolver: zodResolver(tutorProfileSchema),
    defaultValues: {
      headline: "",
      bio: "",
      hourlyRate: "",
      experience: 0,
      education: "",
      languages: "",
      profileImageUrl: null,
    },
  });

  useEffect(() => {
    let active = true;

    getMyProfile()
      .then((data) => {
        if (!active) return;
        setProfile(data);
        setPreviewImage(
          data.tutorProfile?.profileImageUrl ?? data.image ?? null,
        );
        reset({
          headline: data.tutorProfile?.headline ?? "",
          bio: data.tutorProfile?.bio ?? data.bio ?? "",
          hourlyRate: data.tutorProfile?.hourlyRate ?? "",
          experience: data.tutorProfile?.experience ?? 0,
          education: data.tutorProfile?.education ?? "",
          languages: data.tutorProfile?.languages?.join(", ") ?? "",
          profileImageUrl:
            data.tutorProfile?.profileImageUrl ?? data.image ?? null,
        });
      })
      .catch((err: Error) => {
        if (!active) return;
        setError(err.message ?? "Failed to load tutor profile");
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reset]);

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be 2MB or less");
      return;
    }

    setIsUploadingImage(true);
    try {
      const { url } = await uploadSinglePhoto(file);
      setValue("profileImageUrl", url, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setPreviewImage(url);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to upload image",
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

  const onSubmit = async (values: TutorProfileFormValues) => {
    try {
      const updated = await upsertMyTutorProfile({
        headline: values.headline,
        bio: values.bio,
        hourlyRate: values.hourlyRate,
        experience: values.experience,
        education: values.education,
        languages: values.languages
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        profileImageUrl: values.profileImageUrl ?? null,
      });

      const nextProfile: UserProfile | null = profile
        ? {
            ...profile,
            tutorProfile: {
              id: updated.id,
              userId: updated.userId,
              headline: updated.headline,
              bio: updated.bio,
              hourlyRate: updated.hourlyRate,
              experience: updated.experience,
              education: updated.education,
              languages: updated.languages,
              rating: updated.rating,
              totalReviews: updated.totalReviews,
              profileImageUrl: updated.profileImageUrl,
              isVerified: updated.isVerified,
              createdAt: updated.createdAt,
              updatedAt: updated.updatedAt,
            },
          }
        : null;

      setProfile(nextProfile);
      setPreviewImage(updated.profileImageUrl);
      reset({
        headline: updated.headline,
        bio: updated.bio,
        hourlyRate: updated.hourlyRate,
        experience: updated.experience,
        education: updated.education,
        languages: updated.languages.join(", "),
        profileImageUrl: updated.profileImageUrl,
      });

      toast.success("Tutor profile saved successfully");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save tutor profile",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-[720px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Unable to load tutor profile</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Tutor profile</CardTitle>
          <CardDescription>
            Create the public profile students will see before booking a
            session.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile details</CardTitle>
          <CardDescription>
            Add your headline, teaching bio, hourly rate, experience, and
            education.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col gap-4 rounded-xl border p-4 md:flex-row md:items-center">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border bg-muted">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt={profile?.name ?? "Tutor"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="profileImageUrl">Profile image upload</Label>
                <Input
                  id="profileImageUrl"
                  type="file"
                  accept="image/*"
                  disabled={isUploadingImage}
                  onChange={onImageChange}
                />
                <p className="text-xs text-muted-foreground">
                  {isUploadingImage
                    ? "Uploading…"
                    : "Upload a clear profile photo up to 2MB."}
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  placeholder="Math tutor | SAT prep mentor"
                  {...register("headline")}
                  aria-invalid={!!errors.headline}
                />
                {errors.headline && (
                  <p className="text-xs text-destructive">
                    {errors.headline.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly rate</Label>
                <Input
                  id="hourlyRate"
                  placeholder="25.00"
                  {...register("hourlyRate")}
                  aria-invalid={!!errors.hourlyRate}
                />
                {errors.hourlyRate && (
                  <p className="text-xs text-destructive">
                    {errors.hourlyRate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="experience">Experience (years)</Label>
                <Input
                  id="experience"
                  type="number"
                  min={0}
                  {...register("experience", { valueAsNumber: true })}
                  aria-invalid={!!errors.experience}
                />
                {errors.experience && (
                  <p className="text-xs text-destructive">
                    {errors.experience.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  placeholder="BSc in Computer Science"
                  {...register("education")}
                  aria-invalid={!!errors.education}
                />
                {errors.education && (
                  <p className="text-xs text-destructive">
                    {errors.education.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="languages">Languages</Label>
              <Input
                id="languages"
                placeholder="English, Bangla"
                {...register("languages")}
                aria-invalid={!!errors.languages}
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple languages with commas.
              </p>
              {errors.languages && (
                <p className="text-xs text-destructive">
                  {errors.languages.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Describe your teaching style, expertise, and what students can expect..."
                {...register("bio")}
                aria-invalid={!!errors.bio}
              />
              {errors.bio && (
                <p className="text-xs text-destructive">{errors.bio.message}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() =>
                  reset({
                    headline: profile?.tutorProfile?.headline ?? "",
                    bio: profile?.tutorProfile?.bio ?? profile?.bio ?? "",
                    hourlyRate: profile?.tutorProfile?.hourlyRate ?? "",
                    experience: profile?.tutorProfile?.experience ?? 0,
                    education: profile?.tutorProfile?.education ?? "",
                    languages:
                      profile?.tutorProfile?.languages.join(", ") ?? "",
                    profileImageUrl:
                      profile?.tutorProfile?.profileImageUrl ??
                      profile?.image ??
                      null,
                  })
                }
              >
                Reset
              </Button>
              <Button type="submit" disabled={isSubmitting || !isDirty}>
                {isSubmitting && (
                  <LoaderCircle className="size-4 animate-spin" />
                )}
                Save tutor profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
