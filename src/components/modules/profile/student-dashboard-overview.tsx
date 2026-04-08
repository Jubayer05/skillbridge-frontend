"use client";

import { BookOpen, CalendarClock, Clock3, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

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

const upcomingBookings = [
  { title: "Advanced Algebra with Rahim Ahmed", time: "Today, 5:30 PM" },
  { title: "Physics Problem Solving", time: "Tomorrow, 7:00 PM" },
  { title: "IELTS Speaking Practice", time: "Friday, 6:00 PM" },
];

const quickStats = [
  {
    label: "Upcoming bookings",
    value: "03",
    icon: CalendarClock,
    hint: "Next 7 days",
  },
  {
    label: "Learning hours",
    value: "12.5",
    icon: Clock3,
    hint: "This week",
  },
  {
    label: "Saved tutors",
    value: "08",
    icon: BookOpen,
    hint: "Ready to book",
  },
];

export function StudentDashboardOverview() {
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
        <Skeleton className="h-72 w-full" />
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

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card className="border-primary/15 bg-gradient-to-r from-primary/8 via-background to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="size-5 text-primary" />
            {`Welcome back, ${profile?.name ?? "Student"}`}
          </CardTitle>
          <CardDescription>
            Stay on top of your upcoming tutoring sessions and keep your learning
            profile up to date.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {quickStats.map((stat) => (
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

      <Card>
        <CardHeader>
          <CardTitle>Upcoming bookings</CardTitle>
          <CardDescription>
            Your next confirmed tutoring sessions at a glance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingBookings.map((booking) => (
            <div
              key={`${booking.title}-${booking.time}`}
              className="flex items-center justify-between rounded-lg border px-4 py-3"
            >
              <div>
                <p className="font-medium">{booking.title}</p>
                <p className="text-sm text-muted-foreground">{booking.time}</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Confirmed
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
