"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Check, ChevronRight, Filter, Search, Sparkles, Star, TrendingUp } from "lucide-react";
import { FadeUp } from "@/components/ui/Reveal";
import { SUBJECTS } from "@/lib/constants";
import { cn, formatNumber } from "@/lib/utils";

const SAMPLE_QUESTION = {
  id: 1,
  text: "A 58-year-old man presents with progressive dyspnea, bilateral lower limb edema, and a displaced apex beat. Echocardiography reveals an ejection fraction of 30% with global hypokinesia. Which of the following drugs has been shown to REDUCE all-cause mortality in this condition?",
  options: [
    { id: "A", text: "Digoxin", correct: false },
    { id: "B", text: "Ivabradine", correct: false },
    { id: "C", text: "Spironolactone", correct: true },
    { id: "D", text: "Diltiazem", correct: false },
  ],
  explanation:
    "RALES (1999) demonstrated that spironolactone reduces mortality in NYHA class III–IV heart failure with EF ≤35% on standard therapy. Digoxin improves symptoms but not mortality. Ivabradine reduces CV mortality in a subset, not all-cause. Non-dihydropyridine CCBs like diltiazem are contraindicated in HFrEF.",
  subject: "Medicine",
  topic: "Heart Failure",
  difficulty: "Moderate",
  pyq: true,
  bookmarks: 2840,
  success: 64,
};

const FILTERS = ["All", "NEET PG", "INI-CET", "FMGE", "Recent PYQs", "Image-based"];

export function QuestionBank() {
  const [activeSubject, setActiveSubject] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);

  const _correct = SAMPLE_QUESTION.options.find((o) => o.correct)?.id;

  return (
    <section id="question-bank" className="section relative py-32 md:py-40">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-1/4 h-[500px] w-[500px] rounded-full bg-gradient-radial from-warning/10 to-transparent blur-3xl" />
        <div className="absolute right-0 bottom-1/4 h-[500px] w-[500px] rounded-full bg-gradient-radial from-accent/10 to-transparent blur-3xl" />
      </div>

      <div className="container-x">
        <FadeUp className="mx-auto max-w-3xl text-center">
          <span className="label mb-4 inline-block">03 — Question Bank</span>
          <h2 className="mt-4 font-display text-display-xl gradient-text text-balance">
            25,000+ MCQs, tuned for{" "}
            <span className="gradient-text-accent">NEET PG precision.</span>
          </h2>
          <p className="mt-6 text-pretty text-lg text-white/55">
            Subject-wise filtering, difficulty modes, image-based questions,
            PYQ archive, and a revision engine that learns what you forget.
          </p>
        </FadeUp>

        <FadeUp delay={0.2} className="mt-20">
          <div className="relative mx-auto max-w-6xl rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-2 shadow-card-lift md:p-3">
            {/* Window chrome */}
            <div className="flex items-center justify-between rounded-t-2xl bg-white/[0.02] px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-danger/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
              </div>
              <div className="flex h-6 flex-1 items-center gap-2 mx-4 max-w-sm rounded-md border border-white/5 bg-white/[0.02] px-2.5 text-[11px] text-white/40">
                <Search size={11} />
                pulse.app/practice/medicine/heart-failure
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-white/40">
                <Filter size={11} />
                Filters
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 p-3 md:grid-cols-[260px_1fr] md:gap-5 md:p-4">
              {/* Sidebar */}
              <div className="space-y-3">
                <div>
                  <div className="label mb-2.5 text-white/40">Subjects</div>
                  <div className="space-y-1 max-h-[360px] overflow-y-auto pr-1 -mr-1">
                    {SUBJECTS.map((s, i) => (
                      <button
                        key={s.name}
                        onClick={() => setActiveSubject(i)}
                        className={cn(
                          "group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition",
                          activeSubject === i
                            ? "bg-white/[0.06] text-white"
                            : "text-white/55 hover:bg-white/[0.03] hover:text-white/80"
                        )}
                        data-cursor="hover"
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ background: s.color }}
                          />
                          {s.name}
                        </span>
                        <span className="text-[11px] text-white/30 group-hover:text-white/50">
                          {formatNumber(s.count)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="label mb-2.5 text-white/40">Difficulty</div>
                  <div className="flex gap-1.5">
                    {["Easy", "Med", "Hard"].map((d, i) => (
                      <button
                        key={d}
                        className={cn(
                          "flex-1 rounded-md border px-2 py-1.5 text-xs transition",
                          i === 1
                            ? "border-accent/40 bg-accent/10 text-white"
                            : "border-white/10 bg-white/[0.02] text-white/55 hover:border-white/20"
                        )}
                        data-cursor="hover"
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Question panel */}
              <div className="rounded-2xl border border-white/8 bg-background/60 p-5 md:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  {FILTERS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-[11px] font-medium transition",
                        activeFilter === f
                          ? "border-accent/40 bg-accent/15 text-white"
                          : "border-white/8 bg-white/[0.02] text-white/55 hover:border-white/15"
                      )}
                      data-cursor="hover"
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between text-[11px] text-white/40">
                  <span className="flex items-center gap-2">
                    <span className="rounded-md bg-accent/15 px-1.5 py-0.5 text-accent">
                      {SAMPLE_QUESTION.subject}
                    </span>
                    <span>· {SAMPLE_QUESTION.topic}</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Star size={11} className="text-warning" />
                      {SAMPLE_QUESTION.difficulty}
                    </span>
                    {SAMPLE_QUESTION.pyq && (
                      <span className="rounded-md bg-warning/15 px-1.5 py-0.5 text-warning">
                        PYQ
                      </span>
                    )}
                  </span>
                </div>

                <h3 className="mt-4 text-pretty text-base font-medium leading-relaxed text-white md:text-lg">
                  <span className="mr-2 text-white/40">Q{SAMPLE_QUESTION.id}.</span>
                  {SAMPLE_QUESTION.text}
                </h3>

                <div className="mt-5 grid gap-2">
                  {SAMPLE_QUESTION.options.map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    const isCorrect = opt.correct;
                    const showResult = selectedOption !== null;
                    return (
                      <motion.button
                        key={opt.id}
                        onClick={() => !showResult && setSelectedOption(opt.id)}
                        disabled={showResult}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border p-3 text-left text-sm transition",
                          !showResult && "hover:border-white/20 hover:bg-white/[0.03]",
                          isSelected && isCorrect && "border-mint/50 bg-mint/10",
                          isSelected && !isCorrect && "border-danger/50 bg-danger/10",
                          showResult && isCorrect && "border-mint/50 bg-mint/10",
                          showResult && !isSelected && !isCorrect && "opacity-50"
                        )}
                        data-cursor="hover"
                        whileTap={!showResult ? { scale: 0.99 } : undefined}
                      >
                        <span
                          className={cn(
                            "grid h-7 w-7 shrink-0 place-items-center rounded-md border text-[11px] font-medium",
                            isSelected && isCorrect
                              ? "border-mint/40 bg-mint/20 text-mint"
                              : isSelected && !isCorrect
                              ? "border-danger/40 bg-danger/20 text-danger"
                              : showResult && isCorrect
                              ? "border-mint/40 bg-mint/20 text-mint"
                              : "border-white/10 bg-white/[0.02] text-white/60"
                          )}
                        >
                          {showResult && isCorrect ? (
                            <Check size={13} />
                          ) : (
                            opt.id
                          )}
                        </span>
                        <span className="text-white/85">{opt.text}</span>
                      </motion.button>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait">
                  {selectedOption && (
                    <motion.div
                      key="explanation"
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-xl border border-accent/20 bg-accent/[0.04] p-4">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
                          <Sparkles size={12} />
                          AI Explanation
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-white/80">
                          {SAMPLE_QUESTION.explanation}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-white/50">
                          <span className="flex items-center gap-1.5">
                            <TrendingUp size={11} className="text-mint" />
                            {SAMPLE_QUESTION.success}% got it right
                          </span>
                          <span>·</span>
                          <span>{formatNumber(SAMPLE_QUESTION.bookmarks)} saved this</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-5 flex items-center justify-between">
                  <button
                    onClick={() => setBookmarked((b) => !b)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition",
                      bookmarked
                        ? "border-accent/40 bg-accent/10 text-white"
                        : "border-white/10 text-white/60 hover:border-white/20"
                    )}
                    data-cursor="hover"
                  >
                    {bookmarked ? <Check size={12} /> : <Bookmark size={12} />}
                    {bookmarked ? "Saved" : "Save for revision"}
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedOption(null)}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:border-white/20"
                      data-cursor="hover"
                    >
                      Skip
                    </button>
                    <button
                      onClick={() => setSelectedOption("C")}
                      className="btn-primary px-3.5 py-1.5 text-xs"
                      data-cursor="hover"
                    >
                      Next question
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mx-auto mt-8 grid max-w-6xl grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Questions solved today", value: "48,200" },
              { label: "Accuracy improvement", value: "+23%" },
              { label: "PYQs covered", value: "20 yrs" },
              { label: "Image-based questions", value: "4,800" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 backdrop-blur"
              >
                <div className="font-display text-2xl font-semibold text-white">
                  {s.value}
                </div>
                <div className="mt-1 text-xs text-white/50">{s.label}</div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
