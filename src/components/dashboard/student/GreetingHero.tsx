import { currentUser } from "@clerk/nextjs/server";
import { Sparkles, Flame } from "lucide-react";

type GreetingHeroProps = {
  firstName: string;
  greeting: string;
  motivation: string;
  streak: number;
  todayMinutes: number;
  goalMinutes: number;
};

function getGreeting(h: number): string {
  if (h < 5) return "Burning the midnight oil";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Late-night session";
}

function pickMotivation(minutes: number, goal: number, streak: number): string {
  const pct = Math.round((minutes / goal) * 100);
  if (pct >= 100) return "Daily goal smashed — you're on fire!";
  if (pct >= 60) return "Almost there. A focused block will finish it.";
  if (streak >= 7) return `Day ${streak} — momentum is real. Keep it going.`;
  if (minutes === 0) return "Let's open the day with a small win.";
  return "Tiny steps compound. Start your next session now.";
}

export async function GreetingHero() {
  const user = await currentUser();
  const firstName = user?.firstName ?? user?.username ?? "Doctor";
  const hour = new Date().getHours();
  const greeting = getGreeting(hour);
  const streak = 12;
  const todayMinutes = 48;
  const goalMinutes = 120;
  const motivation = pickMotivation(todayMinutes, goalMinutes, streak);

  return <GreetingHeroView firstName={firstName} greeting={greeting} motivation={motivation} streak={streak} todayMinutes={todayMinutes} goalMinutes={goalMinutes} />;
}

function GreetingHeroView({
  firstName,
  greeting,
  motivation,
  streak,
  todayMinutes,
  goalMinutes,
}: GreetingHeroProps) {
  const progressPct = Math.min(100, Math.round((todayMinutes / goalMinutes) * 100));

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-soft-border bg-white p-6 shadow-soft-md md:p-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 bg-mesh-light"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-radial from-primary/30 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-gradient-radial from-cyan-300/40 to-transparent blur-3xl"
      />

      {/* Floating decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-6 top-6 h-20 w-20 rounded-2xl bg-gradient-to-br from-secondary to-cyan opacity-60 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-16 top-10 h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary opacity-80 shadow-soft-sm float-soft"
      />

      <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <span className="chip-light">
            <Sparkles size={12} className="text-primary" />
            {greeting}
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Welcome back,{" "}
            <span className="gradient-text-primary">{firstName}</span>.
          </h1>
          <p className="mt-2.5 max-w-xl text-pretty text-[15px] leading-relaxed text-ink-muted">
            {motivation}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <a
              href="/dashboard/question-bank"
              className="btn-grad"
            >
              <Play size={14} />
              Continue learning
            </a>
            <a
              href="/dashboard/ai-tutor"
              className="btn-soft"
            >
              <Sparkles size={14} className="text-primary" />
              Ask Pulse Tutor
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative overflow-hidden rounded-2xl border border-soft-border bg-white p-4 shadow-soft-sm">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-warning to-pink-500 text-white shadow-soft-sm">
                <Flame size={14} />
              </span>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">
                  Streak
                </div>
                <div className="font-display text-xl font-bold text-ink">
                  {streak}d
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-0.5">
              {Array.from({ length: 7 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${
                    i < 5
                      ? "bg-gradient-to-r from-warning to-pink-500"
                      : "bg-soft"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-soft-border bg-white p-4 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">
                Today
              </span>
              <span className="text-[10px] font-semibold text-primary">
                {progressPct}%
              </span>
            </div>
            <div className="mt-1.5 flex items-end gap-1">
              <span className="font-display text-2xl font-bold text-ink">
                {todayMinutes}
              </span>
              <span className="pb-1 text-[11px] text-ink-faint">/ {goalMinutes}m</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-soft">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-cyan"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="col-span-2 flex items-center justify-between rounded-2xl border border-soft-border bg-gradient-to-r from-primary-50 to-cyan-50 p-3.5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white shadow-soft-sm">
                <TrophyIcon />
              </span>
              <div>
                <div className="text-[11px] font-semibold text-primary">
                  Next milestone
                </div>
                <div className="font-display text-sm font-semibold text-ink">
                  2 days to "Steady Week" badge
                </div>
              </div>
            </div>
            <a
              href="/dashboard/ai-tutor"
              className="rounded-xl bg-white px-3 py-1.5 text-[11px] font-semibold text-primary shadow-soft-xs transition hover:-translate-y-0.5 hover:shadow-soft-sm"
            >
              View
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Play({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M8 5.5v13l11-6.5L8 5.5z" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 4h10v3a5 5 0 01-10 0V4z"
        stroke="#4F46E5"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M5 6H3v2a3 3 0 003 3M19 6h2v2a3 3 0 01-3 3M9 17h6M12 13v4M8 20h8"
        stroke="#4F46E5"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
