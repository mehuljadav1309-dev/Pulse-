import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default async function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/dashboard");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
