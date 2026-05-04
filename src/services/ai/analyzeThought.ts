import type {
  AIProviderAnalysis,
  AIProviderTask,
  EmotionalTone,
  ThoughtAnalysis,
} from "./aiTypes";
import type { Task } from "../../types/Thought";
import { localFallbackAnalyzer } from "./localFallbackAnalyzer";
import { buildThoughtAnalysisPrompt } from "./promptBuilder";

const CATEGORIES = ["task", "idea", "promemoria", "sfogo", "nota"] as const;
const PRIORITIES = ["low", "medium", "high"] as const;
const EMOTIONAL_TONES = [
  "neutral",
  "positive",
  "stressed",
  "sad",
  "excited",
  "confused",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6);
}

function isPriority(value: string | undefined): value is NonNullable<Task["priority"]> {
  return value !== undefined && PRIORITIES.some((priority) => priority === value);
}

function normalizeProviderTasks(value: unknown): ThoughtAnalysis["tasks"] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is AIProviderTask => isRecord(item))
    .map((task, index): Task | null => {
      const title = readString(task.title);
      const priority = readString(task.priority);
      const dueHint = readString(task.dueHint);

      if (!title) {
        return null;
      }

      return {
        id: `ai-task-${index}-${title.toLowerCase().replace(/[^a-z0-9]+/gi, "-")}`,
        title,
        completed: false,
        ...(dueHint ? { dueHint } : {}),
        priority: isPriority(priority) ? priority : "low",
      };
    })
    .filter((task): task is Task => task !== null);
}

function normalizeProviderAnalysis(
  raw: unknown,
  fallback: ThoughtAnalysis
): ThoughtAnalysis {
  if (!isRecord(raw)) {
    return fallback;
  }

  const data = raw as AIProviderAnalysis;
  const category = readString(data.category);
  const emotionalTone = readString(data.emotionalTone);
  const suggestedAction = readString(data.suggestedAction);
  const tasks = normalizeProviderTasks(data.tasks);
  const tags = readStringArray(data.tags);

  return {
    title: readString(data.title) ?? fallback.title,
    summary: readString(data.summary) ?? fallback.summary,
    category: CATEGORIES.includes(category as ThoughtAnalysis["category"])
      ? (category as ThoughtAnalysis["category"])
      : fallback.category,
    tags: tags.length > 0 ? tags : fallback.tags,
    tasks,
    emotionalTone: EMOTIONAL_TONES.includes(emotionalTone as EmotionalTone)
      ? (emotionalTone as EmotionalTone)
      : fallback.emotionalTone,
    suggestedAction: suggestedAction ?? fallback.suggestedAction,
  };
}

function createMockAIResponse(prompt: string): AIProviderAnalysis {
  const text = prompt.match(/Pensiero:\s*"([\s\S]*)"$/)?.[1]?.replace(/\\"/g, '"') ?? "";
  const fallback = localFallbackAnalyzer(text);

  return {
    title: fallback.title,
    summary: fallback.summary,
    category: fallback.category,
    tags: fallback.tags,
    tasks: fallback.tasks.map(({ title, dueHint, priority }) => ({
      title,
      dueHint: dueHint ?? null,
      priority: priority ?? "low",
    })),
    emotionalTone: fallback.emotionalTone ?? "neutral",
    suggestedAction: fallback.suggestedAction ?? null,
  };
}

async function callConfiguredEndpoint(text: string, prompt: string): Promise<unknown> {
  const endpoint = import.meta.env.VITE_AI_ENDPOINT;

  if (!endpoint) {
    throw new Error("VITE_AI_ENDPOINT non configurato.");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, prompt }),
  });

  if (!response.ok) {
    throw new Error(`AI endpoint non disponibile: ${response.status}`);
  }

  return response.json();
}

export async function callAIProvider(text: string, prompt: string): Promise<unknown> {
  if (import.meta.env.VITE_AI_ENDPOINT) {
    return callConfiguredEndpoint(text, prompt);
  }

  if (import.meta.env.VITE_ENABLE_MOCK_AI === "true") {
    return createMockAIResponse(prompt);
  }

  // In produzione non chiamare direttamente OpenAI o altri provider dal frontend:
  // usa un backend o una serverless function per proteggere chiavi, rate limit e log.
  throw new Error("AI provider non configurato: uso fallback locale.");
}

export async function analyzeThought(text: string): Promise<ThoughtAnalysis> {
  const fallback = localFallbackAnalyzer(text);

  try {
    const prompt = buildThoughtAnalysisPrompt(text);
    const rawAnalysis = await callAIProvider(text, prompt);
    return normalizeProviderAnalysis(rawAnalysis, fallback);
  } catch (error) {
    console.info("Analisi AI non disponibile, uso fallback locale.", error);
    return fallback;
  }
}
