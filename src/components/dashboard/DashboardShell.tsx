"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Menu,
  X,
  Search,
  Bell,
  ChevronRight,
  ArrowUpRight,
  type LucideIcon,
  Sparkles,
} from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { DASHBOARD_FEATURES, type FeatureGroup } from "@/lib/features";
import { cn } from "@/lib/utils";
import { getFeatureIcon } from "./featureIcons";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  group: string;
  color: string;
};

const DASHBOARD_NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, group: "Main", color: "from-primary to-secondary" },
  ...DASHBOARD_FEATURES.map((f) => ({
    href: f.href,
    label: f.title.replace(/^AI\s/, ""),
    icon: getFeatureIcon(f.iconName),
    group: f.group,
    color: navColorFor(f.iconName),
  })),
];

function navColorFor(iconName: string): string {
  const map: Record<string, string> = {
    Sparkles: "from-primary to-secondary",
    Mic: "from-secondary to-cyan-500",
    ListChecks: "from-warning to-pink-500",
    PlayCircle: "from-danger to-primary",
    Notebook: "from-purple-500 to-secondary",
    Layers: "from-pink-500 to-secondary",
    Archive: "from-cyan-500 to-primary",
    TrendingUp: "from-emerald-500 to-cyan-500",
    BarChart3: "from-orange-500 to-pink-500",
    Bookmark: "from-blue-500 to-primary",
    CalendarDays: "from-violet-500 to-primary",
    Timer: "from-teal-500 to-cyan-500",
  };
  return map[iconName] ?? "from-primary to-secondary";
}

const GROUP_ORDER: ("Main" | FeatureGroup)[] = [
  "Main",
  "Learn",
  "Practice",
  "Track",
  "Tools",
];

const GROUP_LABEL: Record<string, string> = {
  Main: "Workspace",
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const grouped = GROUP_ORDER.map((group) => ({
    group,
    items: DASHBOARD_NAV.filter((i) => i.group === group),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="relative min-h-svh bg-soft text-ink">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-mesh-light" />
        <div className="absolute inset-0 dot-bg-light opacity-40" />
        <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-radial from-primary/10 to-transparent blur-3xl" />
      </div>

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
        className="fixed left-4 top-4 z-40 grid h-11 w-11 place-items-center rounded-2xl border border-soft-border bg-white/80 text-ink shadow-soft-sm backdrop-blur-xl md:hidden"
      >
        <Menu size={18} />
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 hidden w-[280px] flex-col border-r border-soft-border bg-white/75 backdrop-blur-2xl md:flex"
        )}
      >
        <SidebarContent grouped={grouped} pathname={pathname} onNavigate={() => undefined} />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-[300px] flex-col border-r border-soft-border bg-white md:hidden"
            >
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-soft-border bg-soft text-ink-muted"
              >
                <X size={14} />
              </button>
              <SidebarContent
                grouped={grouped}
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="md:pl-[280px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-soft-border bg-white/70 px-5 backdrop-blur-xl md:px-8">
          <div className="flex flex-1 items-center gap-3 pl-12 md:pl-0">
            <div className="relative hidden w-full max-w-md md:block">
              <Search
                size={15}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint"
              />
              <input
                type="text"
                placeholder="Search topics, questions, notes..."
                className="h-10 w-full rounded-2xl border border-soft-border bg-soft pl-10 pr-16 text-sm text-ink placeholder:text-ink-faint focus:border-primary/40 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-soft-border bg-white px-1.5 py-0.5 text-[10px] font-medium text-ink-soft md:inline-block">
                ⌘ K
              </kbd>
            </div>
            <Link
              href="/dashboard"
              className="ml-auto flex items-center gap-2 rounded-2xl border border-soft-border bg-white px-3 py-1.5 text-xs font-semibold text-ink-muted shadow-soft-xs md:hidden"
            >
              <LayoutDashboard size={13} />
              Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Notifications"
              className="relative grid h-10 w-10 place-items-center rounded-2xl border border-soft-border bg-white text-ink-muted transition hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary hover:shadow-soft-sm"
            >
              <Bell size={15} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.6)]" />
            </button>
            <SignedIn>
              <div className="ml-1 rounded-full ring-1 ring-soft-border">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: { avatarBox: "h-10 w-10" },
                  }}
                />
              </div>
            </SignedIn>
          </div>
        </header>

        <main id="main" className="relative min-h-[calc(100svh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  grouped,
  pathname,
  onNavigate,
}: {
  grouped: { group: string; items: NavItem[] }[];
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <Link
        href="/"
        onClick={onNavigate}
        className="flex h-16 items-center gap-2.5 border-b border-soft-border px-5"
      >
        <span className="relative grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-cyan shadow-soft-sm">
          <span className="absolute inset-0 rounded-2xl bg-white/15" />
          <Sparkles size={16} className="relative text-white" />
        </span>
        <div className="flex flex-col leading-tight">
          <span className="font-display text-[15px] font-semibold tracking-tight text-ink">
            Pulse
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
            Student
          </span>
        </div>
        <ArrowUpRight size={13} className="ml-auto text-ink-faint" />
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {grouped.map((g) => (
          <div key={g.group} className="mb-4">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-faint">
              {GROUP_LABEL[g.group] ?? g.group}
            </div>
            <ul className="space-y-0.5">
              {g.items.map((item) => {
                const active =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition",
                        active
                          ? "bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 shadow-soft-xs"
                          : "text-ink-muted hover:bg-soft hover:text-ink"
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br text-white shadow-soft-xs",
                          item.color,
                          active ? "scale-105" : "opacity-90 group-hover:opacity-100"
                        )}
                      >
                        <item.icon size={13} className="text-white" />
                      </span>
                      <span className="truncate">{item.label}</span>
                      {active && (
                        <ChevronRight size={12} className="ml-auto text-primary" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-soft-border p-3">
        <div className="relative overflow-hidden rounded-2xl border border-soft-border bg-gradient-to-br from-primary-50 via-white to-cyan-50 p-4">
          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-radial from-primary/25 to-transparent blur-2xl" />
          <div className="relative">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Pro tip
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
              Save a flashcard from any mock test — Pulse will schedule it for
              spaced review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
