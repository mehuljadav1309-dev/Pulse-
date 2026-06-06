import { prisma } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed-once";
import { UploadForm } from "./UploadForm";

export const dynamic = "force-dynamic";

export default async function UploadPage() {
  await ensureSeeded();
  const subjects = await prisma.subject.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });
  const topics = await prisma.topic.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true, subjectId: true },
  });

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <h1 className="admin-page__title">Upload MCQs</h1>
          <p className="admin-page__sub">
            Drop a PDF, HTML, CSV, or JSON file. We'll auto-extract the
            questions, options, answers, and explanations.
          </p>
        </div>
      </header>
      <section className="admin-card">
        <UploadForm subjects={subjects} topics={topics} />
      </section>
      <section className="admin-card admin-card--muted">
        <h2 className="admin-card__title">Format tips</h2>
        <ul className="admin-tips">
          <li>
            <strong>JSON</strong> — array of <code>{`{ question, options[4], answer, explanation }`}</code>.
            "answer" can be a letter (A–D) or an index (0–3).
          </li>
          <li>
            <strong>CSV</strong> — columns: <code>question, a, b, c, d, answer, explanation</code> (header row required).
          </li>
          <li>
            <strong>HTML / PDF</strong> — start each question with a number ("1.", "Q1.") and each option with a letter ("A.", "a)"). Include an "Answer: B" line.
          </li>
        </ul>
      </section>
    </div>
  );
}
