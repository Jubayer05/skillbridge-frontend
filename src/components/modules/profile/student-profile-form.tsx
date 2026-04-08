"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
import { getMyProfile, updateMyProfile } from "@/services/profile";
import { uploadSinglePhoto } from "@/services/upload";
import type { UserProfile } from "@/types/profile";

const studentProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  phoneNumber: z.string().trim().max(30).optional(),
  bio: z.string().trim().max(1000).optional(),
  image: z.string().optional().nullable(),
});

type StudentProfileFormValues = z.infer<typeof studentProfileSchema>;

export function StudentProfileForm() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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
  } = useForm<StudentProfileFormValues>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      bio: "",
      image: null,
    },
  });

  useEffect(() => {
    let active = true;

    getMyProfile()
      .then((data) => {
        if (!active) return;
        setProfile(data);
        setPreviewImage(data.image);
        reset({
          name: data.name,
          phoneNumber: data.phoneNumber ?? "",
          bio: data.bio ?? "",
          image: data.image ?? null,
        });
      })
      .catch((err: Error) => {
        if (!active) return;
        setError(err.message ?? "Failed to load profile");
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
      setValue("image", url, { shouldDirty: true, shouldValidate: true });
      setPreviewImage(url);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to upload image",
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

  const onSubmit = async (values: StudentProfileFormValues) => {
    try {
      const updated = await updateMyProfile({
        name: values.name,
        phoneNumber: values.phoneNumber?.trim() || null,
        bio: values.bio?.trim() || null,
        image: values.image ?? null,
      });

      setProfile(updated);
      setPreviewImage(updated.image);
      reset({
        name: updated.name,
        phoneNumber: updated.phoneNumber ?? "",
        bio: updated.bio ?? "",
        image: updated.image ?? null,
      });

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update profile",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-[520px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Unable to load profile</CardTitle>
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
          <CardTitle>Student profile</CardTitle>
          <CardDescription>
            Manage your personal details and the information visible on your
            account.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit profile</CardTitle>
          <CardDescription>
            Keep your profile current so tutors can contact and support you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col gap-4 rounded-xl border p-4 md:flex-row md:items-center">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border bg-muted">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt={profile?.name ?? "Profile"}
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
                <Label htmlFor="student-image">Profile image upload</Label>
                <Input
                  id="student-image"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  disabled={isUploadingImage}
                  onChange={onImageChange}
                />
                <p className="text-xs text-muted-foreground">
                  {isUploadingImage
                    ? "Uploading…"
                    : "Upload JPG, PNG, or WEBP up to 2MB."}
                </p>
                {previewImage && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setValue("image", null, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      setPreviewImage(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    <Camera className="size-4" />
                    Remove image
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+8801XXXXXXXXX"
                  {...register("phoneNumber")}
                  aria-invalid={!!errors.phoneNumber}
                />
                {errors.phoneNumber && (
                  <p className="text-xs text-destructive">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                value={profile?.email ?? ""}
                disabled
                readOnly
                className="opacity-80"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us a little about your learning goals..."
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
                    name: profile?.name ?? "",
                    phoneNumber: profile?.phoneNumber ?? "",
                    bio: profile?.bio ?? "",
                    image: profile?.image ?? null,
                  })
                }
              >
                Reset
              </Button>
              <Button type="submit" disabled={isSubmitting || !isDirty}>
                {isSubmitting && (
                  <LoaderCircle className="size-4 animate-spin" />
                )}
                Save changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
