"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import { FadeUp } from "@/components/ui/Reveal";
import { MagneticWrap } from "@/components/ui/Magnetic";

function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio);
    const dpr = window.devicePixelRatio;

    type Node = { x: number; y: number; vx: number; vy: number; r: number; c: string };
    const NODES = 60;
    const nodes: Node[] = Array.from({ length: NODES }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4 * dpr,
      vy: (Math.random() - 0.5) * 0.4 * dpr,
      r: (Math.random() * 1.5 + 0.5) * dpr,
      c: Math.random() > 0.5 ? "#4F8CFF" : "#00E5A8",
    }));

    const onResize = () => {
      width = canvas.width = canvas.offsetWidth * dpr;
      height = canvas.height = canvas.offsetHeight * dpr;
    };
    window.addEventListener("resize", onResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Connections
      for (let i = 0; i < NODES; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        for (let j = i + 1; j < NODES; j++) {
          const m = nodes[j];
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140 * dpr) {
            const a = (1 - d / (140 * dpr)) * 0.25;
            ctx.strokeStyle = `rgba(79, 140, 255, ${a})`;
            ctx.lineWidth = 0.5 * dpr;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }
      }

      // Nodes
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.c;
        ctx.shadowColor = n.c;
        ctx.shadowBlur = 8 * dpr;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

export function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section id="cta" ref={ref} className="section relative overflow-hidden py-32 md:py-40">
      <div className="absolute inset-0 -z-10">
        <motion.div
          style={{ y }}
          className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-accent/15 via-mint/5 to-transparent blur-3xl"
        />
        <div className="absolute inset-0 grid-bg opacity-30" />
      </div>

      <NetworkBackground />

      <div className="container-x relative">
        <FadeUp className="mx-auto max-w-4xl text-center">
          <div className="chip mx-auto mb-6 backdrop-blur">
            <Sparkles size={12} className="text-mint" />
            7-day free trial · No credit card required
          </div>
          <h2 className="mt-4 font-display text-display-2xl leading-[0.95] tracking-[-0.04em] text-balance">
            <span className="gradient-text">Your PG seat</span>
            <br />
            <span className="gradient-text-accent">starts here.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-white/55">
            Stop juggling 14 apps, 6 textbooks and 3 coaching subscriptions.
            One intelligent workspace. Built for the next generation of Indian
            doctors. Built for you.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MagneticWrap>
              <Link href="#" className="btn-primary group" data-cursor="hover">
                Start Free Trial
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </MagneticWrap>
            <MagneticWrap>
              <Link href="#" className="btn-ghost" data-cursor="hover">
                Join Top Rankers
              </Link>
            </MagneticWrap>
          </div>

          <ul className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/55">
            {["Full access for 7 days", "Cancel anytime", "Made for India"].map((b) => (
              <li key={b} className="flex items-center gap-1.5">
                <Check size={13} className="text-mint" />
                {b}
              </li>
            ))}
          </ul>
        </FadeUp>

        <FadeUp delay={0.3} className="mt-16">
          <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur md:p-7">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { label: "Free trial", value: "7 days", desc: "Full access to every feature" },
                { label: "Most chosen", value: "Pulse Pro", desc: "₹1,499 / 3 months" },
                { label: "Best value", value: "Pulse Elite", desc: "₹3,999 / 12 months" },
              ].map((tier, i) => (
                <div
                  key={tier.label}
                  className={`relative rounded-2xl border p-4 ${
                    i === 1
                      ? "border-accent/30 bg-accent/[0.04]"
                      : "border-white/8 bg-white/[0.02]"
                  }`}
                  data-cursor="hover"
                >
                  {i === 1 && (
                    <span className="absolute -top-2 left-4 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-background">
                      POPULAR
                    </span>
                  )}
                  <div className="text-[11px] uppercase tracking-wider text-white/40">
                    {tier.label}
                  </div>
                  <div className="mt-1 font-display text-lg font-semibold text-white">
                    {tier.value}
                  </div>
                  <div className="mt-1 text-xs text-white/50">{tier.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
