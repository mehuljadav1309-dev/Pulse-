"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-spring-smooth",
        scrolled ? "py-3" : "py-5"
      )}
    >
      <div className="container-x">
        <div
          className={cn(
            "flex h-12 items-center justify-between rounded-full border px-4 transition-all duration-500 md:h-14 md:px-5",
            scrolled
              ? "border-white/10 bg-background/70 backdrop-blur-xl"
              : "border-transparent bg-transparent"
          )}
        >
          <Link href="/" className="flex items-center gap-2.5" data-cursor="hover">
            <span className="relative grid h-7 w-7 place-items-center">
              <span className="absolute inset-0 rounded-lg bg-gradient-to-br from-accent to-mint opacity-80 blur-md" />
              <span className="relative grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-accent to-mint">
                <span className="font-display text-sm font-bold text-background">P</span>
              </span>
            </span>
            <span className="font-display text-[15px] font-semibold tracking-tight text-white">
              Pulse
            </span>
            <span className="hidden rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-white/60 sm:inline-block">
              PG
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                data-cursor="hover"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="rounded-full px-4 py-2 text-sm text-white/70 transition-colors hover:text-white"
                  data-cursor="hover"
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button type="button" className="btn-primary" data-cursor="hover">
                  Start free
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <div className="ml-1 flex items-center">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9 ring-1 ring-white/10",
                    },
                  }}
                />
              </div>
            </SignedIn>
          </div>

          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((s) => !s)}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 md:hidden"
            data-cursor="hover"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="container-x mt-2 md:hidden"
          >
            <div className="rounded-2xl border border-white/10 bg-background/95 p-2 backdrop-blur-xl">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm text-white/80 hover:bg-white/5"
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/5 pt-2">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className="rounded-xl bg-white/5 py-2.5 text-center text-sm text-white/80"
                    >
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button type="button" className="btn-primary text-sm">
                      Start free
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <div className="col-span-2 flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                    <span className="text-sm text-white/80">Account</span>
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: { avatarBox: "h-8 w-8 ring-1 ring-white/10" },
                      }}
                    />
                  </div>
                </SignedIn>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
