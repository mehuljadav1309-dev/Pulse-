import { createHash } from "node:crypto";
import type { ParsedMCQ } from "./types";

/**
 * Stable hash used to deduplicate MCQs across uploads.
 * Strips HTML, lowercases, joins question + options + answer index.
 */
export function hashQuestion(m: Pick<ParsedMCQ, "question" | "options" | "correctIndex">): string {
  const norm = (s: string) =>
    s
      .replace(/<[^>]+>/g, "")
      .replace(/&[a-z]+;/gi, " ")
      .replace(/[^a-z0-9]+/gi, " ")
      .trim()
      .toLowerCase();
  const payload =
    norm(m.question) +
    "\u0001" +
    m.options.map(norm).join("\u0001") +
    "\u0001" +
    m.correctIndex;
  return createHash("sha256").update(payload).digest("hex");
}
