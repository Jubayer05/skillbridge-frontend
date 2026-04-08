"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/services/auth";

const schema = z
  .object({
    newPassword: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") ?? "";
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  if (!token) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-sm text-destructive">
          Invalid or missing reset token. Please request a new reset link.
        </p>
        <Link
          href="/auth/forgot-password"
          className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          Request new link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="size-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Password reset!
          </h1>
          <p className="text-sm text-muted-foreground text-balance">
            Your password has been updated successfully. You can now sign in
            with your new password.
          </p>
        </div>
        <Link
          href="/auth/login"
          className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  const onSubmit = ({ newPassword }: FormValues) => {
    resetPassword({ token, newPassword })
      .then(() => {
        toast.success("Password reset successfully!");
        setDone(true);
      })
      .catch((error: Error) => {
        toast.error(error.message ?? "Failed to reset password.");
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Set new password
        </h1>
        <p className="text-sm text-muted-foreground text-balance">
          Choose a strong password for your account.
        </p>
      </div>

      {/* Fields */}
      <div className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="newPassword" className="text-foreground">
            New Password
          </Label>
          <Input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.newPassword}
            {...register("newPassword")}
          />
          {errors.newPassword ? (
            <p className="text-xs text-destructive">
              {errors.newPassword.message}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Min 8 chars, one uppercase letter and one number.
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword" className="text-foreground">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Resetting…" : "Reset password"}
        </Button>
      </div>
    </form>
  );
}
