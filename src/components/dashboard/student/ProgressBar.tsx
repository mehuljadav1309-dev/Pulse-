"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  label?: string;
  detail?: string;
  gradient?: string;
  index?: number;
};

export function ProgressBar({
  value,
  label,
  detail,
  gradient = "from-accent to-mint",
  index = 0,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-1.5"
    >
      {(label || detail) && (
        <div className="flex items-center justify-between text-[12px]">
          <span className="font-semibold text-white">{label}</span>
          {detail && <span className="font-semibold text-white/55">{detail}</span>}
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className={cn("h-full rounded-full bg-gradient-to-r", gradient)}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.div>
  );
}
