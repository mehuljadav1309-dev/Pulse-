"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export async function deleteMCQ(id: string) {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
  await prisma.mCQ.delete({ where: { id } });
  revalidatePath("/admin/mcqs");
  revalidatePath("/dashboard/question-bank");
  return { ok: true };
}

export async function deleteMCQsForTopic(topicId: string) {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
  const result = await prisma.mCQ.deleteMany({ where: { topicId } });
  revalidatePath("/admin/mcqs");
  revalidatePath("/dashboard/question-bank");
  return { ok: true, deleted: result.count };
}
