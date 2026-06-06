export type ParsedMCQ = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  difficulty?: "easy" | "medium" | "hard";
  topic?: string;
  subject?: string;
  // AI-extraction metadata (only set when this MCQ came from the AI path)
  _aiConfidence?: number;
  _aiNeedsReview?: boolean;
  _aiTags?: string[];
};

export type ParseResult = {
  mcqs: ParsedMCQ[];
  warnings: string[];
  source: "pdf" | "html" | "csv" | "json";
};
