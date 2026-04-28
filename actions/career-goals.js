"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

function getCurrentWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
}

export async function getGoals() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");
  return db.careerGoal.findMany({
    where: { userId: user.id, archived: false },
    orderBy: { createdAt: "desc" },
  });
}

export async function getStreak() {
  const { userId } = await auth();
  if (!userId) return 0;
  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) return 0;

  const currentWeek = getCurrentWeekNumber();
  let streak = 0;

  for (let w = currentWeek - 1; w >= 1; w--) {
    const weekGoals = await db.careerGoal.findMany({
      where: { userId: user.id, weekNumber: w, archived: true },
    });
    if (weekGoals.length === 0) break;
    const allDone = weekGoals.every((g) => g.completed);
    if (allDone) streak++;
    else break;
  }
  return streak;
}

export async function createGoal(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");
  await db.careerGoal.create({
    data: { ...data, userId: user.id, weekNumber: getCurrentWeekNumber() },
  });
  revalidatePath("/career-goals");
}

export async function toggleGoal(id, completed) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  await db.careerGoal.update({ where: { id }, data: { completed } });
  revalidatePath("/career-goals");
}

export async function updateGoalNotes(id, notes) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  await db.careerGoal.update({ where: { id }, data: { notes } });
  revalidatePath("/career-goals");
}

export async function deleteGoal(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  await db.careerGoal.delete({ where: { id } });
  revalidatePath("/career-goals");
}

export async function resetWeek() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");
  await db.careerGoal.updateMany({
    where: { userId: user.id, archived: false },
    data: { archived: true },
  });
  revalidatePath("/career-goals");
}