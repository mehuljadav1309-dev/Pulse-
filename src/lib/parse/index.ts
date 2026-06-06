import { parseJSON } from "./json";
import { parseCSV } from "./csv";
import { parseHTML } from "./html";
import { parsePDF } from "./pdf";
import { hashQuestion } from "./dedup";
import { extractMCQsWithAI, aiQuestionToMCQ, type AIExtractResult } from "./ai-extract";
import { fileToText } from "./file-to-text";
import type { ParseResult, ParsedMCQ } from "./types";

export type { ParsedMCQ, ParseResult } from "./types";

export type DedupeStats = { unique: number; duplicates: number };

export type FullParseResult = {
  /** All MCQs found (deterministic + AI), before dedup. */
  mcqs: ParsedMCQ[];
  /** MCQs that are not duplicates of each other or of pre-existing DB rows. */
  uniqueMcqs: ParsedMCQ[];
  /** Hashes of dropped duplicates. */
  dedupe: DedupeStats;
  warnings: string[];
  source: ParseResult["source"];
  /** Set when the AI extractor ran. */
  ai?: AIExtractResult;
};

export type ParseOptions = {
  /** When true, run the AI extractor alongside the deterministic parser.
   *  This is the recommended setting — the deterministic parser may miss
   *  embedded JS arrays, while the AI extractor reads the whole document
   *  holistically. Both results are merged and deduped. */
  aiFallback?: boolean;
  /** When true, skip the deterministic parser entirely and rely on the AI
   *  extractor alone. Useful for noisy / poorly-formatted PDFs. */
  aiAlways?: boolean;
  /** Pre-loaded hash set for cross-upload dedup. */
  knownHashes?: Set<string>;
};

/**
 * Single entry point: parse a file (PDF / HTML / CSV / JSON) into MCQs.
 *
 * Pipeline:
 *   1. (unless aiAlways) Run the deterministic parser for the file type.
 *   2. (when aiFallback or aiAlways) Run the AI extractor on the raw text.
 *   3. Merge deterministic + AI results, dedup, and return.
 *
 * The AI extractor is the primary path — it handles noisy PDFs, scanned
 * text, CEREB HTML, and ad-hoc formats that the deterministic parser
 * can't crack. The deterministic parser is kept as a fast first pass so
 * well-formatted files get instant results without paying the AI cost.
 */
export async function parseFile(
  file: File | { name: string; type: string; arrayBuffer: () => Promise<ArrayBuffer>; text?: () => Promise<string> },
  options: ParseOptions = {}
): Promise<FullParseResult> {
  const knownHashes = options.knownHashes ?? new Set();
  const name = (file.name ?? "").toLowerCase();
  const type = (file.type ?? "").toLowerCase();
  const warnings: string[] = [];

  // --- Step 1: deterministic parser (skipped if aiAlways) --------------------
  let deterministic: ParseResult = { mcqs: [], warnings: [], source: "json" };
  if (!options.aiAlways) {
    if (name.endsWith(".json") || type.includes("json")) {
      const text = typeof (file as File).text === "function" ? await (file as File).text() : "";
      deterministic = parseJSON(text);
    } else if (name.endsWith(".csv") || type.includes("csv") || type.includes("spreadsheet")) {
      const text = typeof (file as File).text === "function" ? await (file as File).text() : "";
      deterministic = parseCSV(text);
    } else if (name.endsWith(".pdf") || type === "application/pdf" || type.includes("pdf")) {
      const buf = Buffer.from(await file.arrayBuffer());
      deterministic = await parsePDF(buf, name);
    } else if (name.endsWith(".html") || name.endsWith(".htm") || type.includes("html")) {
      const text = typeof (file as File).text === "function" ? await (file as File).text() : "";
      deterministic = await parseHTML(text, name);
    } else {
      warnings.push(`Unsupported file type: ${name || type || "unknown"} — sending to AI as plain text.`);
    }
    warnings.push(...deterministic.warnings);
  }

  // --- Step 2: AI extractor (when enabled) -----------------------------------
  let ai: AIExtractResult | undefined;
  const fromAI: ParsedMCQ[] = [];
  const shouldRunAI = options.aiFallback || options.aiAlways;
  if (shouldRunAI) {
    try {
      const raw = await fileToText(file);
      if (raw && raw.trim().length > 50) {
        const ext = (name.split(".").pop() ?? "txt").toLowerCase();
        ai = await extractMCQsWithAI(raw, {
          sourceFormat: ext,
          filename: name,
        });
        for (const q of ai.questions) {
          const m = aiQuestionToMCQ(q, {});
          if (!m) continue;
          (m as ParsedMCQ & { _aiConfidence?: number; _aiNeedsReview?: boolean; _aiTags?: string[] })._aiConfidence = q.overallConfidence ?? 0;
          (m as ParsedMCQ & { _aiNeedsReview?: boolean })._aiNeedsReview = q.needsReview ?? false;
          (m as ParsedMCQ & { _aiTags?: string[] })._aiTags = q.tags ?? [];
          fromAI.push(m);
        }
        if (fromAI.length > 0) {
          warnings.push(
            `AI extractor (${ai.model}${ai.usedFallback ? ", fallback" : ""}) added ${fromAI.length} MCQ${fromAI.length === 1 ? "" : "s"} in ${(ai.durationMs / 1000).toFixed(1)}s.`
          );
        } else {
          warnings.push(
            `AI extractor (${ai.model}) returned 0 MCQs — document may not contain any.`
          );
        }
      } else {
        warnings.push("AI extractor skipped: file produced no text.");
      }
    } catch (e) {
      warnings.push(
        "AI extraction failed: " + (e instanceof Error ? e.message : String(e))
      );
    }
  }

  // --- Step 3: merge + dedup -------------------------------------------------
  const allMcqs = [...deterministic.mcqs, ...fromAI];
  return dedupe(
    { mcqs: allMcqs, warnings, source: deterministic.source },
    knownHashes,
    ai
  );
}

function dedupe(
  base: ParseResult,
  known: Set<string>,
  ai?: AIExtractResult
): FullParseResult {
  const seen = new Set(known);
  const unique: ParsedMCQ[] = [];
  let duplicates = 0;
  for (const m of base.mcqs) {
    const h = hashQuestion(m);
    if (seen.has(h)) {
      duplicates++;
      continue;
    }
    seen.add(h);
    unique.push(m);
  }
  return {
    mcqs: base.mcqs,
    uniqueMcqs: unique,
    dedupe: { unique: unique.length, duplicates },
    warnings: base.warnings,
    source: base.source,
    ai,
  };
}
