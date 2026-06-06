import { extractMCQsFromText } from "./html";
import type { ParseResult } from "./types";

/**
 * PDF parser — uses pdf-parse v2 (ESM) to extract text,
 * then runs the same line-based heuristic used for HTML.
 */
export async function parsePDF(buffer: Buffer): Promise<ParseResult> {
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
  const mcqs = extractMCQsFromText(text, warnings);
  return { mcqs, warnings, source: "pdf" };
}
