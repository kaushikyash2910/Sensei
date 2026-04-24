"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// Fetch stats for the current user
export async function getUserStats() {
  const { userId } = await auth();
  if (!userId) return null;

  const stats = await db.userActivity.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });

  return stats;
}

// Call this whenever a resume is saved
export async function incrementResumes() {
  const { userId } = await auth();
  if (!userId) return;

  await db.userActivity.upsert({
    where: { userId },
    create: { userId, resumesCreated: 1 },
    update: { resumesCreated: { increment: 1 } },
  });
}

// Call this whenever a cover letter is saved
export async function incrementCoverLetters() {
  const { userId } = await auth();
  if (!userId) return;

  await db.userActivity.upsert({
    where: { userId },
    create: { userId, coverLetters: 1 },
    update: { coverLetters: { increment: 1 } },
  });
}

// Call this whenever an interview quiz is completed
export async function incrementInterviews(userId) {
  if (!userId) return;

  await db.userActivity.upsert({
    where: { userId },
    create: { userId, interviewsDone: 1 },
    update: { interviewsDone: { increment: 1 } },
  });
}