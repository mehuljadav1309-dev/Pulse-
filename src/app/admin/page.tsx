import { prisma } from "@/lib/db";
import { IconBook, IconCheck, IconClock, IconUpload } from "@tabler/icons-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const [subjectCount, topicCount, mcqCount, recentUploads] = await Promise.all([
    prisma.subject.count(),
    prisma.topic.count(),
    prisma.mCQ.count(),
    prisma.uploadLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <h1 className="admin-page__title">Admin overview</h1>
          <p className="admin-page__sub">
            Manage subjects, topics, and the MCQ bank.
          </p>
        </div>
        <Link href="/admin/upload" className="admin-btn admin-btn--primary">
          <IconUpload size={16} /> Upload MCQs
        </Link>
      </header>

      <section className="admin-stats">
        <Stat icon={<IconBook size={18} />} label="Subjects" value={subjectCount} />
        <Stat icon={<IconBook size={18} />} label="Topics" value={topicCount} />
        <Stat icon={<IconCheck size={18} />} label="MCQs" value={mcqCount} />
        <Stat icon={<IconClock size={18} />} label="Recent uploads" value={recentUploads.length} />
      </section>

      <section className="admin-card">
        <h2 className="admin-card__title">Recent uploads</h2>
        {recentUploads.length === 0 ? (
          <p className="admin-empty">
            No uploads yet. Go to <Link href="/admin/upload">Upload</Link> to add MCQs.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>File</th>
                <th>Type</th>
                <th>Parsed</th>
                <th>Inserted</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {recentUploads.map((u) => (
                <tr key={u.id}>
                  <td>{u.filename}</td>
                  <td>{u.fileType}</td>
                  <td>{u.mcqsParsed}</td>
                  <td>{u.mcqsSaved}</td>
                  <td>{new Date(u.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="admin-stat">
      <div className="admin-stat__icon">{icon}</div>
      <div>
        <div className="admin-stat__label">{label}</div>
        <div className="admin-stat__value">{value}</div>
      </div>
    </div>
  );
}
