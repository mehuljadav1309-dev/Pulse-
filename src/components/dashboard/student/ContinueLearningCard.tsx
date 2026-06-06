"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, BookOpen, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ContinueLearningCardProps = {
  title: string;
  subject: string;
  duration: string;
  progress: number;
  href: string;
  thumbnail?: string;
  badge?: string;
  variant?: "primary" | "wide" | "compact";
};

export function ContinueLearningCard({
  title,
  subject,
  duration,
  progress,
  href,
  badge = "Continue",
  variant = "primary",
}: ContinueLearningCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] transition-all duration-300 hover:border-white/20 hover:shadow-ambient",
        variant === "wide" && "md:col-span-2"
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-gradient-radial from-accent/25 to-transparent opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="relative flex h-full flex-col">
        <div className="relative aspect-[16/8] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-secondary/20 to-mint/20" />
          <div
            aria-hidden
            className="absolute inset-0 grid-bg opacity-30"
          />
          <div className="absolute inset-0 grid place-items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/95 text-background shadow-card-lift transition-transform group-hover:scale-105">
              <BookOpen size={22} />
            </div>
          </div>
          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-background/60 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-mint" />
            {badge}
          </div>
          <div className="absolute right-3 top-3 rounded-full border border-white/15 bg-background/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
            {subject}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-lg font-semibold leading-tight tracking-tight text-white">
            {title}
          </h3>
          <div className="mt-1.5 flex items-center gap-3 text-[12px] text-white/55">
            <span className="inline-flex items-center gap-1">
              <Clock size={12} /> {duration}
            </span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span>{Math.round(progress)}% complete</span>
          </div>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-accent via-mint to-accent"
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.max(2, Math.min(100, progress))}%` }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          <div className="mt-5 flex items-center justify-between">
            <Link
              href={href}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-white px-3.5 py-2 text-[12px] font-semibold text-background shadow-soft-sm transition hover:-translate-y-0.5 hover:shadow-card-lift"
            >
              Resume
              <ArrowRight size={13} />
            </Link>
            <span className="inline-flex items-center gap-1 text-[11px] text-white/50">
              <CheckCircle2 size={11} className="text-mint" />
              Auto-saved
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
