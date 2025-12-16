"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSkills() {
  const user = await prisma.user.findFirst();
  if (!user) return [];

  return await prisma.skill.findMany({
    where: { userId: user.id },
    include: { learningGoals: true },
    orderBy: { priority: "desc" },
  });
}

export async function addSkill(formData: FormData) {
  const user = await prisma.user.findFirst();
  if (!user) throw new Error("User not found");

  const name = formData.get("name") as string;
  const currentLevel = formData.get("currentLevel") as string;
  const targetLevel = formData.get("targetLevel") as string;
  const priority = Number(formData.get("priority") || 1);

  await prisma.skill.create({
    data: {
      name,
      currentLevel,
      targetLevel,
      priority,
      userId: user.id,
    },
  });

  revalidatePath("/learning");
}

export async function addLearningGoal(formData: FormData) {
  const title = formData.get("title") as string;
  const skillId = formData.get("skillId") as string;
  const deadlineStr = formData.get("deadline") as string;
  const deadline = deadlineStr ? new Date(deadlineStr) : null;

  await prisma.learningGoal.create({
    data: {
      title,
      skillId,
      deadline,
    },
  });

  revalidatePath("/learning");
}

export async function toggleGoalCompletion(
  goalId: string,
  currentStatus: boolean
) {
  await prisma.learningGoal.update({
    where: { id: goalId },
    data: { isCompleted: !currentStatus },
  });
  revalidatePath("/learning");
}

export async function deleteSkill(skillId: string) {
  await prisma.skill.delete({ where: { id: skillId } });
  revalidatePath("/learning");
}
