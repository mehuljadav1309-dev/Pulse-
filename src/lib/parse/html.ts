import * as cheerio from "cheerio";
import { extractFromObject } from "./normalize";
import { inferSubjectSlug } from "./subject-infer";
import type { ParseResult, ParsedMCQ } from "./types";

/**
 * HTML parser — CEREB-style aware.
 *
 * Main path: extract `<h2>title</h2>\s*<iframe srcdoc="...">` blocks.
 *   - decode HTML entities in the srcdoc
 *   - find `questions = [...]` array via bracket-balanced scan
 *   - eval the literal via `new Function("return (...)")`
 *   - normalize each row through extractFromObject
 *
 * Fallback paths:
 *   - if no <iframe> blocks, look for `<script>var questions = [...]</script>`
 *   - if no JS array at all, query `.question, .mcq, [data-question]` and read
 *     `.q/.stem` + `.option/.opt/li` + `data-answer`
 *
 * Per-block metadata (topic + subject) is inferred from the enclosing <h2>
 * title, the <title>, and the filename. These are attached to every MCQ
 * emitted from that block.
 */
export async function parseHTML(html: string, filename = ""): Promise<ParseResult> {
  const warnings: string[] = [];
  const mcqs: ParsedMCQ[] = [];

  const $ = cheerio.load(html);
  $("script, style, noscript").remove();

  // 1. CEREB iframe blocks
  const iframeBlocks: Array<{ title: string; srcdoc: string }> = [];

  $("iframe[srcdoc]").each((_, el) => {
    const $iframe = $(el);
    const srcdoc = $iframe.attr("srcdoc") ?? "";
    const title =
      $iframe.prev("h2").first().text().trim() ||
      $iframe.closest("section, article, div").find("h2").first().text().trim() ||
      $iframe.attr("title") ||
      "";
    iframeBlocks.push({ title, srcdoc });
  });

  if (iframeBlocks.length > 0) {
    for (const { title, srcdoc } of iframeBlocks) {
      const decoded = decodeEntities(srcdoc);
      const inferredTopic = title || undefined;
      const inferredSubject = inferSubjectSlug(title, filename);
      const arr = extractJSArray(decoded, warnings);
      if (arr) {
        let added = 0;
        for (const row of arr) {
          const m = extractFromObject(row);
          if (!m) continue;
          if (!m.topic && inferredTopic) m.topic = inferredTopic;
          if (!m.subject && inferredSubject) m.subject = inferredSubject;
          mcqs.push(m);
          added++;
        }
        warnings.push(
          `CEREB block "${title || "(untitled)"}": ${added} MCQ${added === 1 ? "" : "s"} extracted.`
        );
      } else {
        // DOM fallback inside this iframe
        const fromDom = domFallback(cheerio.load(decoded));
        for (const m of fromDom) {
          if (!m.topic && inferredTopic) m.topic = inferredTopic;
          if (!m.subject && inferredSubject) m.subject = inferredSubject;
          mcqs.push(m);
        }
        if (fromDom.length === 0) {
          warnings.push(
            `CEREB block "${title || "(untitled)"}": no questions array and no .question blocks found.`
          );
        }
      }
    }
  } else {
    // 2. Inline <script>var questions = [...]</script>
    const scripts = $("script").map((_, el) => $(el).html() ?? "").get();
    for (const s of scripts) {
      const arr = extractJSArray(s, warnings);
      if (arr) {
        const fallbackTopic =
          $("title").first().text().trim() || $("h1, h2").first().text().trim() || undefined;
        const fallbackSubject = inferSubjectSlug(fallbackTopic ?? "", filename);
        for (const row of arr) {
          const m = extractFromObject(row);
          if (!m) continue;
          if (!m.topic && fallbackTopic) m.topic = fallbackTopic;
          if (!m.subject && fallbackSubject) m.subject = fallbackSubject;
          mcqs.push(m);
        }
      }
    }

    // 3. DOM fallback
    if (mcqs.length === 0) {
      const dom = domFallback($);
      for (const m of dom) {
        if (!m.topic) {
          m.topic =
            $("title").first().text().trim() ||
            $("h1, h2").first().text().trim() ||
            stripExt(filename);
        }
        if (!m.subject) m.subject = inferSubjectSlug(m.topic, filename) ?? undefined;
        mcqs.push(m);
      }
    }
  }

  if (mcqs.length === 0) {
    warnings.push("No MCQs could be extracted from the HTML.");
  }
  return { mcqs, warnings, source: "html" };
}

// -------------------- helpers --------------------

function decodeEntities(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

/**
 * Find a JS array literal (e.g. `questions = [...]` or `var q = [...]`) inside
 * a string and evaluate it. Uses bracket-balancing, ignoring brackets inside
 * string literals.
 */
function extractJSArray(source: string, warnings: string[]): unknown[] | null {
  // 1) find a candidate array start: '[' preceded by an identifier and '=' or '('
  const startIdx = findArrayStart(source);
  if (startIdx < 0) return null;

  // 2) bracket-balance to find the matching ']'
  let depth = 0;
  let inString: '"' | "'" | "`" | null = null;
  let escape = false;
  let endIdx = -1;
  for (let i = startIdx; i < source.length; i++) {
    const c = source[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (inString) {
      if (c === "\\") {
        escape = true;
        continue;
      }
      if (c === inString) inString = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      inString = c as '"' | "'" | "`";
      continue;
    }
    if (c === "[") depth++;
    else if (c === "]") {
      depth--;
      if (depth === 0) {
        endIdx = i;
        break;
      }
    }
  }
  if (endIdx < 0) {
    warnings.push("Array start '[' found but no matching ']'.");
    return null;
  }

  const literal = source.slice(startIdx, endIdx + 1);

  // 3) Evaluate. `new Function` is more forgiving than JSON.parse — it accepts
  //    single quotes, trailing commas, and identifier keys.
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
    const fn = new Function(`return (${literal});`);
    const result = fn();
    if (Array.isArray(result)) return result;
  } catch (e) {
    warnings.push(
      "JS array literal could not be evaluated: " +
        (e instanceof Error ? e.message : String(e))
    );
  }
  return null;
}

function findArrayStart(source: string): number {
  // Try to find a keyword like 'questions' or 'q' or any identifier followed by
  // '=' or ':' or '(' and then a '['.
  const re = /(^|[\s;,({])([A-Za-z_$][A-Za-z0-9_$]*)\s*[:=]\s*\[/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source))) {
    const idx = m.index + m[0].lastIndexOf("[");
    return idx;
  }
  // Fallback: first top-level '[' that looks like an array
  const idx = source.indexOf("[");
  return idx;
}

function domFallback($: cheerio.CheerioAPI): ParsedMCQ[] {
  const out: ParsedMCQ[] = [];
  const blocks = $(".question, .mcq, [data-question]").toArray();
  if (blocks.length === 0) return out;

  for (const block of blocks) {
    const $b = $(block);
    const question =
      $b.find(".q, .stem, .question-text").first().text().trim() ||
      $b.find("[data-question-text]").attr("data-question-text") ||
      "";
    if (!question) continue;

    const options: string[] = [];
    $b.find(".option, .opt, li, [data-option]").each((_, el) => {
      const t = $(el).text().trim();
      if (t) options.push(t);
    });
    if (options.length < 2) continue;

    let correctIndex = -1;
    const ans =
      $b.attr("data-answer") ||
      $b.find("[data-answer]").attr("data-answer") ||
      $b.find(".answer, .correct").first().text().trim();
    if (ans) {
      const m = ans.match(/([A-H])/i);
      if (m) correctIndex = m[1].toUpperCase().charCodeAt(0) - 65;
    }
    if (correctIndex < 0 || correctIndex >= options.length) correctIndex = 0;

    const explanation =
      $b.find(".explanation, .solution, .rationale").first().text().trim() || undefined;

    out.push({
      question,
      options,
      correctIndex,
      explanation: explanation || undefined,
    });
  }
  return out;
}

function stripExt(s: string): string {
  return s.replace(/\.[a-z0-9]+$/i, "").replace(/[_-]+/g, " ").trim();
}
