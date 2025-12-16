import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import Link from "next/link";
import { Briefcase, GraduationCap, Calendar, ArrowRight } from "lucide-react";

async function getDashboardStats() {
  const user = await prisma.user.findFirst();
  if (!user) return null;

  const activeJobs = await prisma.jobVacancy.count({
    where: {
      userId: user.id,
      status: { in: ["APPLIED", "INTERVIEWING", "OFFER"] },
    },
  });

  const savedJobs = await prisma.jobVacancy.count({
    where: { userId: user.id, status: "SAVED" },
  });

  const skillsInProgress = await prisma.skill.count({
    where: { userId: user.id }, // Simply count all for now
  });

  const recentJobs = await prisma.jobVacancy.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    take: 3,
  });

  return {
    activeJobs,
    savedJobs,
    skillsInProgress,
    recentJobs,
    userName: user.name,
  };
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <h2 className="text-xl font-semibold">Welcome to JobTracker</h2>
        <p className="text-zinc-500">
          Please complete your profile to get started.
        </p>
        <Link href="/profile" className="text-indigo-600 hover:underline">
          Go to Profile &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Welcome back, {stats.userName?.split(" ")[0]}
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
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-zinc-500">
              {stats.savedJobs} saved jobs waiting
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
            <div className="text-2xl font-bold">{stats.skillsInProgress}</div>
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
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-zinc-500">No interviews scheduled</p>
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
              {stats.recentJobs.map((job) => (
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
            <Link
              href="/learning"
              className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <span className="text-sm font-medium">Update Skills</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/profile"
              className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <span className="text-sm font-medium">Update Resume</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
