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
  const blocks: string[] = [];
  $("h1, h2, h3, h4, h5, h6, p, li, tr, pre, br").each((_, el) => {
    const t = $(el).text().replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
    if (t) blocks.push(t);
  });
  if (blocks.length === 0) return $.text();
  return blocks.join("\n");
}
