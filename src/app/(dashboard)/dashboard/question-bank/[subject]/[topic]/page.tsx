import { prisma } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed-once";
import { notFound } from "next/navigation";
import Link from "next/link";
import { IconArrowLeft, IconBolt } from "@tabler/icons-react";
import { MCQSession } from "./MCQSession";

export const dynamic = "force-dynamic";

export default async function TopicMCQPage({
  params,
}: {
  params: Promise<{ subject: string; topic: string }>;
}) {
  await ensureSeeded();
  const { subject: subjectSlug, topic: topicSlug } = await params;
  const subject = await prisma.subject.findUnique({ where: { slug: subjectSlug } });
  if (!subject) notFound();
  const topic = await prisma.topic.findUnique({
    where: { subjectId_slug: { subjectId: subject.id, slug: topicSlug } },
  });
  if (!topic) notFound();

  const mcqs = await prisma.mCQ.findMany({
    where: { topicId: topic.id },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      question: true,
      options: true,
      correctIndex: true,
      explanation: true,
      difficulty: true,
    },
  });

  const parsed = mcqs.map((m) => ({
    ...m,
    options: safeParseOptions(m.options),
  }));

  return (
    <div className="qb-page">
      <header className="mcq-topic-head">
        <Link
          href={`/dashboard/question-bank/${subject.slug}`}
          className="qb-subj-head__back"
        >
          <IconArrowLeft size={14} /> Back to {subject.name}
        </Link>
        <div>
          <div className="qb-page__eyebrow">{subject.name}</div>
          <h1 className="qb-page__title">{topic.name}</h1>
          <p className="qb-page__sub">
            <IconBolt size={11} style={{ verticalAlign: -1 }} /> {mcqs.length} MCQs ·
            paginated 50 per page
          </p>
        </div>
      </header>

      <MCQSession
        mcqs={parsed}
        subjectName={subject.name}
        topicName={topic.name}
      />
    </div>
  );
}

function safeParseOptions(raw: string): string[] {
  try {
    const v = JSON.parse(raw);
    if (Array.isArray(v) && v.every((x) => typeof x === "string")) return v;
  } catch {}
  return [];
}
