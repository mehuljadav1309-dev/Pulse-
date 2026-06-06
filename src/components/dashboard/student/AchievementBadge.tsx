"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AchievementBadgeProps = {
  emoji?: string;
  title: string;
  description?: string;
  unlocked?: boolean;
  progress?: number;
  gradient: string;
  size?: "sm" | "md" | "lg";
  index?: number;
};

export function AchievementBadge({
  emoji,
  title,
  description,
  unlocked = true,
  progress,
  gradient,
  size = "md",
  index = 0,
}: AchievementBadgeProps) {
  const dimensions =
    size === "lg"
      ? "h-24 w-24"
      : size === "sm"
      ? "h-14 w-14"
      : "h-20 w-20";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col items-center text-center"
    >
      <div
        className={cn(
          "relative grid place-items-center rounded-3xl border border-soft-border bg-white shadow-soft-sm transition-all duration-300",
          dimensions,
          unlocked
            ? "hover:-translate-y-1 hover:shadow-soft-md"
            : "opacity-50 grayscale"
        )}
      >
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-2 rounded-2xl bg-gradient-to-br opacity-25 blur-md",
            gradient
          )}
        />
        <div
          className={cn(
            "relative grid h-3/4 w-3/4 place-items-center rounded-2xl bg-gradient-to-br text-2xl shadow-soft-xs",
            gradient
          )}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/35 to-transparent"
          />
          <span className="relative">{emoji ?? "🏆"}</span>
        </div>
        {unlocked && (
          <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-success text-[10px] font-bold text-white shadow-soft-sm">
            ✓
          </span>
        )}
        {!unlocked && typeof progress === "number" && (
          <div className="absolute -bottom-2 left-1/2 w-3/4 -translate-x-1/2">
            <div className="h-1 overflow-hidden rounded-full bg-soft">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-cyan"
                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 px-1">
        <div className="text-[12px] font-semibold text-ink">{title}</div>
        {description && (
          <div className="mt-0.5 text-[11px] text-ink-soft">{description}</div>
        )}
      </div>
    </motion.div>
  );
}
