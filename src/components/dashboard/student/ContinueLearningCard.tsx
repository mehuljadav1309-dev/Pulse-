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
        "group relative overflow-hidden rounded-3xl border border-soft-border bg-white shadow-soft-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg",
        variant === "wide" && "md:col-span-2"
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-gradient-radial from-primary/20 to-transparent opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="relative flex h-full flex-col">
        <div className="relative aspect-[16/8] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-cyan" />
          <div
            aria-hidden
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0, transparent 35%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.3) 0, transparent 35%)",
            }}
          />
          <div className="absolute inset-0 grid place-items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/95 text-primary shadow-soft-lg transition-transform group-hover:scale-105">
              <BookOpen size={22} />
            </div>
          </div>
          <div className="absolute left-3 top-3 chip-light">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            {badge}
          </div>
          <div className="absolute right-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-bold text-primary backdrop-blur">
            {subject}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-lg font-semibold leading-tight tracking-tight text-ink">
            {title}
          </h3>
          <div className="mt-1.5 flex items-center gap-3 text-[12px] text-ink-soft">
            <span className="inline-flex items-center gap-1">
              <Clock size={12} /> {duration}
            </span>
            <span className="h-1 w-1 rounded-full bg-ink-faint" />
            <span>{Math.round(progress)}% complete</span>
          </div>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-soft">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-cyan"
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.max(2, Math.min(100, progress))}%` }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          <div className="mt-5 flex items-center justify-between">
            <Link
              href={href}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-ink px-3.5 py-2 text-[12px] font-semibold text-white shadow-soft-sm transition hover:-translate-y-0.5 hover:shadow-soft-md"
            >
              Resume
              <ArrowRight size={13} />
            </Link>
            <span className="inline-flex items-center gap-1 text-[11px] text-ink-faint">
              <CheckCircle2 size={11} className="text-success" />
              Auto-saved
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
