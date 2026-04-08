"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { loginUser } from "@/services/auth";
import type { AuthSessionInfo, AuthUser } from "@/types/auth";
import { DemoLoginButtons } from "./demo-login-buttons";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const { setAuth } = useAuth();
  const router = useRouter();

  const onSubmit = (data: LoginFormValues) => {
    loginUser(data)
      .then((res) => {
        const user = res.data?.user as AuthUser;
        const session = res.data?.session as AuthSessionInfo | null | undefined;
        setAuth(user, session?.expiresAt ?? null);
        toast.success(`Welcome back, ${user.name}!`);
        router.push(user.role === "TUTOR" ? "/tutor/dashboard" : "/dashboard");
      })
      .catch((error: Error) => {
        toast.error(error.message ?? "Login failed. Please try again.");
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground text-balance">
          Enter your credentials to access your account
        </p>
      </div>

      <DemoLoginButtons setValue={setValue} />

      {/* Fields */}
      <div className="grid gap-5">
        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-foreground">
              Password
            </Label>
            <Link
              href="/auth/forgot-password"
              className={cn(
                "text-xs text-muted-foreground underline-offset-4",
                "hover:text-foreground hover:underline transition-colors",
              )}
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
