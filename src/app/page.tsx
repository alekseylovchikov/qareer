"use client";

import { db } from "@/lib/instant";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import Link from "next/link";
import { Briefcase, GraduationCap, Calendar, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = db.useAuth();

  const { data, isLoading: dataLoading } = db.useQuery({
    jobs: {
      $: {
        where: { userId: user?.id },
      },
    },
    skills: {
      $: {
        where: { userId: user?.id },
      },
    },
    interviews: {
      $: {
        where: { userId: user?.id },
      },
      job: {},
    },
  });

  if (authLoading || dataLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-zinc-500 animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <h2 className="text-xl font-semibold">Please Log In</h2>
        <p className="text-zinc-500">
          You need to be logged in to view your dashboard.
        </p>
        <Link href="/login" className="text-indigo-600 hover:underline">
          Go to Login &rarr;
        </Link>
      </div>
    );
  }

  // Calculate Stats
  const jobs = data?.jobs || [];
  const skills = data?.skills || [];
  const interviews = data?.interviews || [];

  const activeJobs = jobs.filter((j) =>
    ["APPLIED", "INTERVIEWING", "OFFER"].includes(j.status)
  ).length;
  const savedJobs = jobs.filter((j) => j.status === "SAVED").length;
  const skillsInProgress = skills.length;

  const recentJobs = [...jobs]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 3);

  const upcomingInterviews = interviews.filter(
    (i) => new Date(i.date) >= new Date()
  );
  const upcomingCount = upcomingInterviews.length;
  const nextInterview = upcomingInterviews.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Welcome back
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Here is your job search at a glance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Applications
            </CardTitle>
            <Briefcase className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeJobs}</div>
            <p className="text-xs text-zinc-500">
              {savedJobs} saved jobs waiting
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Skills Tracked
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skillsInProgress}</div>
            <p className="text-xs text-zinc-500">Keep growing!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Interviews
            </CardTitle>
            <Calendar className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingCount}</div>
            {nextInterview ? (
              <div className="mt-1">
                <p className="text-xs font-medium text-zinc-900 dark:text-zinc-50">
                  Next: {new Date(nextInterview.date).toLocaleDateString()}
                </p>
                <p className="text-xs text-zinc-500 truncate">
                  {nextInterview.job?.company || "Scheduled"} -{" "}
                  {nextInterview.type}
                </p>
              </div>
            ) : (
              <p className="text-xs text-zinc-500">No interviews scheduled</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between border-b border-zinc-100 last:border-0 pb-2 last:pb-0 dark:border-zinc-800"
                >
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {job.title}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">{job.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800">
                      {job.status}
                    </span>
                  </div>
                </div>
              ))}
              {recentJobs.length === 0 && (
                <p className="text-sm text-zinc-500 italic">
                  No recent activity.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/jobs"
              className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <span className="text-sm font-medium">Add New Job</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
