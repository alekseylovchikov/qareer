"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUserProfile() {
  // For this MV, we might just fetch the first user or create one if none exists
  // In a real app, we'd use auth(), but here we'll simulate a logged-in user.
  let user = await prisma.user.findFirst({
    include: { skills: true, jobs: true },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "demo@example.com",
        name: "Demo User",
        title: "Software Engineer",
        summary: "Passionate developer looking for new opportunities.",
      },
      include: { skills: true, jobs: true },
    });
  }

  return user;
}

export async function updateUserProfile(formData: FormData) {
  // Identify user (for now, just the first one)
  const user = await prisma.user.findFirst();
  if (!user) throw new Error("User not found");

  const name = formData.get("name") as string;
  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const email = formData.get("email") as string;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name,
      title,
      summary,
      email,
    },
  });

  revalidatePath("/profile");
}
