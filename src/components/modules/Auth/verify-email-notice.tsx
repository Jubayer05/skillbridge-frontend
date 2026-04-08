"use client";

import { LoaderCircle, MailCheck, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { sendVerificationEmail } from "@/services/auth";

export function VerifyEmailNotice() {
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") ?? "";
  const token = searchParams?.get("token") ?? "";
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) return;

    const callbackURL = `${window.location.origin}/auth/login?verified=1`;
    const verificationUrl = API_ENDPOINTS.auth.verifyEmailToken(
      token,
      callbackURL,
    );

    window.location.replace(verificationUrl);
  }, [token]);

  const handleResend = async () => {
    if (!email) {
      toast.error("Email address not found. Please register again.");
      return;
    }
    setResending(true);
    try {
      await sendVerificationEmail({ email });
      toast.success("Verification email resent! Check your inbox.");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to resend email.";
      toast.error(message);
    } finally {
      setResending(false);
    }
  };

  if (token) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <LoaderCircle className="size-8 animate-spin" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Verifying your email
          </h1>
          <p className="text-sm leading-6 text-muted-foreground text-balance">
            Please wait while we confirm your email address and complete your
            verification.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {/* Icon */}
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <MailCheck className="size-8" />
      </div>

      {/* Heading */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Check your inbox
        </h1>
        <p className="text-sm leading-6 text-muted-foreground text-balance">
          We sent a verification link to{" "}
          {email ? (
            <span className="font-medium text-foreground">{email}</span>
          ) : (
            "your email address"
          )}
          . Click the link to activate your account.
        </p>
      </div>

      {/* Resend */}
      <div className="flex flex-col items-center gap-3 w-full">
        <Button
          variant="outline"
          className="w-full"
          disabled={resending || !email}
          onClick={handleResend}
        >
          <RefreshCw className={`mr-2 size-4 ${resending ? "animate-spin" : ""}`} />
          {resending ? "Resending…" : "Resend verification email"}
        </Button>

        <p className="text-xs text-muted-foreground">
          Already verified?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
