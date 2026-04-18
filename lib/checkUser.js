import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export const checkUser = async () => {
  const { userId } = await auth();

  if (!userId) return null;

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  return user;
};