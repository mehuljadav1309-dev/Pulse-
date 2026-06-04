"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Activity, BookOpen, ClipboardList, Dna, FileText, Heart, Image as ImageIcon, Layers, Microscope, Notebook, Pill, ScanLine, Stethoscope, Syringe, type LucideIcon } from "lucide-react";
import { FadeUp } from "@/components/ui/Reveal";

interface KnowledgeItem {
  id: number;
  type: "mcq" | "card" | "image" | "note";
  title: string;
  subject: string;
  icon: LucideIcon;
  color: string;
  x: number;
  y: number;
  z: number;
  size: number;
  delay: number;
}

const ITEMS: KnowledgeItem[] = [
  { id: 1, type: "mcq", title: "Nephrotic syndrome — first-line therapy in adults?", subject: "Medicine", color: "#4F8CFF", x: 12, y: 18, z: 60, size: 1.05, delay: 0, icon: ClipboardList },
  { id: 2, type: "image", title: "ECG — Anterior STEMI", subject: "Cardiology", color: "#EF4444", x: 82, y: 22, z: 80, size: 1.0, delay: 0.2, icon: Activity },
  { id: 3, type: "note", title: "Cranial nerves — quick recap", subject: "Anatomy", color: "#00E5A8", x: 22, y: 64, z: 40, size: 1.0, delay: 0.4, icon: Notebook },
  { id: 4, type: "mcq", title: "Histology of liver — Identify the cell", subject: "Pathology", color: "#F59E0B", x: 70, y: 70, z: 100, size: 1.1, delay: 0.6, icon: Microscope },
  { id: 5, type: "image", title: "CXR — Right lower lobe consolidation", subject: "Radiology", color: "#A78BFA", x: 50, y: 12, z: -40, size: 0.95, delay: 0.8, icon: ScanLine },
  { id: 6, type: "card", title: "INICET PYQ 2024", subject: "OBG", color: "#EC4899", x: 88, y: 50, z: 30, size: 1.0, delay: 1.0, icon: FileText },
  { id: 7, type: "note", title: "Insulin signaling pathway", subject: "Biochemistry", color: "#22C55E", x: 6, y: 48, z: -20, size: 0.9, delay: 0.3, icon: Dna },
  { id: 8, type: "mcq", title: "Mechanism — Beta-lactam antibiotics", subject: "Microbiology", color: "#FBBF24", x: 38, y: 38, z: 120, size: 1.15, delay: 0.5, icon: Pill },
  { id: 9, type: "image", title: "Histology slide — Cerebellum", subject: "Anatomy", color: "#34D399", x: 60, y: 84, z: 20, size: 0.95, delay: 0.7, icon: Layers },
  { id: 10, type: "card", title: "Flashcard — H. pylori", subject: "Microbiology", color: "#F472B6", x: 30, y: 86, z: 60, size: 0.9, delay: 0.9, icon: Stethoscope },
  { id: 11, type: "mcq", title: "Surgery — inguinal hernia anatomy", subject: "Surgery", color: "#60A5FA", x: 75, y: 38, z: -50, size: 1.0, delay: 0.1, icon: Syringe },
  { id: 12, type: "note", title: "Pediatric milestones at 18 months", subject: "Pediatrics", color: "#A3E635", x: 50, y: 50, z: 0, size: 1.25, delay: 0.15, icon: Heart },
  { id: 13, type: "image", title: "Dermatology — Psoriasis plaque", subject: "Dermatology", color: "#38BDF8", x: 14, y: 80, z: 50, size: 0.95, delay: 1.2, icon: ImageIcon },
  { id: 14, type: "card", title: "PYQ — Orthopedics 2023", subject: "Orthopedics", color: "#C084FC", x: 88, y: 88, z: 90, size: 0.9, delay: 1.1, icon: FileText },
  { id: 15, type: "note", title: "Drug — Metformin MOA", subject: "Pharmacology", color: "#FACC15", x: 44, y: 16, z: 30, size: 0.95, delay: 0.55, icon: Pill },
];

function KnowledgeCard({ item, mouseX, scrollYProgress }: { item: KnowledgeItem; mouseX: ReturnType<typeof useMotionValue<number>>; mouseY: ReturnType<typeof useMotionValue<number>>; scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = item.icon || BookOpen;

  const parallaxX = useTransform(mouseX, [-1, 1], [-10 * (item.z / 100), 10 * (item.z / 100)]);
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, -item.y * 1.5]);

  return (
    <motion.div
      ref={ref}
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        z: item.z,
        scale: item.size,
        x: parallaxX,
        y: scrollY,
        zIndex: Math.round(100 + item.z),
      }}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: item.size }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, delay: item.delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: item.size * 1.08, zIndex: 200, transition: { duration: 0.4 } }}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      data-cursor="hover"
    >
      <div className="glass w-[200px] rounded-2xl p-3 shadow-card-lift transition-shadow duration-500 hover:shadow-glow-accent">
        <div className="flex items-center justify-between">
          <div
            className="grid h-7 w-7 place-items-center rounded-md"
            style={{ background: `${item.color}22`, color: item.color }}
          >
            <Icon size={14} />
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-white/50">
            {item.type}
          </span>
        </div>
        <div className="mt-2.5 line-clamp-2 text-[12px] font-medium leading-snug text-white/90">
          {item.title}
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] text-white/40">
          <span>{item.subject}</span>
          <span className="flex items-center gap-0.5">
            <span className="h-1 w-1 rounded-full" style={{ background: item.color }} />
            Live
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function KnowledgeUniverse() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  const rotateX = useTransform(smY, [-1, 1], [3, -3]);
  const rotateY = useTransform(smX, [-1, 1], [-3, 3]);

  return (
    <section
      ref={sectionRef}
      className="section relative py-32 md:py-40"
      id="knowledge"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 dot-bg opacity-30" />
        <motion.div
          style={{ rotateX, rotateY, transformPerspective: 1200 }}
          className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-accent/10 via-transparent to-transparent blur-3xl"
        />
      </div>

      <div className="container-x">
        <FadeUp className="mx-auto max-w-3xl text-center">
          <span className="label mb-4 inline-block">02 — Knowledge Universe</span>
          <h2 className="mt-4 font-display text-display-xl text-balance gradient-text">
            Every concept you need,
            <br />
            floating in one workspace.
          </h2>
          <p className="mt-6 text-pretty text-lg text-white/55">
            MCQs, surgical videos, radiology scans, histology slides, flashcards
            and PYQs — all spatially organized so your brain connects them faster.
          </p>
        </FadeUp>

        <div
          className="relative mx-auto mt-20 h-[680px] w-full max-w-6xl overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent"
          style={{ perspective: "1400px" }}
        >
          {/* Inner gradient background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent" />
          </div>

          {/* Scroll indicator */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-background to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-background to-transparent" />

          {/* Cards */}
          {ITEMS.map((item) => (
            <KnowledgeCard
              key={item.id}
              item={item}
              mouseX={smX}
              mouseY={smY}
              scrollYProgress={scrollYProgress}
            />
          ))}

          {/* Hint */}
          <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
            <span className="chip backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" />
              Move your cursor to explore
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
