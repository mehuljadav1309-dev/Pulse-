"use client";

import { motion } from "framer-motion";
import {
  Sparkles, Mic, ListChecks, PlayCircle, Notebook, Layers, Archive, TrendingUp,
  BarChart3, Bookmark, CalendarDays, Timer, ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { FadeUp } from "@/components/ui/Reveal";
import { FEATURES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles, Mic, ListChecks, PlayCircle, Notebook, Layers, Archive, TrendingUp,
  BarChart3, Bookmark, CalendarDays, Timer,
};

function FeatureTile({ f, i, large = false }: { f: typeof FEATURES[number]; i: number; large?: boolean }) {
  const Icon = ICON_MAP[f.icon];

  return (
    <FadeUp delay={0.05 * i} className={cn("h-full", f.span)}>
      <motion.div
        className={cn(
          "group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 transition-all duration-500 hover:border-white/20",
          "flex flex-col"
        )}
        whileHover={{ y: -4 }}
        data-cursor="hover"
      >
        {/* Gradient bg */}
        <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100", f.accent)} />
        <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-radial from-white/8 to-transparent opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />

        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-center justify-between">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-white">
              <Icon size={17} />
            </span>
            <span className="text-[10px] font-mono text-white/30">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>

          <h3 className="mt-5 font-display text-lg font-semibold text-white md:text-xl">
            {f.title}
          </h3>
          <p className={cn("mt-2 text-sm leading-relaxed text-white/55", large && "md:text-base")}>
            {f.description}
          </p>

          {large && (
            <div className="mt-6 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
                <div className="font-mono text-xs text-white/40">Mode</div>
                <div className="mt-0.5 text-sm text-white">Voice · Text</div>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
                <div className="font-mono text-xs text-white/40">Powered by</div>
                <div className="mt-0.5 text-sm text-white">Pulse-LM 70B</div>
              </div>
            </div>
          )}

          <div className="mt-auto flex items-center gap-1.5 pt-6 text-xs text-white/50 transition group-hover:text-white">
            <span>Explore</span>
            <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </motion.div>
    </FadeUp>
  );
}

export function FeatureGrid() {
  return (
    <section id="features" className="section relative py-32 md:py-40">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 dot-bg opacity-20" />
      </div>

      <div className="container-x">
        <FadeUp className="mx-auto max-w-3xl text-center">
          <span className="label mb-4 inline-block">09 — Feature Grid</span>
          <h2 className="mt-4 font-display text-display-xl gradient-text text-balance">
            Twelve tools.
            <br />
            <span className="gradient-text-accent">One workspace.</span>
          </h2>
          <p className="mt-6 text-pretty text-lg text-white/55">
            Every feature is built to work together. Save a flashcard from a
            mock test, ask the AI tutor to explain it, schedule a viva for
            next week — Pulse keeps everything connected.
          </p>
        </FadeUp>

        <div className="mt-16 grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[200px]">
          {FEATURES.map((f, i) => (
            <FeatureTile key={f.title} f={f} i={i} large={i < 4} />
          ))}
        </div>
      </div>
    </section>
  );
}
