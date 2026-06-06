import Papa from "papaparse";
import type { ParseResult, ParsedMCQ } from "./types";

/**
 * CSV parser.
 * Expected columns (case-insensitive, any order):
 *   question | q | stem
 *   option_a / a | option_b / b | option_c / c | option_d / d
 *   answer | correct | answer_index
 *   explanation (optional)
 *   difficulty (optional)
 */
export function parseCSV(input: string): ParseResult {
  const warnings: string[] = [];
  const result = Papa.parse<Record<string, string>>(input, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, "_"),
    // Don't try to be strict — accept rows that have extra fields (e.g. unquoted
    // commas in explanation cells) and just keep the first N fields.
  });
  if (result.errors.length) {
    for (const e of result.errors.slice(0, 3)) {
      if (e.code === "TooFewFields" || e.code === "TooManyFields") continue;
      warnings.push(`Row ${e.row}: ${e.message}`);
    }
  }

  const mcqs: ParsedMCQ[] = [];
  result.data.forEach((row, idx) => {
    const get = (...keys: string[]) => {
      for (const k of keys) {
        if (row[k] != null && String(row[k]).trim() !== "") return String(row[k]).trim();
      }
      return "";
    };
    const question = get("question", "q", "stem", "question_text");
    if (!question) {
      warnings.push(`Row ${idx + 1}: no question column, skipped.`);
      return;
    }
    const options: string[] = [];
    for (const k of ["a", "b", "c", "d", "e", "f"]) {
      const v = get(`option_${k}`, k, `opt_${k}`, `choice_${k}`);
      if (v) options.push(v);
    }
    if (options.length < 2) {
      warnings.push(`Row ${idx + 1}: needs at least 2 options, skipped.`);
      return;
    }
    const ansRaw = get("answer", "correct", "correct_answer", "answer_index");
    let correctIndex = 0;
    if (/^\d+$/.test(ansRaw)) correctIndex = parseInt(ansRaw, 10);
    else {
      const m = ansRaw.toUpperCase().match(/^([A-Z])/);
      if (m) correctIndex = m[1].charCodeAt(0) - 65;
    }
    if (correctIndex < 0 || correctIndex >= options.length) correctIndex = 0;
    const explanation = get("explanation", "explain", "rationale") || undefined;
    const diff = get("difficulty");
    const difficulty = (["easy", "medium", "hard"] as const).find((d) => d === diff);
    mcqs.push({ question, options, correctIndex, explanation, difficulty });
  });

  return { mcqs, warnings, source: "csv" };
}
