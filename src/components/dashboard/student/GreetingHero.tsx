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

  return (
    <GreetingHeroView
      firstName={firstName}
      greeting={greeting}
      motivation={motivation}
      streak={streak}
      todayMinutes={todayMinutes}
      goalMinutes={goalMinutes}
    />
  );
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
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-accent/15 via-mint/5 to-transparent p-6 md:p-10">
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-radial from-accent/30 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-gradient-radial from-mint/20 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-20" />

      <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <span className="chip">
            <Sparkles size={12} className="text-accent" />
            {greeting}
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
            Welcome back,{" "}
            <span className="gradient-text-accent">{firstName}</span>.
          </h1>
          <p className="mt-3 max-w-xl text-pretty text-[15px] leading-relaxed text-white/65">
            {motivation}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <a href="/dashboard/question-bank" className="btn-primary" data-cursor="hover">
              <Play size={14} />
              Continue learning
            </a>
            <a href="/dashboard/ai-tutor" className="btn-ghost" data-cursor="hover">
              <Sparkles size={14} className="text-accent" />
              Ask Pulse Tutor
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-background/50 p-4 backdrop-blur">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-warning to-pink-500 text-white shadow-soft-sm">
                <Flame size={14} />
              </span>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-white/45">
                  Streak
                </div>
                <div className="font-display text-xl font-bold text-white">
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
                      : "bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-background/50 p-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/45">
                Today
              </span>
              <span className="text-[10px] font-semibold text-accent">
                {progressPct}%
              </span>
            </div>
            <div className="mt-1.5 flex items-end gap-1">
              <span className="font-display text-2xl font-bold text-white">
                {todayMinutes}
              </span>
              <span className="pb-1 text-[11px] text-white/40">/ {goalMinutes}m</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-mint"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="col-span-2 flex items-center justify-between rounded-2xl border border-accent/20 bg-gradient-to-r from-accent/10 to-mint/10 p-3.5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-background/60 shadow-soft-sm backdrop-blur">
                <TrophyIcon />
              </span>
              <div>
                <div className="text-[11px] font-semibold text-accent">
                  Next milestone
                </div>
                <div className="font-display text-sm font-semibold text-white">
                  2 days to "Steady Week" badge
                </div>
              </div>
            </div>
            <a
              href="/dashboard/ai-tutor"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/20 hover:shadow-soft-sm"
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
        stroke="#4F8CFF"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M5 6H3v2a3 3 0 003 3M19 6h2v2a3 3 0 01-3 3M9 17h6M12 13v4M8 20h8"
        stroke="#4F8CFF"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
