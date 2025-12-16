import { getJob, addInterview, deleteInterview } from "@/app/actions/jobs";
import { Button } from "@/app/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import { Input } from "@/app/components/ui/Input";
import { ArrowLeft, Trash2, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/jobs"
          className="inline-flex items-center text-sm text-zinc-500 hover:text-indigo-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Jobs
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {job.title}
        </h1>
        <p className="text-xl text-zinc-500 dark:text-zinc-400 mt-1">
          {job.company}
        </p>
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-600 hover:underline mt-2 inline-block"
          >
            Original Posting &rarr;
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Job Details & Status */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {job.interviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex justify-between items-start p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                          {interview.type || "Interview"}
                        </span>
                        <span className="text-xs text-zinc-500 bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                          {new Date(interview.date).toLocaleDateString()}
                        </span>
                      </div>
                      {interview.notes && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                          {interview.notes}
                        </p>
                      )}
                    </div>
                    <form
                      action={async () => {
                        "use server";
                        await deleteInterview(interview.id, job.id);
                      }}
                    >
                      <button className="text-zinc-400 hover:text-red-500 transition-colors p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                ))}
                {job.interviews.length === 0 && (
                  <p className="text-sm text-zinc-500 italic">
                    No interviews scheduled yet.
                  </p>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-4">
                  Add Upcoming Interview
                </h4>
                <form action={addInterview} className="space-y-4">
                  <input type="hidden" name="jobId" value={job.id} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-zinc-500">
                        Date
                      </label>
                      <Input name="date" type="datetime-local" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-zinc-500">
                        Type
                      </label>
                      <div className="relative">
                        <select
                          name="type"
                          className="flex h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 appearance-none"
                        >
                          <option value="Screening">Screening</option>
                          <option value="Technical">Technical</option>
                          <option value="Behavioral">Behavioral</option>
                          <option value="Final">Final</option>
                          <option value="Other">Other</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
                          <svg
                            className="h-4 w-4 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-500">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      className="flex min-h-[80px] w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                      placeholder="Preparation notes, interviewer names, etc."
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Add Interview
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Other Details potentially */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Placeholder for Job Description or other notes */}
              <div className="text-sm text-zinc-500">
                {job.description || "No description added."}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
