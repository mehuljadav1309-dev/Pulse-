"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type AIInsightProps = {
  title: string;
  message: string;
  href?: string;
  cta?: string;
  variant?: "tip" | "warning" | "success";
  index?: number;
};

export function AIInsight({
  title,
  message,
  href = "/dashboard/ai-tutor",
  cta = "Open",
  variant = "tip",
  index = 0,
}: AIInsightProps) {
  const styles =
    variant === "warning"
      ? "from-warning/15 to-pink-100 border-warning/30"
      : variant === "success"
      ? "from-success/15 to-cyan-100 border-success/30"
      : "from-primary-50 to-cyan-50 border-primary/20";

  const iconBg =
    variant === "warning"
      ? "from-warning to-pink-500"
      : variant === "success"
      ? "from-success to-cyan-500"
      : "from-primary to-secondary";

  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative block overflow-hidden rounded-3xl border bg-gradient-to-br p-4 shadow-soft-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-md",
        styles
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/40 blur-2xl"
      />
      <div className="relative flex items-start gap-3">
        <span
          className={cn(
            "icon-tile shrink-0",
            `bg-gradient-to-br ${iconBg}`,
            "h-10 w-10"
          )}
          style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.85rem" }}
        >
          <Sparkles size={14} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
            AI Insight
          </div>
          <div className="mt-0.5 text-[13.5px] font-semibold text-ink">
            {title}
          </div>
          <p className="mt-1 text-[12.5px] leading-relaxed text-ink-muted">
            {message}
          </p>
          <span className="mt-2.5 inline-flex items-center gap-1 text-[12px] font-semibold text-primary">
            {cta}
            <ArrowRight
              size={12}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </motion.a>
  );
}
