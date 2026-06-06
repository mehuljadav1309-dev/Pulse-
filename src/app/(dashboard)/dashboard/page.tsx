import { GreetingHero } from "@/components/dashboard/student/GreetingHero";
import { QuickActionCard } from "@/components/dashboard/student/QuickActionCard";
import { StatCard } from "@/components/dashboard/student/StatCard";
import { ProgressRing } from "@/components/dashboard/student/ProgressRing";
import { ProgressBar } from "@/components/dashboard/student/ProgressBar";
import { ContinueLearningCard } from "@/components/dashboard/student/ContinueLearningCard";
import { AchievementBadge } from "@/components/dashboard/student/AchievementBadge";
import { ScheduleItem } from "@/components/dashboard/student/ScheduleItem";
import { AIInsight } from "@/components/dashboard/student/AIInsight";
import { SectionHeader } from "@/components/dashboard/student/SectionHeader";
import { ActivityList, type ActivityItem } from "@/components/dashboard/student/ActivityList";
import {
  Sparkles,
  ListChecks,
  CalendarDays,
  Bot,
  Notebook,
  Timer,
  BookOpen,
  TrendingUp,
  Trophy,
  Clock,
  Flame,
  Target,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const QUICK_ACTIONS = [
  {
    href: "/dashboard/ai-tutor",
    label: "Continue Learning",
    description: "Pick up exactly where you left off in your last session.",
    icon: BookOpen,
    gradient: "from-accent to-mint",
    badge: "12m left",
    progress: 62,
    cta: "Resume",
  },
  {
    href: "/dashboard/question-bank",
    label: "Practice Quiz",
    description: "10-minute adaptive set tuned to your weak topics.",
    icon: ListChecks,
    gradient: "from-warning to-pink-500",
    badge: "Daily",
    progress: 30,
    cta: "Start quiz",
  },
  {
    href: "/dashboard/revision-planner",
    label: "Assignments",
    description: "Today's 2 tasks are ready. Quick wins first.",
    icon: CalendarDays,
    gradient: "from-mint to-accent",
    badge: "2 due",
    progress: 40,
    cta: "View tasks",
  },
  {
    href: "/dashboard/ai-tutor",
    label: "AI Tutor",
    description: "Ask anything — textbook-grounded, with citations.",
    icon: Bot,
    gradient: "from-accent to-mint",
    badge: "Online",
    cta: "Ask now",
  },
  {
    href: "/dashboard/notes",
    label: "Notes",
    description: "Your exam-oriented notes, all in one place.",
    icon: Notebook,
    gradient: "from-purple-500 to-mint",
    cta: "Open",
  },
  {
    href: "/dashboard/revision-planner",
    label: "Study Plan",
    description: "Adaptive plan recalculated every day.",
    icon: Timer,
    gradient: "from-teal-500 to-mint",
    badge: "47d",
    cta: "View plan",
  },
];

const ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    title: "Heart failure pharmacology",
    subject: "Medicine",
    meta: "Quiz · 2h ago",
    score: "92%",
    type: "quiz",
  },
  {
    id: "2",
    title: "Coronary circulation walkthrough",
    subject: "Anatomy",
    meta: "Video · 5h ago",
    type: "video",
  },
  {
    id: "3",
    title: "Acid-base disorders — quick note",
    subject: "Physiology",
    meta: "Note · Yesterday",
    type: "note",
  },
  {
    id: "4",
    title: "NEET PG Grand Test 24",
    subject: "Full mock",
    meta: "Mock · Yesterday",
    score: "184/200",
    type: "mock",
  },
];

const SCHEDULE = [
  { day: "Mon", focus: "Medicine · 2 hrs", time: "Completed", status: "done" as const },
  { day: "Tue", focus: "Surgery · 1.5 hrs", time: "Completed", status: "done" as const },
  { day: "Wed", focus: "Mock test · 3 hrs", time: "Completed", status: "done" as const },
  { day: "Thu", focus: "Pathology · 1 hr", time: "In progress · 24m left", status: "current" as const },
  { day: "Fri", focus: "Pharmacology · 2 hrs", time: "Scheduled 6:00 PM", status: "upcoming" as const },
  { day: "Sat", focus: "Full-length mock", time: "9:00 AM", status: "upcoming" as const },
  { day: "Sun", focus: "Revision · 1.5 hrs", time: "4:00 PM", status: "upcoming" as const },
];

const ACHIEVEMENTS = [
  { emoji: "🔥", title: "Hot Streak", description: "7-day streak", gradient: "from-warning to-pink-500", unlocked: true },
  { emoji: "🧠", title: "Quiz Master", description: "50 quizzes", gradient: "from-accent to-mint", unlocked: true },
  { emoji: "🎯", title: "Sharp Eye", description: "90% accuracy", gradient: "from-mint to-accent", unlocked: true },
  { emoji: "📚", title: "Bookworm", description: "200 notes", gradient: "from-purple-500 to-mint", unlocked: true },
  { emoji: "🌟", title: "First Mock", description: "Top 10%", gradient: "from-mint to-emerald-500", unlocked: true },
  { emoji: "🛡️", title: "Steady Week", description: "2 days to go", gradient: "from-accent to-secondary", unlocked: false, progress: 71 },
  { emoji: "🏆", title: "NEET Top 1%", description: "Locked", gradient: "from-pink-500 to-accent", unlocked: false, progress: 28 },
  { emoji: "🚀", title: "100-Day Run", description: "Day 12", gradient: "from-accent to-mint", unlocked: false, progress: 12 },
];

export default async function DashboardHome() {
  return (
    <div className="container-x py-8 md:py-10">
      {/* TOP: Greeting + Streak + Today's progress */}
      <GreetingHero />

      {/* QUICK ACTIONS */}
      <section className="mt-10">
        <SectionHeader
          eyebrow="Quick Actions"
          title="What do you want to do next?"
          description="Six big, friendly buttons — tap any of them to keep your momentum going."
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_ACTIONS.map((a, i) => (
            <QuickActionCard
              key={a.label}
              href={a.href}
              label={a.label}
              description={a.description}
              icon={<a.icon size={18} />}
              gradient={a.gradient}
              badge={a.badge}
              progress={a.progress}
              cta={a.cta}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* PROGRESS OVERVIEW (stats) */}
      <section className="mt-12">
        <SectionHeader
          eyebrow="Your Progress"
          title="You're doing great, keep it up."
          description="A clear view of how far you've come this week."
          action={
            <Link
              href="/dashboard/analytics"
              className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-accent transition hover:text-white"
            >
              See full analytics
              <ArrowRight size={13} />
            </Link>
          }
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Courses Completed"
            value={8}
            suffix="/ 12"
            icon={<Trophy size={16} className="text-white" />}
            gradient="from-accent to-mint"
            delta="+2 this month"
            index={0}
          />
          <StatCard
            label="Current Progress"
            value={67}
            suffix="%"
            icon={<TrendingUp size={16} className="text-white" />}
            gradient="from-mint to-emerald-500"
            delta="+12% vs last week"
            index={1}
          />
          <StatCard
            label="Study Hours"
            value={14}
            suffix="h"
            icon={<Clock size={16} className="text-white" />}
            gradient="from-mint to-accent"
            delta="Goal 20h"
            index={2}
          />
          <StatCard
            label="Achievement Points"
            value={2840}
            icon={<Target size={16} className="text-white" />}
            gradient="from-warning to-pink-500"
            delta="+340 this week"
            index={3}
          />
        </div>
      </section>

      {/* LEARNING + RIGHT PANEL */}
      <section className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1.55fr_1fr]">
        <div className="space-y-6">
          <div>
            <SectionHeader
              eyebrow="Continue Learning"
              title="Pick up where you left off"
              action={
                <Link
                  href="/dashboard/bookmarks"
                  className="text-[12.5px] font-semibold text-white/55 transition hover:text-white"
                >
                  View all
                </Link>
              }
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <ContinueLearningCard
                title="Heart failure pharmacology"
                subject="Medicine"
                duration="18m"
                progress={62}
                href="/dashboard/ai-tutor"
                badge="Continue"
                variant="wide"
              />
              <ContinueLearningCard
                title="Coronary circulation walkthrough"
                subject="Anatomy"
                duration="24m"
                progress={34}
                href="/dashboard/videos"
                badge="Up next"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-5">
            <SectionHeader
              eyebrow="Today's Mission"
              title="Two short tasks to keep your streak alive"
              className="mb-4"
            />
            <div className="space-y-3">
              <ProgressBar
                label="60 MCQs"
                detail="18 / 60"
                value={30}
                gradient="from-accent to-mint"
                index={0}
              />
              <ProgressBar
                label="1 mock test"
                detail="0 / 1"
                value={0}
                gradient="from-mint to-accent"
                index={1}
              />
              <ProgressBar
                label="20 flashcards"
                detail="14 / 20"
                value={70}
                gradient="from-mint to-accent"
                index={2}
              />
            </div>
            <div className="mt-5 flex items-center justify-between rounded-2xl border border-accent/20 bg-gradient-to-r from-accent/10 to-mint/10 p-3">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-background/60 shadow-soft-sm backdrop-blur">
                  <Flame size={14} className="text-warning" />
                </span>
                <span className="text-[12.5px] font-semibold text-white">
                  You&apos;re 18 MCQs away from your daily goal.
                </span>
              </div>
              <Link
                href="/dashboard/question-bank"
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/20"
              >
                Start now
              </Link>
            </div>
          </div>

          {/* AI Insights row */}
          <div>
            <SectionHeader
              eyebrow="AI Tutor"
              title="Suggestions from Pulse"
              action={
                <Link
                  href="/dashboard/ai-tutor"
                  className="text-[12.5px] font-semibold text-accent"
                >
                  Open tutor
                </Link>
              }
            />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <AIInsight
                title="Revise Acid-base disorders"
                message="You're at 48% in this topic — a 10-minute flashcard set will lift it into your strong zone."
                href="/dashboard/flashcards"
                cta="Start flashcards"
                index={0}
              />
              <AIInsight
                title="Mock test ready"
                message="You've completed 78% of NEET PG Grand Test syllabus — perfect time for a full-length mock."
                href="/dashboard/question-bank"
                cta="Take mock"
                variant="success"
                index={1}
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE PANEL */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="label">Today's Goal</span>
                <h3 className="mt-1 font-display text-base font-semibold text-white">
                  2 hrs focused study
                </h3>
              </div>
              <ProgressRing
                value={40}
                size={64}
                stroke={7}
                fromColor="#4F8CFF"
                toColor="#00E5A8"
              />
            </div>
            <p className="mt-3 text-[12.5px] text-white/55">
              48 / 120 minutes done · keep going, you&apos;re in the zone.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-2.5">
                <div className="font-display text-base font-bold text-white">12</div>
                <div className="text-[10px] font-semibold text-white/45">MCQs</div>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-2.5">
                <div className="font-display text-base font-bold text-white">2</div>
                <div className="text-[10px] font-semibold text-white/45">Videos</div>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-2.5">
                <div className="font-display text-base font-bold text-white">14</div>
                <div className="text-[10px] font-semibold text-white/45">Cards</div>
              </div>
            </div>
          </div>

          {/* Today's schedule */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <span className="label">Schedule</span>
                <h3 className="mt-1 font-display text-base font-semibold text-white">
                  This week
                </h3>
              </div>
              <Link
                href="/dashboard/scheduler"
                className="text-[12px] font-semibold text-accent"
              >
                Manage
              </Link>
            </div>
            <div className="space-y-2">
              {SCHEDULE.map((s, i) => (
                <ScheduleItem
                  key={s.day}
                  day={s.day}
                  focus={s.focus}
                  time={s.time}
                  status={s.status}
                  index={i}
                />
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <span className="label">Recent Activity</span>
                <h3 className="mt-1 font-display text-base font-semibold text-white">
                  Today
                </h3>
              </div>
              <Link
                href="/dashboard/bookmarks"
                className="text-[12px] font-semibold text-accent"
              >
                See all
              </Link>
            </div>
            <ActivityList items={ACTIVITIES} />
          </div>

          {/* Quick notes */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-accent/15 via-mint/5 to-transparent p-5">
            <span className="label">Quick Note</span>
            <h3 className="mt-1 font-display text-base font-semibold text-white">
              Jot a thought
            </h3>
            <textarea
              placeholder="Today I learned…"
              className="mt-3 h-24 w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] p-3 text-[13px] text-white placeholder:text-white/40 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] text-white/45">Auto-saves to Notes</span>
              <button className="btn-primary !py-1.5 !px-3.5 text-[11px]">
                <Sparkles size={11} />
                Save
              </button>
            </div>
          </div>
        </aside>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="mt-12">
        <SectionHeader
          eyebrow="Achievements"
          title="Your badges & milestones"
          description="Small wins, big momentum. Keep collecting them."
          action={
            <Link
              href="/dashboard/analytics"
              className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-accent"
            >
              View all
              <ArrowRight size={13} />
            </Link>
          }
        />
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {ACHIEVEMENTS.map((a, i) => (
              <AchievementBadge
                key={a.title}
                emoji={a.emoji}
                title={a.title}
                description={a.description}
                gradient={a.gradient}
                unlocked={a.unlocked}
                progress={a.progress}
                index={i}
              />
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-accent/20 bg-gradient-to-r from-accent/10 to-mint/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-background/60 backdrop-blur">
                  <Trophy size={18} className="text-warning" />
                </span>
                <div>
                  <div className="font-display text-[15px] font-bold text-white">
                    You&apos;re 1,160 XP from &ldquo;Quiz Wizard&rdquo;
                  </div>
                  <div className="text-[12px] text-white/55">
                    Complete 5 more quizzes this week to unlock.
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-64">
                <ProgressBar value={71} gradient="from-accent to-mint" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Tutor CTA */}
      <section className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-accent/15 via-mint/5 to-transparent p-6 md:p-8">
        <div className="relative flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="icon-tile h-14 w-14 bg-gradient-to-br from-accent via-mint to-accent" style={{ width: "3.5rem", height: "3.5rem" }}>
              <Sparkles size={22} />
            </span>
            <div>
              <span className="label">Need help?</span>
              <h3 className="mt-1 font-display text-xl font-bold tracking-tight text-white">
                Stuck on a topic? Just ask Pulse Tutor.
              </h3>
              <p className="mt-1 max-w-xl text-[13.5px] text-white/55">
                It&apos;s like having a senior resident on call — with citations
                and follow-up questions.
              </p>
            </div>
          </div>
          <Link href="/dashboard/ai-tutor" className="btn-primary" data-cursor="hover">
            Open Pulse Tutor
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
