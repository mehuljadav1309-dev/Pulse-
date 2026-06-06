import { extractFromObject } from "./normalize";
import type { ParseResult } from "./types";

/**
 * RFC-4180-ish CSV parser. Handles:
 *   - quoted cells ("…") with embedded commas, newlines, and "" escapes
 *   - CRLF / LF / CR line endings
 *   - blank lines (skipped)
 * Returns a 2-D array of unescaped cell strings.
 */
function parseCSVText(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  let i = 0;
  while (i < input.length) {
    const c = input[i];
    if (inQuotes) {
      if (c === '"') {
        if (input[i + 1] === '"') {
          cell += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      cell += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ",") {
      row.push(cell);
      cell = "";
      i++;
      continue;
    }
    if (c === "\r") {
      // peek for CRLF
      if (input[i + 1] === "\n") i++;
      row.push(cell);
      cell = "";
      if (row.length > 0 && !(row.length === 1 && row[0] === "")) rows.push(row);
      row = [];
      i++;
      continue;
    }
    if (c === "\n") {
      row.push(cell);
      cell = "";
      if (!(row.length === 1 && row[0] === "")) rows.push(row);
      row = [];
      i++;
      continue;
    }
    cell += c;
    i++;
  }
  if (cell !== "" || row.length > 0) {
    row.push(cell);
    if (!(row.length === 1 && row[0] === "")) rows.push(row);
  }
  return rows;
}

const HEADER_ALIASES: Record<string, string[]> = {
  question: ["question", "q", "stem", "prompt", "text", "question_html"],
  a: ["a", "option_a", "opt_a", "choice_a", "answer_a"],
  b: ["b", "option_b", "opt_b", "choice_b", "answer_b"],
  c: ["c", "option_c", "opt_c", "choice_c", "answer_c"],
  d: ["d", "option_d", "opt_d", "choice_d", "answer_d"],
  e: ["e", "option_e", "opt_e", "choice_e", "answer_e"],
  f: ["f", "option_f", "opt_f", "choice_f", "answer_f"],
  answer: ["answer", "correct", "correct_answer", "ans", "key"],
  explanation: ["explanation", "explain", "solution", "exp", "rationale", "explanation_html"],
  topic: ["topic", "subject", "chapter", "section"],
  difficulty: ["difficulty", "level"],
  source: ["source", "ref"],
};

/**
 * CSV parser. Returns ParsedMCQ[] via the shared normalizer.
 */
export function parseCSV(input: string): ParseResult {
  const warnings: string[] = [];
  const rows = parseCSVText(input);
  if (rows.length < 2) {
    return { mcqs: [], warnings: ["CSV has no data rows."], source: "csv" };
  }

  const header = rows[0].map((h) => h.trim().toLowerCase());
  // Map each standard field to a column index, picking the first matching alias
  const col: Record<string, number> = {};
  for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
    for (const a of aliases) {
      const idx = header.indexOf(a);
      if (idx >= 0) {
        col[field] = idx;
        break;
      }
    }
  }
  if (col.question === undefined) {
    return {
      mcqs: [],
      warnings: ["CSV is missing a question column (expected: question, q, stem, …)."],
      source: "csv",
    };
  }
  if (col.a === undefined && col.b === undefined) {
    return {
      mcqs: [],
      warnings: ["CSV is missing option columns (expected: a, b, c, d, …)."],
      source: "csv",
    };
  }

  const mcqs = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (row.length === 1 && row[0] === "") continue;
    const obj: Record<string, string> = {};
    const get = (field: string): string => {
      const idx = col[field];
      if (idx === undefined) return "";
      return (row[idx] ?? "").trim();
    };
    obj.question = get("question");
    obj.a = get("a");
    obj.b = get("b");
    if (col.c !== undefined) obj.c = get("c");
    if (col.d !== undefined) obj.d = get("d");
    if (col.e !== undefined) obj.e = get("e");
    if (col.f !== undefined) obj.f = get("f");
    if (col.answer !== undefined) obj.answer = get("answer");
    if (col.explanation !== undefined) obj.explanation = get("explanation");
    if (col.topic !== undefined) obj.topic = get("topic");
    if (col.difficulty !== undefined) obj.difficulty = get("difficulty");

    const m = extractFromObject(obj);
    if (m) mcqs.push(m);
    else warnings.push(`Row ${r + 1}: could not extract MCQ, skipped.`);
  }

  return { mcqs, warnings, source: "csv" };
}
