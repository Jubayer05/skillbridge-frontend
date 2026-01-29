import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookOpen, Star, Users } from "lucide-react";

const RANDOMUSER_BASE = "https://randomuser.me/api/portraits";

export interface FeatureTutorItem {
  id: string;
  name: string;
  avatar: string;
  courseOffered: string;
  description: string;
  rating?: number;
  studentsCount?: number;
  coursesCount?: number;
}

const defaultTutors: FeatureTutorItem[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: `${RANDOMUSER_BASE}/women/32.jpg`,
    courseOffered: "Product Design & UI/UX",
    description:
      "Former design lead with 10+ years experience. Focus on user research, prototyping, and design systems for web and mobile.",
    rating: 4.9,
    studentsCount: 1240,
    coursesCount: 3,
  },
  {
    id: "2",
    name: "Marcus Johnson",
    avatar: `${RANDOMUSER_BASE}/men/22.jpg`,
    courseOffered: "Full-Stack Development",
    description:
      "Senior engineer teaching React, Node.js, and cloud deployment. Hands-on projects and code reviews included in every course.",
    rating: 4.8,
    studentsCount: 2100,
    coursesCount: 5,
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    avatar: `${RANDOMUSER_BASE}/women/44.jpg`,
    courseOffered: "Digital Marketing & Analytics",
    description:
      "Marketing director turned instructor. Covers SEO, paid ads, content strategy, and analytics with real campaign walkthroughs.",
    rating: 4.9,
    studentsCount: 890,
    coursesCount: 4,
  },
  {
    id: "4",
    name: "James Okonkwo",
    avatar: `${RANDOMUSER_BASE}/men/67.jpg`,
    courseOffered: "Creative Writing & Storytelling",
    description:
      "Published author and editor. Learn structure, voice, and revision—from short stories to long-form nonfiction and memoir.",
    rating: 4.7,
    studentsCount: 560,
    coursesCount: 2,
  },
  {
    id: "5",
    name: "Priya Sharma",
    avatar: `${RANDOMUSER_BASE}/women/65.jpg`,
    courseOffered: "Data Science & Python",
    description:
      "Ex-ML engineer teaching Python, pandas, and introductory machine learning. Emphasis on real datasets and portfolio projects.",
    rating: 4.8,
    studentsCount: 1780,
    coursesCount: 4,
  },
  {
    id: "6",
    name: "David Kim",
    avatar: `${RANDOMUSER_BASE}/men/45.jpg`,
    courseOffered: "Photography & Lightroom",
    description:
      "Professional photographer. From camera basics to advanced editing and color grading. Includes critique and portfolio reviews.",
    rating: 4.6,
    studentsCount: 720,
    coursesCount: 3,
  },
  {
    id: "7",
    name: "Amara Okafor",
    avatar: `${RANDOMUSER_BASE}/women/50.jpg`,
    courseOffered: "Project Management",
    description:
      "PMP-certified PM with experience in tech and consulting. Agile, scrum, and stakeholder communication with practical templates.",
    rating: 4.9,
    studentsCount: 1100,
    coursesCount: 2,
  },
  {
    id: "8",
    name: "Lucas Müller",
    avatar: `${RANDOMUSER_BASE}/men/33.jpg`,
    courseOffered: "German & Language Coaching",
    description:
      "Native speaker and language coach. Business German, conversation practice, and exam prep. Custom lessons for your level and goals.",
    rating: 4.8,
    studentsCount: 430,
    coursesCount: 3,
  },
];

interface HomeFeatureTutorProps {
  title?: string;
  description?: string;
  tutors?: FeatureTutorItem[];
  viewMoreHref?: string;
  viewMoreLabel?: string;
  className?: string;
}

export function HomeFeatureTutor({
  title = "Featured tutors",
  description = "Learn from experienced instructors across design, development, marketing, and more.",
  tutors = defaultTutors,
  viewMoreHref = "/instructors",
  viewMoreLabel = "View more tutors",
  className,
}: HomeFeatureTutorProps) {
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

        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {tutors.map((tutor) => (
            <article
              key={tutor.id}
              className="group flex flex-col rounded-xl border border-border/60 bg-background/80 shadow-sm transition-colors hover:border-border hover:bg-background hover:shadow-md"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-t-xl bg-muted/50">
                <Image
                  src={tutor.avatar}
                  alt=""
                  className="object-cover transition-transform group-hover:scale-105"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <h3 className="font-semibold text-foreground sm:text-lg">
                  {tutor.name}
                </h3>
                <p className="mt-0.5 text-sm font-medium text-primary">
                  {tutor.courseOffered}
                </p>
                <p
                  className="mt-2 line-clamp-2 text-sm text-muted-foreground"
                  title={tutor.description}
                >
                  {tutor.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  {tutor.rating != null && (
                    <span className="flex items-center gap-1">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      {tutor.rating}
                    </span>
                  )}
                  {tutor.studentsCount != null && (
                    <span className="flex items-center gap-1">
                      <Users className="size-3.5" />
                      {tutor.studentsCount >= 1000
                        ? `${(tutor.studentsCount / 1000).toFixed(1)}k`
                        : tutor.studentsCount}{" "}
                      students
                    </span>
                  )}
                  {tutor.coursesCount != null && (
                    <span className="flex items-center gap-1">
                      <BookOpen className="size-3.5" />
                      {tutor.coursesCount} courses
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center sm:mt-12">
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link href={viewMoreHref}>{viewMoreLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
