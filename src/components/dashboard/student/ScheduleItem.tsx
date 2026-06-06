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
        "group flex items-center gap-3 rounded-xl border p-3 transition-all duration-200",
        status === "current"
          ? "border-accent/30 bg-accent/[0.06] shadow-[inset_0_1px_0_rgba(79,140,255,0.1)]"
          : status === "done"
          ? "border-white/[0.04] bg-white/[0.02]"
          : "border-white/[0.06] bg-white/[0.02]"
      )}
    >
      <span
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[11px] font-bold uppercase tracking-wider",
          status === "current"
            ? "bg-gradient-to-br from-accent to-mint text-background shadow-glow-accent"
            : status === "done"
            ? "bg-mint/15 text-mint"
            : "border border-white/10 bg-white/[0.04] text-white/55"
        )}
      >
        {day}
      </span>
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "truncate text-[13.5px] font-semibold",
            status === "done" ? "text-white/45 line-through" : "text-white"
          )}
        >
          {focus}
        </div>
        {time && (
          <div
            className={cn(
              "mt-0.5 text-[11px]",
              status === "current" ? "text-accent" : "text-white/45"
            )}
          >
            {time}
          </div>
        )}
      </div>
      <span
        className={cn(
          "grid h-7 w-7 shrink-0 place-items-center rounded-full",
          status === "done" && "bg-mint/15 text-mint",
          status === "current" && "bg-accent text-background",
          status === "upcoming" && "border border-white/10 text-white/30"
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
