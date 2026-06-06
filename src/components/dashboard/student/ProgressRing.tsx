"use client";

import { useId } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type ProgressRingProps = {
  value: number;
  size?: number;
  stroke?: number;
  className?: string;
  trackClassName?: string;
  progressClassName?: string;
  duration?: number;
  showLabel?: boolean;
  label?: React.ReactNode;
  trackColor?: string;
  fromColor?: string;
  toColor?: string;
  glow?: boolean;
};

export function ProgressRing({
  value,
  size = 96,
  stroke = 9,
  className,
  trackClassName,
  progressClassName,
  duration = 1.4,
  showLabel = true,
  label,
  trackColor = "rgba(255,255,255,0.08)",
  fromColor = "#4F8CFF",
  toColor = "#00E5A8",
  glow = true,
}: ProgressRingProps) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const dashOffset = circumference - (clamped / 100) * circumference;
  const gradId = `pg-${id}`;

  return (
    <div
      ref={ref}
      className={cn("relative inline-grid place-items-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 -rotate-90"
        width={size}
        height={size}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={fromColor} />
            <stop offset="100%" stopColor={toColor} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={
            inView ? { strokeDashoffset: dashOffset } : { strokeDashoffset: circumference }
          }
          transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
          style={
            glow
              ? { filter: `drop-shadow(0 4px 10px ${fromColor}55)` }
              : undefined
          }
          className={progressClassName}
        />
      </svg>
      {showLabel && (
        <div className="relative z-10 text-center">
          <div className="font-display text-lg font-bold tracking-tight text-white">
            {label ?? `${Math.round(clamped)}%`}
          </div>
        </div>
      )}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-1 rounded-full bg-gradient-to-br from-white/15 to-transparent opacity-50",
          trackClassName
        )}
      />
    </div>
  );
}
