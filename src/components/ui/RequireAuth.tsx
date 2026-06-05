"use client";

import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Lock, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type RequireAuthProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  cta?: string;
  className?: string;
};

export function RequireAuth({
  children,
  title = "Sign in to unlock this feature",
  description = "Pulse is free for medical PG aspirants. Create an account to access the question bank, AI tutor, mock tests, viva simulator, and your personalized dashboard.",
  cta = "Sign in to continue",
  className,
}: RequireAuthProps) {
  return (
    <>
      <SignedIn>
        <div className={className}>{children}</div>
      </SignedIn>
      <SignedOut>
        <div
          className={cn(
            "relative isolate flex min-h-[440px] items-center justify-center",
            className
          )}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 select-none overflow-hidden rounded-3xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-white/[0.01]" />
            <div className="absolute inset-0 backdrop-blur-[2px]" />
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-accent/15 to-transparent blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong relative z-10 mx-auto w-full max-w-md rounded-3xl p-8 text-center"
          >
            <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-accent/20 to-mint/20 ring-1 ring-white/10">
              <Lock className="h-5 w-5 text-white/80" />
            </div>

            <h3 className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {title}
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/60">
              {description}
            </p>

            <SignInButton mode="modal">
              <button
                type="button"
                data-cursor="hover"
                className="btn-primary mt-6 w-full"
              >
                <span>{cta}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </SignInButton>

            <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-white/40">
              <Sparkles className="h-3 w-3" />
              <span>Free for PG aspirants</span>
            </div>
          </motion.div>
        </div>
      </SignedOut>
    </>
  );
}
