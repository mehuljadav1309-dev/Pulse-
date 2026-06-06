import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/admin";
import Link from "next/link";
import {
  IconChartBar,
  IconUpload,
  IconBooks,
  IconArrowLeft,
} from "@tabler/icons-react";

export const metadata = {
  title: "Pulse Admin",
};

const NAV = [
  { href: "/admin", label: "Overview", icon: IconChartBar },
  { href: "/admin/upload", label: "Upload", icon: IconUpload },
  { href: "/admin/mcqs", label: "MCQs", icon: IconBooks },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getAdminContext();
  if (!ctx) redirect("/sign-in?redirect_url=/admin");

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <Link href="/dashboard" className="admin-side__back">
          <IconArrowLeft size={16} /> Back to dashboard
        </Link>
        <div className="admin-side__brand">
          <span className="admin-side__brand-dot" />
          Pulse Admin
        </div>
        <nav className="admin-side__nav">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="admin-side__link">
              <n.icon size={16} /> {n.label}
            </Link>
          ))}
        </nav>
        <div className="admin-side__user">
          <div className="admin-side__user-name">{ctx.name ?? "Admin"}</div>
          <div className="admin-side__user-email">{ctx.email}</div>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
