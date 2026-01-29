"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Quote, Star } from "lucide-react";
import Image from "next/image";
import * as React from "react";

const RANDOMUSER_BASE = "https://randomuser.me/api/portraits";

const defaultReviews = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Product Designer",
    avatar: `${RANDOMUSER_BASE}/women/32.jpg`,
    text: "SkillBridge helped me level up my design skills with real projects and feedback from working designers. The 1:1 sessions were worth every penny.",
    rating: 5,
  },
  {
    id: "2",
    name: "Marcus Johnson",
    role: "Software Developer",
    avatar: `${RANDOMUSER_BASE}/men/22.jpg`,
    text: "I went from zero to landing my first dev job in six months. The mentors on SkillBridge know their stuff and actually care about your progress.",
    rating: 5,
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    role: "Marketing Lead",
    avatar: `${RANDOMUSER_BASE}/women/44.jpg`,
    text: "Finally a platform where I could learn analytics and content strategy from people doing it day to day. No fluff, just practical skills.",
    rating: 5,
  },
  {
    id: "4",
    name: "James Okonkwo",
    role: "Freelance Writer",
    avatar: `${RANDOMUSER_BASE}/men/67.jpg`,
    text: "The writing and storytelling courses connected me with editors and authors who gave me actionable feedback. My portfolio improved dramatically.",
    rating: 5,
  },
];

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  avatar?: string;
}

interface HomeReviewsProps {
  title?: string;
  description?: string;
  reviews?: ReviewItem[];
  autoplayDelay?: number;
  className?: string;
}

const AUTOPLAY_DELAY_MS = 5000;

export function HomeReviews({
  title = "What learners are saying",
  description = "Real stories from people who built new skills and grew their careers on SkillBridge.",
  reviews = defaultReviews,
  autoplayDelay = AUTOPLAY_DELAY_MS,
  className,
}: HomeReviewsProps) {
  const [api, setApi] = React.useState<CarouselApi | null>(null);

  React.useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, autoplayDelay);
    return () => clearInterval(interval);
  }, [api, autoplayDelay]);

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

      <div className="container relative mx-auto max-w-4xl">
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

        <Carousel
          opts={{
            loop: true,
            align: "start",
            skipSnaps: false,
          }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="-ml-2 sm:-ml-4">
            {reviews.map((review) => (
              <CarouselItem
                key={review.id}
                className="min-w-0 basis-full pl-2 sm:pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <div className="relative rounded-xl border border-border/60 bg-background/80 p-6 shadow-sm transition-colors hover:border-border hover:bg-background/90 sm:p-8">
                  <Quote className="absolute right-4 top-4 h-8 w-8 text-primary/20 sm:h-10 sm:w-10" />
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary text-primary sm:h-5 sm:w-5"
                        aria-hidden
                      />
                    ))}
                  </div>
                  <blockquote className="text-base text-foreground sm:text-lg">
                    &ldquo;{review.text}&rdquo;
                  </blockquote>
                  <footer className="mt-5 flex items-center gap-3 sm:mt-6">
                    <Image
                      src={review.avatar ?? `${RANDOMUSER_BASE}/men/1.jpg`}
                      alt=""
                      className="size-10 shrink-0 rounded-full object-cover ring-2 ring-border sm:size-12"
                      width={48}
                      height={48}
                    />
                    <div className="min-w-0 flex-1">
                      <cite className="not-italic font-semibold text-foreground">
                        {review.name}
                      </cite>
                      <span className="block text-sm text-muted-foreground">
                        {review.role}
                      </span>
                    </div>
                  </footer>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
