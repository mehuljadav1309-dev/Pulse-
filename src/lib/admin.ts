import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./db";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "prayag7827@gmail.com")
  .trim()
  .toLowerCase();

export type AdminContext = {
  clerkId: string;
  email: string;
  name: string | null;
  isAdmin: true;
  dbUserId: string;
};

export async function getAdminContext(): Promise<AdminContext | null> {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await currentUser();
  const email = (user?.emailAddresses?.[0]?.emailAddress ?? "").toLowerCase();
  if (!email || email !== ADMIN_EMAIL) return null;

  // Ensure a User row exists with isAdmin=true
  const dbUser = await prisma.user.upsert({
    where: { clerkId: userId },
    update: { email, name: user?.firstName ?? null, isAdmin: true },
    create: {
      clerkId: userId,
      email,
      name: user?.firstName ?? null,
      isAdmin: true,
    },
  });

  return {
    clerkId: userId,
    email,
    name: user?.firstName ?? null,
    isAdmin: true,
    dbUserId: dbUser.id,
  };
}

export async function requireAdmin(): Promise<AdminContext> {
  const ctx = await getAdminContext();
  if (!ctx) throw new Error("UNAUTHORIZED");
  return ctx;
}

export function isAdminEmail(email: string | null | undefined): boolean {
  return (email ?? "").trim().toLowerCase() === ADMIN_EMAIL;
}
