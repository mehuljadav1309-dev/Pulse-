"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  duration?: number;
  once?: boolean;
}

export function FadeUp({
  children,
  delay = 0,
  className,
  y = 32,
  duration = 0.9,
  once = true,
}: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Parallax({
  children,
  speed = 0.3,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, -speed * 100]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
