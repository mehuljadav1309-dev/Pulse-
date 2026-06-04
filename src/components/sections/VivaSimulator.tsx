"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Activity, AlertTriangle, Heart, Thermometer, Droplet, Wind } from "lucide-react";
import { FadeUp } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const VITAL_SIGNS = [
  { icon: Heart, label: "HR", value: "98", unit: "bpm", color: "text-danger", normal: false },
  { icon: Wind, label: "RR", value: "22", unit: "/min", color: "text-accent", normal: false },
  { icon: Activity, label: "BP", value: "94/62", unit: "mmHg", color: "text-warning", normal: false },
  { icon: Thermometer, label: "Temp", value: "38.6", unit: "°C", color: "text-danger", normal: false },
  { icon: Droplet, label: "SpO₂", value: "94", unit: "%", color: "text-mint", normal: true },
];

const EXAMINER = [
  "Good morning. Please take a focused history.",
  "What is the most likely diagnosis at this point?",
  "Which two investigations would you order first, and why?",
  "Walk me through your initial management in the first hour.",
  "What are the red flags you'd be watching for?",
];

const STUDENT = [
  "Yes sir. 58-year-old Mr. Sharma, presenting with 3 days of productive cough, fever, and progressive breathlessness.",
  "My primary diagnosis is community-acquired pneumonia, right lower lobe. Smoking history and the focal findings support it.",
  "Chest X-ray and ABG. CXR to confirm consolidation; ABG to look for hypoxemia or early Type 1 respiratory failure.",
  "Empirical IV ceftriaxone plus azithromycin, oxygen titrated to SpO₂ ≥ 94%, IV fluids, and send cultures before antibiotics if possible.",
  "Worsening hypoxemia, septic shock, empyema, and ARDS. I'd escalate to high-dependency care early.",
];

export function VivaSimulator() {
  const [step, setStep] = useState(0);
  const [recording, setRecording] = useState(false);
  const [waveHeights, setWaveHeights] = useState<number[]>(Array.from({ length: 32 }, () => 0.3));

  useEffect(() => {
    if (!recording) return;
    const id = setInterval(() => {
      setWaveHeights((arr) => arr.map(() => 0.3 + Math.random() * 0.7));
    }, 80);
    return () => clearInterval(id);
  }, [recording]);

  useEffect(() => {
    const t = setInterval(() => {
      setStep((s) => (s + 1) % EXAMINER.length);
    }, 4200);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="viva" className="section relative py-32 md:py-40">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-gradient-radial from-accent/12 via-transparent to-transparent blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-gradient-radial from-warning/10 to-transparent blur-3xl" />
      </div>

      <div className="container-x">
        <FadeUp className="mx-auto max-w-3xl text-center">
          <span className="label mb-4 inline-block">07 — AI Viva Simulator</span>
          <h2 className="mt-4 font-display text-display-xl gradient-text text-balance">
            Practice your viva with an{" "}
            <span className="gradient-text-accent">AI examiner</span>{" "}
            that doesn't go easy on you.
          </h2>
          <p className="mt-6 text-pretty text-lg text-white/55">
            Voice-based clinical case discussions. The AI examiner plays a
            senior consultant — asks history, examinations, differentials,
            and management. You answer out loud. You get scored on clinical
            reasoning, completeness, and confidence.
          </p>
        </FadeUp>

        <div className="mt-20 grid items-stretch gap-6 lg:grid-cols-[1fr_1.3fr]">
          {/* Case panel */}
          <FadeUp delay={0.1}>
            <div className="glass-strong flex h-full flex-col gap-4 rounded-3xl p-5">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] text-white/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                    Case 14 · LIVE
                  </div>
                  <span className="chip text-[10px]">Medicine</span>
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold text-white">
                  Mr. Sharma, 58 / M
                </h3>
                <p className="mt-1 text-xs text-white/50">
                  Presented to ED · 3 days fever, productive cough, breathlessness
                </p>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {VITAL_SIGNS.map((v) => (
                  <div
                    key={v.label}
                    className="rounded-xl border border-white/8 bg-white/[0.02] p-2.5 text-center"
                  >
                    <v.icon size={13} className={cn("mx-auto", v.color)} />
                    <div className="mt-1.5 text-[10px] uppercase tracking-wider text-white/40">
                      {v.label}
                    </div>
                    <div className="mt-0.5 font-mono text-sm font-medium text-white">
                      {v.value}
                    </div>
                    <div className="text-[9px] text-white/30">{v.unit}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-3">
                <div className="text-[10px] uppercase tracking-wider text-white/40">
                  Clinical history
                </div>
                <ul className="mt-2 space-y-1.5 text-[12px] text-white/75">
                  <li>· Fever, intermittent, max 39.2°C, with chills</li>
                  <li>· Cough with thick yellow sputum, 3 days</li>
                  <li>· Progressive dyspnea on exertion (NYHA II → III)</li>
                  <li>· Smoker — 30 pack-years, drinks alcohol socially</li>
                  <li>· Known T2DM on metformin, HbA1c 8.1</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-warning/20 bg-warning/[0.05] p-3">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-warning">
                  <AlertTriangle size={12} />
                  Examiner hint
                </div>
                <p className="mt-1.5 text-[12px] text-white/75">
                  Examiner is testing: prioritization of investigations, oxygen
                  strategy, and sepsis bundle awareness.
                </p>
              </div>

              <div className="mt-auto">
                <div className="text-[10px] uppercase tracking-wider text-white/40">
                  Viva duration
                </div>
                <div className="mt-1.5 font-mono text-lg text-white">04:32</div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "62%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, delay: 0.3 }}
                    className="h-full rounded-full bg-gradient-to-r from-accent to-warning"
                  />
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Conversation + recording */}
          <FadeUp delay={0.2}>
            <div className="relative flex h-full flex-col gap-4">
              {/* Examiner + Student voice bubbles */}
              <div className="glass-strong flex-1 rounded-3xl p-5">
                <div className="space-y-3">
                  <AnimatePresence mode="wait">
                    {EXAMINER.slice(0, step + 1).map((q, i) => {
                      const isLast = i === step;
                      return (
                        <motion.div
                          key={`q-${i}-${step}`}
                          initial={isLast ? { opacity: 0, y: 8 } : false}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="flex items-start gap-2.5"
                        >
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent to-mint text-[10px] font-semibold text-background">
                            DR
                          </div>
                          <div className="rounded-2xl rounded-tl-md border border-white/8 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white/90">
                            {q}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    {step > 0 && (
                      <motion.div
                        key={`s-${step}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="flex items-start justify-end gap-2.5"
                      >
                        <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-accent/15 px-3.5 py-2.5 text-sm text-white">
                          {STUDENT[step - 1]}
                        </div>
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-accent/30 bg-accent/15 text-[10px] font-semibold text-accent">
                          YOU
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Live waveform */}
                <div className="mt-5 rounded-2xl border border-white/8 bg-background/40 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-danger/15 text-danger">
                        {recording ? <Mic size={13} /> : <MicOff size={13} />}
                      </span>
                      <div>
                        <div className="text-xs font-medium text-white">
                          {recording ? "Recording..." : "Tap to speak"}
                        </div>
                        <div className="text-[10px] text-white/40">
                          {recording ? "Pulse is transcribing" : "Voice → text → AI response"}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setRecording((r) => !r)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-[11px] font-medium transition",
                        recording ? "bg-danger/15 text-danger" : "bg-accent/15 text-accent hover:bg-accent/25"
                      )}
                      data-cursor="hover"
                    >
                      {recording ? "Stop" : "Start"}
                    </button>
                  </div>

                  <div className="mt-3 flex h-12 items-end gap-1">
                    {waveHeights.map((h, i) => (
                      <span
                        key={i}
                        className="flex-1 rounded-full bg-gradient-to-t from-accent to-mint"
                        style={{
                          height: `${recording ? h * 100 : 12}%`,
                          opacity: recording ? 1 : 0.4,
                          transition: "height 80ms ease-out",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Score card */}
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Clinical reasoning", value: 92, color: "#4F8CFF" },
                  { label: "Completeness", value: 86, color: "#00E5A8" },
                  { label: "Confidence", value: 78, color: "#F59E0B" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-white/8 bg-white/[0.02] p-4"
                    data-cursor="hover"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] text-white/55">{s.label}</div>
                      <span className="font-mono text-sm font-medium" style={{ color: s.color }}>
                        {s.value}
                      </span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.4, delay: 0.3 }}
                        className="h-full rounded-full"
                        style={{ background: s.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
