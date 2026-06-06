import { prisma } from "@/lib/db";
import Link from "next/link";
import { DeleteButton } from "./DeleteButton";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

export default async function MCQsPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string; topic?: string; q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const subjectSlug = sp.subject ?? "";
  const topicSlug = sp.topic ?? "";
  const q = (sp.q ?? "").trim();
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  const subjects = await prisma.subject.findMany({ orderBy: { name: "asc" } });
  const subject = subjects.find((s) => s.slug === subjectSlug);
  const topics = subject
    ? await prisma.topic.findMany({
        where: { subjectId: subject.id },
        orderBy: { name: "asc" },
      })
    : [];
  const topic = topics.find((t) => t.slug === topicSlug);

  const where = {
    ...(topic ? { topicId: topic.id } : subject ? { topic: { subjectId: subject.id } } : {}),
    ...(q ? { question: { contains: q } } : {}),
  };
  const [total, mcqs] = await Promise.all([
    prisma.mCQ.count({ where }),
    prisma.mCQ.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      include: { topic: { include: { subject: true } } },
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <h1 className="admin-page__title">MCQs</h1>
          <p className="admin-page__sub">
            {total} MCQ{total === 1 ? "" : "s"}
            {subject ? ` in ${subject.name}` : ""}
            {topic ? ` / ${topic.name}` : ""}
          </p>
        </div>
      </header>

      <form className="admin-filters" method="get">
        <select name="subject" defaultValue={subjectSlug} className="admin-filters__sel">
          <option value="">All subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
        <select
          name="topic"
          defaultValue={topicSlug}
          className="admin-filters__sel"
          disabled={!subject}
        >
          <option value="">{subject ? "All topics" : "Pick a subject"}</option>
          {topics.map((t) => (
            <option key={t.id} value={t.slug}>
              {t.name}
            </option>
          ))}
        </select>
        <input
          name="q"
          defaultValue={q}
          placeholder="Search question…"
          className="admin-filters__search"
        />
        <button type="submit" className="admin-btn">Apply</button>
      </form>

      <section className="admin-card">
        {mcqs.length === 0 ? (
          <p className="admin-empty">No MCQs found.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "50%" }}>Question</th>
                <th>Subject</th>
                <th>Topic</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {mcqs.map((m) => (
                <tr key={m.id}>
                  <td className="admin-table__q">
                    <Link href={`/admin/mcqs?subject=${m.topic.subject.slug}&topic=${m.topic.slug}`}>
                      {m.question}
                    </Link>
                  </td>
                  <td>{m.topic.subject.name}</td>
                  <td>{m.topic.name}</td>
                  <td>
                    <DeleteButton id={m.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {totalPages > 1 && (
          <div className="admin-pager">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
              .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <span key={`e${i}`} className="admin-pager__ell">…</span>
                ) : (
                  <Link
                    key={p}
                    href={{
                      pathname: "/admin/mcqs",
                      query: {
                        ...(subjectSlug ? { subject: subjectSlug } : {}),
                        ...(topicSlug ? { topic: topicSlug } : {}),
                        ...(q ? { q } : {}),
                        page: String(p),
                      },
                    }}
                    className={
                      "admin-pager__link" + (p === page ? " admin-pager__link--on" : "")
                    }
                  >
                    {p}
                  </Link>
                )
              )}
          </div>
        )}
      </section>
    </div>
  );
}
