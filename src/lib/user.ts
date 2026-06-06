import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./db";

/**
 * Returns the DB user row for the current Clerk session, creating it on
 * first visit. Returns null if there is no signed-in user.
 */
export async function getOrCreateDbUser() {
  const { userId } = await auth();
  if (!userId) return null;
  const cu = await currentUser();
  const email = (cu?.emailAddresses?.[0]?.emailAddress ?? "").toLowerCase();
  return prisma.user.upsert({
    where: { clerkId: userId },
    update: { email, name: cu?.firstName ?? null },
    create: {
      clerkId: userId,
      email,
      name: cu?.firstName ?? null,
      isAdmin: email === (process.env.ADMIN_EMAIL ?? "prayag7827@gmail.com").toLowerCase(),
    },
  });
}
