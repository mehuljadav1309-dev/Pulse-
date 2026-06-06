"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { parseFile } from "@/lib/parse";
import { hashQuestion } from "@/lib/parse/dedup";
import { ALL_SUBJECT_SLUGS } from "@/lib/parse/subject-infer";

export type UploadFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  warnings?: string[];
  inserted?: number;
  parsed?: number;
  duplicates?: number;
  topicSummary?: { subject: string; topic: string; count: number; createdTopic: boolean; createdSubject: boolean }[];
  subjectsDetected?: string[];
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "topic";
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

  const filename = filenameOverride || file.name || "upload";

  // Fetch existing MCQ hashes (subject-scoped dedup is best, but global is OK
  // for now — the same question rarely appears in two subjects).
  const existingHashes = await loadAllHashes();

  const parsed = await parseFile(file, existingHashes);
  const uniqueMcqs = parsed.uniqueMcqs;
  const warnings: string[] = [...parsed.warnings];

  if (parsed.mcqs.length === 0) {
    await prisma.uploadLog.create({
      data: {
        userId: ctx.dbUserId,
        filename,
        fileType: parsed.source,
        subjectSlug: null,
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
      warnings,
    };
  }

  // Resolve the form-default subject (used when an MCQ has no per-row subject)
  let defaultSubject: { id: string; slug: string; name: string } | null = null;
  if (subjectId) {
    const s = await prisma.subject.findUnique({ where: { id: subjectId } });
    if (!s) return { status: "error", message: "Subject not found." };
    defaultSubject = { id: s.id, slug: s.slug, name: s.name };
  }

  // Resolve the form-default topic (used when an MCQ has no per-row topic)
  let defaultTopic: { id: string; slug: string; name: string; subjectId: string } | null = null;
  if (newTopicName) {
    if (!defaultSubject) {
      return {
        status: "error",
        message:
          "You typed a new topic but didn't pick a subject. Pick a subject or leave both empty for auto-detect.",
      };
    }
    const slug = slugify(newTopicName);
    const existing = await prisma.topic.findUnique({
      where: { subjectId_slug: { subjectId: defaultSubject.id, slug } },
    });
    const t = existing
      ? await prisma.topic.update({ where: { id: existing.id }, data: { name: newTopicName } })
      : await prisma.topic.create({
          data: { subjectId: defaultSubject.id, slug, name: newTopicName },
        });
    defaultTopic = t;
  } else if (topicId) {
    const t = await prisma.topic.findUnique({ where: { id: topicId } });
    if (!t) return { status: "error", message: "Topic not found." };
    if (defaultSubject && t.subjectId !== defaultSubject.id) {
      return {
        status: "error",
        message: "The chosen topic does not belong to the chosen subject.",
      };
    }
    defaultTopic = t;
  }

  // Group MCQs by (subjectSlug, topicSlug). Create subjects/topics on the fly.
  type Group = {
    subjectId: string;
    subjectSlug: string;
    subjectName: string;
    topicId: string;
    topicSlug: string;
    topicName: string;
    createdSubject: boolean;
    createdTopic: boolean;
    rows: Array<{
      topicId: string;
      question: string;
      options: string;
      correctIndex: number;
      explanation: string | null;
      difficulty: string;
      source: string;
      status: string;
    }>;
  };
  const groups = new Map<string, Group>();
  const subjectsDetectedSet = new Set<string>();

  const ensureGroup = async (
    subjectSlugOrName: string | undefined,
    topicName: string | undefined
  ): Promise<Group | null> => {
    // 1. Resolve subject: form default > inferred > error
    let subject = defaultSubject;
    let subjectCreated = false;
    if (!subject && subjectSlugOrName) {
      const slug = slugify(subjectSlugOrName);
      if (ALL_SUBJECT_SLUGS.has(slug) || subjectSlugOrName === slug) {
        const found = await prisma.subject.findUnique({ where: { slug } });
        if (found) {
          subject = { id: found.id, slug: found.slug, name: found.name };
        }
      } else {
        // Unknown subject — create it
        const name = subjectSlugOrName.trim();
        const slug = slugify(name);
        if (!slug) return null;
        const existing = await prisma.subject.findUnique({ where: { slug } });
        if (existing) {
          subject = { id: existing.id, slug: existing.slug, name: existing.name };
        } else {
          const created = await prisma.subject.create({
            data: {
              slug,
              name,
              color: "#94A3B8",
              icon: "BookOpen",
              order: 100,
            },
          });
          subject = { id: created.id, slug: created.slug, name: created.name };
          subjectCreated = true;
        }
      }
    }
    if (!subject) return null;
    subjectsDetectedSet.add(subject.slug);

    // 2. Resolve topic: per-row > form default > fallback
    let topic = defaultTopic && defaultTopic.subjectId === subject.id ? defaultTopic : null;
    let topicCreated = false;
    if (!topic) {
      const name = (topicName ?? "General").trim() || "General";
      const slug = slugify(name);
      const existing = await prisma.topic.findUnique({
        where: { subjectId_slug: { subjectId: subject.id, slug } },
      });
      if (existing) {
        topic = {
          id: existing.id,
          slug: existing.slug,
          name: existing.name,
          subjectId: existing.subjectId,
        };
      } else {
        const created = await prisma.topic.create({
          data: { subjectId: subject.id, slug, name },
        });
        topic = {
          id: created.id,
          slug: created.slug,
          name: created.name,
          subjectId: created.subjectId,
        };
        topicCreated = true;
      }
    }

    const key = `${subject.id}::${topic.id}`;
    let g = groups.get(key);
    if (!g) {
      g = {
        subjectId: subject.id,
        subjectSlug: subject.slug,
        subjectName: subject.name,
        topicId: topic.id,
        topicSlug: topic.slug,
        topicName: topic.name,
        createdSubject: subjectCreated,
        createdTopic: topicCreated,
        rows: [],
      };
      groups.set(key, g);
    }
    return g;
  };

  let skippedNoTopic = 0;
  for (const m of uniqueMcqs) {
    const g = await ensureGroup(m.subject, m.topic);
    if (!g) {
      skippedNoTopic++;
      continue;
    }
    g.rows.push({
      topicId: g.topicId,
      question: m.question,
      options: JSON.stringify(m.options),
      correctIndex: m.correctIndex,
      explanation: m.explanation ?? null,
      difficulty: m.difficulty ?? "medium",
      source: filename,
      status: "published",
    });
  }

  if (skippedNoTopic > 0) {
    warnings.push(
      `${skippedNoTopic} MCQ${skippedNoTopic === 1 ? "" : "s"} skipped (couldn't assign a subject — set one in the form or add a subject/topic column to the file).`
    );
  }

  // Persist
  let totalInserted = 0;
  for (const g of groups.values()) {
    if (g.rows.length === 0) continue;
    const res = await prisma.mCQ.createMany({ data: g.rows });
    totalInserted += res.count;
  }

  await prisma.uploadLog.create({
    data: {
      userId: ctx.dbUserId,
      filename,
      fileType: parsed.source,
      subjectSlug: defaultSubject?.slug ?? null,
      topicSlug: defaultTopic?.slug ?? null,
      mcqsParsed: parsed.mcqs.length,
      mcqsSaved: totalInserted,
      status: totalInserted > 0 ? "success" : "failed",
      errorMessage:
        totalInserted === 0 ? "No MCQs were inserted." : null,
    },
  });

  const topicSummary = Array.from(groups.values())
    .map((g) => ({
      subject: g.subjectName,
      topic: g.topicName,
      count: g.rows.length,
      createdTopic: g.createdTopic,
      createdSubject: g.createdSubject,
    }))
    .sort((a, b) =>
      a.subject.localeCompare(b.subject) || a.topic.localeCompare(b.topic)
    );

  for (const s of subjectsDetectedSet) revalidatePath(`/dashboard/question-bank/${s}`);
  revalidatePath("/admin");
  revalidatePath("/admin/mcqs");
  revalidatePath("/dashboard/question-bank");

  const subjectNote =
    subjectsDetectedSet.size > 0
      ? ` across ${subjectsDetectedSet.size} subject${subjectsDetectedSet.size === 1 ? "" : "s"}`
      : "";

  return {
    status: "success",
    parsed: parsed.mcqs.length,
    duplicates: parsed.dedupe.duplicates,
    inserted: totalInserted,
    warnings,
    topicSummary,
    subjectsDetected: Array.from(subjectsDetectedSet),
    message: `Inserted ${totalInserted} MCQ${totalInserted === 1 ? "" : "s"}${subjectNote} (${parsed.dedupe.duplicates} duplicate${parsed.dedupe.duplicates === 1 ? "" : "s"} skipped).`,
  };
}

async function loadAllHashes(): Promise<Set<string>> {
  // Hash the existing rows by reading question/options/correctIndex. For a
  // small DB this is fine; for very large banks you'd add a `hash` column.
  const rows = await prisma.mCQ.findMany({
    select: { question: true, options: true, correctIndex: true },
  });
  const out = new Set<string>();
  for (const r of rows) {
    let options: string[] = [];
    try {
      const v = JSON.parse(r.options);
      if (Array.isArray(v)) options = v.map((x: unknown) => String(x));
    } catch {
      continue;
    }
    out.add(
      hashQuestion({ question: r.question, options, correctIndex: r.correctIndex })
    );
  }
  return out;
}
