"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

type ActivityItem = {
  id: string;
  title: string;
  subject: string;
  meta: string;
  score?: string;
  type: "quiz" | "video" | "note" | "mock";
};

const TYPE_STYLES: Record<ActivityItem["type"], { color: string; label: string; emoji: string }> = {
  quiz: { color: "from-accent to-mint", label: "Quiz", emoji: "📝" },
  video: { color: "from-danger to-accent", label: "Video", emoji: "🎬" },
  note: { color: "from-purple-500 to-mint", label: "Note", emoji: "📒" },
  mock: { color: "from-warning to-pink-500", label: "Mock", emoji: "🏁" },
};

export function ActivityList({ items }: { items: ActivityItem[] }) {
  return (
    <ul className="space-y-2">
      {items.map((a, i) => {
        const s = TYPE_STYLES[a.type];
        return (
          <motion.li
            key={a.id}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.35, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            className="group flex items-center gap-3 rounded-xl border border-transparent p-2.5 transition-all hover:border-white/10 hover:bg-white/[0.03]"
          >
            <span
              className={cn(
                "icon-tile shrink-0",
                `bg-gradient-to-br ${s.color}`,
                "h-9 w-9"
              )}
              style={{ width: "2.25rem", height: "2.25rem", borderRadius: "0.65rem" }}
            >
              <span className="text-sm">{s.emoji}</span>
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13.5px] font-semibold text-white">
                {a.title}
              </div>
              <div className="mt-0.5 text-[11px] text-white/45">
                {a.subject} · {a.meta}
              </div>
            </div>
            {a.score && (
              <span className="hidden rounded-full border border-mint/30 bg-mint/10 px-2 py-0.5 text-[10px] font-bold text-mint sm:inline-flex">
                {a.score}
              </span>
            )}
            <ChevronRight
              size={14}
              className="text-white/35 transition-transform group-hover:translate-x-0.5 group-hover:text-white"
            />
          </motion.li>
        );
      })}
    </ul>
  );
}

export type { ActivityItem };
