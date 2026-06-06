import * as cheerio from "cheerio";
import type { ParseResult, ParsedMCQ } from "./types";

/**
 * Heuristic HTML parser.
 * Walks all <p>, <div>, <li>, <tr>, <pre> blocks and stitches question text
 * (recognised by leading "Q1." / "1." / "1)") with 2+ option lines
 * ("A)", "A.", "A -") and an answer/explanation line.
 */
export function parseHTML(html: string): ParseResult {
  const warnings: string[] = [];
  const $ = cheerio.load(html);

  // Strip scripts / styles
  $("script, style, noscript").remove();

  // Collect all block-level text nodes
  const lines: string[] = [];
  $("body")
    .find("p, div, li, tr, pre, h1, h2, h3, h4, h5, h6, br")
    .each((_, el) => {
      const t = $(el).text().replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
      if (t) lines.push(t);
    });
  if (lines.length === 0) {
    $("body *").each((_, el) => {
      const node = el as { type?: string };
      if (node.type === "text") {
        const t = $(el).text().replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
        if (t) lines.push(t);
      }
    });
  }

  return { mcqs: extractMCQsFromText(lines.join("\n"), warnings), warnings, source: "html" };
}

const QUESTION_START = /^\s*(?:Q\s*)?(\d{1,4})[.)]\s*(.+?)\s*$/i;
const OPTION_LINE = /^\s*([A-H])[.)]\s*(.+?)\s*$/i;
const ANSWER_LINE =
  /^\s*(?:Ans(?:wer)?|Correct\s*Ans(?:wer)?|Key)\s*[:\-=]?\s*(.+?)\s*$/i;
const EXPLAIN_START = /^\s*(?:Exp(?:lanation)?|Reason|Rationale)\s*[:\-=]?\s*(.+?)\s*$/i;

export function extractMCQsFromText(
  text: string,
  warnings: string[]
): ParsedMCQ[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const mcqs: ParsedMCQ[] = [];
  let i = 0;
  while (i < lines.length) {
    const qm = lines[i].match(QUESTION_START);
    if (!qm) {
      i++;
      continue;
    }
    const question = qm[2];
    const options: string[] = [];
    let correctIndex = -1;
    let explanation: string | undefined;
    i++;
    while (i < lines.length) {
      const om = lines[i].match(OPTION_LINE);
      if (om) {
        options.push(om[2]);
        i++;
        continue;
      }
      const am = lines[i].match(ANSWER_LINE);
      if (am) {
        const ans = am[1].trim();
        if (/^\d+$/.test(ans)) correctIndex = parseInt(ans, 10);
        else {
          const m = ans.toUpperCase().match(/^([A-H])/);
          if (m) correctIndex = m[1].charCodeAt(0) - 65;
        }
        i++;
        continue;
      }
      const em = lines[i].match(EXPLAIN_START);
      if (em) {
        explanation = em[1];
        i++;
        while (i < lines.length && !QUESTION_START.test(lines[i]) && !OPTION_LINE.test(lines[i])) {
          explanation += " " + lines[i];
          i++;
        }
        if (explanation) explanation = explanation.trim();
        continue;
      }
      if (QUESTION_START.test(lines[i])) break;
      i++;
    }
    if (options.length < 2) {
      warnings.push(`Question "${question.slice(0, 40)}…": fewer than 2 options, skipped.`);
      continue;
    }
    if (correctIndex < 0 || correctIndex >= options.length) {
      warnings.push(`Question "${question.slice(0, 40)}…": no answer found, defaulted to 0.`);
      correctIndex = 0;
    }
    mcqs.push({ question, options, correctIndex, explanation });
  }
  return mcqs;
}
