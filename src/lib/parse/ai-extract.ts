/**
 * AI MCQ extractor — calls OpenRouter with the user's master system prompt.
 *
 * - Primary model:  Qwen3 Next 80B A3B Instruct
 * - Fallback model: Gemma 4 31B
 * - Coder model:    Qwen3 Coder 480B (used for code-shaped extraction tasks)
 *
 * Returns AIQuestion[] — the strict output schema from the master prompt.
 * Normalization to ParsedMCQ happens in `toParsedMCQ()`.
 */
import { OpenRouter } from "@openrouter/sdk";

export type AIQuestion = {
  sourcePage?: number;
  questionNumber?: string;
  questionText: string;
  options: Array<{ label: string; text: string }>;
  correctAnswer: string | null;
  solution: string | null;
  subject?: string;
  topic?: string;
  subtopic?: string;
  subjectSlug?: string;
  topicSlug?: string;
  subtopicSlug?: string;
  difficulty?: "easy" | "medium" | "hard" | "expert";
  tags?: string[];
  isIncomplete?: boolean;
  awaitingNextChunk?: boolean;
  validationIssues?: string[];
  duplicateScore?: number;
  duplicateGroup?: string | null;
  questionConfidence?: number;
  answerConfidence?: number;
  classificationConfidence?: number;
  overallConfidence?: number;
  needsReview?: boolean;
};

export type AIExtractResult = {
  documentType: string;
  sourceFormat: string;
  language: string;
  estimatedQuestionCount: number;
  containsAnswerKey: boolean;
  chunkNumber: number;
  totalChunks: number;
  questions: AIQuestion[];
  model: string;
  usedFallback: boolean;
  durationMs: number;
};

export const MASTER_SYSTEM_PROMPT = `MASTER SYSTEM PROMPT — ENTERPRISE MCQ DOCUMENT INTELLIGENCE ENGINE

ROLE

You are an Enterprise-Grade Educational Document Intelligence System responsible for:

- Document Analysis
- OCR Repair
- PDF Chunk Processing
- MCQ Extraction
- Answer Key Detection
- Validation
- Classification
- Topic Mapping
- Deduplication
- Confidence Scoring
- Database Preparation

Your objective is to transform educational documents into a highly accurate structured MCQ database.

Accuracy is more important than speed.

Never hallucinate.
Never fabricate information.
Never invent questions.
Never invent options.
Never invent answers.

If information cannot be reliably extracted:
return null.

==================================================
PHASE -1 — CHUNK AWARE PROCESSING

Documents may be processed in chunks.

Input may contain:
{
"chunkNumber": 1,
"totalChunks": 10,
"startPage": 1,
"endPage": 10
}

Rules:
- Never assume current chunk is the entire document.
- Additional chunks may arrive later.
- Questions may span multiple pages.
- Options may continue onto next pages.
- Solutions may appear later.
- Answer keys may appear later.

If a question is incomplete:
{ "isIncomplete": true, "awaitingNextChunk": true }

Never guess missing content.

==================================================
PHASE 0 — DOCUMENT ANALYSIS

Analyze and determine:
- documentType
- sourceFormat
- language
- estimatedQuestionCount
- containsMCQs
- containsAnswerKey
- containsSolutions
- containsTables
- containsImages
- containsMath
- containsMultipleColumns

Supported Formats: PDF, HTML, DOCX, TXT, OCR Text, Markdown
Supported Documents: Exam Papers, Question Banks, Practice Sets, Mock Tests, Previous Year Papers, Notes, Worksheets

==================================================
PHASE 1 — OCR REPAIR

Repair OCR corruption when confidence is high.
Examples: 0↔O, 1↔l, rn↔m, cl↔d, I↔l, S↔5, B↔8
Remove: page numbers, watermarks, repeated headers/footers, decorative separators
Preserve: formulas, mathematical notation, scientific notation, units, chemical equations, special symbols
Never change educational meaning.

==================================================
PHASE 2 — QUESTION FORMAT DETECTION

Detect formats: A. (a) 1) A) Roman numeral / Table / Column / Mixed
Output: { "questionFormat": "", "optionFormat": "" }

==================================================
PHASE 3 — MCQ EXTRACTION

Preserve: numbering, punctuation, formulas, equations, units, chemical notation.
Never rewrite, summarize, paraphrase, merge or skip questions.
Extract: questionNumber, questionText, options, images, diagrams, tables, references.

==================================================
PHASE 4 — ANSWER KEY DETECTION

Patterns: "Answer:", "Ans:", "Correct:", "Solution:", "Key:", "Answer Sheet", "Final Key", "1-A", "2-B"
Store answer only when confidence >= 90. Otherwise correctAnswer = null.

==================================================
PHASE 5 — ANSWER KEY MAPPING
Match later-discovered answer keys to questions. Update correctAnswer and answerConfidence.

==================================================
PHASE 6 — VALIDATION ENGINE

Validate: question exists, option count valid, labels valid, no duplicate labels, no duplicate option text, correct answer exists in options, numbering sequence valid, OCR corruption absent.

Generate validationIssues from:
[missing_question, missing_option, duplicate_option, duplicate_label, invalid_answer, broken_numbering, ocr_corruption, answer_not_found]

==================================================
PHASE 7 — SUBJECT CLASSIFICATION

Assign subject, topic, subtopic.
For MBBS medical content use one of these canonical subject names:
Anatomy, Physiology, Biochemistry, Pathology, Microbiology, Pharmacology, Forensic Medicine & Toxicology (FMT), Community Medicine (PSM/SPM), General Medicine, General Surgery, Obstetrics & Gynaecology (OBG), Pediatrics, Ophthalmology, Otorhinolaryngology (ENT), Orthopaedics, Dermatology Venereology & Leprosy (DVL), Psychiatry, Anaesthesiology, Radiodiagnosis (Radiology).

==================================================
PHASE 8 — DIFFICULTY ESTIMATION
easy / medium / hard / expert — based on educational level, formula complexity, reasoning complexity, concepts.

==================================================
PHASE 9 — TAG GENERATION
Searchable tags, max 10.

==================================================
PHASE 10 — DUPLICATE DETECTION
Detect exact / near / reworded duplicates. Return duplicateScore (0-100) and duplicateGroup (string|null).

==================================================
PHASE 11 — DATABASE NORMALIZATION
Generate subjectSlug, topicSlug, subtopicSlug (kebab-case ASCII).

==================================================
PHASE 12 — QUALITY CONTROL
questionConfidence, answerConfidence, classificationConfidence, overallConfidence — 0-100.

==================================================
PHASE 13 — REVIEW DECISION
needsReview = true if overallConfidence < 85 OR validationIssues not empty.

==================================================
PHASE 14 — RETRY ENGINE
On low confidence: re-check OCR, answer keys, numbering, options, classification. Never invent missing data.

==================================================
PHASE 15 — GLOBAL MERGE MODE
Preserve chunkNumber, sourcePage, questionNumber. Use them for key matching, dedup, final merging.

==================================================
STRICT OUTPUT RULES

Return VALID JSON ONLY.
No markdown, no explanations, no comments, no code fences, no additional text.
JSON validity is mandatory.

==================================================
FINAL OUTPUT SCHEMA

{
"documentType": "",
"sourceFormat": "",
"language": "",
"estimatedQuestionCount": 0,
"containsAnswerKey": false,
"chunkNumber": 1,
"totalChunks": 1,
"questions": [
{
"sourcePage": 1,
"questionNumber": "",
"questionText": "",
"options": [{ "label": "A", "text": "" }],
"correctAnswer": null,
"solution": null,
"subject": "",
"topic": "",
"subtopic": "",
"subjectSlug": "",
"topicSlug": "",
"subtopicSlug": "",
"difficulty": "",
"tags": [],
"isIncomplete": false,
"awaitingNextChunk": false,
"validationIssues": [],
"duplicateScore": 0,
"duplicateGroup": null,
"questionConfidence": 0,
"answerConfidence": 0,
"classificationConfidence": 0,
"overallConfidence": 0,
"needsReview": false
}
]
}

==================================================
NON-NEGOTIABLE RULES
1. Never hallucinate.
2. Never invent questions.
3. Never invent options.
4. Never invent answers.
5. Never rewrite educational content.
6. Never omit extractable questions.
7. Never return invalid JSON.
8. Preserve formulas exactly.
9. Preserve mathematical notation exactly.
10. Preserve chemical notation exactly.
11. Preserve numbering exactly.
12. Preserve answer mappings exactly.
13. Accuracy is more important than speed.
14. JSON validity is mandatory.
15. If uncertain, return null rather than guessing.
`;

const PRIMARY = process.env.OPENROUTER_PRIMARY_MODEL ?? "qwen/qwen3-next-80b-a3b-instruct:free";
const FALLBACK = process.env.OPENROUTER_FALLBACK_MODEL ?? "google/gemma-4-31b-it:free";

function getClient() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");
  return new OpenRouter({ apiKey });
}

/**
 * Call OpenRouter with the master system prompt and a chunk of document text.
 * If the primary model errors, retries with the fallback.
 */
export async function extractMCQsWithAI(
  rawText: string,
  options: {
    chunkNumber?: number;
    totalChunks?: number;
    sourceFormat?: string;
    filename?: string;
    signal?: AbortSignal;
  } = {}
): Promise<AIExtractResult> {
  const client = getClient();
  const chunkNumber = options.chunkNumber ?? 1;
  const totalChunks = options.totalChunks ?? 1;
  const filename = options.filename ?? "upload";

  // Wrap the user's text with chunk metadata so the model is aware of context.
  const userContent = [
    `Document filename: ${filename}`,
    `Source format: ${options.sourceFormat ?? "unknown"}`,
    `Chunk: ${chunkNumber} of ${totalChunks}`,
    `--- BEGIN DOCUMENT TEXT ---`,
    rawText.slice(0, 80_000), // hard cap to keep token usage reasonable
    `--- END DOCUMENT TEXT ---`,
  ].join("\n");

  const started = Date.now();
  let response: any;
  let usedFallback = false;
  let modelUsed = PRIMARY;

  try {
    response = await client.chat.send({
      chatRequest: {
        model: PRIMARY,
        messages: [
          { role: "system", content: MASTER_SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        // Encourage strict JSON
        responseFormat: { type: "json_object" },
        temperature: 0,
        stream: false,
      },
    });
  } catch (err) {
    console.warn("[ai] primary model failed, using fallback:", err);
    usedFallback = true;
    modelUsed = FALLBACK;
    response = await client.chat.send({
      chatRequest: {
        model: FALLBACK,
        messages: [
          { role: "system", content: MASTER_SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        responseFormat: { type: "json_object" },
        temperature: 0,
        stream: false,
      },
    });
  }

  const content = extractContent(response);
  const parsed = safeParseJSON(content);
  if (!parsed) {
    throw new Error("AI returned invalid JSON");
  }

  return {
    documentType: typeof parsed.documentType === "string" ? parsed.documentType : "",
    sourceFormat: typeof parsed.sourceFormat === "string" ? parsed.sourceFormat : (options.sourceFormat ?? ""),
    language: typeof parsed.language === "string" ? parsed.language : "",
    estimatedQuestionCount:
      typeof parsed.estimatedQuestionCount === "number" ? parsed.estimatedQuestionCount : 0,
    containsAnswerKey: parsed.containsAnswerKey === true,
    chunkNumber: typeof parsed.chunkNumber === "number" ? parsed.chunkNumber : chunkNumber,
    totalChunks: typeof parsed.totalChunks === "number" ? parsed.totalChunks : totalChunks,
    questions: Array.isArray(parsed.questions) ? parsed.questions.map(normalizeAIQuestion) : [],
    model: modelUsed,
    usedFallback,
    durationMs: Date.now() - started,
  };
}

function extractContent(response: any): string {
  // SDK may return either an object directly, a Promise, or a stream-ish
  // structure. Cover the common shapes.
  if (typeof response === "string") return response;
  if (response?.choices?.[0]?.message?.content) {
    const c = response.choices[0].message.content;
    if (typeof c === "string") return c;
    if (Array.isArray(c)) return c.map((p: any) => p.text ?? "").join("");
  }
  if (response?.message?.content) return String(response.message.content);
  if (response?.content) return String(response.content);
  return JSON.stringify(response);
}

function safeParseJSON(s: string): any | null {
  if (!s) return null;
  // Strip code fences if the model still added them
  const cleaned = s
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // Try to recover the first JSON object in the text
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

function normalizeAIQuestion(q: any): AIQuestion {
  const opts = Array.isArray(q?.options)
    ? q.options
        .map((o: any) => {
          if (typeof o === "string") {
            return { label: "", text: o };
          }
          return {
            label: String(o?.label ?? "").trim(),
            text: String(o?.text ?? "").trim(),
          };
        })
        .filter((o: { text: string }) => o.text.length > 0)
    : [];
  return {
    sourcePage: typeof q?.sourcePage === "number" ? q.sourcePage : undefined,
    questionNumber: q?.questionNumber != null ? String(q.questionNumber) : undefined,
    questionText: String(q?.questionText ?? "").trim(),
    options: opts,
    correctAnswer: q?.correctAnswer != null ? String(q.correctAnswer).trim() : null,
    solution: q?.solution != null ? String(q.solution).trim() : null,
    subject: q?.subject != null ? String(q.subject) : undefined,
    topic: q?.topic != null ? String(q.topic) : undefined,
    subtopic: q?.subtopic != null ? String(q.subtopic) : undefined,
    subjectSlug: q?.subjectSlug != null ? String(q.subjectSlug) : undefined,
    topicSlug: q?.topicSlug != null ? String(q.topicSlug) : undefined,
    subtopicSlug: q?.subtopicSlug != null ? String(q.subtopicSlug) : undefined,
    difficulty: ["easy", "medium", "hard", "expert"].includes(q?.difficulty)
      ? q.difficulty
      : undefined,
    tags: Array.isArray(q?.tags) ? q.tags.slice(0, 10).map((t: any) => String(t)) : [],
    isIncomplete: q?.isIncomplete === true,
    awaitingNextChunk: q?.awaitingNextChunk === true,
    validationIssues: Array.isArray(q?.validationIssues)
      ? q.validationIssues.map((v: any) => String(v))
      : [],
    duplicateScore: typeof q?.duplicateScore === "number" ? q.duplicateScore : 0,
    duplicateGroup: q?.duplicateGroup != null ? String(q.duplicateGroup) : null,
    questionConfidence: clamp(q?.questionConfidence),
    answerConfidence: clamp(q?.answerConfidence),
    classificationConfidence: clamp(q?.classificationConfidence),
    overallConfidence: clamp(q?.overallConfidence),
    needsReview:
      q?.needsReview === true ||
      (typeof q?.overallConfidence === "number" && q.overallConfidence < 85) ||
      (Array.isArray(q?.validationIssues) && q.validationIssues.length > 0),
  };
}

function clamp(n: any): number {
  const v = typeof n === "number" ? n : 0;
  return Math.max(0, Math.min(100, Math.round(v)));
}

/**
 * Map the AI's subject / topic / slugs onto our internal ParsedMCQ shape.
 * If the AI's subjectSlug matches a known subject, use that; else we trust
 * subjectSlug as-is and the upload action will create the row if needed.
 */
export function aiQuestionToMCQ(q: AIQuestion, fallback: { subject?: string; topic?: string }) {
  const correctIndex = resolveCorrectIndex(q);
  if (correctIndex < 0) return null;
  // Our DB difficulty enum is "easy" | "medium" | "hard" — "expert" maps to "hard".
  const diff =
    q.difficulty === "expert"
      ? ("hard" as const)
      : q.difficulty === "easy" || q.difficulty === "medium" || q.difficulty === "hard"
      ? q.difficulty
      : undefined;
  return {
    question: q.questionText,
    options: q.options.map((o) => o.text),
    correctIndex,
    explanation: q.solution ?? undefined,
    difficulty: diff,
    subject: q.subjectSlug || q.subject || fallback.subject,
    topic: q.topic || fallback.topic,
    aiMeta: {
      confidence: q.overallConfidence ?? 0,
      needsReview: q.needsReview ?? false,
      validationIssues: q.validationIssues ?? [],
      tags: q.tags ?? [],
    },
  };
}

function resolveCorrectIndex(q: AIQuestion): number {
  if (!q.correctAnswer) return -1;
  const a = q.correctAnswer.trim();
  // "C. ..." prefix
  const m1 = a.match(/^([A-H])[.)\s]/);
  if (m1) return m1[1].toUpperCase().charCodeAt(0) - 65;
  if (/^[A-H]$/i.test(a)) return a.toUpperCase().charCodeAt(0) - 65;
  if (/^\d+$/.test(a)) {
    const n = parseInt(a, 10);
    if (n >= 0 && n < q.options.length) return n;
  }
  // Try matching by option text
  const i = q.options.findIndex(
    (o) => o.text.trim().toLowerCase() === a.toLowerCase()
  );
  return i;
}

export type ParsedMCQWithMeta = ReturnType<typeof aiQuestionToMCQ> & {
  aiMeta?: {
    confidence: number;
    needsReview: boolean;
    validationIssues: string[];
    tags: string[];
  };
};
