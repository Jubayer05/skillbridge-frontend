"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const defaultFaqs = [
  {
    question: "What is SkillBridge?",
    answer:
      "SkillBridge is a platform where you can learn new skills from others and share what you know. Whether you want to pick up a new hobby, advance your career, or teach others, SkillBridge connects learners with skilled mentors in a simple, supportive environment.",
  },
  {
    question: "Is SkillBridge free to use?",
    answer:
      "You can join and explore SkillBridge for free. Some courses or one-on-one sessions may have a fee set by the instructor. We also offer premium features for instructors who want to grow their audience and manage their offerings.",
  },
  {
    question: "How do I become an instructor?",
    answer:
      "Sign up, complete your profile, and list the skills you want to teach. You can create courses, set your own pricing, and start accepting learners. We provide tools to schedule sessions, share materials, and get paid securely.",
  },
  {
    question: "How do I find courses or mentors?",
    answer:
      "Browse by skill, topic, or instructor. You can read reviews, see availability, and book sessions or enroll in courses that fit your goals. Many instructors offer free intro sessions so you can try before you commit.",
  },
  {
    question: "Can I cancel or get a refund?",
    answer:
      "Refund and cancellation policies depend on the instructor and the type of offering. You can see each instructor's policy before you book. For platform or billing issues, our support team is here to help.",
  },
];

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqHomeProps {
  title?: string;
  description?: string;
  faqs?: FaqItem[];
  className?: string;
}

export function FaqHome({
  title = "Frequently asked questions",
  description = "Everything you need to know about learning and teaching on SkillBridge.",
  faqs = defaultFaqs,
  className,
}: FaqHomeProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 px-6 py-12 shadow-sm backdrop-blur-sm sm:px-10 sm:py-16 md:px-14",
        className,
      )}
    >
      {/* Subtle background gradient */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, var(--primary / 0.08), transparent)",
        }}
      />

      <div className="container relative mx-auto max-w-3xl">
        <div className="mb-12 text-center sm:mb-14">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-4 max-w-xl mx-auto text-muted-foreground sm:text-lg">
              {description}
            </p>
          )}
        </div>

        <Accordion type="single" collapsible className="w-full space-y-1">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`faq-${index}`}
              className="rounded-xl border border-border/60 bg-background/60 shadow-xs transition-colors hover:border-border hover:bg-background/80 data-[state=open]:border-primary/20 data-[state=open]:bg-background"
            >
              <AccordionTrigger
                icon="plus"
                className="py-5 px-4 text-left text-base font-semibold sm:py-6 sm:text-lg"
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 px-4  text-muted-foreground sm:pb-6 sm:text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
