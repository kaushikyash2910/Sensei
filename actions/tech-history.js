"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function saveToHistory({ feature, inputSummary, result }) {
  const { userId } = await auth();
  if (!userId) return;
  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) return;

  await db.techHistory.create({
    data: { userId: user.id, feature, inputSummary, result },
  });
}

export async function getHistory(feature = null) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  return db.techHistory.findMany({
    where: { userId: user.id, ...(feature ? { feature } : {}) },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function deleteHistoryItem(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  await db.techHistory.delete({ where: { id } });
  revalidatePath("/tech-history");
}

export async function clearFeatureHistory(feature) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");
  await db.techHistory.deleteMany({
    where: { userId: user.id, feature },
  });
  revalidatePath("/tech-history");
}

export async function clearAllHistory() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");
  await db.techHistory.deleteMany({ where: { userId: user.id } });
  revalidatePath("/tech-history");
}