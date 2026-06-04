export const SITE = {
  name: "Pulse",
  tagline: "Crack NEET PG & INI-CET with AI",
  description:
    "Pulse is the AI-powered medical education platform built for NEET PG, INI-CET, and FMGE aspirants. 25,000+ MCQs, video lectures, AI viva simulator, mock tests, and personalized learning — all in one place.",
  url: "https://pulse.med",
  twitter: "@pulsemed",
} as const;

export const NAV_ITEMS = [
  { label: "Product", href: "#features" },
  { label: "Question Bank", href: "#question-bank" },
  { label: "AI Tutor", href: "#ai-tutor" },
  { label: "Mock Tests", href: "#mock-tests" },
  { label: "Pricing", href: "#pricing" },
] as const;

export const EXAMS = ["NEET PG", "INI-CET", "FMGE"] as const;

export const STATS = [
  { value: "25,000+", label: "Curated MCQs" },
  { value: "1,200+", label: "Video Lectures" },
  { value: "AIR <500", label: "Top Achievers" },
  { value: "94%", label: "Selection Rate" },
] as const;

export const SUBJECTS = [
  { name: "Anatomy", count: 2840, color: "#4F8CFF" },
  { name: "Physiology", count: 2360, color: "#00E5A8" },
  { name: "Biochemistry", count: 1920, color: "#F59E0B" },
  { name: "Pathology", count: 3120, color: "#EF4444" },
  { name: "Pharmacology", count: 2780, color: "#A78BFA" },
  { name: "Microbiology", count: 2050, color: "#22C55E" },
  { name: "Forensic Med", count: 1240, color: "#F472B6" },
  { name: "ENT", count: 980, color: "#FBBF24" },
  { name: "Ophthalmology", count: 1100, color: "#60A5FA" },
  { name: "Surgery", count: 3450, color: "#34D399" },
  { name: "Medicine", count: 3820, color: "#FB7185" },
  { name: "Pediatrics", count: 2180, color: "#A3E635" },
  { name: "OBG", count: 2640, color: "#38BDF8" },
  { name: "Orthopedics", count: 1320, color: "#C084FC" },
  { name: "Dermatology", count: 980, color: "#FACC15" },
  { name: "Psychiatry", count: 760, color: "#4ADE80" },
  { name: "Radiology", count: 1680, color: "#818CF8" },
  { name: "Anesthesia", count: 920, color: "#F87171" },
] as const;

export const FEATURES = [
  {
    title: "AI Medical Tutor",
    description: "Ask anything from renal physiology to surgical procedures. Get answers grounded in standard textbooks.",
    icon: "Sparkles",
    span: "lg:col-span-2 lg:row-span-2",
    accent: "from-accent/20 to-accent/0",
  },
  {
    title: "AI Viva Simulator",
    description: "Voice-based clinical case discussions with real-time feedback.",
    icon: "Mic",
    span: "lg:col-span-2",
    accent: "from-mint/20 to-mint/0",
  },
  {
    title: "Question Bank",
    description: "25,000+ MCQs with PYQs, clinical vignettes, and image-based questions.",
    icon: "ListChecks",
    span: "lg:col-span-2",
    accent: "from-warning/20 to-warning/0",
  },
  {
    title: "Video Library",
    description: "1,200+ conceptual lectures and surgical walkthroughs.",
    icon: "PlayCircle",
    span: "lg:col-span-2",
    accent: "from-danger/20 to-danger/0",
  },
  {
    title: "Smart Notes",
    description: "High-yield notes you can revise in minutes.",
    icon: "Notebook",
    span: "lg:col-span-1",
    accent: "from-purple-500/20 to-purple-500/0",
  },
  {
    title: "Flashcards",
    description: "Spaced repetition for long-term retention.",
    icon: "Layers",
    span: "lg:col-span-1",
    accent: "from-pink-500/20 to-pink-500/0",
  },
  {
    title: "PYQ Archive",
    description: "20+ years of past papers, fully solved.",
    icon: "Archive",
    span: "lg:col-span-1",
    accent: "from-cyan-500/20 to-cyan-500/0",
  },
  {
    title: "Rank Predictor",
    description: "AI-powered AIR prediction after every test.",
    icon: "TrendingUp",
    span: "lg:col-span-1",
    accent: "from-emerald-500/20 to-emerald-500/0",
  },
  {
    title: "Performance Analytics",
    description: "Subject-wise strengths, weaknesses, and time analysis.",
    icon: "BarChart3",
    span: "lg:col-span-1",
    accent: "from-orange-500/20 to-orange-500/0",
  },
  {
    title: "Bookmarks & Revision",
    description: "Save, tag, and revisit your weak topics.",
    icon: "Bookmark",
    span: "lg:col-span-1",
    accent: "from-blue-500/20 to-blue-500/0",
  },
  {
    title: "Revision Planner",
    description: "Adaptive schedules that fit your exam date.",
    icon: "CalendarDays",
    span: "lg:col-span-1",
    accent: "from-violet-500/20 to-violet-500/0",
  },
  {
    title: "Study Scheduler",
    description: "Block time, set goals, track streaks.",
    icon: "Timer",
    span: "lg:col-span-1",
    accent: "from-teal-500/20 to-teal-500/0",
  },
] as const;

export const SUCCESS_STORIES = [
  { name: "Aarav Mehta", college: "AIIMS Delhi", rank: "AIR 12", exam: "NEET PG '25", improvement: "+1840", image: "AM" },
  { name: "Sneha Iyer", college: "JIPMER Puducherry", rank: "AIR 47", exam: "INI-CET '25", improvement: "+960", image: "SI" },
  { name: "Rohan Kapoor", college: "PGI Chandigarh", rank: "AIR 89", exam: "NEET PG '25", improvement: "+1420", image: "RK" },
  { name: "Anjali Verma", college: "AIIMS Rishikesh", rank: "AIR 124", exam: "INI-CET '25", improvement: "+820", image: "AV" },
  { name: "Vikram Shah", college: "KEM Mumbai", rank: "AIR 31", exam: "NEET PG '25", improvement: "+2010", image: "VS" },
  { name: "Priya Nair", college: "MAMC Delhi", rank: "AIR 58", exam: "NEET PG '25", improvement: "+1340", image: "PN" },
  { name: "Karthik Rao", college: "CMC Vellore", rank: "AIR 76", exam: "INI-CET '25", improvement: "+1180", image: "KR" },
  { name: "Divya Singh", college: "AIIMS Bhubaneswar", rank: "AIR 102", exam: "NEET PG '25", improvement: "+980", image: "DS" },
  { name: "Arjun Reddy", college: "SGPGI Lucknow", rank: "AIR 145", exam: "INI-CET '25", improvement: "+720", image: "AR" },
  { name: "Meera Joshi", college: "AIIMS Jodhpur", rank: "AIR 167", exam: "NEET PG '25", improvement: "+640", image: "MJ" },
] as const;
