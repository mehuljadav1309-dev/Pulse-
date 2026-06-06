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
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-5 transition-all duration-300 hover:border-white/20 hover:shadow-ambient"
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-radial opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100",
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
              "rounded-full border px-2 py-0.5 text-[10px] font-bold",
              deltaTone === "up" && "border-mint/30 bg-mint/10 text-mint",
              deltaTone === "down" && "border-danger/30 bg-danger/10 text-danger",
              deltaTone === "neutral" && "border-white/10 bg-white/[0.05] text-white/65"
            )}
          >
            {delta}
          </span>
        )}
      </div>
      <div className="relative mt-4 font-display text-3xl font-bold tracking-tight text-white">
        <Counter value={value} prefix={prefix} suffix={suffix} format={format} />
      </div>
      <div className="relative mt-0.5 text-[12px] font-semibold text-white/55">
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
