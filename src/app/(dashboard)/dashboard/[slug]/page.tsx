import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  Mic,
  Pause,
  Play,
  Plus,
  Search,
  Settings,
  Sparkles,
  Star,
  Target,
  Timer,
  TrendingUp,
  Trophy,
  Video,
  Volume2,
  Zap,
} from "lucide-react";
import { getFeatureBySlug } from "@/lib/features";
import { FeatureHeader } from "@/components/dashboard/FeatureCard";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { slug: string } }) {
  const feature = getFeatureBySlug(params.slug);
  if (!feature) return { title: "Feature" };
  return { title: feature.title };
}

const FLASHCARDS = [
  { front: "Beck's triad", back: "Hypotension, muffled heart sounds, JVD — cardiac tamponade." },
  { front: "Charcot's triad", back: "RUQ pain, fever, jaundice — acute cholangitis." },
  { front: "Cushing's triad", back: "Hypertension, bradycardia, irregular respirations — raised ICP." },
  { front: "Virchow's triad", back: "Stasis, hypercoagulability, endothelial injury — thrombosis." },
];

const NOTES = [
  { id: 1, title: "Heart failure — drug summary", subject: "Medicine", updated: "2h ago" },
  { id: 2, title: "Cranial nerves — quick reference", subject: "Anatomy", updated: "1d ago" },
  { id: 3, title: "TB regimens — RNTCP vs WHO", subject: "Microbiology", updated: "3d ago" },
  { id: 4, title: "Acid-base — ABG interpretation", subject: "Physiology", updated: "1w ago" },
  { id: 5, title: "Antimicrobial spectrum chart", subject: "Pharmacology", updated: "2w ago" },
];

const PYQ_LIST = [
  { year: "NEET PG 2024", q: 200, solved: 184 },
  { year: "NEET PG 2023", q: 200, solved: 162 },
  { year: "INI-CET Nov '24", q: 250, solved: 230 },
  { year: "INI-CET May '24", q: 250, solved: 198 },
  { year: "FMGE 2024", q: 300, solved: 252 },
  { year: "NEET PG 2022", q: 200, solved: 144 },
];

const SCHEDULE = [
  { day: "Mon", focus: "Medicine · 2 hrs", done: true },
  { day: "Tue", focus: "Surgery · 1.5 hrs", done: true },
  { day: "Wed", focus: "Mock test · 3 hrs", done: true },
  { day: "Thu", focus: "Pathology · 1 hr", done: false, current: true },
  { day: "Fri", focus: "Pharmacology · 2 hrs", done: false },
  { day: "Sat", focus: "Full-length mock", done: false },
  { day: "Sun", focus: "Revision · 1.5 hrs", done: false },
];

const RECOMMENDED_VIDEOS = [
  { title: "Coronary circulation walkthrough", subject: "Anatomy", duration: "18:24" },
  { title: "Cranial nerves — clinical exam", subject: "Neuroanatomy", duration: "24:10" },
  { title: "Auscultation essentials", subject: "Medicine", duration: "12:48" },
  { title: "Pharyngeal arch derivatives", subject: "Embryology", duration: "21:05" },
];

export default function FeaturePage({ params }: { params: { slug: string } }) {
  const feature = getFeatureBySlug(params.slug);
  if (!feature) notFound();

  return (
    <div className="container-x py-8 md:py-10">
      <FeatureHeader feature={feature} />
      <div className="mt-8">
        <FeatureContent slug={feature.slug} />
      </div>
    </div>
  );
}

function FeatureContent({ slug }: { slug: string }) {
  switch (slug) {
    case "ai-tutor":
      return <AiTutorPanel />;
    case "viva":
      return <VivaPanel />;
    case "question-bank":
      return <QuestionBankPanel />;
    case "videos":
      return <VideosPanel />;
    case "mock-tests":
      return <MockTestsPanel />;
    case "notes":
      return <NotesPanel />;
    case "flashcards":
      return <FlashcardsPanel />;
    case "pyq":
      return <PyqPanel />;
    case "rank-predictor":
      return <RankPredictorPanel />;
    case "analytics":
      return <AnalyticsPanel />;
    case "bookmarks":
      return <BookmarksPanel />;
    case "revision-planner":
      return <RevisionPlannerPanel />;
    case "scheduler":
      return <SchedulerPanel />;
    default:
      return <PlaceholderPanel />;
  }
}

function PanelShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-5 md:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

function AiTutorPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
      <PanelShell className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-white/8 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-accent to-mint">
              <Sparkles size={14} className="text-background" />
            </span>
            <div>
              <div className="text-sm font-semibold text-white">Pulse Tutor</div>
              <div className="text-[11px] text-mint">Online · Avg reply 1.2s</div>
            </div>
          </div>
          <div className="hidden items-center gap-1.5 sm:flex">
            {["Explain", "Compare", "Quiz me", "Summarize"].map((m, i) => (
              <span
                key={m}
                className={`rounded-md px-2 py-1 text-[11px] ${
                  i === 0 ? "bg-accent/20 text-accent" : "text-white/45"
                }`}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-3 py-4">
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-accent/15 px-4 py-2.5 text-sm text-white">
              Why does H. pylori cause gastric ulcers?
            </div>
          </div>
          <div className="flex">
            <div className="max-w-[88%] rounded-2xl rounded-tl-md border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-white/90">
              H. pylori colonises the gastric mucosa and triggers a chronic
              neutrophilic inflammation. Urease activity raises local pH, while
              CagA and VacA toxins disrupt epithelial tight junctions — together
              this erodes the protective mucus layer and exposes the mucosa to
              acid.
            </div>
          </div>
          <div className="flex">
            <div className="max-w-[88%] rounded-2xl rounded-tl-md border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/90">
              <ol className="space-y-1.5">
                {[
                  "Urease → neutralises gastric acid locally",
                  "Mucolytic enzymes → degrade protective mucus",
                  "Toxins (CagA, VacA) → epithelial injury",
                  "Chronic inflammation → atrophic gastritis → ulcer",
                ].map((it, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-accent/15 text-[10px] font-medium text-accent">
                      {i + 1}
                    </span>
                    <span>{it}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
        <div className="mt-auto border-t border-white/8 pt-3">
          <div className="flex flex-wrap gap-1.5 pb-2">
            {[
              "Mechanism of insulin resistance",
              "Side effects of beta-blockers",
              "Interpret anterior STEMI ECG",
            ].map((s) => (
              <button
                key={s}
                className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[11px] text-white/70 hover:border-accent/30 hover:bg-accent/10 hover:text-white"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-accent/15 text-accent">
              <Mic size={14} />
            </span>
            <input
              type="text"
              placeholder="Ask Pulse anything medical..."
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
            />
            <button className="grid h-8 w-8 place-items-center rounded-full bg-accent text-background">
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </PanelShell>
      <div className="space-y-4">
        <PanelShell>
          <h3 className="font-display text-base font-semibold text-white">Modes</h3>
          <ul className="mt-3 space-y-2">
            {[
              ["Explain", "Textbook-grounded long-form answers"],
              ["Compare", "Side-by-side differential tables"],
              ["Quiz me", "Adaptive MCQs from your weak topics"],
              ["Summarize", "Notes & high-yield summaries"],
            ].map(([t, d]) => (
              <li
                key={t}
                className="flex items-start gap-2.5 rounded-lg border border-white/8 bg-white/[0.02] p-2.5"
              >
                <Sparkles size={13} className="mt-0.5 text-accent" />
                <div>
                  <div className="text-sm font-medium text-white">{t}</div>
                  <div className="text-xs text-white/50">{d}</div>
                </div>
              </li>
            ))}
          </ul>
        </PanelShell>
        <PanelShell>
          <h3 className="font-display text-base font-semibold text-white">Citations</h3>
          <p className="mt-1 text-xs text-white/50">
            Every answer is traceable to standard references.
          </p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {["Harrison 21e", "Robbins 10e", "Bailey & Love 28e", "KDIGO 2024"].map(
              (c) => (
                <li
                  key={c}
                  className="rounded-md border border-white/8 bg-white/[0.02] px-2 py-1 text-[11px] text-white/65"
                >
                  📚 {c}
                </li>
              )
            )}
          </ul>
        </PanelShell>
      </div>
    </div>
  );
}

function VivaPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
      <PanelShell>
        <div className="flex items-center justify-between text-[11px] text-white/50">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-danger" />
            Case 14 · LIVE
          </span>
          <span className="chip text-[10px]">Medicine</span>
        </div>
        <h3 className="mt-2 font-display text-lg font-semibold text-white">
          Mr. Sharma, 58 / M
        </h3>
        <p className="mt-1 text-xs text-white/55">
          Presented to ED · 3 days fever, productive cough, breathlessness.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {[
            ["HR", "98 bpm", "text-danger"],
            ["RR", "22 /min", "text-accent"],
            ["BP", "94/62", "text-warning"],
            ["SpO₂", "94%", "text-mint"],
          ].map(([k, v, c]) => (
            <div
              key={k}
              className="rounded-lg border border-white/8 bg-white/[0.02] p-2.5"
            >
              <div className="text-[10px] uppercase tracking-wider text-white/40">
                {k}
              </div>
              <div className={`mt-0.5 font-mono text-sm ${c ?? "text-white"}`}>
                {v}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-accent/20 bg-accent/5 p-3 text-xs text-white/70">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-accent">
            Examiner
          </div>
          <p className="mt-1">
            “What is the most likely diagnosis at this point, and what two
            investigations would you order first?”
          </p>
        </div>
      </PanelShell>
      <PanelShell>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-white">
            Voice session
          </h3>
          <span className="flex items-center gap-1.5 text-[11px] text-mint">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" />
            Listening
          </span>
        </div>
        <div className="mt-6 flex h-32 items-center justify-center gap-1">
          {Array.from({ length: 32 }).map((_, i) => (
            <span
              key={i}
              className="block w-1 origin-bottom rounded-full bg-gradient-to-t from-accent to-mint"
              style={{
                height: `${20 + Math.abs(Math.sin(i * 0.5)) * 80}%`,
                animation: `wave 1.1s ease-in-out ${i * 0.05}s infinite`,
              }}
            />
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-3">
          <button className="grid h-12 w-12 place-items-center rounded-full bg-accent text-background shadow-glow-accent">
            <Mic size={18} />
          </button>
          <button className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/70">
            <Volume2 size={18} />
          </button>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            ["Reasoning", 88],
            ["Completeness", 74],
            ["Confidence", 82],
          ].map(([label, v]) => (
            <div
              key={label as string}
              className="rounded-xl border border-white/8 bg-white/[0.02] p-3"
            >
              <div className="text-[10px] uppercase tracking-wider text-white/40">
                {label}
              </div>
              <div className="mt-1 font-display text-xl font-semibold text-white">
                {v}
              </div>
            </div>
          ))}
        </div>
      </PanelShell>
    </div>
  );
}

function QuestionBankPanel() {
  const SAMPLE = {
    text: "A 58-year-old man with progressive dyspnea and bilateral lower limb edema. Echo shows EF 30% with global hypokinesia. Which drug reduces all-cause mortality?",
    options: [
      { id: "A", text: "Digoxin", correct: false },
      { id: "B", text: "Ivabradine", correct: false },
      { id: "C", text: "Spironolactone", correct: true },
      { id: "D", text: "Diltiazem", correct: false },
    ],
  };
  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      <PanelShell>
        <div className="label mb-2 text-white/40">Subjects</div>
        <ul className="space-y-1">
          {[
            ["Anatomy", 2840, "#4F8CFF"],
            ["Physiology", 2360, "#00E5A8"],
            ["Biochemistry", 1920, "#F59E0B"],
            ["Pathology", 3120, "#EF4444"],
            ["Pharmacology", 2780, "#A78BFA"],
            ["Microbiology", 2050, "#22C55E"],
            ["Medicine", 3820, "#FB7185"],
            ["Surgery", 3450, "#34D399"],
          ].map(([n, c, color], i) => (
            <li
              key={n as string}
              className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm ${
                i === 0 ? "bg-white/[0.06] text-white" : "text-white/55"
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: color as string }}
                />
                {n}
              </span>
              <span className="text-[11px] text-white/30">{c as number}</span>
            </li>
          ))}
        </ul>
      </PanelShell>
      <PanelShell>
        <div className="flex flex-wrap items-center gap-1.5">
          {["All", "NEET PG", "INI-CET", "FMGE", "Recent PYQs", "Image-based"].map(
            (f, i) => (
              <span
                key={f}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                  i === 0
                    ? "border-accent/40 bg-accent/15 text-white"
                    : "border-white/8 bg-white/[0.02] text-white/55"
                }`}
              >
                {f}
              </span>
            )
          )}
        </div>
        <div className="mt-4 flex items-center gap-2 text-[11px] text-white/40">
          <span className="rounded-md bg-accent/15 px-1.5 py-0.5 text-accent">
            Medicine
          </span>
          <span>· Heart Failure</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Star size={11} className="text-warning" /> Moderate
          </span>
          <span className="rounded-md bg-warning/15 px-1.5 py-0.5 text-warning">
            PYQ
          </span>
        </div>
        <h3 className="mt-4 text-base font-medium leading-relaxed text-white md:text-lg">
          <span className="mr-2 text-white/40">Q1.</span>
          {SAMPLE.text}
        </h3>
        <div className="mt-4 grid gap-2">
          {SAMPLE.options.map((o) => (
            <button
              key={o.id}
              className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-3 text-left text-sm text-white/85 transition hover:border-white/20 hover:bg-white/[0.04]"
            >
              <span className="grid h-7 w-7 place-items-center rounded-md border border-white/10 bg-white/[0.02] text-[11px] font-medium text-white/60">
                {o.id}
              </span>
              {o.text}
            </button>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between">
          <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:border-white/20">
            Skip
          </button>
          <button className="btn-primary px-3.5 py-1.5 text-xs">
            Next question <ArrowRight size={12} />
          </button>
        </div>
      </PanelShell>
    </div>
  );
}

function VideosPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <PanelShell>
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-danger/15 via-accent/10 to-mint/10">
          <div className="absolute inset-0 grid place-items-center">
            <button className="grid h-16 w-16 place-items-center rounded-full bg-white/95 text-background shadow-card-lift transition hover:scale-105">
              <Play size={22} fill="currentColor" />
            </button>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
              <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-accent to-mint" />
            </div>
            <span className="font-mono text-[11px] text-white/70">6:14 / 18:24</span>
          </div>
          <div className="absolute left-3 top-3 chip text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-danger" /> LIVE-ANNOTATED
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-white">
              Coronary circulation walkthrough
            </h3>
            <p className="mt-1 text-xs text-white/55">
              Anatomy · Dr. Mehra · 18:24 · with AI annotations
            </p>
          </div>
          <button className="btn-ghost text-xs">
            <Plus size={13} /> Save
          </button>
        </div>
      </PanelShell>
      <PanelShell>
        <h3 className="font-display text-base font-semibold text-white">
          Recommended for you
        </h3>
        <ul className="mt-3 space-y-2">
          {RECOMMENDED_VIDEOS.map((v) => (
            <li
              key={v.title}
              className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-2.5"
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/[0.04] text-white/60">
                <Video size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-white">
                  {v.title}
                </div>
                <div className="text-[11px] text-white/45">
                  {v.subject} · {v.duration}
                </div>
              </div>
              <Play size={13} className="text-white/45" />
            </li>
          ))}
        </ul>
      </PanelShell>
    </div>
  );
}

function MockTestsPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <PanelShell className="lg:col-span-2">
        <h3 className="font-display text-base font-semibold text-white">
          Available tests
        </h3>
        <ul className="mt-3 space-y-2">
          {[
            ["NEET PG Grand Test 24", "200 Q · 3.5 hrs", "Score 184/200", 92],
            ["INI-CET Full Mock 11", "250 Q · 3 hrs", "Score 211/250", 84],
            ["Medicine subject test", "50 Q · 50 min", "Score 41/50", 82],
            ["Rapid revision — Surgery", "30 Q · 30 min", "In progress", 64],
          ].map(([t, meta, score, p], i) => (
            <li
              key={t as string}
              className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-3"
            >
              <span
                className={`grid h-9 w-9 place-items-center rounded-lg ${
                  i === 3 ? "bg-warning/15 text-warning" : "bg-accent/15 text-accent"
                }`}
              >
                <Trophy size={15} />
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{t}</div>
                <div className="text-[11px] text-white/50">{meta}</div>
              </div>
              <div className="hidden text-right md:block">
                <div className="font-mono text-sm text-white">{score}</div>
                <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-mint"
                    style={{ width: `${p}%` }}
                  />
                </div>
              </div>
              <button className="btn-ghost px-3 py-1.5 text-xs">
                {i === 3 ? "Resume" : "Start"}
              </button>
            </li>
          ))}
        </ul>
      </PanelShell>
      <PanelShell>
        <h3 className="font-display text-base font-semibold text-white">
          Your rank
        </h3>
        <div className="mt-4 grid place-items-center">
          <div className="relative grid h-40 w-40 place-items-center">
            <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#4F8CFF"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${(78 / 100) * 327} 327`}
              />
            </svg>
            <div className="text-center">
              <div className="font-display text-3xl font-semibold text-white">
                AIR 412
              </div>
              <div className="text-[11px] text-white/50">predicted</div>
            </div>
          </div>
        </div>
        <ul className="mt-3 space-y-1.5 text-xs">
          <li className="flex items-center justify-between text-white/65">
            <span>Accuracy</span>
            <span className="text-white">78%</span>
          </li>
          <li className="flex items-center justify-between text-white/65">
            <span>Time / Q</span>
            <span className="text-white">52s</span>
          </li>
          <li className="flex items-center justify-between text-white/65">
            <span>Streak</span>
            <span className="text-mint">12 days</span>
          </li>
        </ul>
      </PanelShell>
    </div>
  );
}

function NotesPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
      <PanelShell>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-white">
            My notes
          </h3>
          <button className="btn-primary px-3 py-1.5 text-xs">
            <Plus size={12} /> New
          </button>
        </div>
        <ul className="mt-3 space-y-1">
          {NOTES.map((n) => (
            <li
              key={n.id}
              className="cursor-pointer rounded-lg border border-white/8 bg-white/[0.02] p-2.5 hover:border-white/15"
            >
              <div className="text-sm font-medium text-white">{n.title}</div>
              <div className="mt-0.5 text-[11px] text-white/45">
                {n.subject} · {n.updated}
              </div>
            </li>
          ))}
        </ul>
      </PanelShell>
      <PanelShell>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-semibold text-white">
              Heart failure — drug summary
            </h3>
            <p className="mt-0.5 text-[11px] text-white/50">
              Medicine · last edited 2h ago
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="btn-ghost px-2.5 py-1.5 text-xs">
              <Sparkles size={12} /> Summarise
            </button>
            <button className="btn-ghost px-2.5 py-1.5 text-xs">
              <Settings size={12} />
            </button>
          </div>
        </div>
        <div className="mt-4 space-y-3 rounded-xl border border-white/8 bg-white/[0.01] p-4 text-sm leading-relaxed text-white/85">
          <p>
            <strong className="text-white">Mortality-reducing drugs in HFrEF</strong>{" "}
            (EF ≤ 40%): the four pillars are ARNI/ACE-i, beta-blockers (evidence-based),
            MRA, and SGLT2 inhibitors.
          </p>
          <ul className="list-disc space-y-1.5 pl-5 text-white/75">
            <li>
              <strong className="text-white">ARNI</strong> (sacubitril/valsartan) →
              PARADIGM-HF.
            </li>
            <li>
              <strong className="text-white">Beta-blockers</strong>: carvedilol,
              metoprolol succinate, bisoprolol.
            </li>
            <li>
              <strong className="text-white">MRA</strong> (spironolactone, eplerenone)
              → RALES, EMPHASIS-HF.
            </li>
            <li>
              <strong className="text-white">SGLT2i</strong> (dapagliflozin, empagliflozin)
              → DAPA-HF, EMPEROR-Reduced.
            </li>
          </ul>
          <p className="text-white/75">
            Symptom-relieving only: loop diuretics, digoxin (improves symptoms, not
            mortality), ivabradine (in a subset).
          </p>
        </div>
      </PanelShell>
    </div>
  );
}

function FlashcardsPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
      <PanelShell className="flex flex-col items-center justify-center py-10">
        <div className="text-[11px] uppercase tracking-wider text-white/40">
          Card 4 of 18
        </div>
        <div className="mt-4 grid aspect-[3/2] w-full max-w-md place-items-center rounded-2xl border border-white/15 bg-gradient-to-br from-accent/15 to-mint/10 p-6 text-center">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-accent">
              Triad
            </div>
            <div className="mt-2 font-display text-2xl font-semibold text-white">
              Beck&apos;s triad
            </div>
            <p className="mt-2 text-sm text-white/55">Tap to reveal</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button className="btn-ghost text-xs">
            <Pause size={12} /> Hard
          </button>
          <button className="btn-ghost text-xs">Good</button>
          <button className="btn-ghost text-xs">Easy</button>
        </div>
        <div className="mt-3 text-[11px] text-white/40">
          Next review in 2 hrs · 14 cards due today
        </div>
      </PanelShell>
      <PanelShell>
        <h3 className="font-display text-base font-semibold text-white">
          Today&apos;s deck
        </h3>
        <ul className="mt-3 space-y-1.5">
          {FLASHCARDS.map((c, i) => (
            <li
              key={i}
              className="rounded-lg border border-white/8 bg-white/[0.02] p-2.5"
            >
              <div className="text-sm font-medium text-white">{c.front}</div>
              <div className="mt-0.5 text-[11px] text-white/50">{c.back}</div>
            </li>
          ))}
        </ul>
      </PanelShell>
    </div>
  );
}

function PyqPanel() {
  return (
    <PanelShell>
      <h3 className="font-display text-base font-semibold text-white">
        Past papers
      </h3>
      <p className="mt-1 text-xs text-white/55">
        20+ years of NEET PG, INI-CET and FMGE papers — fully solved.
      </p>
      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {PYQ_LIST.map((p) => {
          const pct = Math.round((p.solved / p.q) * 100);
          return (
            <div
              key={p.year}
              className="rounded-xl border border-white/8 bg-white/[0.02] p-3"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-white">{p.year}</div>
                <span className="text-[11px] text-white/45">
                  {p.solved}/{p.q} solved
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-mint"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-white/50">
                <span>{pct}% complete</span>
                <button className="text-accent hover:text-accent/80">
                  Continue →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </PanelShell>
  );
}

function RankPredictorPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
      <PanelShell>
        <h3 className="font-display text-base font-semibold text-white">
          Predict your rank
        </h3>
        <p className="mt-1 text-xs text-white/55">
          Enter your mock score to get an AI-predicted AIR.
        </p>
        <div className="mt-5 space-y-3">
          <label className="block">
            <span className="text-xs text-white/55">Exam</span>
            <select className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white focus:border-accent/40 focus:outline-none">
              <option className="bg-background">NEET PG 2025</option>
              <option className="bg-background">INI-CET 2025</option>
              <option className="bg-background">FMGE 2025</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs text-white/55">Score (out of 800)</span>
            <input
              type="number"
              defaultValue={612}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white focus:border-accent/40 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-xs text-white/55">Category</span>
            <select className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white focus:border-accent/40 focus:outline-none">
              <option className="bg-background">General</option>
              <option className="bg-background">OBC</option>
              <option className="bg-background">SC / ST</option>
            </select>
          </label>
          <button className="btn-primary w-full text-sm">
            <TrendingUp size={13} /> Predict rank
          </button>
        </div>
      </PanelShell>
      <PanelShell>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-white">
            Predicted outcome
          </h3>
          <span className="chip text-[10px]">78% confidence</span>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            ["Predicted AIR", "412", "text-accent"],
            ["Percentile", "99.78", "text-mint"],
            ["Likely branch", "Radio", "text-purple-400"],
          ].map(([l, v, c]) => (
            <div
              key={l as string}
              className="rounded-xl border border-white/8 bg-white/[0.02] p-3 text-center"
            >
              <div className="text-[10px] uppercase tracking-wider text-white/40">
                {l}
              </div>
              <div className={`mt-1 font-display text-2xl font-semibold ${c}`}>
                {v}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-xl border border-accent/20 bg-accent/5 p-4 text-sm text-white/80">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-accent">
            <Sparkles size={11} /> Suggestion
          </div>
          <p className="mt-1.5">
            With AIR 412, top picks include MD Radio, MD Paediatrics, MD Anaesthesia
            (AIIMS), and MS OBG. Target INI-CET for counselling flexibility.
          </p>
        </div>
      </PanelShell>
    </div>
  );
}

function AnalyticsPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {[
        { label: "MCQs solved", value: "1,284", delta: "+184 this week", icon: Sparkles, color: "text-accent" },
        { label: "Accuracy", value: "78%", delta: "+6% vs last month", icon: Target, color: "text-mint" },
        { label: "Streak", value: "12 days", delta: "Best: 21", icon: Flame, color: "text-warning" },
        { label: "Time / Q", value: "52s", delta: "−8s vs last month", icon: Clock, color: "text-purple-400" },
      ].map((s) => (
        <PanelShell key={s.label}>
          <s.icon size={14} className={s.color} />
          <div className="mt-2 font-display text-2xl font-semibold text-white">
            {s.value}
          </div>
          <div className="text-xs text-white/50">{s.label}</div>
          <div className="mt-3 text-[11px] text-mint">{s.delta}</div>
        </PanelShell>
      ))}
      <PanelShell className="lg:col-span-2">
        <h3 className="font-display text-base font-semibold text-white">
          Subject heatmap
        </h3>
        <div className="mt-4 grid grid-cols-3 gap-2 md:grid-cols-4">
          {[
            ["Medicine", 86, "#4F8CFF"],
            ["Surgery", 79, "#00E5A8"],
            ["Pathology", 72, "#F59E0B"],
            ["Pharma", 64, "#EF4444"],
            ["Micro", 81, "#A78BFA"],
            ["OBG", 58, "#EC4899"],
            ["Anatomy", 74, "#22C55E"],
            ["Physio", 82, "#60A5FA"],
          ].map(([n, v, c]) => (
            <div
              key={n as string}
              className="rounded-xl border border-white/8 bg-white/[0.02] p-3"
            >
              <div className="text-[11px] text-white/55">{n}</div>
              <div className="mt-1 font-display text-xl font-semibold text-white">
                {v as number}%
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${v}%`, background: c as string }}
                />
              </div>
            </div>
          ))}
        </div>
      </PanelShell>
      <PanelShell>
        <h3 className="font-display text-base font-semibold text-white">
          Weak topics
        </h3>
        <ul className="mt-3 space-y-2">
          {[
            ["Acid-base disorders", 48],
            ["Cranial nerve palsies", 52],
            ["Antimicrobial spectrum", 56],
          ].map(([t, v]) => (
            <li
              key={t as string}
              className="rounded-lg border border-white/8 bg-white/[0.02] p-2.5"
            >
              <div className="flex items-center justify-between text-sm text-white">
                {t}
                <span className="text-[11px] text-warning">{v}%</span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-warning"
                  style={{ width: `${v}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </PanelShell>
    </div>
  );
}

function BookmarksPanel() {
  return (
    <PanelShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-base font-semibold text-white">
          Saved items
        </h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={12}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              type="text"
              placeholder="Search bookmarks..."
              className="h-8 rounded-full border border-white/10 bg-white/[0.03] pl-8 pr-3 text-xs text-white placeholder:text-white/40 focus:border-accent/40 focus:outline-none"
            />
          </div>
          <span className="chip text-[10px]">All · 42</span>
        </div>
      </div>
      <ul className="mt-4 divide-y divide-white/5">
        {[
          ["Heart failure pharmacology", "Question · Medicine", "saved 2h ago"],
          ["Coronary circulation video", "Video · Anatomy", "saved 1d ago"],
          ["Beck's triad — quick note", "Note · Medicine", "saved 2d ago"],
          ["INI-CET 2024 paper", "PYQ · INI-CET", "saved 3d ago"],
          ["TB drug regimens", "Note · Microbiology", "saved 5d ago"],
        ].map(([t, sub, time]) => (
          <li
            key={t as string}
            className="flex items-center justify-between gap-3 py-3"
          >
            <div>
              <div className="text-sm font-medium text-white">{t}</div>
              <div className="text-[11px] text-white/45">{sub}</div>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-white/45">
              <span>{time}</span>
              <button className="text-accent hover:text-accent/80">Open</button>
            </div>
          </li>
        ))}
      </ul>
    </PanelShell>
  );
}

function RevisionPlannerPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <PanelShell>
        <h3 className="font-display text-base font-semibold text-white">
          This week
        </h3>
        <p className="mt-0.5 text-xs text-white/50">
          28 of 42 chapters revised · 67% on track
        </p>
        <div className="mt-4 space-y-2">
          {SCHEDULE.map((d) => (
            <div
              key={d.day}
              className={`flex items-center gap-3 rounded-xl border p-3 ${
                d.current
                  ? "border-accent/30 bg-accent/5"
                  : "border-white/8 bg-white/[0.02]"
              }`}
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-xs text-white/70">
                {d.day}
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{d.focus}</div>
                {d.current && (
                  <div className="mt-0.5 text-[11px] text-accent">In progress</div>
                )}
              </div>
              <span
                className={`grid h-7 w-7 place-items-center rounded-full ${
                  d.done
                    ? "bg-mint/15 text-mint"
                    : d.current
                    ? "bg-accent/15 text-accent"
                    : "border border-white/10 text-white/30"
                }`}
              >
                {d.done ? <CheckCircle2 size={13} /> : d.current ? <Timer size={13} /> : d.day[0]}
              </span>
            </div>
          ))}
        </div>
      </PanelShell>
      <PanelShell>
        <h3 className="font-display text-base font-semibold text-white">
          Exam countdown
        </h3>
        <div className="mt-4 text-center">
          <div className="font-display text-5xl font-semibold gradient-text-accent">
            47
          </div>
          <div className="mt-1 text-xs text-white/50">days to NEET PG</div>
        </div>
        <div className="mt-6 space-y-2 text-xs">
          {[
            ["Syllabus coverage", 78],
            ["PYQ practice", 64],
            ["Mock test avg", 71],
            ["Weak-topic revision", 42],
          ].map(([l, v]) => (
            <div key={l as string}>
              <div className="flex items-center justify-between text-white/65">
                <span>{l}</span>
                <span className="text-white">{v}%</span>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-mint"
                  style={{ width: `${v}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <button className="btn-primary mt-5 w-full text-sm">
          <Sparkles size={13} /> Recalculate plan
        </button>
      </PanelShell>
    </div>
  );
}

function SchedulerPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <PanelShell>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-white">
            Today&apos;s focus timer
          </h3>
          <span className="flex items-center gap-1.5 text-[11px] text-mint">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" />
            Active session
          </span>
        </div>
        <div className="mt-6 grid place-items-center">
          <div className="relative grid h-56 w-56 place-items-center">
            <svg viewBox="0 0 200 200" className="absolute inset-0 -rotate-90">
              <circle
                cx="100"
                cy="100"
                r="86"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="12"
              />
              <circle
                cx="100"
                cy="100"
                r="86"
                fill="none"
                stroke="#4F8CFF"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(32 / 100) * 540} 540`}
              />
            </svg>
            <div className="text-center">
              <div className="font-display text-4xl font-semibold text-white">
                24:18
              </div>
              <div className="mt-1 text-[11px] text-white/50">Pathology · Block 2</div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2">
          <button className="btn-ghost text-xs">
            <Pause size={12} /> Pause
          </button>
          <button className="btn-primary text-xs">
            <CheckCircle2 size={12} /> End block
          </button>
        </div>
      </PanelShell>
      <PanelShell>
        <h3 className="font-display text-base font-semibold text-white">
          This week
        </h3>
        <div className="mt-4 grid grid-cols-7 gap-1.5 text-center">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => {
            const v = [85, 100, 70, 32, 0, 0, 0][i];
            return (
              <div key={`${d}-${i}`} className="space-y-1.5">
                <div className="text-[10px] text-white/45">{d}</div>
                <div
                  className={`mx-auto h-14 w-full rounded-md border ${
                    v > 0
                      ? "border-accent/30 bg-accent/15"
                      : "border-white/8 bg-white/[0.02]"
                  }`}
                  style={{
                    background:
                      v > 0
                        ? `linear-gradient(to top, rgba(79,140,255,0.4) ${v}%, transparent ${v}%)`
                        : undefined,
                  }}
                />
                <div className="text-[10px] text-white/45">
                  {v > 0 ? `${Math.round((v / 100) * 2.5)}h` : "—"}
                </div>
              </div>
            );
          })}
        </div>
        <ul className="mt-5 space-y-1.5 text-sm">
          <li className="flex items-center justify-between text-white/65">
            <span>Total this week</span>
            <span className="text-white">14.2 hrs</span>
          </li>
          <li className="flex items-center justify-between text-white/65">
            <span>Daily goal</span>
            <span className="text-white">2.5 hrs</span>
          </li>
          <li className="flex items-center justify-between text-white/65">
            <span>Streak</span>
            <span className="text-mint">12 days</span>
          </li>
        </ul>
      </PanelShell>
    </div>
  );
}

function PlaceholderPanel() {
  return (
    <PanelShell className="py-12 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/60">
        <Zap size={18} />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-white">
        Coming soon
      </h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-white/55">
        This feature is being polished. Get a head-start with the tools already
        live in your dashboard.
      </p>
      <div className="mt-5 flex justify-center gap-2">
        <a href="/dashboard" className="btn-primary text-xs">
          Back to overview
        </a>
        <a href="/dashboard/ai-tutor" className="btn-ghost text-xs">
          Try Pulse Tutor
        </a>
      </div>
    </PanelShell>
  );
}
