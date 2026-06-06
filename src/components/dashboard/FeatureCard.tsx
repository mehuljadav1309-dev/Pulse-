"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { DashboardFeature } from "@/lib/features";
import { cn } from "@/lib/utils";
import { getFeatureIcon } from "./featureIcons";

const STATUS_LABEL: Record<DashboardFeature["status"], string> = {
  live: "Live",
  beta: "Beta",
  coming: "Soon",
};

const STATUS_STYLE: Record<DashboardFeature["status"], string> = {
  live: "bg-mint/15 text-mint border-mint/30",
  beta: "bg-warning/15 text-warning border-warning/30",
  coming: "bg-white/5 text-white/50 border-white/10",
};

export function FeatureCard({
  feature,
  index = 0,
  size = "md",
}: {
  feature: DashboardFeature;
  index?: number;
  size?: "sm" | "md" | "lg";
}) {
  const Icon = getFeatureIcon(feature.iconName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className={cn("h-full", size === "lg" && "sm:col-span-2 lg:col-span-2")}
    >
      <Link
        href={feature.href}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-5 transition-all duration-500",
          "hover:border-white/20 hover:shadow-ambient"
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100",
            feature.accent
          )}
        />
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-radial from-white/10 to-transparent opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />

        <div className="relative z-10 flex items-start justify-between gap-3">
          <span
            className={cn(
              "grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white",
              feature.ring,
              "ring-1"
            )}
          >
            <Icon size={17} />
          </span>
          <div className="flex flex-col items-end gap-1.5">
            {feature.badge && (
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[10px] font-medium text-white/70">
                {feature.badge}
              </span>
            )}
            <span
              className={cn(
                "rounded-full border px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider",
                STATUS_STYLE[feature.status]
              )}
            >
              {STATUS_LABEL[feature.status]}
            </span>
          </div>
        </div>

        <div className="relative z-10 mt-5 flex-1">
          <h3 className="font-display text-base font-semibold tracking-tight text-white md:text-lg">
            {feature.title}
          </h3>
          <p className="mt-1 text-[13px] font-medium text-white/55">
            {feature.short}
          </p>
          {size !== "sm" && (
            <p className="mt-2.5 text-sm leading-relaxed text-white/55">
              {feature.description}
            </p>
          )}
        </div>

        {size === "lg" && (
          <ul className="relative z-10 mt-5 grid grid-cols-1 gap-1.5 sm:grid-cols-3">
            {feature.highlights.map((h) => (
              <li
                key={h}
                className="rounded-lg border border-white/8 bg-white/[0.02] px-2.5 py-1.5 text-[11px] text-white/70"
              >
                {h}
              </li>
            ))}
          </ul>
        )}

        <div className="relative z-10 mt-5 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/45 transition group-hover:text-white">
            Open
            <ArrowUpRight
              size={12}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
          <span className="rounded-md bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-white/35">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export function FeatureHeader({
  feature,
  status,
}: {
  feature: DashboardFeature;
  status?: "live" | "beta" | "coming";
}) {
  const Icon = getFeatureIcon(feature.iconName);
  const s = status ?? feature.status;
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 md:p-8">
      <div
        className={cn(
          "pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-radial opacity-60 blur-3xl",
          feature.accent
        )}
      />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <span
            className={cn(
              "grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-white",
              feature.ring,
              "ring-1"
            )}
          >
            <Icon size={20} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="label">{feature.group}</span>
              <span
                className={cn(
                  "rounded-full border px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider",
                  STATUS_STYLE[s]
                )}
              >
                {STATUS_LABEL[s]}
              </span>
            </div>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-white md:text-3xl">
              {feature.title}
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-white/55">
              {feature.description}
            </p>
          </div>
        </div>
        <ul className="flex flex-wrap items-center gap-1.5 md:justify-end">
          {feature.highlights.map((h) => (
            <li
              key={h}
              className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/70"
            >
              {h}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
