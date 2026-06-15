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
          <h1 className="admin-page__title">AI-Powered MCQ Upload</h1>
          <p className="admin-page__sub">
            Drop a PDF, HTML, CSV, or JSON file. Our AI extracts questions,
            options, and answers — then lets you review, edit, and confirm
            before adding them to the question bank.
          </p>
        </div>
      </header>
      <section className="admin-card">
        <UploadForm subjects={subjects} topics={topics} />
      </section>
      <section className="admin-card admin-card--muted">
        <h2 className="admin-card__title">How it works</h2>
        <ul className="admin-tips">
          <li>
            <strong>1. Upload</strong> — Select your file and optional subject/topic.
          </li>
          <li>
            <strong>2. AI Extraction</strong> — Qwen3-80B via OpenRouter extracts MCQs with confidence scores.
          </li>
          <li>
            <strong>3. Review &amp; Edit</strong> — See every question with confidence bars, flag low-confidence items, and edit inline.
          </li>
          <li>
            <strong>4. Confirm</strong> — Select which MCQs to insert and save them to the bank.
          </li>
        </ul>
      </section>
    </div>
  );
}
