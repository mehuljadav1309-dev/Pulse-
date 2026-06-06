"use client";

import {
  Archive,
  BarChart3,
  Bookmark,
  CalendarDays,
  Layers,
  ListChecks,
  LucideIcon,
  Mic,
  Notebook,
  PlayCircle,
  Sparkles,
  Timer,
  TrendingUp,
} from "lucide-react";

export const FEATURE_ICON_MAP: Record<string, LucideIcon> = {
  Archive,
  BarChart3,
  Bookmark,
  CalendarDays,
  Layers,
  ListChecks,
  Mic,
  Notebook,
  PlayCircle,
  Sparkles,
  Timer,
  TrendingUp,
};

export function getFeatureIcon(name: string): LucideIcon {
  return FEATURE_ICON_MAP[name] ?? Sparkles;
}
