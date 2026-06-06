export type ParsedMCQ = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  difficulty?: "easy" | "medium" | "hard";
  topic?: string;
  subject?: string;
};

export type ParseResult = {
  mcqs: ParsedMCQ[];
  warnings: string[];
  source: "pdf" | "html" | "csv" | "json";
};
