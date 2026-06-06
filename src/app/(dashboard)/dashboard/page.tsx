import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowRight, Flame, Sparkles, Timer, TrendingUp } from "lucide-react";
import { FeatureCard } from "@/components/dashboard/FeatureCard";
import {
  DASHBOARD_FEATURES,
  FEATURE_GROUPS,
  type DashboardFeature,
} from "@/lib/features";

const STATS = [
  { label: "Day streak", value: "12", icon: Flame, accent: "text-warning" },
  { label: "MCQs solved", value: "1,284", icon: Sparkles, accent: "text-accent" },
  { label: "Mock accuracy", value: "78%", icon: TrendingUp, accent: "text-mint" },
  { label: "Hours this week", value: "14.2", icon: Timer, accent: "text-purple-400" },
];

const RECENT = [
  { title: "Heart failure pharmacology", subject: "Medicine", time: "2h ago" },
  { title: "Acid-base disorders", subject: "Physiology", time: "5h ago" },
  { title: "Cranial nerves mnemonics", subject: "Anatomy", time: "Yesterday" },
  { title: "TB drug mechanisms", subject: "Microbiology", time: "Yesterday" },
];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Burning the midnight oil";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Late-night session";
}

export default async function DashboardHome() {
  const user = await currentUser();
  const firstName = user?.firstName ?? user?.username ?? "Doctor";

  return (
    <div className="container-x py-8 md:py-12">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-accent/15 via-mint/5 to-transparent p-6 md:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-radial from-accent/30 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-gradient-radial from-mint/20 to-transparent blur-3xl" />
        <div className="relative grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <span className="label">{getGreeting()}</span>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Welcome back, <span className="gradient-text-accent">{firstName}</span>.
            </h1>
            <p className="mt-3 max-w-xl text-pretty text-white/65">
              Your entire PG-prep workspace is here. Pick up where you left off, jump
              into a quick practice set, or chat with Pulse Tutor — everything is
              connected.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Link
                href="/dashboard/question-bank"
                className="btn-primary"
                data-cursor="hover"
              >
                Start a quick set
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/dashboard/ai-tutor"
                className="btn-ghost"
                data-cursor="hover"
              >
                Ask Pulse Tutor
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-background/50 p-4 backdrop-blur"
              >
                <s.icon size={14} className={s.accent} />
                <div className="mt-3 font-display text-2xl font-semibold text-white">
                  {s.value}
                </div>
                <div className="mt-0.5 text-xs text-white/50">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-white">
              Continue revising
            </h2>
            <Link
              href="/dashboard/bookmarks"
              className="text-xs text-white/55 transition hover:text-white"
            >
              View all
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-white/5">
            {RECENT.map((r) => (
              <li
                key={r.title}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-white">
                    {r.title}
                  </div>
                  <div className="mt-0.5 text-xs text-white/45">
                    {r.subject} · {r.time}
                  </div>
                </div>
                <ArrowRight size={14} className="shrink-0 text-white/35" />
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-accent/10 to-transparent p-5">
          <span className="label">Today&apos;s target</span>
          <h3 className="mt-2 font-display text-lg font-semibold text-white">
            60 MCQs · 1 mock test
          </h3>
          <p className="mt-1 text-xs text-white/55">
            You&apos;re 42 MCQs away from hitting your daily goal.
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-mint"
              style={{ width: "32%" }}
            />
          </div>
          <div className="mt-2 text-[11px] text-white/45">32% complete</div>
        </div>
      </section>

      <section className="mt-12 space-y-12">
        {FEATURE_GROUPS.map((g) => {
          const items: DashboardFeature[] = DASHBOARD_FEATURES.filter(
            (f) => f.group === g.id
          );
          if (items.length === 0) return null;
          return (
            <div key={g.id}>
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <span className="label">{g.label}</span>
                  <h2 className="mt-1 font-display text-xl font-semibold text-white md:text-2xl">
                    {g.label === "Learn"
                      ? "Learn anything, faster"
                      : g.label === "Practice"
                      ? "Practice that adapts to you"
                      : g.label === "Track progress"
                      ? "Track every gain"
                      : "Tools to stay on track"}
                  </h2>
                </div>
                <span className="text-xs text-white/40">
                  {items.length} feature{items.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((f, i) => (
                  <FeatureCard
                    key={f.slug}
                    feature={f}
                    index={i}
                    size={i === 0 ? "lg" : "md"}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section className="mt-14 rounded-3xl border border-white/10 bg-gradient-to-br from-accent/15 via-mint/5 to-transparent p-6 md:p-8">
        <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="label">Need help?</span>
            <h3 className="mt-1.5 font-display text-xl font-semibold text-white">
              Have a question? Just ask Pulse Tutor.
            </h3>
            <p className="mt-1 text-sm text-white/55">
              It&apos;s like having a senior resident on call — with citations.
            </p>
          </div>
          <Link
            href="/dashboard/ai-tutor"
            className="btn-primary"
            data-cursor="hover"
          >
            Open Pulse Tutor
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
