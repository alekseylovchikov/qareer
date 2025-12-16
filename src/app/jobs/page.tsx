import { addJob, getJobs } from "@/app/actions/jobs";
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

export default async function JobsPage() {
  const jobs = await getJobs();

  // Group jobs by status or just list them? A simple list for now
  // We can add client-side "StatusSelect" component later or inline form actions

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
