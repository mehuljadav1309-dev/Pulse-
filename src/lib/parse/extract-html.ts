/**
 * Deterministic HTML MCQ Extractor — CEREB / quiz-generator aware.
 *
 * Never relies on visible DOM text alone. Probes every layer:
 *   iframe srcdoc → decode entities → JS array → JSON blob → script tags
 */

import type { ParsedMCQ } from "./types";

/* ─── Public API ────────────────────────────────────────── */

export type ExtractedQuestion = {
  subject: string;
  topic: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string;
  optionF: string;
  correctAnswer: string;
  explanation: string;
  questionImages: string[];
  explanationImages: string[];
  sourceTest: string;
  exam: string;
  difficulty: string;
  tags: string[];
};

export function extractMCQsFromHTML(
  html: string,
  filename: string
): { questions: ExtractedQuestion[]; warnings: string[] } {
  const warnings: string[] = [];
  const all: ExtractedQuestion[] = [];
  const seen = new Set<string>();

  const add = (q: ExtractedQuestion) => {
    const key = q.question.slice(0, 80).toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    all.push(q);
  };

  // ── Stage 1: iframe srcdoc blocks ──────────────────────
  const iframeRegex = /<iframe[^>]*srcdoc\s*=\s*["']([^"']*)["'][^>]*>/gi;
  let match: RegExpExecArray | null;
  while ((match = iframeRegex.exec(html)) !== null) {
    const raw = match[1];
    const decoded = decodeEntitiesDeep(raw);
    const title = extractTitleNearIframe(html, match.index) || filename;
    const source = title.replace(/\s+/g, " ").trim();
    const fromSrc = scanAllSources(decoded, source, warnings);
    fromSrc.forEach(add);
  }

  // ── Stage 2: inline <script> tags ──────────────────────
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  while ((match = scriptRegex.exec(html)) !== null) {
    const code = match[1];
    const source = filename;
    const fromScript = scanAllSources(code, source, warnings);
    fromScript.forEach(add);
  }

  // ── Stage 3: raw JSON blobs in the document ────────────
  const jsonCandidates = findJSONBlobs(html, warnings);
  for (const { blob, source } of jsonCandidates) {
    const fromJSON = parseQuestionArray(blob, source, warnings);
    fromJSON.forEach(add);
  }

  // ── Stage 4: DOM-based fallback ─────────────────────────
  if (all.length === 0) {
    const fromDOM = domExtract(html, filename);
    fromDOM.forEach(add);
  }

  if (all.length === 0) {
    warnings.push("No MCQs found after scanning all layers.");
  }

  return { questions: all, warnings };
}

/* ─── Multi-layer scanner ──────────────────────────────── */

function scanAllSources(
  text: string,
  source: string,
  warnings: string[]
): ExtractedQuestion[] {
  const out: ExtractedQuestion[] = [];

  // Try each known variable pattern
  const patterns = [
    /(?:var|let|const|)\s*(?:questions|questionBank|quizData|examData|mcqs|qbank)\s*=\s*(\[[\s\S]*?\])\s*;/i,
    /(?:questions|questionBank|quizData|examData|mcqs|qbank)\s*:\s*(\[[\s\S]*?\])\s*,/i,
    /(?:questions|questionBank|quizData|examData)\s*=\s*(\[[\s\S]*?\])\s*(?:;|$)/i,
  ];

  for (const pat of patterns) {
    const m = pat.exec(text);
    if (m) {
      const arr = safeParseArray(m[1], warnings);
      if (arr && arr.length > 0) {
        const parsed = parseQuestionArray(arr, source, warnings);
        out.push(...parsed);
        if (out.length > 0) return out;
      }
    }
  }

  // Bracket-balanced extraction (for very large arrays)
  const arr = bracketBalanceExtract(text, warnings);
  if (arr && arr.length > 0) {
    const parsed = parseQuestionArray(arr, source, warnings);
    out.push(...parsed);
  }

  return out;
}

/* ─── Bracket-balanced array extraction ────────────────── */

function bracketBalanceExtract(
  source: string,
  warnings: string[]
): unknown[] | null {
  // Find the first '[' that looks like it starts a questions array
  const startIdx = findQuestionsArrayStart(source);
  if (startIdx < 0) return null;

  let depth = 0;
  let inString: string | null = null;
  let escape = false;
  let endIdx = -1;

  for (let i = startIdx; i < source.length; i++) {
    const c = source[i];
    if (escape) { escape = false; continue; }
    if (inString) {
      if (c === "\\") { escape = true; continue; }
      if (c === inString) inString = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") { inString = c; continue; }
    if (c === "[") depth++;
    else if (c === "]") {
      depth--;
      if (depth === 0) { endIdx = i; break; }
    }
  }

  if (endIdx < 0) return null;

  const literal = source.slice(startIdx, endIdx + 1);
  return safeParseArray(literal, warnings);
}

function findQuestionsArrayStart(text: string): number {
  // Look for identifier followed by = or : then [
  const re = /(?:questions|questionBank|quizData|examData|mcqs|qbank|items|data)\s*[:=]\s*\[/i;
  const m = re.exec(text);
  if (m) return m.index + m[0].lastIndexOf("[");
  // Fallback: first top-level [
  const idx = text.indexOf("[");
  if (idx >= 0) return idx;
  return -1;
}

/* ─── JSON blob finder ─────────────────────────────────── */

function findJSONBlobs(
  html: string,
  _warnings: string[]
): Array<{ blob: unknown[]; source: string }> {
  const results: Array<{ blob: unknown[]; source: string }> = [];

  // Find escaped JSON inside script tags or attributes
  const jsonPatterns = [
    /(?:questions|questionBank|quizData|examData|mcqs)\s*[:=]\s*("(?:[^"\\]|\\.)*")/gi,
    /(?:questions|questionBank|quizData|examData|mcqs)\s*[:=]\s*('(?:[^'\\]|\\.)*')/gi,
  ];

  for (const pat of jsonPatterns) {
    let m: RegExpExecArray | null;
    while ((m = pat.exec(html)) !== null) {
      try {
        const unescaped = m[1]
          .replace(/\\"/g, '"')
          .replace(/\\'/g, "'")
          .replace(/\\\\/g, "\\")
          .replace(/\\n/g, "")
          .replace(/\\t/g, "");
        const parsed = JSON.parse(unescaped);
        if (Array.isArray(parsed) && parsed.length > 0) {
          results.push({ blob: parsed as unknown[], source: "json-blob" });
        }
      } catch {
        // not valid JSON, skip
      }
    }
  }

  return results;
}

/* ─── Parse question array → ExtractedQuestion[] ──────── */

function parseQuestionArray(
  arr: unknown[],
  source: string,
  _warnings: string[]
): ExtractedQuestion[] {
  const out: ExtractedQuestion[] = [];
  for (const item of arr) {
    if (!item || typeof item !== "object") continue;
    const q = normalizeQuestion(item as Record<string, unknown>, source);
    if (q) out.push(q);
  }
  return out;
}

/* ─── Normalize a single question object ───────────────── */

function normalizeQuestion(
  o: Record<string, unknown>,
  source: string
): ExtractedQuestion | null {
  const pick = (...keys: string[]): unknown => {
    for (const k of keys) {
      if (o[k] !== undefined && o[k] !== null && o[k] !== "") return o[k];
    }
    return undefined;
  };

  // Question text
  const rawQ =
    pick("question_html", "question", "q", "stem", "text", "prompt") || "";
  const question = stripHtml(String(rawQ)).trim();
  if (!question) return null;

  // Options
  const rawOptions = pick("options", "choices", "answers", "opts");
  let options: string[] = [];
  let correctIndex = -1;

  if (Array.isArray(rawOptions)) {
    if (rawOptions.length > 0 && typeof rawOptions[0] === "object") {
      // CEREB shape: [{label, text, correct}]
      options = rawOptions.map((e: unknown) => {
        const entry = e as Record<string, unknown>;
        return stripHtml(String(entry.text ?? entry.option ?? entry.label ?? entry.value ?? ""));
      });
      rawOptions.forEach((e: unknown, i: number) => {
        const entry = e as Record<string, unknown>;
        if (entry.correct === true || entry.is_correct === true || entry.isCorrect === true) {
          correctIndex = i;
        }
      });
    } else {
      options = rawOptions.map((v: unknown) => stripHtml(String(v)));
    }
  } else {
    // Letter keys: a, b, c, d, e, f
    const letters = ["a", "b", "c", "d", "e", "f"];
    const flat: string[] = [];
    for (const L of letters) {
      const v = pick(`option_${L}`, L);
      if (v !== undefined) flat.push(stripHtml(String(v)));
    }
    if (flat.length >= 2) options = flat;
  }

  if (options.length < 2) return null;

  // Correct answer
  if (correctIndex < 0) {
    const ans = pick("correct_answer", "answer", "ans", "correct", "correctIndex", "answerIndex");
    if (typeof ans === "number") {
      correctIndex = ans;
    } else if (typeof ans === "string") {
      const t = ans.trim();
      const m = t.match(/^([A-H])[.)\s]/i);
      if (m) correctIndex = m[1].toUpperCase().charCodeAt(0) - 65;
      else if (/^[A-H]$/i.test(t)) correctIndex = t.toUpperCase().charCodeAt(0) - 65;
      else if (/^\d+$/.test(t)) correctIndex = parseInt(t, 10);
      else {
        const lower = t.toLowerCase();
        const i = options.findIndex((o) => o.toLowerCase() === lower);
        if (i >= 0) correctIndex = i;
      }
    }
  }
  if (correctIndex < 0 || correctIndex >= options.length) correctIndex = 0;

  // Map to A-F labels
  const labels = ["A", "B", "C", "D", "E", "F"];
  const correctAnswer = labels[correctIndex] ?? "A";

  // Pad options to 6
  while (options.length < 6) options.push("");

  // Explanation
  const rawExp = pick("explanation_html", "explanation", "solution", "exp", "rationale");
  const explanation = rawExp ? stripHtml(String(rawExp)) : "";

  // Subject & topic classification
  const rawSubject = pick("subject", "subjectSlug", "subject_slug");
  const rawTopic = pick("topic", "chapter", "section");
  const textForClassify = [question, ...options, explanation].join(" ");
  const { subject, topic } = classifyTopic(rawSubject ? String(rawSubject) : "", rawTopic ? String(rawTopic) : "", textForClassify);

  // Images
  const questionImages = asStringArray(o.question_images ?? o.images ?? []);
  const explanationImages = asStringArray(o.explanation_images ?? o.exp_images ?? []);

  // Difficulty
  const diff = pick("difficulty", "level");
  const difficulty = typeof diff === "string" ? diff : "medium";

  // Tags
  const tags = asStringArray(o.tags ?? o._aiTags ?? []);

  // Source test name
  const sourceTest = source || stripExt(String(pick("filename", "source", "exam_name") ?? ""));

  return {
    subject,
    topic,
    question,
    optionA: options[0],
    optionB: options[1],
    optionC: options[2],
    optionD: options[3],
    optionE: options[4],
    optionF: options[5] || "",
    correctAnswer,
    explanation,
    questionImages,
    explanationImages,
    sourceTest,
    exam: sourceTest,
    difficulty,
    tags,
  };
}

/* ─── Topic classification ─────────────────────────────── */

const TOPIC_RULES: Array<{ topic: string; keywords: string[] }> = [
  { topic: "Upper Limb", keywords: ["clavicle", "scapula", "humerus", "radius", "ulna", "brachial plexus", "axilla", "pectoralis", "deltoid", "biceps", "triceps", "forearm", "carpal", "metacarpal", "phalanges", "shoulder", "elbow", "wrist", "hand"] },
  { topic: "Lower Limb", keywords: ["femur", "tibia", "fibula", "hip", "knee", "ankle", "foot", "gluteal", "thigh", "leg", "popliteal", "patella", "tarsal", "metatarsal", "calcaneus", "achilles", "sole"] },
  { topic: "Thorax", keywords: ["heart", "coronary", "mediastinum", "diaphragm", "pleura", "lung", "aorta", "vena cava", "pulmonary", "bronchus", "trachea", "esophagus", "thymus", "intercostal"] },
  { topic: "Abdomen", keywords: ["inguinal", "stomach", "intestine", "liver", "pancreas", "gallbladder", "spleen", "kidney", "adrenal", "mesentery", "peritoneum", "rectum", "colon", "duodenum", "jejunum", "ileum", "appendix"] },
  { topic: "Pelvis", keywords: ["pelvic floor", "uterus", "prostate", "pudendal", "ovary", "fallopian", "vagina", "cervix", "bladder", "urethra", "rectum", "sacrum", "coccyx", "perineum"] },
  { topic: "Head & Neck", keywords: ["tmj", "tongue", "cranial nerves", "pharynx", "larynx", "mandible", "maxilla", "temporomandibular", "facial", "parotid", "thyroid", "parathyroid", "neck", "scalp", "orbit", "eye", "ear", "nose", "sinus"] },
  { topic: "Neuroanatomy", keywords: ["cerebellum", "brainstem", "spinal cord", "basal ganglia", "thalamus", "hypothalamus", "midbrain", "pons", "medulla", "cortex", "hippocampus", "amygdala", "ventricle", "meninges"] },
  { topic: "Histology", keywords: ["cartilage", "epithelium", "connective tissue", "muscle tissue", "nervous tissue", "gland", "stain", "microscope", "cell", "tissue"] },
  { topic: "Embryology", keywords: ["branchial arch", "pharyngeal pouch", "fetal development", "neural crest", "neural tube", "somite", "placenta", "umbilical", "gestation", "fertilization", "cleavage", "gastrulation", "organogenesis"] },
];

function classifyTopic(
  rawSubject: string,
  rawTopic: string,
  text: string
): { subject: string; topic: string } {
  // If we already have a subject/topic, validate or use it
  if (rawSubject && rawTopic) {
    return { subject: rawSubject, topic: rawTopic };
  }

  const lower = text.toLowerCase();

  // Score each topic
  let bestTopic = "General";
  let bestScore = 0;

  for (const rule of TOPIC_RULES) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (lower.includes(kw)) score++;
      // Bonus for exact matches
      if (lower.includes(kw.toLowerCase())) score += 0.5;
    }
    if (score > bestScore) {
      bestScore = score;
      bestTopic = rule.topic;
    }
  }

  // Map topic to subject
  const subjectMap: Record<string, string> = {
    "Upper Limb": "Anatomy",
    "Lower Limb": "Anatomy",
    "Thorax": "Anatomy",
    "Abdomen": "Anatomy",
    "Pelvis": "Anatomy",
    "Head & Neck": "Anatomy",
    "Neuroanatomy": "Anatomy",
    "Histology": "Anatomy",
    "Embryology": "Anatomy",
  };

  return {
    subject: subjectMap[bestTopic] || "Anatomy",
    topic: bestTopic === "General" ? rawTopic || "General" : bestTopic,
  };
}

/* ─── Helpers ──────────────────────────────────────────── */

function stripHtml(s: string): string {
  return s
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
}

function decodeEntitiesDeep(s: string): string {
  let prev = s;
  let curr = decodeEntities(prev);
  // Decode nested entities (double-encoded)
  while (curr !== prev) {
    prev = curr;
    curr = decodeEntities(prev);
  }
  return curr;
}

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

function extractTitleNearIframe(html: string, iframeIdx: number): string {
  // Look backwards for an <h2> or <h3> before the iframe
  const before = html.slice(Math.max(0, iframeIdx - 500), iframeIdx);
  const hMatch = before.match(/<h[23][^>]*>\s*(.*?)\s*<\/h[23]>/i);
  if (hMatch) return hMatch[1].replace(/<[^>]+>/g, "").trim();
  return "";
}

function safeParseArray(
  literal: string,
  warnings: string[]
): unknown[] | null {
  try {
    const fn = new Function(`return (${literal});`);
    const result = fn();
    if (Array.isArray(result)) return result;
    return null;
  } catch (e) {
    warnings.push(
      "Array eval failed: " + (e instanceof Error ? e.message : String(e))
    );
    return null;
  }
}

function asStringArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map((v) => String(v));
  return [];
}

function domExtract(html: string, filename: string): ExtractedQuestion[] {
  // Simple regex-based DOM extraction when cheerio isn't available
  const out: ExtractedQuestion[] = [];
  const questionBlocks = html.match(
    /<div[^>]*class="[^"]*(?:question|mcq|quiz-item)[^"]*"[^>]*>[\s\S]*?<\/div>/gi
  );

  if (!questionBlocks) return out;

  for (const block of questionBlocks) {
    const qMatch = block.match(
      /<(?:p|div|span)[^>]*class="[^"]*(?:q|stem|question-text)[^"]*"[^>]*>(.*?)<\//i
    );
    const question = qMatch ? stripHtml(qMatch[1]) : "";
    if (!question) continue;

    const opts: string[] = [];
    const optRegex = /<(?:li|span|div|p)[^>]*class="[^"]*(?:option|opt|choice)[^"]*"[^>]*>(.*?)<\//gi;
    let m: RegExpExecArray | null;
    while ((m = optRegex.exec(block)) !== null) {
      opts.push(stripHtml(m[1]));
    }
    if (opts.length < 2) continue;

    const ansMatch = block.match(/data-answer=["']([A-H])["']/i);
    const correctAnswer = ansMatch ? ansMatch[1].toUpperCase() : "A";

    while (opts.length < 6) opts.push("");

    out.push({
      subject: "",
      topic: "",
      question,
      optionA: opts[0],
      optionB: opts[1],
      optionC: opts[2],
      optionD: opts[3],
      optionE: opts[4],
      optionF: opts[5],
      correctAnswer,
      explanation: "",
      questionImages: [],
      explanationImages: [],
      sourceTest: filename,
      exam: filename,
      difficulty: "medium",
      tags: [],
    });
  }

  return out;
}

function stripExt(s: string): string {
  return s.replace(/\.[a-z0-9]+$/i, "").replace(/[_-]+/g, " ").trim();
}

/* ─── Convert ExtractedQuestion → ParsedMCQ for DB ─────── */

export function extractedQuestionToParsedMCQ(
  eq: ExtractedQuestion
): ParsedMCQ {
  const labels = ["A", "B", "C", "D", "E", "F"];
  const correctIdx = labels.indexOf(eq.correctAnswer);
  const options = [
    eq.optionA,
    eq.optionB,
    eq.optionC,
    eq.optionD,
    eq.optionE,
    eq.optionF,
  ].filter((o) => o.length > 0);

  return {
    question: eq.question,
    options,
    correctIndex: correctIdx >= 0 && correctIdx < options.length ? correctIdx : 0,
    explanation: eq.explanation || undefined,
    difficulty: (eq.difficulty as "easy" | "medium" | "hard") || "medium",
    subject: eq.subject || undefined,
    topic: eq.topic || undefined,
  };
}
