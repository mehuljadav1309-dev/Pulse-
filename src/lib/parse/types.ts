export type ParsedMCQ = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  difficulty?: "easy" | "medium" | "hard";
};

export type ParseResult = {
  mcqs: ParsedMCQ[];
  warnings: string[];
  source: "pdf" | "html" | "csv" | "json";
};
