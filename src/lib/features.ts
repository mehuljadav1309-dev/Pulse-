export type FeatureGroup = "Learn" | "Practice" | "Track" | "Tools";

export type DashboardFeature = {
  slug: string;
  title: string;
  short: string;
  description: string;
  href: string;
  iconName: string;
  group: FeatureGroup;
  accent: string;
  ring: string;
  badge?: string;
  highlights: string[];
  status: "live" | "beta" | "coming";
};

export const DASHBOARD_FEATURES: DashboardFeature[] = [
  {
    slug: "ai-tutor",
    title: "AI Medical Tutor",
    short: "Your 24/7 medical professor",
    description:
      "Ask anything from renal physiology to surgical procedures. Get answers grounded in standard textbooks with citations and clinical reasoning.",
    href: "/dashboard/ai-tutor",
    iconName: "Sparkles",
    group: "Learn",
    accent: "from-accent/25 via-accent/5 to-transparent",
    ring: "ring-accent/30",
    badge: "Most used",
    highlights: ["Textbook citations", "Voice viva mode", "Clinical reasoning"],
    status: "live",
  },
  {
    slug: "viva",
    title: "AI Viva Simulator",
    short: "Voice-based clinical cases",
    description:
      "Practice clinical case discussions out loud. The AI plays examiner, evaluates your answers, and corrects gaps in real time.",
    href: "/dashboard/viva",
    iconName: "Mic",
    group: "Practice",
    accent: "from-mint/25 via-mint/5 to-transparent",
    ring: "ring-mint/30",
    badge: "Voice",
    highlights: ["Real-time feedback", "Case library", "Examiner mode"],
    status: "live",
  },
  {
    slug: "question-bank",
    title: "Question Bank",
    short: "25,000+ MCQs tuned for NEET PG",
    description:
      "Subject-wise filtering, difficulty modes, image-based questions, PYQ archive, and an AI explanation engine.",
    href: "/dashboard/question-bank",
    iconName: "ListChecks",
    group: "Practice",
    accent: "from-warning/25 via-warning/5 to-transparent",
    ring: "ring-warning/30",
    highlights: ["PYQ archive", "Image-based", "AI explanations"],
    status: "live",
  },
  {
    slug: "videos",
    title: "Video Library",
    short: "1,200+ conceptual lectures",
    description:
      "High-yield video lectures and surgical walkthroughs from top faculty, structured by subject and topic.",
    href: "/dashboard/videos",
    iconName: "PlayCircle",
    group: "Learn",
    accent: "from-danger/25 via-danger/5 to-transparent",
    ring: "ring-danger/30",
    highlights: ["1,200+ lectures", "Surgical walkthroughs", "Topic search"],
    status: "live",
  },
  {
    slug: "notes",
    title: "Smart Notes",
    short: "High-yield notes in minutes",
    description:
      "Concise, exam-oriented notes you can revise in minutes — auto-generated from lectures and the AI tutor.",
    href: "/dashboard/notes",
    iconName: "Notebook",
    group: "Learn",
    accent: "from-purple-500/25 via-purple-500/5 to-transparent",
    ring: "ring-purple-500/30",
    highlights: ["Exam-oriented", "Auto summaries", "Highlight & annotate"],
    status: "live",
  },
  {
    slug: "flashcards",
    title: "Flashcards",
    short: "Spaced repetition for retention",
    description:
      "Spaced-repetition flashcards tuned to your weak areas. Reviewed at the exact moment you're about to forget.",
    href: "/dashboard/flashcards",
    iconName: "Layers",
    group: "Learn",
    accent: "from-pink-500/25 via-pink-500/5 to-transparent",
    ring: "ring-pink-500/30",
    highlights: ["Spaced repetition", "Weak-area focus", "Daily review"],
    status: "live",
  },
  {
    slug: "pyq",
    title: "PYQ Archive",
    short: "20+ years of past papers",
    description:
      "Two decades of past papers across NEET PG, INI-CET, and FMGE — fully solved with explanations.",
    href: "/dashboard/pyq",
    iconName: "Archive",
    group: "Practice",
    accent: "from-cyan-500/25 via-cyan-500/5 to-transparent",
    ring: "ring-cyan-500/30",
    highlights: ["20+ years", "Fully solved", "Topic filters"],
    status: "live",
  },
  {
    slug: "rank-predictor",
    title: "Rank Predictor",
    short: "AI-powered AIR prediction",
    description:
      "Get an All India Rank prediction after every mock test using a model trained on years of historical data.",
    href: "/dashboard/rank-predictor",
    iconName: "TrendingUp",
    group: "Track",
    accent: "from-emerald-500/25 via-emerald-500/5 to-transparent",
    ring: "ring-emerald-500/30",
    badge: "New",
    highlights: ["AIR prediction", "Trend graph", "College cutoffs"],
    status: "live",
  },
  {
    slug: "analytics",
    title: "Performance Analytics",
    short: "Subject-wise strengths & gaps",
    description:
      "Detailed analytics on your accuracy, time per question, subject-wise strengths, and weaknesses.",
    href: "/dashboard/analytics",
    iconName: "BarChart3",
    group: "Track",
    accent: "from-orange-500/25 via-orange-500/5 to-transparent",
    ring: "ring-orange-500/30",
    highlights: ["Subject heatmap", "Time analysis", "Weak topics"],
    status: "live",
  },
  {
    slug: "bookmarks",
    title: "Bookmarks & Revision",
    short: "Save, tag, revisit",
    description:
      "Save questions, notes, and lectures. Tag them by subject and let Pulse build a revision queue for you.",
    href: "/dashboard/bookmarks",
    iconName: "Bookmark",
    group: "Tools",
    accent: "from-blue-500/25 via-blue-500/5 to-transparent",
    ring: "ring-blue-500/30",
    highlights: ["Smart tags", "Revision queue", "Cross-feature"],
    status: "live",
  },
  {
    slug: "revision-planner",
    title: "Revision Planner",
    short: "Adaptive schedules to your exam",
    description:
      "Adaptive revision plans that fit your exam date, syllabus, and current progress — recalculated every day.",
    href: "/dashboard/revision-planner",
    iconName: "CalendarDays",
    group: "Tools",
    accent: "from-violet-500/25 via-violet-500/5 to-transparent",
    ring: "ring-violet-500/30",
    highlights: ["Adaptive plan", "Daily targets", "Exam-aware"],
    status: "live",
  },
  {
    slug: "scheduler",
    title: "Study Scheduler",
    short: "Block time, set goals, streak",
    description:
      "Block study time, set daily goals, and track streaks. Pulse nudges you when you fall behind.",
    href: "/dashboard/scheduler",
    iconName: "Timer",
    group: "Tools",
    accent: "from-teal-500/25 via-teal-500/5 to-transparent",
    ring: "ring-teal-500/30",
    highlights: ["Time blocking", "Streaks", "Daily goals"],
    status: "live",
  },
];

export const FEATURE_GROUPS: { id: FeatureGroup; label: string }[] = [
  { id: "Learn", label: "Learn" },
  { id: "Practice", label: "Practice" },
  { id: "Track", label: "Track progress" },
  { id: "Tools", label: "Tools" },
];

export function getFeatureBySlug(slug: string): DashboardFeature | undefined {
  return DASHBOARD_FEATURES.find((f) => f.slug === slug);
}
