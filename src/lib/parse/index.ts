import { parseJSON } from "./json";
import { parseCSV } from "./csv";
import { parseHTML } from "./html";
import { parsePDF } from "./pdf";
import { hashQuestion } from "./dedup";
import type { ParseResult, ParsedMCQ } from "./types";

export type { ParsedMCQ, ParseResult } from "./types";

export type DedupeStats = { unique: number; duplicates: number };

export type FullParseResult = ParseResult & {
  uniqueMcqs: ParsedMCQ[];
  dedupe: DedupeStats;
};

/**
 * Parse a file and return deduped MCQs plus a parse report.
 *
 * HTML parser is async (no real I/O today, but kept async for forward compat).
 */
export async function parseFile(
  file: File | { name: string; type: string; arrayBuffer: () => Promise<ArrayBuffer> },
  knownHashes: Set<string> = new Set()
): Promise<FullParseResult> {
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

  return dedupe(base, knownHashes);
}

function dedupe(base: ParseResult, known: Set<string>): FullParseResult {
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
  };
}
