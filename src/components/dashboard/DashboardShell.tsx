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
};

const DASHBOARD_NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, group: "Main" },
  ...DASHBOARD_FEATURES.map((f) => ({
    href: f.href,
    label: f.title.replace(/^AI\s/, ""),
    icon: getFeatureIcon(f.iconName),
    group: f.group,
  })),
];

const GROUP_ORDER: ("Main" | FeatureGroup)[] = [
  "Main",
  "Learn",
  "Practice",
  "Track",
  "Tools",
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const grouped = GROUP_ORDER.map((group) => ({
    group,
    items: DASHBOARD_NAV.filter((i) => i.group === group),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="relative min-h-svh bg-background text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-radial from-accent/8 to-transparent blur-3xl" />
      </div>

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
        className="fixed left-4 top-4 z-40 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-background/80 text-white/80 backdrop-blur-xl md:hidden"
      >
        <Menu size={16} />
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 hidden w-[280px] flex-col border-r border-white/5 bg-background/85 backdrop-blur-2xl md:flex"
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
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-[300px] flex-col border-r border-white/5 bg-background md:hidden"
            >
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/70"
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
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-background/70 px-5 backdrop-blur-xl md:px-8">
          <div className="flex flex-1 items-center gap-3 pl-12 md:pl-0">
            <div className="relative hidden w-full max-w-md md:block">
              <Search
                size={14}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                type="text"
                placeholder="Search topics, questions, notes..."
                className="h-10 w-full rounded-full border border-white/10 bg-white/[0.03] pl-10 pr-16 text-sm text-white placeholder:text-white/40 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-white/40 md:inline-block">
                ⌘ K
              </kbd>
            </div>
            <Link
              href="/dashboard"
              className="ml-auto flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/70 transition hover:border-white/20 hover:text-white md:hidden"
            >
              <LayoutDashboard size={13} />
              Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Notifications"
              className="relative grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition hover:border-white/20 hover:text-white"
            >
              <Bell size={14} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-mint shadow-[0_0_8px_rgba(0,229,168,0.6)]" />
            </button>
            <SignedIn>
              <div className="ml-1 rounded-full ring-1 ring-white/10">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: { avatarBox: "h-9 w-9" },
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
        className="flex h-16 items-center gap-2.5 border-b border-white/5 px-5"
      >
        <span className="relative grid h-8 w-8 place-items-center">
          <span className="absolute inset-0 rounded-lg bg-gradient-to-br from-accent to-mint opacity-80 blur-md" />
          <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent to-mint">
            <span className="font-display text-sm font-bold text-background">P</span>
          </span>
        </span>
        <div className="flex flex-col leading-tight">
          <span className="font-display text-[15px] font-semibold tracking-tight text-white">
            Pulse
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
            Workspace
          </span>
        </div>
        <ArrowUpRight size={13} className="ml-auto text-white/30" />
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {grouped.map((g) => (
          <div key={g.group} className="mb-4">
            <div className="px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/35">
              {g.group === "Main" ? "Workspace" : g.group}
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
                        "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition",
                        active
                          ? "bg-white/[0.06] text-white"
                          : "text-white/65 hover:bg-white/[0.04] hover:text-white"
                      )}
                    >
                      <item.icon
                        size={15}
                        className={cn(
                          "shrink-0 transition",
                          active ? "text-accent" : "text-white/50 group-hover:text-white/80"
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                      {active && (
                        <ChevronRight size={12} className="ml-auto text-white/40" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/5 p-3">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-accent/15 via-mint/5 to-transparent p-4">
          <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
            Pro tip
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-white/70">
            Save a flashcard from any mock test — Pulse will schedule it for spaced
            review.
          </p>
        </div>
      </div>
    </div>
  );
}
