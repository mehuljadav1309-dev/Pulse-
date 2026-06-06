import { prisma } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed-once";
import { getOrCreateDbUser } from "@/lib/user";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import {
  IconChevronRight,
  IconStethoscope,
  IconCheck,
} from "@tabler/icons-react";

export const dynamic = "force-dynamic";

const SUBJECT_COLORS = [
  "#4F8CFF",
  "#00E5A8",
  "#F59E0B",
  "#EF4444",
  "#A78BFA",
  "#22C55E",
  "#FB7185",
  "#34D399",
  "#F472B6",
  "#60A5FA",
  "#FBBF24",
  "#10B981",
  "#C084FC",
  "#FB923C",
  "#2DD4BF",
  "#E879F9",
  "#94A3B8",
  "#F87171",
  "#38BDF8",
];

export default async function QuestionBankPage() {
  await ensureSeeded();
  const { userId } = await auth();
  const user = userId ? await getOrCreateDbUser() : null;

  const subjects = await prisma.subject.findMany({
    orderBy: { name: "asc" },
    include: {
      topics: {
        include: { _count: { select: { mcqs: true } } },
      },
    },
  });

  const progressRows = user
    ? await prisma.userProgress.findMany({
        where: { userId: user.id },
        include: { mcq: { include: { topic: { select: { subjectId: true } } } } },
      })
    : [];

  const progressBySubject = new Map<string, { seen: number; attempts: number; correct: number }>();
  for (const p of progressRows) {
    const sid = p.mcq.topic.subjectId;
    const cur = progressBySubject.get(sid) ?? { seen: 0, attempts: 0, correct: 0 };
    cur.seen += 1;
    cur.attempts += p.attempts;
    if (p.isCorrect) cur.correct += 1;
    progressBySubject.set(sid, cur);
  }

  const totalMcqs = subjects.reduce(
    (s, sub) => s + sub.topics.reduce((t, x) => t + x._count.mcqs, 0),
    0
  );
  const totalSolved = progressRows.length;

  return (
    <div className="qb-page">
      <header className="qb-page__head">
        <div>
          <div className="qb-page__eyebrow">Question bank</div>
          <h1 className="qb-page__title">Practice by subject</h1>
          <p className="qb-page__sub">
            19 MBBS subjects · {totalMcqs.toLocaleString()} MCQs across{" "}
            {subjects.length} topics.
            {user && totalSolved > 0 && ` You've attempted ${totalSolved} so far.`}
          </p>
        </div>
        <div className="qb-page__stats">
          <Stat label="MCQs" value={totalMcqs} />
          <Stat label="Subjects" value={subjects.length} />
          <Stat label="Your attempts" value={totalSolved} accent />
        </div>
      </header>

      <div className="qb-grid">
        {subjects.map((s, i) => {
          const total = s.topics.reduce((t, x) => t + x._count.mcqs, 0);
          const prog = progressBySubject.get(s.id) ?? { seen: 0, attempts: 0, correct: 0 };
          const accuracy =
            prog.attempts > 0 ? Math.round((prog.correct / prog.attempts) * 100) : 0;
          const color = SUBJECT_COLORS[i % SUBJECT_COLORS.length];
          return (
            <Link
              key={s.id}
              href={`/dashboard/question-bank/${s.slug}`}
              className="qb-card"
              style={{ ["--qb-color" as string]: color }}
            >
              <div className="qb-card__top">
                <span
                  className="qb-card__icon"
                  style={{ background: `${color}22`, color }}
                >
                  <IconStethoscope size={18} />
                </span>
                <span className="qb-card__count">{total} MCQs</span>
              </div>
              <div className="qb-card__name">{s.name}</div>
              <div className="qb-card__meta">
                {prog.attempts > 0 ? (
                  <>
                    <span className="qb-card__chip qb-card__chip--ok">
                      <IconCheck size={11} /> {prog.correct}/{prog.attempts}
                    </span>
                    <span className="qb-card__chip qb-card__chip--acc">{accuracy}% acc</span>
                  </>
                ) : (
                  <span className="qb-card__chip">Not started</span>
                )}
              </div>
              <div className="qb-card__bar">
                <div
                  className="qb-card__bar-fill"
                  style={{
                    width: `${Math.min(100, (prog.seen / Math.max(1, total)) * 100)}%`,
                    background: color,
                  }}
                />
              </div>
              <span className="qb-card__cta">
                Open <IconChevronRight size={13} />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={"qb-stat" + (accent ? " qb-stat--accent" : "")}>
      <div className="qb-stat__v">{value.toLocaleString()}</div>
      <div className="qb-stat__l">{label}</div>
    </div>
  );
}
