"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: React.ReactNode;
  gradient: string;
  format?: (n: number) => string;
  delta?: string;
  deltaTone?: "up" | "down" | "neutral";
  index?: number;
};

export function StatCard({
  label,
  value,
  suffix,
  prefix,
  icon,
  gradient,
  format,
  delta,
  deltaTone = "up",
  index = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-3xl border border-soft-border bg-white p-5 shadow-soft-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-md"
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-radial opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-70",
          gradient
        )}
      />
      <div className="relative flex items-center justify-between">
        <span
          className={cn(
            "icon-tile",
            `bg-gradient-to-br ${gradient}`,
            "h-10 w-10"
          )}
          style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.85rem" }}
        >
          {icon}
        </span>
        {delta && (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-bold",
              deltaTone === "up" && "bg-success/10 text-success",
              deltaTone === "down" && "bg-pink-100 text-pink-700",
              deltaTone === "neutral" && "bg-soft text-ink-muted"
            )}
          >
            {delta}
          </span>
        )}
      </div>
      <div className="relative mt-4 font-display text-3xl font-bold tracking-tight text-ink">
        <Counter value={value} prefix={prefix} suffix={suffix} format={format} />
      </div>
      <div className="relative mt-0.5 text-[12px] font-semibold text-ink-soft">
        {label}
      </div>
    </motion.div>
  );
}

function Counter({
  value,
  prefix,
  suffix,
  format,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  format?: (n: number) => string;
}) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="tabular-nums"
    >
      {prefix}
      {format ? format(value) : value.toLocaleString()}
      {suffix}
    </motion.span>
  );
}
