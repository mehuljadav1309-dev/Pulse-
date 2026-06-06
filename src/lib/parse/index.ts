import { parseJSON } from "./json";
import { parseCSV } from "./csv";
import { parseHTML } from "./html";
import { parsePDF } from "./pdf";
import type { ParseResult } from "./types";

export type { ParsedMCQ, ParseResult } from "./types";

export async function parseFile(
  file: File | { name: string; type: string; arrayBuffer: () => Promise<ArrayBuffer> }
): Promise<ParseResult> {
  const name = (file.name ?? "").toLowerCase();
  const type = (file.type ?? "").toLowerCase();

  if (name.endsWith(".json") || type.includes("json")) {
    const text = typeof (file as File).text === "function" ? await (file as File).text() : "";
    return parseJSON(text);
  }
  if (name.endsWith(".csv") || type.includes("csv") || type.includes("spreadsheet")) {
    const text = typeof (file as File).text === "function" ? await (file as File).text() : "";
    return parseCSV(text);
  }
  if (
    name.endsWith(".pdf") ||
    type === "application/pdf" ||
    type.includes("pdf")
  ) {
    const buf = Buffer.from(await file.arrayBuffer());
    return parsePDF(buf);
  }
  if (
    name.endsWith(".html") ||
    name.endsWith(".htm") ||
    type.includes("html")
  ) {
    const text = typeof (file as File).text === "function" ? await (file as File).text() : "";
    return parseHTML(text);
  }
  return {
    mcqs: [],
    warnings: [`Unsupported file type: ${name || type || "unknown"}`],
    source: "json",
  };
}
