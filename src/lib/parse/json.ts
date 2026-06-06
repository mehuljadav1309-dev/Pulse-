import type { ParseResult, ParsedMCQ } from "./types";

/**
 * Strict JSON parser.
 * Accepts an array of MCQ objects, or an object with an `mcqs` / `questions` array.
 */
export function parseJSON(input: string | object): ParseResult {
  const warnings: string[] = [];
  let data: unknown;
  if (typeof input === "string") {
    try {
      data = JSON.parse(input);
    } catch {
      return { mcqs: [], warnings: ["Invalid JSON syntax."], source: "json" };
    }
  } else {
    data = input;
  }

  let arr: unknown[] = [];
  if (Array.isArray(data)) arr = data;
  else if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    for (const key of ["mcqs", "questions", "items", "data"]) {
      if (Array.isArray(obj[key])) {
        arr = obj[key] as unknown[];
        break;
      }
    }
    if (arr.length === 0) {
      return {
        mcqs: [],
        warnings: ["JSON must be an array, or an object with mcqs/questions/items/data array."],
        source: "json",
      };
    }
  } else {
    return { mcqs: [], warnings: ["JSON root must be an array or object."], source: "json" };
  }

  const mcqs: ParsedMCQ[] = [];
  arr.forEach((item, idx) => {
    if (!item || typeof item !== "object") {
      warnings.push(`Item ${idx + 1}: not an object, skipped.`);
      return;
    }
    const o = item as Record<string, unknown>;
    const question = String(o.question ?? o.q ?? o.stem ?? "").trim();
    if (!question) {
      warnings.push(`Item ${idx + 1}: missing question, skipped.`);
      return;
    }
    const rawOptions = o.options ?? o.choices ?? o.answers;
    if (!Array.isArray(rawOptions) || rawOptions.length < 2) {
      warnings.push(`Item ${idx + 1}: needs options array (>=2), skipped.`);
      return;
    }
    const options = rawOptions.map((x) => String(x).trim());

    let correctIndex: number;
    const ans = o.answer ?? o.correct ?? o.correctIndex ?? o.answerIndex;
    if (typeof ans === "number") correctIndex = ans;
    else if (typeof ans === "string") {
      const t = ans.trim().toUpperCase();
      if (/^[0-9]+$/.test(t)) correctIndex = parseInt(t, 10);
      else {
        const m = t.match(/^([A-Z])/);
        if (m) correctIndex = m[1].charCodeAt(0) - 65;
        else correctIndex = options.findIndex((opt) => opt.toLowerCase() === t.toLowerCase());
      }
    } else correctIndex = 0;
    if (correctIndex < 0 || correctIndex >= options.length) {
      warnings.push(`Item ${idx + 1}: invalid answer index, defaulted to 0.`);
      correctIndex = 0;
    }
    const explanation = o.explanation
      ? String(o.explanation).trim()
      : undefined;
    const difficulty = (["easy", "medium", "hard"] as const).find(
      (d) => d === (o.difficulty as string)
    );
    mcqs.push({ question, options, correctIndex, explanation, difficulty });
  });

  return { mcqs, warnings, source: "json" };
}
