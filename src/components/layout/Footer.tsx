import Link from "next/link";
import { ArrowUpRight, Github, Twitter, Linkedin, Youtube } from "lucide-react";
import { SITE } from "@/lib/constants";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "AI Tutor", href: "#ai-tutor" },
      { label: "AI Viva", href: "#viva" },
      { label: "Question Bank", href: "#question-bank" },
      { label: "Mock Tests", href: "#mock-tests" },
      { label: "Video Library", href: "#video" },
    ],
  },
  {
    title: "Exams",
    links: [
      { label: "NEET PG", href: "#" },
      { label: "INI-CET", href: "#" },
      { label: "FMGE", href: "#" },
      { label: "NEET SS", href: "#" },
      { label: "USMLE", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Study Planner", href: "#" },
      { label: "Rank Predictor", href: "#" },
      { label: "PYQ Archive", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Community", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Faculty", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

const SOCIALS = [
  { Icon: Twitter, href: "#", label: "Twitter" },
  { Icon: Linkedin, href: "#", label: "LinkedIn" },
  { Icon: Youtube, href: "#", label: "YouTube" },
  { Icon: Github, href: "#", label: "GitHub" },
];

export function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden border-t border-white/5 bg-background">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute inset-0 -z-10 grid-bg opacity-30" />

      <div className="container-x py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-2.5" data-cursor="hover">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-accent to-mint">
                <span className="font-display text-sm font-bold text-background">P</span>
              </span>
              <span className="font-display text-[15px] font-semibold tracking-tight">
                Pulse
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/50">
              The AI-powered medical education platform built for the next generation of
              Indian doctors. Crack NEET PG, INI-CET & FMGE.
            </p>
            <div className="mt-7 flex items-center gap-2">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  data-cursor="hover"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.02] text-white/60 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="label mb-4 text-white/40">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      data-cursor="hover"
                      className="group inline-flex items-center gap-1.5 text-sm text-white/70 transition hover:text-white"
                    >
                      {l.label}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 transition group-hover:opacity-60"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-white/5 pt-8 md:flex-row md:items-center">
          <div className="flex items-center gap-3 text-xs text-white/40">
            <span>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>Made for medical aspirants.</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-white/40">
            <a href="#" className="hover:text-white" data-cursor="hover">
              Privacy
            </a>
            <a href="#" className="hover:text-white" data-cursor="hover">
              Terms
            </a>
            <a href="#" className="hover:text-white" data-cursor="hover">
              Security
            </a>
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint/60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-mint" />
              </span>
              All systems normal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
