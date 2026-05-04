export type ThoughtStatus = "nota" | "task" | "idea" | "sfogo" | "promemoria";

export type ThoughtEmotionalTone =
  | "neutral"
  | "positive"
  | "stressed"
  | "sad"
  | "excited"
  | "confused";

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  dueHint?: string;
  priority?: "low" | "medium" | "high";
};

export type Thought = {
  id: string;
  originalText: string;
  title: string;
  summary: string;
  createdAt: string;
  category: ThoughtStatus;
  tags: string[];
  tasks: Task[];
  status: ThoughtStatus;
  emotionalTone?: ThoughtEmotionalTone;
  suggestedAction?: string;
};

export type ThoughtInput = {
  text: string;
  createdAt?: string;
};
