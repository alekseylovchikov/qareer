"use client";

import { db } from "@/lib/instant";
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
import Link from "next/link";

interface Job {
  id: string;
  title: string;
  company: string;
  status: string;
  salary?: string | null;
  userId: string;
  url?: string | null;
}

export function JobCard({ job }: { job: Job }) {
  const { user } = db.useAuth();

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    db.transact(db.tx.jobs[job.id].update({ status: newStatus }));
  }

  function handleDelete() {
    if (confirm("Delete this job?")) {
      db.transact(db.tx.jobs[job.id].delete());
    }
  }

  return (
    <Card className="relative group">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            {user?.id === job.userId ? (
              <Link href={`/jobs/${job.id}`} className="hover:underline">
                <CardTitle className="text-base">{job.title}</CardTitle>
              </Link>
            ) : (
              <CardTitle className="text-base">{job.title}</CardTitle>
            )}
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
      {user?.id === job.userId && (
        <CardFooter className="flex justify-between pt-2">
          <div className="flex items-center gap-2">
            <select
              name="status"
              defaultValue={job.status}
              className="h-8 rounded bg-transparent text-xs font-medium border-0 focus:ring-0 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 p-1"
              onChange={handleStatusChange}
            >
              <option value="SAVED">Saved</option>
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEWING">Interviewing</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <Button
            onClick={handleDelete}
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 h-8 w-8"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </CardFooter>
      )}
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
