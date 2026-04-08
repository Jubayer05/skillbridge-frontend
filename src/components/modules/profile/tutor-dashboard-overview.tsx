"use client";

import {
  BadgeDollarSign,
  CalendarDays,
  MessageSquareQuote,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyProfile } from "@/services/profile";
import type { UserProfile } from "@/types/profile";

const sessions = [
  { title: "Calculus mentoring session", time: "Today, 4:00 PM" },
  { title: "Career coaching call", time: "Tomorrow, 11:00 AM" },
  { title: "Group revision workshop", time: "Saturday, 8:00 PM" },
];

const reviews = [
  {
    student: "Ayesha",
    text: "Explains difficult topics in a very simple and structured way.",
  },
  {
    student: "Fahim",
    text: "The mock interview feedback helped me improve quickly.",
  },
];

export function TutorDashboardOverview() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getMyProfile()
      .then((data) => {
        if (!active) return;
        setProfile(data);
        setError(null);
      })
      .catch((err: Error) => {
        if (!active) return;
        setError(err.message ?? "Failed to load dashboard data");
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Skeleton className="h-28 w-full" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Unable to load dashboard</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const rating = profile?.tutorProfile?.rating ?? "4.90";
  const totalReviews = profile?.tutorProfile?.totalReviews ?? 24;
  const hourlyRate = profile?.tutorProfile?.hourlyRate ?? "45.00";

  const stats = [
    {
      label: "Sessions this week",
      value: "09",
      icon: CalendarDays,
      hint: "3 upcoming today",
    },
    {
      label: "Estimated earnings",
      value: `$${hourlyRate}`,
      icon: BadgeDollarSign,
      hint: "Current hourly rate",
    },
    {
      label: "Average rating",
      value: `${rating}`,
      icon: Star,
      hint: `${totalReviews} reviews`,
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card className="border-primary/15 bg-gradient-to-r from-primary/8 via-background to-background">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-2xl">{`Tutor dashboard for ${profile?.name ?? "Tutor"}`}</CardTitle>
            <CardDescription>
              Track your sessions, earnings, and student feedback from one place.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/tutor/availability">Manage availability</Link>
          </Button>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="mt-2 text-3xl">{stat.value}</CardTitle>
              </div>
              <stat.icon className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {stat.hint}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming sessions</CardTitle>
            <CardDescription>Your next booked tutoring sessions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessions.map((session) => (
              <div
                key={`${session.title}-${session.time}`}
                className="rounded-lg border px-4 py-3"
              >
                <p className="font-medium">{session.title}</p>
                <p className="text-sm text-muted-foreground">{session.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent reviews</CardTitle>
            <CardDescription>Latest feedback from your students.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.student}
                className="rounded-lg border px-4 py-3 text-sm"
              >
                <div className="mb-2 flex items-center gap-2 font-medium">
                  <MessageSquareQuote className="size-4 text-primary" />
                  {review.student}
                </div>
                <p className="text-muted-foreground">{review.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
