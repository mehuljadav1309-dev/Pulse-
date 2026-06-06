"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "mb-5 flex flex-wrap items-end justify-between gap-3",
        className
      )}
    >
      <div>
        {eyebrow && <span className="label">{eyebrow}</span>}
        <h2 className="mt-1 font-display text-xl font-bold tracking-tight text-white md:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-1 max-w-xl text-[13.5px] text-white/55">{description}</p>
        )}
      </div>
      {action}
    </motion.div>
  );
}
