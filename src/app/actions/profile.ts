"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function getUserProfile() {
  const session = await auth();
  if (!session?.user?.email) return null;

  return await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { skills: true, jobs: true },
  });
}

export async function updateUserProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
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
