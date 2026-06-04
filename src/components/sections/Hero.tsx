"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Play, Sparkles, Star } from "lucide-react";
import { MagneticWrap } from "@/components/ui/Magnetic";
import { ParticleField } from "@/components/ui/ParticleField";
import { FadeUp } from "@/components/ui/Reveal";
import { EXAMS, STATS } from "@/lib/constants";

const Hero3D = dynamic(
  () => import("@/components/three/Hero3D").then((m) => m.Hero3D),
  { ssr: false }
);

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <section
      ref={ref}
      className="section relative min-h-[100svh] overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-bg" />
        <motion.div
          style={{ y: yBg }}
          className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-accent/15 via-accent/5 to-transparent blur-3xl"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -150]) }}
          className="absolute left-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-gradient-radial from-mint/10 via-mint/0 to-transparent blur-3xl"
        />
        <ParticleField count={40} color="rgba(255,255,255,0.35)" />
      </div>

      {/* 3D layer */}
      <motion.div
        style={{ scale, opacity }}
        className="absolute inset-0 z-0 opacity-80"
      >
        <Hero3D />
      </motion.div>

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-transparent via-transparent to-background" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-32 bg-gradient-to-b from-background to-transparent" />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="container-x relative z-10 flex min-h-[100svh] flex-col justify-center pt-28 pb-16"
      >
        <FadeUp className="flex flex-col items-center text-center" delay={0.1}>
          <div className="chip mb-6 backdrop-blur">
            <Sparkles size={12} className="text-accent" />
            <span>Built for NEET PG · INI-CET · FMGE aspirants</span>
            <span className="ml-1 flex items-center gap-0.5 text-warning">
              <Star size={10} fill="currentColor" />
              <Star size={10} fill="currentColor" />
              <Star size={10} fill="currentColor" />
              <Star size={10} fill="currentColor" />
              <Star size={10} fill="currentColor" />
            </span>
            <span className="text-white/50">4.9 · 12,400+ reviews</span>
          </div>
        </FadeUp>

        <FadeUp delay={0.2} className="text-center">
          <h1 className="font-display text-display-2xl leading-[0.92] tracking-[-0.045em] text-balance">
            <span className="block gradient-text">Crack NEET PG</span>
            <span className="mt-1 block text-white/30">&amp; INI-CET</span>
            <span className="mt-1 block">
              with{" "}
              <span className="relative inline-block">
                <span className="gradient-text-accent">AI</span>
                <svg
                  className="absolute -bottom-2 left-0 h-3 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8 C 60 2, 140 2, 198 8"
                    stroke="url(#hero-grad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <defs>
                    <linearGradient id="hero-grad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#4F8CFF" />
                      <stop offset="100%" stopColor="#00E5A8" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </span>
          </h1>
        </FadeUp>

        <FadeUp delay={0.35} className="mx-auto mt-8 max-w-2xl text-center">
          <p className="text-pretty text-lg leading-relaxed text-white/60 md:text-xl">
            25,000+ curated MCQs, 1,200+ video lectures, an AI viva simulator,
            full-length mock tests, and personalized learning paths — all in
            one intelligent workspace built for serious PG aspirants.
          </p>
        </FadeUp>

        <FadeUp delay={0.5} className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <MagneticWrap>
            <Link href="#cta" className="btn-primary group" data-cursor="hover">
              Start Learning
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </MagneticWrap>
          <MagneticWrap>
            <button type="button" className="btn-ghost" data-cursor="hover">
              <Play size={14} fill="currentColor" />
              Watch Demo
            </button>
          </MagneticWrap>
        </FadeUp>

        <FadeUp delay={0.65} className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {EXAMS.map((exam) => (
            <span key={exam} className="chip backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-mint" />
              {exam} 2026
            </span>
          ))}
        </FadeUp>

        <FadeUp delay={0.85} className="mt-auto pt-16">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur md:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="bg-background/40 p-5 text-center md:p-6"
                data-cursor="hover"
              >
                <div className="font-display text-2xl font-semibold text-white md:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1 text-xs text-white/50 md:text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </FadeUp>
      </motion.div>

      {/* Bottom gradient for next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-24 bg-gradient-to-b from-transparent to-background" />
    </section>
  );
}
