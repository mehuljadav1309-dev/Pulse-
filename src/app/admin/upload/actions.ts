"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { parseFile } from "@/lib/parse";

export type UploadFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  warnings?: string[];
  inserted?: number;
  parsed?: number;
};

export async function uploadMCQFile(
  _prev: UploadFormState,
  formData: FormData
): Promise<UploadFormState> {
  let ctx;
  try {
    ctx = await requireAdmin();
  } catch {
    return { status: "error", message: "Not authorized." };
  }

  const file = formData.get("file");
  const subjectId = String(formData.get("subjectId") ?? "");
  const topicId = String(formData.get("topicId") ?? "");
  const filenameOverride = String(formData.get("filename") ?? "").trim();

  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Please choose a file." };
  }
  if (!subjectId) return { status: "error", message: "Please pick a subject." };
  if (!topicId) return { status: "error", message: "Please pick a topic." };

  const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
  const topic = await prisma.topic.findUnique({ where: { id: topicId } });
  if (!subject || !topic || topic.subjectId !== subjectId) {
    return { status: "error", message: "Subject/topic mismatch." };
  }

  const filename = filenameOverride || file.name || "upload";

  const parsed = await parseFile(file);
  if (parsed.mcqs.length === 0) {
    await prisma.uploadLog.create({
      data: {
        userId: ctx.dbUserId,
        filename,
        fileType: parsed.source,
        subjectSlug: subject.slug,
        topicSlug: topic.slug,
        mcqsParsed: 0,
        mcqsSaved: 0,
        status: "failed",
        errorMessage: "No MCQs could be extracted.",
      },
    });
    return {
      status: "error",
      message: "No MCQs could be extracted from the file.",
      warnings: parsed.warnings,
    };
  }

  const rows = parsed.mcqs.map((m) => ({
    topicId,
    question: m.question,
    options: JSON.stringify(m.options),
    correctIndex: m.correctIndex,
    explanation: m.explanation ?? null,
    difficulty: m.difficulty ?? "medium",
    source: filename,
    status: "published",
  }));

  const result = await prisma.mCQ.createMany({ data: rows });

  await prisma.uploadLog.create({
    data: {
      userId: ctx.dbUserId,
      filename,
      fileType: parsed.source,
      subjectSlug: subject.slug,
      topicSlug: topic.slug,
      mcqsParsed: parsed.mcqs.length,
      mcqsSaved: result.count,
      status: "success",
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/mcqs");
  revalidatePath("/dashboard/question-bank");
  revalidatePath(`/dashboard/question-bank/${subject.slug}`);
  revalidatePath(`/dashboard/question-bank/${subject.slug}/${topic.slug}`);

  return {
    status: "success",
    parsed: parsed.mcqs.length,
    inserted: result.count,
    warnings: parsed.warnings,
    message: `Inserted ${result.count} MCQs.`,
  };
}
