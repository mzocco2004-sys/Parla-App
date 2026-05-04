import {
  ArrowLeft,
  Calendar,
  CalendarClock,
  CheckCircle2,
  Flag,
  HeartPulse,
  Sparkles,
  Trash2,
} from "lucide-react";
import type { Thought } from "../types/Thought";

const PRIORITY_LABELS = {
  low: "bassa",
  medium: "media",
  high: "alta",
};

const PRIORITY_STYLE = {
  low: "bg-ink-100 text-ink-500",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-red-50 text-red-600",
};

const TONE_LABELS = {
  neutral: "neutro",
  positive: "positivo",
  stressed: "stressato",
  sad: "triste",
  excited: "entusiasta",
  confused: "confuso",
};

type ThoughtDetailProps = {
  thought: Thought;
  onBack: () => void;
  onDelete: (id: string) => void;
  onToggleTask: (thoughtId: string, taskId: string) => void;
};

export function ThoughtDetail({
  thought,
  onBack,
  onDelete,
  onToggleTask,
}: ThoughtDetailProps) {
  return (
    <section className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="tap inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-700"
      >
        <ArrowLeft size={17} />
        Indietro
      </button>

      <article className="card p-5">
        <div className="flex items-start justify-between gap-4">
          <span className="rounded-full bg-ink-900 px-3 py-1 text-sm font-semibold text-white">
            {thought.category}
          </span>
          <span className="inline-flex items-center gap-2 text-xs text-ink-500">
            <Calendar size={15} />
            {new Intl.DateTimeFormat("it-IT", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(thought.createdAt))}
          </span>
        </div>

        <h2 className="mt-6 text-2xl font-semibold leading-tight text-ink-900">
          {thought.title}
        </h2>
        <p className="mt-3 text-base leading-7 text-ink-700">
          {thought.summary}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {thought.emotionalTone && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-ink-500">
              <HeartPulse size={15} />
              {TONE_LABELS[thought.emotionalTone]}
            </span>
          )}
          {thought.suggestedAction && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-100 px-3 py-1.5 text-sm font-medium text-mint-700">
              <Sparkles size={15} />
              {thought.suggestedAction}
            </span>
          )}
        </div>

        <p className="mt-5 whitespace-pre-wrap rounded-2xl bg-ink-50 p-4 text-sm leading-7 text-ink-700">
          {thought.originalText}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {thought.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-ink-50 px-3 py-1.5 text-sm text-ink-500">
              #{tag}
            </span>
          ))}
        </div>

        {thought.tasks.length > 0 && (
          <div className="mt-7">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-500">
              Task estratti
            </h3>
            <div className="mt-3 space-y-2">
              {thought.tasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => onToggleTask(thought.id, task.id)}
                  className="tap flex w-full items-center gap-3 rounded-2xl border border-ink-100 bg-ink-50 px-4 py-3 text-left"
                >
                  <CheckCircle2
                    size={20}
                    className={task.completed ? "text-mint-700" : "text-ink-500"}
                  />
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-sm font-medium ${
                        task.completed
                          ? "text-ink-500 line-through"
                          : "text-ink-900"
                      }`}
                    >
                      {task.title}
                    </span>
                    {(task.dueHint || task.priority) && (
                      <span className="mt-2 flex flex-wrap gap-2">
                        {task.dueHint && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-medium text-ink-500">
                            <CalendarClock size={13} />
                            {task.dueHint}
                          </span>
                        )}
                        {task.priority && (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${PRIORITY_STYLE[task.priority]}`}
                          >
                            <Flag size={13} />
                            {PRIORITY_LABELS[task.priority]}
                          </span>
                        )}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => onDelete(thought.id)}
          className="tap mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100"
        >
          <Trash2 size={17} />
          Elimina
        </button>
      </article>
    </section>
  );
}
