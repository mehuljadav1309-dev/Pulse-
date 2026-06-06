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

export type FullParseResult = ParseResult & {
  uniqueMcqs: ParsedMCQ[];
  dedupe: DedupeStats;
  ai?: AIExtractResult;
};

export type ParseOptions = {
  /** If true, run the AI extractor as a fallback when the deterministic
   *  parser returns <3 MCQs. */
  aiFallback?: boolean;
  /** If true, always run the AI extractor (skipped if disabled). */
  aiAlways?: boolean;
  /** Pre-loaded hash set for dedup. */
  knownHashes?: Set<string>;
};

/**
 * Parse a file and return deduped MCQs plus a parse report.
 *
 * HTML parser is async (no real I/O today, but kept async for forward compat).
 */
export async function parseFile(
  file: File | { name: string; type: string; arrayBuffer: () => Promise<ArrayBuffer> },
  options: ParseOptions = {}
): Promise<FullParseResult> {
  const knownHashes = options.knownHashes ?? new Set();
  const name = (file.name ?? "").toLowerCase();
  const type = (file.type ?? "").toLowerCase();

  let base: ParseResult;
  if (name.endsWith(".json") || type.includes("json")) {
    const text = typeof (file as File).text === "function" ? await (file as File).text() : "";
    base = parseJSON(text);
  } else if (name.endsWith(".csv") || type.includes("csv") || type.includes("spreadsheet")) {
    const text = typeof (file as File).text === "function" ? await (file as File).text() : "";
    base = parseCSV(text);
  } else if (name.endsWith(".pdf") || type === "application/pdf" || type.includes("pdf")) {
    const buf = Buffer.from(await file.arrayBuffer());
    base = await parsePDF(buf, name);
  } else if (name.endsWith(".html") || name.endsWith(".htm") || type.includes("html")) {
    const text = typeof (file as File).text === "function" ? await (file as File).text() : "";
    base = await parseHTML(text, name);
  } else {
    base = {
      mcqs: [],
      warnings: [`Unsupported file type: ${name || type || "unknown"}`],
      source: "json",
    };
  }

  const deterministic = dedupe(base, knownHashes);

  // Optionally run the AI extractor
  let ai: AIExtractResult | undefined;
  const shouldRunAI =
    options.aiAlways ||
    (options.aiFallback && (deterministic.uniqueMcqs.length < 3 || deterministic.dedupe.duplicates > deterministic.uniqueMcqs.length));
  if (shouldRunAI) {
    try {
      const raw = await fileToText(file);
      if (raw && raw.trim().length > 50) {
        const ext = (name.split(".").pop() ?? "txt").toLowerCase();
        ai = await extractMCQsWithAI(raw, {
          sourceFormat: ext,
          filename: name,
        });
        // Convert AI questions to MCQs and merge
        const fromAI: ParsedMCQ[] = [];
        for (const q of ai.questions) {
          const m = aiQuestionToMCQ(q, {});
          if (m) {
            // Preserve the question text exactly as the AI returned it
            (m as any)._aiConfidence = q.overallConfidence ?? 0;
            (m as any)._aiNeedsReview = q.needsReview ?? false;
            (m as any)._aiTags = q.tags ?? [];
            fromAI.push(m);
          }
        }
        // Combine, dedup, and re-stat
        const merged: ParseResult = {
          source: base.source,
          warnings: [
            ...base.warnings,
            ...(fromAI.length > 0
              ? [`AI extractor added ${fromAI.length} MCQs (model: ${ai.model}).`]
              : []),
          ],
          mcqs: [...deterministic.uniqueMcqs, ...fromAI],
        };
        return dedupe(merged, knownHashes, ai);
      }
    } catch (e) {
      deterministic.warnings.push(
        "AI extraction failed: " + (e instanceof Error ? e.message : String(e))
      );
    }
  }

  return deterministic;
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
    ...base,
    uniqueMcqs: unique,
    dedupe: { unique: unique.length, duplicates },
    ai,
  };
}
