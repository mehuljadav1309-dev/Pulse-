"use client";

import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, Sparkles, BookOpen, Brain, GraduationCap, Search, Volume2 } from "lucide-react";
import { FadeUp } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const CONVERSATION = [
  {
    role: "user",
    text: "Explain nephrotic syndrome. Why is there edema?",
  },
  {
    role: "ai",
    text: "Nephrotic syndrome results from damage to the glomerular filtration barrier, leading to massive proteinuria (>3.5 g/day). The downstream cascade looks like this:",
  },
  {
    role: "ai",
    type: "list",
    items: [
      "Hypoalbuminemia → reduced plasma oncotic pressure",
      "Fluid shifts from intravascular → interstitial space",
      "Reduced effective circulating volume → RAAS activation",
      "Sodium and water retention → worsening edema",
    ],
  },
  {
    role: "ai",
    text: "Clinically you'll see periorbital edema in the morning, pitting edema in the lower limbs by evening, and possibly anasarca. Workup includes 24-hr urinary protein, serum albumin, lipid profile, and a renal biopsy to identify the underlying cause (MCD, FSGS, MN, MPGN).",
  },
];

const SUGGESTIONS = [
  "Why does H. pylori cause gastric ulcers?",
  "Mechanism of insulin resistance",
  "Side effects of beta-blockers",
  "Interpret this ECG: anterior STEMI",
];

const MODES = [
  { id: "explain", label: "Explain", icon: GraduationCap },
  { id: "compare", label: "Compare", icon: Brain },
  { id: "mcq", label: "Quiz me", icon: BookOpen },
  { id: "summarize", label: "Summarize", icon: Sparkles },
];

export function AITutor() {
  const [typingText, setTypingText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [activeMode, setActiveMode] = useState("explain");

  useEffect(() => {
    let i = 0;
    const text = CONVERSATION[1].text ?? "";
    setTypingText("");
    setTypingDone(false);
    const id = setInterval(() => {
      i++;
      setTypingText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setTypingDone(true);
      }
    }, 18);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="ai-tutor" className="section relative py-32 md:py-40">
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-0 top-1/3 h-[600px] w-[600px] rounded-full bg-gradient-radial from-mint/10 to-transparent blur-3xl" />
        <div className="absolute left-0 bottom-0 h-[500px] w-[500px] rounded-full bg-gradient-radial from-accent/10 to-transparent blur-3xl" />
        <div className="absolute inset-0 dot-bg opacity-20" />
      </div>

      <div className="container-x">
        <FadeUp className="mx-auto max-w-3xl text-center">
          <span className="label mb-4 inline-block">05 — AI Medical Tutor</span>
          <h2 className="mt-4 font-display text-display-xl gradient-text text-balance">
            Your personal{" "}
            <span className="gradient-text-accent">medical professor</span>,
            on call 24/7.
          </h2>
          <p className="mt-6 text-pretty text-lg text-white/55">
            Ask anything from renal physiology to surgical procedures. Get
            answers grounded in standard textbooks, with citations, diagrams,
            and clinical reasoning you can actually use in an exam.
          </p>
        </FadeUp>

        <div className="mt-20 grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
          {/* Feature list */}
          <FadeUp delay={0.1} className="lg:pt-12">
            <div className="space-y-6">
              {[
                {
                  icon: GraduationCap,
                  title: "Textbook-grounded",
                  desc: "Every answer cites Harrison's, Robbins, Bailey & Love, and other PG-standard references.",
                },
                {
                  icon: Brain,
                  title: "Clinical reasoning",
                  desc: "Not just facts. Pulse walks you through the differential, workup, and management — like a real ward round.",
                },
                {
                  icon: Volume2,
                  title: "Voice viva mode",
                  desc: "Practice clinical cases out loud. The AI plays the examiner, evaluates your answers, and corrects gaps.",
                },
                {
                  icon: Search,
                  title: "Citation aware",
                  desc: "Every fact is traceable to a source. Tap to expand the textbook page, image, or guideline.",
                },
              ].map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-4"
                  data-cursor="hover"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-accent">
                    <f.icon size={16} />
                  </span>
                  <div>
                    <div className="font-display text-base font-semibold text-white">
                      {f.title}
                    </div>
                    <p className="mt-1 text-sm text-white/55">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeUp>

          {/* Chat panel */}
          <FadeUp delay={0.2}>
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-accent/20 via-mint/10 to-transparent opacity-60 blur-2xl" />

              <div className="glass-strong relative overflow-hidden rounded-3xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/8 bg-white/[0.02] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent to-mint">
                        <Sparkles size={15} className="text-background" />
                      </span>
                      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-mint" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Pulse Tutor</div>
                      <div className="text-[11px] text-mint">Online · Avg reply 1.2s</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {MODES.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setActiveMode(m.id)}
                        className={cn(
                          "rounded-md px-2 py-1 text-[11px] font-medium transition",
                          activeMode === m.id
                            ? "bg-accent/20 text-accent"
                            : "text-white/45 hover:text-white"
                        )}
                        data-cursor="hover"
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat */}
                <div className="space-y-4 p-5">
                  {/* User message */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-accent/15 px-4 py-2.5 text-sm text-white">
                      {CONVERSATION[0].text}
                    </div>
                  </motion.div>

                  {/* AI first reply (typing) */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="flex"
                  >
                    <div className="max-w-[88%] rounded-2xl rounded-tl-md border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-white/90">
                      {!typingDone ? (
                        <span>
                          {typingText}
                          <span className="ml-0.5 inline-block h-3.5 w-0.5 translate-y-0.5 animate-blink bg-accent" />
                        </span>
                      ) : (
                        CONVERSATION[1].text
                      )}
                    </div>
                  </motion.div>

                  {/* List block */}
                  <AnimatePresence>
                    {typingDone && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex"
                      >
                        <div className="max-w-[88%] rounded-2xl rounded-tl-md border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/90">
                          <ol className="space-y-1.5">
                            {(CONVERSATION[2].items ?? []).map((item, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                                className="flex gap-2.5"
                              >
                                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-accent/15 text-[10px] font-medium text-accent">
                                  {i + 1}
                                </span>
                                <span>{item}</span>
                              </motion.li>
                            ))}
                          </ol>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* AI second reply */}
                  <AnimatePresence>
                    {typingDone && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                        className="flex"
                      >
                        <div className="max-w-[88%] rounded-2xl rounded-tl-md border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-white/90">
                          {CONVERSATION[3].text}
                          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                            <span className="chip">📚 Harrison 21e Ch. 308</span>
                            <span className="chip">🧪 KDIGO 2024</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Suggestions */}
                <div className="border-t border-white/8 bg-white/[0.01] px-5 py-3">
                  <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/30">
                    Try asking
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[11px] text-white/70 transition hover:border-accent/30 hover:bg-accent/10 hover:text-white"
                        data-cursor="hover"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div className="border-t border-white/8 p-3">
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
                    <button
                      className="grid h-8 w-8 place-items-center rounded-full bg-accent/15 text-accent transition hover:bg-accent/25"
                      data-cursor="hover"
                      aria-label="Voice input"
                    >
                      <Mic size={14} />
                    </button>
                    <input
                      type="text"
                      placeholder="Ask Pulse anything medical..."
                      className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
                    />
                    <button
                      className="grid h-8 w-8 place-items-center rounded-full bg-accent text-background transition hover:scale-105"
                      data-cursor="hover"
                      aria-label="Send"
                    >
                      <Send size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Voice wave indicator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -bottom-4 left-1/2 hidden -translate-x-1/2 lg:block"
              >
                <div className="glass rounded-full px-3 py-1.5 text-[11px] text-white/60">
                  <span className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className="block w-0.5 origin-bottom rounded-full bg-accent"
                          style={{
                            height: 12,
                            animation: `wave 1.1s ease-in-out ${i * 0.1}s infinite`,
                          }}
                        />
                      ))}
                    </span>
                    Listening... say "Explain preeclampsia"
                  </span>
                </div>
              </motion.div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
