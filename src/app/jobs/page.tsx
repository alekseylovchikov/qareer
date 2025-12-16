"use client";

import { db } from "@/lib/instant";
import { Button } from "@/app/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import { Input } from "@/app/components/ui/Input";
import { JobStatus } from "@/lib/types";
import { JobCard } from "@/app/components/JobCard";
import { id } from "@instantdb/react";
import Link from "next/link";

export default function JobsPage() {
  const { user } = db.useAuth();
  const { data, isLoading } = db.useQuery({
    jobs: {
      $: {
        where: { userId: user?.id },
      },
    },
  });

  const jobs = data?.jobs || [];

  function addJob(formData: FormData) {
    if (!user) return;
    const title = formData.get("title") as string;
    const company = formData.get("company") as string;
    const url = formData.get("url") as string;
    const status = formData.get("status") as string;

    db.transact(
      db.tx.jobs[id()].update({
        title,
        company,
        url,
        status: status || "SAVED",
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );

    // Reset form? The form will reload, but we might want to clear inputs.
    // For simplicity with standard form submission, we might accept it "just works" but without clearing inputs it's annoying.
    // We can use a ref or state, or just let it be for MVP.
  }

  if (isLoading) return <div className="p-8">Loading jobs...</div>;

  // if (!user) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-96 gap-4">
  //       <h2 className="text-xl font-semibold">Please Log In</h2>
  //       <p className="text-zinc-500">
  //         You need to be logged in to view your dashboard.
  //       </p>
  //       <Link href="/login" className="text-indigo-600 hover:underline">
  //         Go to Login &rarr;
  //       </Link>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Jobs
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Track your applications and interviews.
          </p>
        </div>
      </div>

      {/* Add Job Form */}
      {Boolean(user) && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Vacancy</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              action={addJob}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 items-end"
            >
              <div className="lg:col-span-1">
                <Input name="title" placeholder="Job Title" required />
              </div>
              <div className="lg:col-span-1">
                <Input name="company" placeholder="Company" required />
              </div>
              <div className="lg:col-span-1">
                <Input name="url" placeholder="Posting URL" type="url" />
              </div>
              <div className="lg:col-span-1">
                <select
                  name="status"
                  className="flex h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 md:text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                >
                  {Object.keys(JobStatus).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="lg:col-span-1">
                <Button type="submit" className="w-full">
                  Add Job
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Jobs Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
        {jobs.length === 0 && (
          <div className="col-span-full text-center py-12 text-zinc-500">
            No jobs tracked yet. Add one above!
          </div>
        )}
      </div>
    </div>
  );
}
