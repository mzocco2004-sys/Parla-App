import type { Task, ThoughtStatus } from "../../types/Thought";

export type EmotionalTone =
  | "neutral"
  | "positive"
  | "stressed"
  | "sad"
  | "excited"
  | "confused";

export type ThoughtAnalysis = {
  title: string;
  summary: string;
  category: ThoughtStatus;
  tags: string[];
  tasks: Task[];
  emotionalTone?: EmotionalTone;
  suggestedAction?: string;
};

export type AIProviderTask = {
  title?: unknown;
  dueHint?: unknown;
  priority?: unknown;
};

export type AIProviderAnalysis = {
  title?: unknown;
  summary?: unknown;
  category?: unknown;
  tags?: unknown;
  tasks?: unknown;
  emotionalTone?: unknown;
  suggestedAction?: unknown;
};
