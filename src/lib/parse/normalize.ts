import type { ParsedMCQ } from "./types";

/**
 * Normalize any plain-object row (from a JSON array, a JS array literal in an
 * iframe srcdoc, or a CSV row) into a ParsedMCQ. Returns null if the row
 * cannot be turned into a usable MCQ.
 *
 * Field aliases (first hit wins):
 *   question:  q | question | question_html | stem | text | prompt
 *   options:   options[] | choices[] | answers[] | option_a..option_f
 *              | a..f  | [{label, text, correct}]   (CEREB shape)
 *   answer:    answer | ans | correct | correctIndex | answerIndex
 *              (string letter "C", string "C. ...", or numeric index)
 *   explanation: explanation | explanation_html | solution | exp | rationale
 *   topic:     topic | subject | chapter | section
 *   difficulty: difficulty | level
 */
export function extractFromObject(input: unknown): ParsedMCQ | null {
  if (!input || typeof input !== "object") return null;
  const o = input as Record<string, unknown>;

  const pick = (...keys: string[]): unknown => {
    for (const k of keys) {
      if (o[k] !== undefined && o[k] !== null && o[k] !== "") return o[k];
    }
    return undefined;
  };

  const stripHtml = (s: string): string =>
    s
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|tr|h\d)>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

  // 1. Question
  const rawQuestion = pick(
    "question_html",
    "question",
    "q",
    "stem",
    "text",
    "prompt"
  );
  if (rawQuestion === undefined) return null;
  const question = stripHtml(String(rawQuestion));
  if (!question) return null;

  // 2. Options
  let options: string[] = [];
  let correctFlagIndex = -1;
  const rawOptions = pick("options", "choices", "answers", "opts");
  if (Array.isArray(rawOptions) && rawOptions.length > 0) {
    if (
      typeof rawOptions[0] === "object" &&
      rawOptions[0] !== null
    ) {
      // CEREB shape: [{label, text, correct}] or similar
      options = rawOptions.map((entry) => {
        const e = entry as Record<string, unknown>;
        const t = String(e.text ?? e.option ?? e.label ?? e.value ?? "").trim();
        return stripHtml(t);
      });
      rawOptions.forEach((entry, i) => {
        const e = entry as Record<string, unknown>;
        if (
          e.correct === true ||
          e.is_correct === true ||
          e.isCorrect === true ||
          e.answer === true
        ) {
          correctFlagIndex = i;
        }
      });
    } else {
      options = rawOptions.map((v) => stripHtml(String(v)));
    }
  } else {
    // Fallback: option_a..option_f / a..f
    const flat: string[] = [];
    const letterKeys = ["a", "b", "c", "d", "e", "f"];
    for (const k of letterKeys) {
      const v = pick(`option_${k}`, k);
      if (v !== undefined) flat.push(stripHtml(String(v)));
    }
    if (flat.length >= 2) options = flat;
  }
  if (options.length < 2) return null;

  // 3. Answer resolution
  let correctIndex = -1;
  const ans = pick("correct_answer", "answer", "ans", "correct", "correctIndex", "answerIndex");
  if (typeof ans === "number") {
    correctIndex = ans;
  } else if (typeof ans === "string") {
    const t = ans.trim();
    // "C. ..." prefix
    const m = t.match(/^([A-H])[.)\s]/i);
    if (m) {
      correctIndex = m[1].toUpperCase().charCodeAt(0) - 65;
    } else if (/^[A-H]$/i.test(t)) {
      correctIndex = t.toUpperCase().charCodeAt(0) - 65;
    } else if (/^\d+$/.test(t)) {
      correctIndex = parseInt(t, 10);
    } else {
      // exact text match
      const lower = t.toLowerCase();
      const i = options.findIndex((o) => o.toLowerCase() === lower);
      if (i >= 0) correctIndex = i;
    }
  }
  if (correctIndex < 0 && correctFlagIndex >= 0) {
    correctIndex = correctFlagIndex;
  }
  if (correctIndex < 0 || correctIndex >= options.length) {
    correctIndex = 0;
  }

  // 4. Explanation
  const explanation = pick(
    "explanation_html",
    "explanation",
    "solution",
    "exp",
    "rationale"
  );
  const explanationStr = explanation ? stripHtml(String(explanation)) : undefined;

  // 5. Topic
  const topic = pick("topic", "subject", "chapter", "section");
  const topicStr = topic ? String(topic).trim() : undefined;

  // 6. Difficulty
  const diff = pick("difficulty", "level");
  const diffStr = ["easy", "medium", "hard"].includes(String(diff ?? "").toLowerCase())
    ? (String(diff).toLowerCase() as "easy" | "medium" | "hard")
    : undefined;

  return {
    question,
    options,
    correctIndex,
    explanation: explanationStr,
    difficulty: diffStr,
    topic: topicStr,
  };
}
