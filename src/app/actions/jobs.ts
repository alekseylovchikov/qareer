"use server";

import { prisma } from "@/lib/prisma";
import { JobStatus } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function getJobs() {
  const user = await prisma.user.findFirst();
  if (!user) return []; // Should handle creating user if not exists or auth redirect

  return await prisma.jobVacancy.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { interviews: true },
  });
}

export async function addJob(formData: FormData) {
  const user = await prisma.user.findFirst();
  if (!user) throw new Error("User not found");

  const title = formData.get("title") as string;
  const company = formData.get("company") as string;
  const url = formData.get("url") as string;
  const status = formData.get("status") as JobStatus;
  const salary = formData.get("salary") as string;

  await prisma.jobVacancy.create({
    data: {
      title,
      company,
      url,
      status: status || "SAVED",
      salary,
      userId: user.id,
    },
  });

  revalidatePath("/jobs");
}

export async function updateJobStatus(jobId: string, status: JobStatus) {
  await prisma.jobVacancy.update({
    where: { id: jobId },
    data: { status },
  });
  revalidatePath("/jobs");
}

export async function deleteJob(jobId: string) {
  await prisma.jobVacancy.delete({
    where: { id: jobId },
  });
  revalidatePath("/jobs");
}

export async function getJob(jobId: string) {
  const user = await prisma.user.findFirst();
  if (!user) return null;

  return await prisma.jobVacancy.findUnique({
    where: { id: jobId },
    include: { interviews: true },
  });
}

export async function addInterview(formData: FormData) {
  const jobId = formData.get("jobId") as string;
  const date = formData.get("date") as string;
  const type = formData.get("type") as string;
  const notes = formData.get("notes") as string;

  await prisma.interview.create({
    data: {
      jobId,
      date: new Date(date),
      type,
      notes,
    },
  });

  revalidatePath(`/jobs/${jobId}`);
}

export async function deleteInterview(interviewId: string, jobId: string) {
  await prisma.interview.delete({
    where: { id: interviewId },
  });
  revalidatePath(`/jobs/${jobId}`);
}
