"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type QuickActionCardProps = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  ringClass?: string;
  badge?: string;
  progress?: number;
  cta?: string;
  index?: number;
};

export function QuickActionCard({
  href,
  label,
  description,
  icon: Icon,
  gradient,
  ringClass,
  badge,
  progress,
  cta = "Open",
  index = 0,
}: QuickActionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={href}
        className="group relative block h-full overflow-hidden rounded-3xl border border-soft-border bg-white p-4 shadow-soft-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-soft-lg"
      >
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-radial opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-60",
            gradient
          )}
        />
        <div className="relative flex items-start gap-3">
          <span
            className={cn(
              "icon-tile shrink-0",
              `bg-gradient-to-br ${gradient}`,
              ringClass
            )}
            style={{ width: "3rem", height: "3rem", borderRadius: "1rem" }}
          >
            <Icon size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-[15px] font-semibold tracking-tight text-ink">
                {label}
              </h3>
              {badge && (
                <span className="rounded-full bg-soft px-2 py-0.5 text-[10px] font-semibold text-primary">
                  {badge}
                </span>
              )}
            </div>
            <p className="mt-0.5 line-clamp-2 text-[12.5px] leading-snug text-ink-soft">
              {description}
            </p>
          </div>
        </div>

        {typeof progress === "number" && (
          <div className="relative mt-4">
            <div className="flex items-center justify-between text-[10px] font-semibold text-ink-faint">
              <span>Progress</span>
              <span className="text-ink-muted">{Math.round(progress)}%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-soft">
              <div
                className={cn("h-full rounded-full bg-gradient-to-r", gradient)}
                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
              />
            </div>
          </div>
        )}

        <div className="relative mt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary">
            {cta}
            <ArrowRight
              size={13}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </span>
          <span className="rounded-md bg-soft px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
