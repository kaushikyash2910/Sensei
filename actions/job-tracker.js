"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getJobs() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  return db.jobApplication.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function createJob(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  await db.jobApplication.create({
    data: { ...data, userId: user.id },
  });

  revalidatePath("/job-tracker");
}

export async function updateJobStatus(id, status) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.jobApplication.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/job-tracker");
}

export async function deleteJob(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.jobApplication.delete({ where: { id } });
  revalidatePath("/job-tracker");
}