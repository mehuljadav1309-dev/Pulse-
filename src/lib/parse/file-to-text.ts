/**
 * Convert a file to a single plain-text blob suitable for the AI extractor.
 * For HTML we strip tags; for PDF we run the same pdf-parse text extraction;
 * for CSV/JSON we keep the structure but strip HTML noise.
 */
import * as cheerio from "cheerio";

export async function fileToText(
  file: File | { name: string; type: string; arrayBuffer: () => Promise<ArrayBuffer> }
): Promise<string> {
  const name = (file.name ?? "").toLowerCase();
  const type = (file.type ?? "").toLowerCase();
  if (name.endsWith(".pdf") || type.includes("pdf")) {
    const buf = Buffer.from(await file.arrayBuffer());
    try {
      const mod = await import("pdf-parse");
      const PDFParse = (mod as { PDFParse?: unknown }).PDFParse ?? (mod as { default?: unknown }).default;
      const Ctor = PDFParse as new (opts: { data: Buffer }) => {
        getText: () => Promise<{ text?: string }>;
      };
      const parser = new Ctor({ data: buf });
      const result = await parser.getText();
      return result?.text ?? "";
    } catch {
      return "";
    }
  }
  if (name.endsWith(".html") || name.endsWith(".htm") || type.includes("html")) {
    const text = typeof (file as File).text === "function" ? await (file as File).text() : "";
    return htmlToText(text);
  }
  // CSV / JSON / plain text: return as-is
  if (typeof (file as File).text === "function") return await (file as File).text();
  return "";
}

function htmlToText(html: string): string {
  const $ = cheerio.load(html);
  $("script, style, noscript").remove();

  // ── CEREB path: extract iframe srcdoc, decode, send clean question text to AI ──
  const srcdocs: string[] = [];
  $("iframe[srcdoc]").each((_, el) => {
    const raw = $(el).attr("srcdoc") ?? "";
    if (raw.trim()) srcdocs.push(decodeEntities(raw));
  });
  if (srcdocs.length > 0) {
    const combined = srcdocs.join("\n\n==========\n\n");
    // Try to find `questions = [...]` in decoded content
    const extracted = extractQuestionsArray(combined);
    if (extracted) return extracted;
    return combined;
  }

  // ── Default path: extract readable text from block elements ──
  const blocks: string[] = [];
  $("h1, h2, h3, h4, h5, h6, p, li, tr, pre, br").each((_, el) => {
    const t = $(el).text().replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
    if (t) blocks.push(t);
  });
  if (blocks.length === 0) return $.text();
  return blocks.join("\n");
}

/** Decode HTML entities (single- and double-encoded). */
function decodeEntities(s: string): string {
  let prev: string;
  let curr = s;
  do {
    prev = curr;
    curr = curr
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&nbsp;/g, " ")
      .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
      .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
  } while (curr !== prev);
  return curr;
}

/** Try to locate `questions = [...]` in plain text and return its JSON content. */
function extractQuestionsArray(text: string): string | null {
  const re = /questions\s*=\s*(\[[\s\S]*?\])/;
  const m = re.exec(text);
  if (!m) return null;
  try {
    const parsed = JSON.parse(m[1]);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return JSON.stringify(parsed, null, 2);
    }
  } catch {
    // not parseable, return the extracted text block around the match
  }
  // Return a window of text around the match
  const idx = m.index;
  const start = Math.max(0, idx - 500);
  const end = Math.min(text.length, idx + m[1].length + 1000);
  return text.slice(start, end);
}
