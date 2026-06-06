import { extractFromObject } from "./normalize";
import type { ParseResult, ParsedMCQ } from "./types";

/**
 * JSON parser. Accepts a top-level array or an object with `mcqs / questions /
 * items / data / rows` arrays. Each row is normalized via `extractFromObject`.
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
  if (Array.isArray(data)) {
    arr = data;
  } else if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    for (const key of ["mcqs", "questions", "items", "data", "rows"]) {
      if (Array.isArray(obj[key])) {
        arr = obj[key] as unknown[];
        break;
      }
    }
    if (arr.length === 0) {
      return {
        mcqs: [],
        warnings: [
          "JSON must be an array, or an object with mcqs/questions/items/data/rows array.",
        ],
        source: "json",
      };
    }
  } else {
    return { mcqs: [], warnings: ["JSON root must be an array or object."], source: "json" };
  }

  const mcqs: ParsedMCQ[] = [];
  arr.forEach((item, idx) => {
    const m = extractFromObject(item);
    if (!m) {
      warnings.push(`Item ${idx + 1}: could not extract MCQ, skipped.`);
      return;
    }
    mcqs.push(m);
  });

  return { mcqs, warnings, source: "json" };
}
