"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle2, Timer, Circle } from "lucide-react";

type ScheduleItemProps = {
  day: string;
  focus: string;
  time?: string;
  status: "done" | "current" | "upcoming";
  index?: number;
};

export function ScheduleItem({
  day,
  focus,
  time,
  status,
  index = 0,
}: ScheduleItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group flex items-center gap-3 rounded-2xl border p-3 transition-all duration-200",
        status === "current"
          ? "border-primary/30 bg-gradient-to-r from-primary-50 via-white to-cyan-50 shadow-soft-sm"
          : status === "done"
          ? "border-soft-border bg-soft/50"
          : "border-soft-border bg-white"
      )}
    >
      <span
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[11px] font-bold uppercase tracking-wider",
          status === "current"
            ? "bg-gradient-to-br from-primary to-secondary text-white shadow-soft-sm"
            : status === "done"
            ? "bg-success/10 text-success"
            : "bg-soft text-ink-soft"
        )}
      >
        {day}
      </span>
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "truncate text-[13.5px] font-semibold",
            status === "done" ? "text-ink-muted line-through" : "text-ink"
          )}
        >
          {focus}
        </div>
        {time && (
          <div className="mt-0.5 text-[11px] text-ink-soft">{time}</div>
        )}
      </div>
      <span
        className={cn(
          "grid h-7 w-7 shrink-0 place-items-center rounded-full",
          status === "done" && "bg-success/15 text-success",
          status === "current" && "bg-primary text-white",
          status === "upcoming" && "border border-soft-border text-ink-faint"
        )}
      >
        {status === "done" ? (
          <CheckCircle2 size={13} />
        ) : status === "current" ? (
          <Timer size={13} />
        ) : (
          <Circle size={12} />
        )}
      </span>
    </motion.div>
  );
}
