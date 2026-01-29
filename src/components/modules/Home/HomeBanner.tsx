import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HomeBanner({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-muted/40 via-background to-background px-6 py-16 shadow-sm dark:from-muted/20 dark:via-background sm:px-12 sm:py-24 md:px-16 lg:px-24",
        className,
      )}
    >
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: "3rem 3rem",
        }}
      />

      <div className="container relative mx-auto flex max-w-5xl flex-col items-center gap-10 text-center">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-xs backdrop-blur-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          Now in open beta — start learning today
        </span>

        {/* Headline */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Learn skills.
            <br />
            <span className="text-primary">Share what you know.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            SkillBridge connects people who want to learn with people who love
            to teach. Master new skills, share your expertise, and grow
            together.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 text-base font-semibold"
          >
            <Link href="/signup">Get started free</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border-2 px-8 text-base font-semibold"
          >
            <Link href="/courses">Browse courses</Link>
          </Button>
        </div>

        {/* Trust line */}
        <p className="text-sm text-muted-foreground">
          No credit card required · Free to join · Cancel anytime
        </p>
      </div>
    </section>
  );
}
