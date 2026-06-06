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
  topicSummary?: { name: string; count: number; created: boolean }[];
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

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
  const newTopicName = String(formData.get("newTopicName") ?? "").trim();
  const filenameOverride = String(formData.get("filename") ?? "").trim();

  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Please choose a file." };
  }
  if (!subjectId) return { status: "error", message: "Please pick a subject." };
  if (!topicId && !newTopicName) {
    return { status: "error", message: "Pick an existing topic or type a new one." };
  }

  const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
  if (!subject) return { status: "error", message: "Subject not found." };

  const filename = filenameOverride || file.name || "upload";
  const parsed = await parseFile(file);

  if (parsed.mcqs.length === 0) {
    await prisma.uploadLog.create({
      data: {
        userId: ctx.dbUserId,
        filename,
        fileType: parsed.source,
        subjectSlug: subject.slug,
        topicSlug: null,
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

  // Resolve the "default topic" used when an MCQ has no per-row topic metadata.
  let defaultTopicId: string | null = null;
  let defaultTopicSlug: string | null = null;
  if (newTopicName) {
    const slug = slugify(newTopicName);
    if (!slug) return { status: "error", message: "Invalid topic name." };
    const existing = await prisma.topic.findUnique({
      where: { subjectId_slug: { subjectId: subject.id, slug } },
    });
    const t = existing
      ? await prisma.topic.update({
          where: { id: existing.id },
          data: { name: newTopicName },
        })
      : await prisma.topic.create({
          data: { subjectId: subject.id, slug, name: newTopicName },
        });
    defaultTopicId = t.id;
    defaultTopicSlug = t.slug;
  } else if (topicId) {
    const t = await prisma.topic.findUnique({ where: { id: topicId } });
    if (!t || t.subjectId !== subjectId) {
      return { status: "error", message: "Topic does not belong to the chosen subject." };
    }
    defaultTopicId = t.id;
    defaultTopicSlug = t.slug;
  }

  // Group MCQs by topic name; create topics on the fly for per-row topics
  // coming from the file. Map: topicName -> { id, created }.
  type TopicEntry = { id: string; name: string; created: boolean };
  const topicMap = new Map<string, TopicEntry>();

  if (defaultTopicId && defaultTopicSlug) {
    const t = await prisma.topic.findUnique({ where: { id: defaultTopicId } });
    if (t) {
      topicMap.set("__default__", { id: t.id, name: t.name, created: false });
    }
  }

  const ensureTopic = async (rawName: string): Promise<TopicEntry> => {
    const key = rawName.trim().toLowerCase();
    if (!key) throw new Error("Empty topic name");
    const existing = topicMap.get(key);
    if (existing) return existing;
    const slug = slugify(rawName);
    const found = await prisma.topic.findUnique({
      where: { subjectId_slug: { subjectId: subject.id, slug } },
    });
    if (found) {
      const entry: TopicEntry = { id: found.id, name: found.name, created: false };
      topicMap.set(key, entry);
      return entry;
    }
    const created = await prisma.topic.create({
      data: { subjectId: subject.id, slug, name: rawName.trim() },
    });
    const entry: TopicEntry = { id: created.id, name: created.name, created: true };
    topicMap.set(key, entry);
    return entry;
  };

  const rows: Array<{
    topicId: string;
    question: string;
    options: string;
    correctIndex: number;
    explanation: string | null;
    difficulty: string;
    source: string;
    status: string;
  }> = [];
  const warnings: string[] = [...parsed.warnings];

  for (const m of parsed.mcqs) {
    let entry: TopicEntry | undefined;
    if (m.topic && m.topic.trim()) {
      try {
        entry = await ensureTopic(m.topic);
      } catch {
        entry = topicMap.get("__default__");
      }
    } else {
      entry = topicMap.get("__default__");
    }
    if (!entry) {
      warnings.push(`Skipped: "${m.question.slice(0, 40)}…" — no topic could be assigned.`);
      continue;
    }
    rows.push({
      topicId: entry.id,
      question: m.question,
      options: JSON.stringify(m.options),
      correctIndex: m.correctIndex,
      explanation: m.explanation ?? null,
      difficulty: m.difficulty ?? "medium",
      source: filename,
      status: "published",
    });
  }

  if (rows.length === 0) {
    await prisma.uploadLog.create({
      data: {
        userId: ctx.dbUserId,
        filename,
        fileType: parsed.source,
        subjectSlug: subject.slug,
        topicSlug: defaultTopicSlug,
        mcqsParsed: parsed.mcqs.length,
        mcqsSaved: 0,
        status: "failed",
        errorMessage: "No MCQs could be assigned to a topic.",
      },
    });
    return {
      status: "error",
      message: "No MCQs could be assigned to a topic.",
      warnings,
    };
  }

  const result = await prisma.mCQ.createMany({ data: rows });

  await prisma.uploadLog.create({
    data: {
      userId: ctx.dbUserId,
      filename,
      fileType: parsed.source,
      subjectSlug: subject.slug,
      topicSlug: defaultTopicSlug,
      mcqsParsed: parsed.mcqs.length,
      mcqsSaved: result.count,
      status: "success",
    },
  });

  // Build a topic summary for the admin to see what was created
  const counts = new Map<string, { name: string; count: number; created: boolean }>();
  for (const r of rows) {
    const e = Array.from(topicMap.values()).find((x) => x.id === r.topicId);
    if (!e) continue;
    const cur = counts.get(e.id) ?? { name: e.name, count: 0, created: e.created };
    cur.count += 1;
    counts.set(e.id, cur);
  }
  const topicSummary = Array.from(counts.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  revalidatePath("/admin");
  revalidatePath("/admin/mcqs");
  revalidatePath("/dashboard/question-bank");
  revalidatePath(`/dashboard/question-bank/${subject.slug}`);

  return {
    status: "success",
    parsed: parsed.mcqs.length,
    inserted: result.count,
    warnings,
    topicSummary,
    message: `Inserted ${result.count} MCQ${result.count === 1 ? "" : "s"} across ${topicSummary.length} topic${topicSummary.length === 1 ? "" : "s"}.`,
  };
}
