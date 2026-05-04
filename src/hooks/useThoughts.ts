import { useEffect, useMemo, useState } from "react";
import type { Task, Thought, ThoughtInput } from "../types/Thought";
import { analyzeThought } from "../services/ai/analyzeThought";
import { localFallbackAnalyzer } from "../services/ai/localFallbackAnalyzer";
import { trackEvent } from "../utils/analytics";

const STORAGE_KEY = "second-brain-vocale:thoughts";

const MOCK_TEXTS = [
  "Domani devo chiamare il dentista e comprare il regalo per Luca",
  "Idea: creare un'app che organizza le note vocali automaticamente",
  "Mi sento un po' stressato per il lavoro",
  "Vorrei prenotare un viaggio in Giappone",
  "Ricordami di pagare la bolletta stasera",
];

function createThoughtFromAnalysis(
  { text, createdAt }: ThoughtInput,
  analysis = localFallbackAnalyzer(text)
): Thought {
  const cleanText = text.trim();

  return {
    id: crypto.randomUUID(),
    originalText: cleanText,
    title: analysis.title,
    summary: analysis.summary,
    createdAt: createdAt ?? new Date().toISOString(),
    category: analysis.category,
    tags: analysis.tags,
    tasks: analysis.tasks,
    status: analysis.category,
    emotionalTone: analysis.emotionalTone,
    suggestedAction: analysis.suggestedAction,
  };
}

function normalizeThought(rawThought: Partial<Thought>): Thought | null {
  if (!rawThought.originalText || !rawThought.createdAt) {
    return null;
  }

  const fallback = localFallbackAnalyzer(rawThought.originalText);
  const category = rawThought.category ?? rawThought.status ?? fallback.category;

  return {
    id: rawThought.id ?? crypto.randomUUID(),
    originalText: rawThought.originalText,
    title: rawThought.title ?? fallback.title,
    summary: rawThought.summary ?? fallback.summary,
    createdAt: rawThought.createdAt,
    category,
    tags: rawThought.tags ?? fallback.tags,
    tasks: rawThought.tasks ?? fallback.tasks,
    status: rawThought.status ?? category,
    emotionalTone: rawThought.emotionalTone ?? fallback.emotionalTone,
    suggestedAction: rawThought.suggestedAction ?? fallback.suggestedAction,
  };
}

function getInitialThoughts(): Thought[] {
  const now = Date.now();

  return MOCK_TEXTS.map((text, index) =>
    createThoughtFromAnalysis({
      text,
      createdAt: new Date(now - index * 1000 * 60 * 60 * 7).toISOString(),
    })
  );
}

function readStoredThoughts(): Thought[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return getInitialThoughts();
    }

    const parsed = JSON.parse(stored) as Partial<Thought>[];
    return parsed.map(normalizeThought).filter((thought): thought is Thought => thought !== null);
  } catch {
    return getInitialThoughts();
  }
}

export function useThoughts() {
  const [thoughts, setThoughts] = useState<Thought[]>(readStoredThoughts);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(thoughts));
      setError(null);
    } catch {
      setError("Non sono riuscito a salvare localmente questa nota.");
    }
  }, [thoughts]);

  const sortedThoughts = useMemo(
    () =>
      [...thoughts].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [thoughts]
  );

  async function addThought(text: string): Promise<Thought | null> {
    if (!text.trim()) {
      setError("Aggiungi almeno qualche parola prima di salvare.");
      return null;
    }

    setIsAnalyzing(true);

    try {
      const analysis = await analyzeThought(text);
      const thought = createThoughtFromAnalysis({ text }, analysis);
      setThoughts((current) => [thought, ...current]);
      trackEvent("thought_created", {
        category: thought.category,
        tasks: thought.tasks.length,
      });
      setError(null);
      return thought;
    } catch {
      setError("Non sono riuscito ad analizzare questa nota.");
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }

  function deleteThought(id: string) {
    setThoughts((current) => current.filter((thought) => thought.id !== id));
  }

  function toggleTask(thoughtId: string, taskId: string) {
    const thoughtToUpdate = thoughts.find((thought) => thought.id === thoughtId);
    const taskToUpdate = thoughtToUpdate?.tasks.find((task) => task.id === taskId);

    if (thoughtToUpdate && taskToUpdate && !taskToUpdate.completed) {
      trackEvent("task_completed", { category: thoughtToUpdate.category });
    }

    setThoughts((current) =>
      current.map((thought) => {
        if (thought.id !== thoughtId) {
          return thought;
        }

        return {
          ...thought,
          tasks: thought.tasks.map((task: Task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          ),
        };
      })
    );
  }

  return {
    thoughts: sortedThoughts,
    error,
    isAnalyzing,
    addThought,
    deleteThought,
    toggleTask,
  };
}
