import {
  Award,
  BookOpen,
  MessageCircle,
  Sparkles,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

const defaultServices: ServiceItem[] = [
  {
    id: "1",
    title: "Structured courses",
    description:
      "Follow step-by-step curricula designed by experts. Learn at your own pace with video lessons, assignments, and quizzes.",
    icon: BookOpen,
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-500/10 dark:bg-blue-400/10",
  },
  {
    id: "2",
    title: "Live sessions",
    description:
      "Join live workshops and Q&A sessions. Get real-time feedback and connect with instructors and other learners.",
    icon: Video,
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-400/10",
  },
  {
    id: "3",
    title: "Mentorship",
    description:
      "Work one-on-one with experienced mentors. Get personalized guidance and accountability to reach your goals.",
    icon: Users,
    iconColor: "text-violet-600 dark:text-violet-400",
    iconBg: "bg-violet-500/10 dark:bg-violet-400/10",
  },
  {
    id: "4",
    title: "Certificates",
    description:
      "Earn certificates when you complete courses. Showcase your new skills on your profile and resume.",
    icon: Award,
    iconColor: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-500/10 dark:bg-amber-400/10",
  },
  {
    id: "5",
    title: "Community",
    description:
      "Join discussions, share progress, and network with learners and instructors in a supportive community.",
    icon: MessageCircle,
    iconColor: "text-rose-600 dark:text-rose-400",
    iconBg: "bg-rose-500/10 dark:bg-rose-400/10",
  },
  {
    id: "6",
    title: "Skill paths",
    description:
      "Follow curated paths that combine courses and projects so you can go from beginner to job-ready.",
    icon: Sparkles,
    iconColor: "text-cyan-600 dark:text-cyan-400",
    iconBg: "bg-cyan-500/10 dark:bg-cyan-400/10",
  },
];

interface HomeServicesProps {
  title?: string;
  description?: string;
  services?: ServiceItem[];
  className?: string;
}

export function HomeServices({
  title = "How SkillBridge works",
  description = "Learn new skills through courses, live sessions, and mentorship—all in one place.",
  services = defaultServices,
  className,
}: HomeServicesProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 px-6 py-12 shadow-sm backdrop-blur-sm sm:px-10 sm:py-16 md:px-14",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, var(--primary / 0.08), transparent)",
        }}
      />

      <div className="container relative mx-auto max-w-5xl">
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground sm:text-lg">
              {description}
            </p>
          )}
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.id}
                className="group relative rounded-xl border border-border/60 bg-background/80 p-6 shadow-sm transition-colors hover:border-border hover:bg-background hover:shadow-md sm:p-7"
              >
                <div
                  className={cn(
                    "mb-4 inline-flex size-12 items-center justify-center rounded-xl sm:size-14",
                    service.iconBg,
                    service.iconColor,
                  )}
                >
                  <Icon className="size-6 sm:size-7" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-foreground sm:text-xl">
                  {service.title}
                </h3>
                <p className="mt-2 text-muted-foreground sm:mt-3 sm:text-base">
                  {service.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
