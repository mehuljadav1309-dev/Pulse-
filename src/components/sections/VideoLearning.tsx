"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Play, Clock, BookOpen, Heart, Brain, Stethoscope } from "lucide-react";
import { FadeUp } from "@/components/ui/Reveal";
import { RequireAuth } from "@/components/ui/RequireAuth";

const VideoScene = dynamic(
  () => import("@/components/three/VideoScene").then((m) => m.VideoScene),
  { ssr: false }
);

const LESSONS = [
  { icon: Heart, title: "Coronary circulation", subject: "Anatomy", duration: "18:24", color: "#EF4444" },
  { icon: Brain, title: "Cranial nerves — clinical", subject: "Neuroanatomy", duration: "24:10", color: "#A78BFA" },
  { icon: Stethoscope, title: "Auscultation findings", subject: "Medicine", duration: "12:48", color: "#4F8CFF" },
  { icon: BookOpen, title: "Embryology — pharyngeal arches", subject: "Anatomy", duration: "21:05", color: "#00E5A8" },
];

export function VideoLearning() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [12, 0, -8]);
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section id="video" ref={ref} className="section relative py-32 md:py-40">
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-1/4 top-0 h-[500px] w-[500px] rounded-full bg-gradient-radial from-danger/10 to-transparent blur-3xl" />
        <div className="absolute left-0 top-1/2 h-[500px] w-[500px] rounded-full bg-gradient-radial from-mint/10 to-transparent blur-3xl" />
      </div>

      <div className="container-x">
        <FadeUp className="mx-auto max-w-3xl text-center">
          <span className="label mb-4 inline-block">04 — Video Learning</span>
          <h2 className="mt-4 font-display text-display-xl gradient-text text-balance">
            Watch the surgery before{" "}
            <span className="gradient-text-accent">you read the textbook.</span>
          </h2>
          <p className="mt-6 text-pretty text-lg text-white/55">
            1,200+ high-yield lectures, surgical walkthroughs, and clinical
            case discussions — filmed in 4K with real cadaveric specimens and
            AI-generated annotations.
          </p>
        </FadeUp>

        <RequireAuth
          title="Sign in to watch surgical walkthroughs"
          description="1,200+ high-yield lectures filmed in 4K with real cadaveric specimens and AI-generated annotations."
          cta="Sign in to start watching"
        >
          <div className="relative mt-20 grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          {/* 3D Laptop */}
          <div className="relative aspect-[5/4] w-full" style={{ perspective: "1600px" }}>
            <motion.div
              style={{ rotateX, y, transformStyle: "preserve-3d" }}
              className="absolute inset-0"
            >
              <VideoScene />
            </motion.div>

            {/* Floating lesson chips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -left-2 top-12 z-20 hidden lg:block"
              style={{ animation: "floatSlow 7s ease-in-out infinite" }}
            >
              <div className="glass rounded-2xl p-3 shadow-card-lift">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-md bg-danger/15 text-danger">
                    <Heart size={14} />
                  </span>
                  <div>
                    <div className="text-xs font-medium text-white">CABG procedure</div>
                    <div className="text-[10px] text-white/40">Surgery · 42:18</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -right-2 bottom-16 z-20 hidden lg:block"
              style={{ animation: "float 8s ease-in-out infinite 1s" }}
            >
              <div className="glass rounded-2xl p-3 shadow-card-lift">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-md bg-mint/15 text-mint">
                    <Stethoscope size={14} />
                  </span>
                  <div>
                    <div className="text-xs font-medium text-white">Auscultation — basics</div>
                    <div className="text-[10px] text-white/40">Medicine · 18:42</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Lessons list */}
          <div>
            <div className="space-y-2.5">
              {LESSONS.map((l, i) => {
                return (
                  <FadeUp key={l.title} delay={i * 0.08}>
                    <div
                      className="group flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-3 transition hover:border-white/15 hover:bg-white/[0.04]"
                      data-cursor="hover"
                    >
                      <div
                        className="relative grid h-12 w-20 shrink-0 place-items-center overflow-hidden rounded-lg"
                        style={{ background: `${l.color}15` }}
                      >
                        <div
                          className="absolute inset-0 opacity-30"
                          style={{
                            background: `radial-gradient(circle at 30% 30%, ${l.color}, transparent 60%)`,
                          }}
                        />
                        <div className="grid h-7 w-7 place-items-center rounded-full bg-white text-black">
                          <Play size={11} fill="currentColor" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-white">{l.title}</div>
                        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-white/40">
                          <span>{l.subject}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {l.duration}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="opacity-30 transition group-hover:opacity-100" size={16} />
                    </div>
                  </FadeUp>
                );
              })}
            </div>

            <FadeUp delay={0.4} className="mt-6">
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/55">Lecture progress this week</span>
                  <span className="font-medium text-mint">62%</span>
                </div>
                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "62%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-accent to-mint"
                  />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3 text-center text-[11px]">
                  <div>
                    <div className="font-display text-lg font-semibold text-white">12</div>
                    <div className="text-white/40">Hours watched</div>
                  </div>
                  <div>
                    <div className="font-display text-lg font-semibold text-white">38</div>
                    <div className="text-white/40">Lectures</div>
                  </div>
                  <div>
                    <div className="font-display text-lg font-semibold text-white">7d</div>
                    <div className="text-white/40">Streak</div>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
          </div>
        </RequireAuth>
      </div>

      <style jsx>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </section>
  );
}

function ChevronRight({ className, size }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || 16}
      height={size || 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
