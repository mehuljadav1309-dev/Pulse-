"use server";

import { prisma } from "@/lib/db";
import { getOrCreateDbUser } from "@/lib/user";
import { revalidatePath } from "next/cache";

export async function recordAttempt(
  mcqId: string,
  selectedIndex: number
): Promise<{ ok: true; isCorrect: boolean } | { ok: false; error: string }> {
  const user = await getOrCreateDbUser();
  if (!user) return { ok: false, error: "Not signed in" };
  const mcq = await prisma.mCQ.findUnique({ where: { id: mcqId } });
  if (!mcq) return { ok: false, error: "MCQ not found" };
  const isCorrect = mcq.correctIndex === selectedIndex;

  await prisma.userProgress.upsert({
    where: { userId_mcqId: { userId: user.id, mcqId } },
    create: {
      userId: user.id,
      mcqId,
      isCorrect,
      selectedIdx: selectedIndex,
      attempts: 1,
      lastAttempt: new Date(),
    },
    update: {
      isCorrect,
      selectedIdx: selectedIndex,
      attempts: { increment: 1 },
      lastAttempt: new Date(),
    },
  });

  revalidatePath("/dashboard/question-bank");
  return { ok: true, isCorrect };
}
