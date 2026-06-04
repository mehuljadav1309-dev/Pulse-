"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let raf = 0;
    const start = performance.now();
    const duration = 1500;

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      // ease out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(eased * 100);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 350);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background"
        >
          <div className="absolute inset-0 grid-bg opacity-50" />
          <div className="relative z-10 flex flex-col items-center gap-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex h-14 w-14 items-center justify-center"
            >
              <span className="absolute inset-0 rounded-full border border-white/10" />
              <motion.span
                className="absolute inset-0 rounded-full border-t border-accent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              />
              <span className="font-display text-lg font-semibold text-white">P</span>
            </motion.div>
            <div className="flex flex-col items-center gap-3">
              <div className="h-px w-48 overflow-hidden bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent via-mint to-accent"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex w-48 items-center justify-between text-[10px] font-medium tracking-[0.2em] text-white/40">
                <span>PULSE</span>
                <span>{Math.round(progress).toString().padStart(3, "0")}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
