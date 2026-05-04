import type { ThoughtStatus } from "../types/Thought";

const RULES: Array<{ status: ThoughtStatus; keywords: string[] }> = [
  {
    status: "promemoria",
    keywords: ["domani", "stasera", "alle", "ricordami"],
  },
  {
    status: "task",
    keywords: ["devo", "ricordami", "fare", "chiamare", "comprare", "prenotare"],
  },
  {
    status: "idea",
    keywords: ["idea", "progetto", "potrei", "app", "business"],
  },
  {
    status: "sfogo",
    keywords: ["stress", "ansia", "stanco", "confuso", "nervoso"],
  },
];

export function classifyThought(text: string): ThoughtStatus {
  const normalized = text.toLowerCase();

  return (
    RULES.find((rule) =>
      rule.keywords.some((keyword) => normalized.includes(keyword))
    )?.status ?? "nota"
  );
}
