import { classifyThought } from "../../utils/classifyThought";
import { extractTasks } from "../../utils/extractTasks";
import { generateTags } from "../../utils/generateTags";
import type { EmotionalTone, ThoughtAnalysis } from "./aiTypes";

const TONE_RULES: Array<{ tone: EmotionalTone; keywords: string[] }> = [
  { tone: "stressed", keywords: ["stress", "ansia", "nervoso", "pressione"] },
  { tone: "sad", keywords: ["triste", "giù", "solo", "deluso"] },
  { tone: "excited", keywords: ["entusiasta", "carico", "non vedo l'ora", "felice"] },
  { tone: "confused", keywords: ["confuso", "indeciso", "non so", "dubbi"] },
  { tone: "positive", keywords: ["bene", "contento", "ottimo", "soddisfatto"] },
];

function normalizeSpaces(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function trimSentence(text: string, maxLength: number): string {
  const clean = normalizeSpaces(text);

  if (clean.length <= maxLength) {
    return clean;
  }

  return `${clean.slice(0, maxLength - 1).trim()}...`;
}

function generateLocalTitle(text: string, tasks: ThoughtAnalysis["tasks"]): string {
  if (tasks.length > 0) {
    return trimSentence(tasks.map((task) => task.title).join(" e "), 72);
  }

  return trimSentence(text.replace(/^idea:\s*/i, ""), 72) || "Pensiero salvato";
}

function detectEmotionalTone(text: string): EmotionalTone {
  const normalized = text.toLowerCase();

  return (
    TONE_RULES.find((rule) =>
      rule.keywords.some((keyword) => normalized.includes(keyword))
    )?.tone ?? "neutral"
  );
}

function generateLocalSummary(
  text: string,
  tasks: ThoughtAnalysis["tasks"],
  category: ThoughtAnalysis["category"]
): string {
  const dueHint = tasks.find((task) => task.dueHint)?.dueHint;

  if (tasks.length > 1) {
    return `Hai ${tasks.length} attivita' da completare${dueHint ? ` ${dueHint}` : ""}.`;
  }

  if (tasks.length === 1) {
    return `Hai una attivita' da completare${dueHint ? ` ${dueHint}` : ""}.`;
  }

  if (category === "idea") {
    return "Hai salvato una possibile idea da sviluppare.";
  }

  if (category === "sfogo") {
    return "Hai catturato uno stato emotivo o un pensiero personale.";
  }

  return trimSentence(text, 110) || "Nota salvata.";
}

function generateSuggestedAction(
  tasks: ThoughtAnalysis["tasks"],
  category: ThoughtAnalysis["category"],
  tone: EmotionalTone
): string | undefined {
  const dueHint = tasks.find((task) => task.dueHint)?.dueHint;

  if (tasks.length > 0 && dueHint) {
    return `Imposta un promemoria per ${dueHint}.`;
  }

  if (tasks.length > 0) {
    return "Scegli il primo task e completalo appena puoi.";
  }

  if (category === "idea") {
    return "Aggiungi un prossimo passo concreto per validare l'idea.";
  }

  if (tone === "stressed" || tone === "confused") {
    return "Rileggi questa nota piu' tardi e separa cio' che puoi controllare.";
  }

  return undefined;
}

export function localFallbackAnalyzer(text: string): ThoughtAnalysis {
  const cleanText = normalizeSpaces(text);
  const category = classifyThought(cleanText);
  const tasks = extractTasks(cleanText).map((task) => ({
    ...task,
    priority: task.priority ?? "low",
  }));
  const emotionalTone = detectEmotionalTone(cleanText);

  return {
    title: generateLocalTitle(cleanText, tasks),
    summary: generateLocalSummary(cleanText, tasks, category),
    category,
    tags: generateTags(cleanText),
    tasks,
    emotionalTone,
    suggestedAction: generateSuggestedAction(tasks, category, emotionalTone),
  };
}
