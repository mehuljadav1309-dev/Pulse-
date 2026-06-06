import { prisma } from "@/lib/db";
import { getOrCreateDbUser } from "@/lib/user";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  IconArrowLeft,
  IconChevronRight,
  IconCheck,
  IconStack2,
} from "@tabler/icons-react";

export const dynamic = "force-dynamic";

export default async function SubjectTopicsPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject: slug } = await params;
  const subject = await prisma.subject.findUnique({
    where: { slug },
    include: {
      topics: {
        orderBy: { name: "asc" },
        include: { _count: { select: { mcqs: true } } },
      },
    },
  });
  if (!subject) notFound();

  const { userId } = await auth();
  const user = userId ? await getOrCreateDbUser() : null;

  const topicIds = subject.topics.map((t) => t.id);
  const progress = user
    ? await prisma.userProgress.findMany({
        where: { userId: user.id, mcq: { topicId: { in: topicIds } } },
        include: { mcq: { select: { topicId: true } } },
      })
    : [];

  const progressByTopic = new Map<string, { seen: number; correct: number; attempts: number }>();
  for (const p of progress) {
    const tid = p.mcq.topicId;
    const cur = progressByTopic.get(tid) ?? { seen: 0, correct: 0, attempts: 0 };
    cur.seen += 1;
    cur.attempts += p.attempts;
    if (p.isCorrect) cur.correct += 1;
    progressByTopic.set(tid, cur);
  }

  return (
    <div className="qb-page">
      <header className="qb-subj-head">
        <Link href="/dashboard/question-bank" className="qb-subj-head__back">
          <IconArrowLeft size={14} /> All subjects
        </Link>
        <div>
          <div className="qb-page__eyebrow">Subject</div>
          <h1 className="qb-page__title">{subject.name}</h1>
          <p className="qb-page__sub">
            {subject.topics.length} topics ·{" "}
            {subject.topics.reduce((a, t) => a + t._count.mcqs, 0)} MCQs
          </p>
        </div>
      </header>

      <div className="qb-topic-list">
        {subject.topics.map((t) => {
          const total = t._count.mcqs;
          const prog = progressByTopic.get(t.id) ?? { seen: 0, correct: 0, attempts: 0 };
          const accuracy =
            prog.attempts > 0 ? Math.round((prog.correct / prog.attempts) * 100) : 0;
          const done = prog.seen >= total && total > 0;
          return (
            <Link
              key={t.id}
              href={`/dashboard/question-bank/${subject.slug}/${t.slug}`}
              className="qb-topic"
            >
              <div className="qb-topic__icon">
                <IconStack2 size={16} />
              </div>
              <div className="qb-topic__main">
                <div className="qb-topic__name">{t.name}</div>
                <div className="qb-topic__meta">
                  {total > 0 ? `${total} MCQs` : "No MCQs yet"}
                  {prog.attempts > 0 && (
                    <>
                      {" · "}
                      <span className="qb-topic__ok">
                        <IconCheck size={11} /> {prog.correct}/{prog.attempts}
                      </span>
                      {" · "}
                      <span>{accuracy}% acc</span>
                    </>
                  )}
                </div>
                <div className="qb-topic__bar">
                  <div
                    className="qb-topic__bar-fill"
                    style={{
                      width: `${Math.min(100, (prog.seen / Math.max(1, total)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
              {done ? (
                <span className="qb-topic__badge qb-topic__badge--done">Done</span>
              ) : (
                <span className="qb-topic__chev">
                  <IconChevronRight size={14} />
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
