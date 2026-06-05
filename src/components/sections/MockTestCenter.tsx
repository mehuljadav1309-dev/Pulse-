"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUp, ArrowDown, Target, TrendingUp, Trophy, Clock, Zap, CheckCircle2, AlertCircle } from "lucide-react";
import { FadeUp } from "@/components/ui/Reveal";
import { RequireAuth } from "@/components/ui/RequireAuth";
import { cn } from "@/lib/utils";

const TREND = [42, 51, 48, 58, 62, 67, 71, 78, 76, 82, 85, 88, 91, 89, 94];

const SUBJECT_PERFORMANCE = [
  { name: "Medicine", score: 86, color: "#4F8CFF", trend: "+8" },
  { name: "Surgery", score: 79, color: "#00E5A8", trend: "+12" },
  { name: "Pathology", score: 72, color: "#F59E0B", trend: "+5" },
  { name: "Pharmacology", score: 64, color: "#EF4444", trend: "-3" },
  { name: "Microbiology", score: 81, color: "#A78BFA", trend: "+7" },
  { name: "OBG", score: 58, color: "#EC4899", trend: "+2" },
];

function AreaChart() {
  const W = 600;
  const H = 200;
  const max = Math.max(...TREND);
  const min = Math.min(...TREND);
  const range = max - min || 1;
  const points = TREND.map((v, i) => {
    const x = (i / (TREND.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 20) - 10;
    return [x, y] as const;
  });
  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`))
    .join(" ");
  const areaD = `${pathD} L ${W} ${H} L 0 ${H} Z`;
  const id = "gradArea";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4F8CFF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#4F8CFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((p) => (
        <line
          key={p}
          x1="0"
          x2={W}
          y1={H * p}
          y2={H * p}
          stroke="rgba(255,255,255,0.04)"
        />
      ))}
      {/* Area */}
      <motion.path
        d={areaD}
        fill={`url(#${id})`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay: 0.4 }}
      />
      {/* Line */}
      <motion.path
        d={pathD}
        stroke="#4F8CFF"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Points */}
      {points.map((p, i) => (
        <motion.circle
          key={i}
          cx={p[0]}
          cy={p[1]}
          r="3"
          fill="#4F8CFF"
          stroke="#0a0a0a"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.6 + i * 0.04 }}
        />
      ))}
    </svg>
  );
}

function RingProgress({ value, max = 100, label, color = "#4F8CFF", size = 130 }: { value: number; max?: number; label: string; color?: string; size?: number }) {
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;
  const pct = value / max;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * (1 - pct) }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-display text-2xl font-semibold text-white">{value}</div>
        <div className="text-[10px] uppercase tracking-wider text-white/40">{label}</div>
      </div>
    </div>
  );
}

export function MockTestCenter() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section id="mock-tests" ref={ref} className="section relative py-32 md:py-40">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-accent/[0.06] to-transparent" />
        <motion.div
          style={{ y }}
          className="absolute right-1/4 top-1/2 h-[500px] w-[500px] rounded-full bg-gradient-radial from-success/10 to-transparent blur-3xl"
        />
      </div>

      <div className="container-x">
        <FadeUp className="mx-auto max-w-3xl text-center">
          <span className="label mb-4 inline-block">06 — Mock Test Command Center</span>
          <h2 className="mt-4 font-display text-display-xl gradient-text text-balance">
            Predict your rank{" "}
            <span className="gradient-text-accent">before exam day.</span>
          </h2>
          <p className="mt-6 text-pretty text-lg text-white/55">
            Every mock you take refines Pulse's AI model. Get AIR predictions,
            percentile tracking, time-per-question analysis, and a personalized
            revision plan.
          </p>
        </FadeUp>

        <FadeUp delay={0.2} className="mt-20">
          <RequireAuth
            title="Sign in to track your mock test performance"
            description="Get AIR predictions, percentile tracking, time-per-question analysis, and a personalized revision plan after every grand test."
            cta="Sign in to start testing"
          >
            <div className="relative mx-auto max-w-6xl">
            {/* Glow */}
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-accent/15 via-success/10 to-mint/15 opacity-50 blur-3xl" />

            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-5 shadow-card-lift md:p-6">
              {/* Top row: header + rings */}
              <div className="flex flex-wrap items-center justify-between gap-6 border-b border-white/8 pb-5">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-white/50">
                    <Trophy size={12} className="text-warning" />
                    <span>NEET PG 2026 · Grand Test 14</span>
                  </div>
                  <h3 className="mt-2 font-display text-xl font-semibold text-white md:text-2xl">
                    Your performance snapshot
                  </h3>
                  <p className="mt-1 text-xs text-white/45">
                    Updated 2 hours ago · Synced across devices
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-5">
                  <RingProgress value={742} max={1000} label="Score" color="#4F8CFF" size={100} />
                  <RingProgress value={99.4} max={100} label="Percentile" color="#00E5A8" size={100} />
                  <RingProgress value={184} max={500} label="Predicted AIR" color="#F59E0B" size={100} />
                </div>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
                {/* Trend chart */}
                <div className="rounded-2xl border border-white/8 bg-background/40 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-white/40">
                        Score trend
                      </div>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-display text-2xl font-semibold text-white">742</span>
                        <span className="flex items-center gap-0.5 text-xs text-mint">
                          <ArrowUp size={11} />
                          +58 this week
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[11px]">
                      {["7D", "30D", "90D", "All"].map((t, i) => (
                        <button
                          key={t}
                          className={cn(
                            "rounded-md px-2 py-1 transition",
                            i === 0 ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
                          )}
                          data-cursor="hover"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 h-48">
                    <AreaChart />
                  </div>
                </div>

                {/* Time management */}
                <div className="rounded-2xl border border-white/8 bg-background/40 p-4">
                  <div className="text-[11px] uppercase tracking-wider text-white/40">
                    Time per question
                  </div>
                  <div className="mt-1 font-display text-2xl font-semibold text-white">
                    54s <span className="text-sm font-normal text-white/40">avg</span>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    {[
                      { label: "Easy questions", time: 32, total: 28, color: "#22C55E", count: 28 },
                      { label: "Moderate", time: 48, total: 62, color: "#4F8CFF", count: 62 },
                      { label: "Hard", time: 96, total: 14, color: "#F59E0B", count: 14 },
                      { label: "Skipped", time: 0, total: 6, color: "#EF4444", count: 6 },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center gap-3">
                        <span className="w-24 text-[11px] text-white/55">{row.label}</span>
                        <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(row.total / 110) * 100}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full rounded-full"
                            style={{ background: row.color }}
                          />
                        </div>
                        <span className="w-12 text-right font-mono text-[11px] text-white/55">
                          {row.time ? `${row.time}s` : "—"}
                        </span>
                        <span className="w-8 text-right text-[11px] text-white/40">
                          ×{row.count}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/5 pt-3 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 text-mint">
                        <CheckCircle2 size={12} />
                        <span className="font-display text-base font-semibold text-white">
                          184
                        </span>
                      </div>
                      <div className="text-[10px] text-white/40">Correct</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-danger">
                        <AlertCircle size={12} />
                        <span className="font-display text-base font-semibold text-white">
                          16
                        </span>
                      </div>
                      <div className="text-[10px] text-white/40">Incorrect</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject performance grid */}
              <div className="mt-5 rounded-2xl border border-white/8 bg-background/40 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] uppercase tracking-wider text-white/40">
                    Subject-wise performance
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-white/40">
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                      Improving
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                      Needs focus
                    </span>
                  </div>
                </div>
                <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {SUBJECT_PERFORMANCE.map((s, i) => (
                    <motion.div
                      key={s.name}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.05 * i }}
                      className="rounded-xl border border-white/5 bg-white/[0.02] p-3"
                      data-cursor="hover"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ background: s.color }}
                          />
                          <span className="text-sm text-white">{s.name}</span>
                        </div>
                        <span
                          className={cn(
                            "flex items-center gap-0.5 text-[11px] font-medium",
                            s.trend.startsWith("+") ? "text-mint" : "text-danger"
                          )}
                        >
                          {s.trend.startsWith("+") ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                          {s.trend}
                        </span>
                      </div>
                      <div className="mt-2.5 flex items-center gap-2">
                        <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/5">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${s.score}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.4, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full rounded-full"
                            style={{ background: s.color }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-white/55">{s.score}%</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { icon: Target, label: "Accuracy", value: "82.4%", color: "text-accent" },
                { icon: TrendingUp, label: "Improvement", value: "+340", color: "text-mint" },
                { icon: Clock, label: "Time used", value: "2h 48m", color: "text-warning" },
                { icon: Zap, label: "Streak", value: "12 days", color: "text-pink-400" },
              ].map((s, i) => (
                <FadeUp key={s.label} delay={0.4 + i * 0.05}>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 backdrop-blur" data-cursor="hover">
                    <s.icon size={16} className={s.color} />
                    <div className="mt-2 font-display text-xl font-semibold text-white">
                      {s.value}
                    </div>
                    <div className="text-xs text-white/50">{s.label}</div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
          </RequireAuth>
        </FadeUp>
      </div>
    </section>
  );
}
