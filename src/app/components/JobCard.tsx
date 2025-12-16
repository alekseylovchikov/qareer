"use client";

import { updateJobStatus, deleteJob } from "@/app/actions/jobs";
import { Button } from "@/app/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import { JobStatus } from "@/lib/types";
import { ExternalLink, Trash2 } from "lucide-react";
import { useTransition } from "react";

// Assuming Job type structure based on usage in page.tsx
// Ideally we should import the Job type from Prisma client or types file if available.
// For now, defining a local interface matching what we saw or using 'any' temporarily if unsure,
// but better to be type safe.
// Looking at page.tsx: job.id, job.title, job.company, job.status, job.salary, job.url
interface Job {
  id: string;
  title: string;
  company: string;
  status: string; // Prismo enum is usually string at runtime, but we cast to JobStatus
  salary?: string | null;
  url?: string | null;
}

export function JobCard({ job }: { job: Job }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Card className="relative group">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{job.title}</CardTitle>
            <p className="text-sm text-zinc-500 font-medium">{job.company}</p>
          </div>
          <Badge status={job.status as JobStatus} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          {job.salary && <p>💰 {job.salary}</p>}
          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              View Listing
            </a>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex items-center gap-2">
          <select
            name="status"
            defaultValue={job.status}
            disabled={isPending}
            className="h-8 rounded bg-transparent text-xs font-medium border-0 focus:ring-0 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 p-1"
            onChange={(e) => {
              const newStatus = e.target.value as JobStatus;
              startTransition(async () => {
                await updateJobStatus(job.id, newStatus);
              });
            }}
          >
            <option value="SAVED">Saved</option>
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEWING">Interviewing</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <form
          action={async () => {
            await deleteJob(job.id);
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 h-8 w-8"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

function Badge({ status }: { status: JobStatus }) {
  const colors: Record<string, string> = {
    SAVED: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    APPLIED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    INTERVIEWING:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    OFFER:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        colors[status] || colors.SAVED
      }`}
    >
      {status}
    </span>
  );
}
