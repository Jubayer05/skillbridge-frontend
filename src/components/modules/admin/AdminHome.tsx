"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAdminStats } from "@/services/admin";
import type { AdminStats } from "@/types/admin";
import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "var(--chart-1)",
  TUTOR: "var(--chart-2)",
  STUDENT: "var(--chart-3)",
};

function roleLabel(role: string) {
  if (role === "ADMIN") return "Admins";
  if (role === "TUTOR") return "Tutors";
  return "Students";
}

export function AdminHome() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchAdminStats();
        if (!cancelled) {
          setStats(data);
          setError(null);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load stats");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-destructive p-6 text-sm">
        {error ?? "Unable to load dashboard."}
      </div>
    );
  }

  const totalUsers = stats.usersByRole.reduce((a, r) => a + r.count, 0);

  const chartData = stats.usersByRole.map((r) => ({
    name: roleLabel(r.role),
    value: r.count,
    role: r.role,
  }));

  return (
    <div className="space-y-8 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin overview</h1>
        <p className="text-muted-foreground text-sm">
          Platform usage, revenue from completed sessions, and recent activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums">{totalUsers}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums">
              {stats.totalBookings}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenue (completed)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums">
              ${stats.totalRevenue}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Users by role</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.role}
                      fill={ROLE_COLORS[entry.role] ?? "var(--muted)"}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="max-h-[280px] space-y-3 overflow-y-auto pr-1 text-sm">
              {stats.recentActivities.length === 0 ? (
                <li className="text-muted-foreground">No recent activity.</li>
              ) : (
                stats.recentActivities.map((a, i) => (
                  <li
                    key={`${a.at}-${i}`}
                    className="border-border/60 border-b pb-3 last:border-0 last:pb-0"
                  >
                    <p className="font-medium">{a.title}</p>
                    <p className="text-muted-foreground mt-0.5">{a.description}</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {new Date(a.at).toLocaleString()}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
