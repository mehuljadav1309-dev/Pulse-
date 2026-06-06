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
      ? "from-warning/20 via-warning/5 to-transparent border-warning/30"
      : variant === "success"
      ? "from-mint/20 via-mint/5 to-transparent border-mint/30"
      : "from-accent/15 via-mint/5 to-transparent border-accent/20";

  const iconBg =
    variant === "warning"
      ? "from-warning to-danger"
      : variant === "success"
      ? "from-mint to-accent"
      : "from-accent to-mint";

  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative block overflow-hidden rounded-2xl border bg-gradient-to-br p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-ambient",
        styles
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl"
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
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
            AI Insight
          </div>
          <div className="mt-0.5 text-[13.5px] font-semibold text-white">
            {title}
          </div>
          <p className="mt-1 text-[12.5px] leading-relaxed text-white/65">
            {message}
          </p>
          <span className="mt-2.5 inline-flex items-center gap-1 text-[12px] font-semibold text-white/85 transition group-hover:text-white">
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
