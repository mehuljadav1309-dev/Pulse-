"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Quote, Star, TrendingUp, Trophy } from "lucide-react";
import { FadeUp } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { SUCCESS_STORIES } from "@/lib/constants";

const COLORS = [
  "from-accent to-mint",
  "from-mint to-emerald-400",
  "from-warning to-danger",
  "from-pink-500 to-purple-500",
  "from-cyan-400 to-accent",
];

function StoryCard({ s, color }: { s: typeof SUCCESS_STORIES[number]; color: string }) {
  return (
    <div
      className="group relative w-[340px] shrink-0 md:w-[400px]"
      data-cursor="hover"
    >
      <div className="relative h-full rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 shadow-card-lift">
        <div className="absolute -top-3 left-6 grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br text-background">
          <div className={cn("absolute inset-0 rounded-full bg-gradient-to-br", color)} />
          <Quote size={12} className="relative fill-current" />
        </div>

        <div className="flex items-center gap-3">
          <div
            className={cn(
              "grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br font-display text-sm font-semibold text-background",
              color
            )}
          >
            {s.image}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{s.name}</div>
            <div className="text-[11px] text-white/50">{s.college}</div>
          </div>
          <div className="ml-auto flex flex-col items-end">
            <div className="flex items-center gap-0.5 text-warning">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} size={10} fill="currentColor" />
              ))}
            </div>
          </div>
        </div>

        <p className="mt-4 text-pretty text-[13px] leading-relaxed text-white/75">
          "Pulse was the only platform I needed. The AI tutor explained renal
          physiology like a real professor — and the mock tests predicted my
          rank within 8 positions. I went from AIR 1852 to{" "}
          <span className="font-semibold text-white">AIR 12</span>."
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/5 pt-4 text-center">
          <div>
            <div className="font-display text-base font-semibold text-mint">{s.improvement}</div>
            <div className="text-[10px] text-white/40">Rank jump</div>
          </div>
          <div>
            <div className="font-display text-base font-semibold text-white">{s.rank}</div>
            <div className="text-[10px] text-white/40">Final</div>
          </div>
          <div>
            <div className="font-display text-base font-semibold text-accent">{s.exam}</div>
            <div className="text-[10px] text-white/40">Exam</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SuccessStories() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section ref={ref} className="section relative overflow-hidden py-32 md:py-40">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-bg opacity-30" />
      </div>

      <div className="container-x">
        <FadeUp className="mx-auto max-w-3xl text-center">
          <span className="label mb-4 inline-block">08 — Success Stories</span>
          <h2 className="mt-4 font-display text-display-xl gradient-text text-balance">
            12,400+ aspirants.
            <br />
            <span className="gradient-text-accent">94% selection rate.</span>
          </h2>
          <p className="mt-6 text-pretty text-lg text-white/55">
            Real students, real ranks. See how Pulse users went from anxious
            first-year interns to AIIMS, PGI, JIPMER and beyond.
          </p>
        </FadeUp>
      </div>

      {/* Marquee Row 1 */}
      <motion.div style={{ y: y1 }} className="relative mt-16">
        <div className="mask-fade-x flex gap-4 overflow-hidden">
          <div className="flex shrink-0 animate-marquee gap-4 pr-4">
            {[...SUCCESS_STORIES, ...SUCCESS_STORIES].map((s, i) => (
              <StoryCard key={`a-${i}`} s={s} color={COLORS[i % COLORS.length]} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Marquee Row 2 (reverse) */}
      <motion.div style={{ y: y2 }} className="relative mt-6">
        <div className="mask-fade-x flex gap-4 overflow-hidden">
          <div className="flex shrink-0 animate-marquee-reverse gap-4 pr-4">
            {[...SUCCESS_STORIES.slice().reverse(), ...SUCCESS_STORIES.slice().reverse()].map((s, i) => (
              <StoryCard key={`b-${i}`} s={s} color={COLORS[(i + 2) % COLORS.length]} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom highlight */}
      <FadeUp delay={0.3} className="container-x mt-16">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { icon: Trophy, label: "AIIMS Delhi", value: "47 selected" },
            { icon: TrendingUp, label: "Avg improvement", value: "+1,200 ranks" },
            { icon: Star, label: "App rating", value: "4.9 / 5.0" },
            { icon: Trophy, label: "PGI Chandigarh", value: "32 selected" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 text-center backdrop-blur"
              data-cursor="hover"
            >
              <s.icon size={16} className="mx-auto text-accent" />
              <div className="mt-2 font-display text-lg font-semibold text-white">
                {s.value}
              </div>
              <div className="text-[11px] text-white/50">{s.label}</div>
            </div>
          ))}
        </div>
      </FadeUp>
    </section>
  );
}
