import { inferSubjectSlug } from "./subject-infer";
import type { ParseResult, ParsedMCQ } from "./types";

/**
 * PDF parser — uses pdf-parse v2 (ESM) to extract text, then runs a
 * line-based MCQ extractor. Topic/answer/explanation blocks are detected
 * with regex; the enclosing filename provides subject inference.
 */

const QUESTION_START = /^\s*(?:Q\s*)?(\d{1,4})[.)]\s*(.+?)\s*$/i;
const OPTION_LINE = /^\s*([A-H])[.)]\s*(.+?)\s*$/i;
const ANSWER_LINE =
  /^\s*(?:Ans(?:wer)?|Correct\s*Ans(?:wer)?|Key)\s*[:\-=]?\s*(.+?)\s*$/i;
const EXPLAIN_START = /^\s*(?:Exp(?:lanation)?|Reason|Rationale)\s*[:\-=]?\s*(.+?)\s*$/i;
const TOPIC_LINE = /^\s*(?:Topic|Chapter|Section|Subject)\s*[:\-=]\s*(.+?)\s*$/i;

function extractFromLines(lines: string[], warnings: string[]): ParsedMCQ[] {
  const mcqs: ParsedMCQ[] = [];
  let i = 0;
  let currentTopic: string | undefined;
  while (i < lines.length) {
    const tm = lines[i].match(TOPIC_LINE);
    if (tm) {
      currentTopic = tm[1].trim();
      i++;
      continue;
    }
    const qm = lines[i].match(QUESTION_START);
    if (!qm) {
      i++;
      continue;
    }
    const question = qm[2];
    const options: string[] = [];
    let correctIndex = -1;
    let explanation: string | undefined;
    const topicAtStart = currentTopic;
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
        while (i < lines.length && !QUESTION_START.test(lines[i]) && !OPTION_LINE.test(lines[i]) && !TOPIC_LINE.test(lines[i])) {
          explanation += " " + lines[i];
          i++;
        }
        if (explanation) explanation = explanation.trim();
        continue;
      }
      const innerTopic = lines[i].match(TOPIC_LINE);
      if (innerTopic) {
        currentTopic = innerTopic[1].trim();
        i++;
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
    mcqs.push({ question, options, correctIndex, explanation, topic: topicAtStart });
  }
  return mcqs;
}

export async function parsePDF(buffer: Buffer, filename = ""): Promise<ParseResult> {
  const warnings: string[] = [];
  let text = "";
  try {
    const mod = await import("pdf-parse");
    const PDFParse = (mod as { PDFParse?: unknown }).PDFParse ?? (mod as { default?: unknown }).default;
    if (!PDFParse) {
      return {
        mcqs: [],
        warnings: ["pdf-parse module is missing the PDFParse export."],
        source: "pdf",
      };
    }
    const Ctor = PDFParse as new (opts: { data: Buffer }) => {
      getText: () => Promise<{ text?: string; total?: number }>;
    };
    const parser = new Ctor({ data: buffer });
    const result = await parser.getText();
    text = result?.text ?? "";
  } catch (e) {
    return {
      mcqs: [],
      warnings: [
        "PDF could not be parsed: " + (e instanceof Error ? e.message : String(e)),
      ],
      source: "pdf",
    };
  }
  if (!text || !text.trim()) {
    return { mcqs: [], warnings: ["PDF contained no extractable text."], source: "pdf" };
  }
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const mcqs = extractFromLines(lines, warnings);
  const subject = inferSubjectSlug(filename);
  if (subject) for (const m of mcqs) if (!m.subject) m.subject = subject;
  return { mcqs, warnings, source: "pdf" };
}
