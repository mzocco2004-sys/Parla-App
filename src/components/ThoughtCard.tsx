import { CalendarClock, CheckCircle2, ChevronRight, Flag, ListTodo } from "lucide-react";
import type { Thought, ThoughtStatus } from "../types/Thought";

const STATUS_STYLE: Record<ThoughtStatus, string> = {
  nota: "bg-ink-100 text-ink-700",
  task: "bg-blue-50 text-blue-700",
  idea: "bg-amber-50 text-amber-700",
  sfogo: "bg-rose-50 text-rose-700",
  promemoria: "bg-mint-100 text-mint-700",
};

type ThoughtCardProps = {
  thought: Thought;
  onOpen: (id: string) => void;
};

export function ThoughtCard({ thought, onOpen }: ThoughtCardProps) {
  const openTasks = thought.tasks.filter((task) => !task.completed).length;
  const nextDueHint = thought.tasks.find((task) => task.dueHint)?.dueHint;
  const hasHighPriority = thought.tasks.some((task) => task.priority === "high");

  return (
    <button
      type="button"
      onClick={() => onOpen(thought.id)}
      className="tap card w-full p-4 text-left hover:-translate-y-0.5 hover:border-mint-100"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[thought.status]}`}
            >
              {thought.status}
            </span>
            <span className="text-xs text-ink-500">
              {new Intl.DateTimeFormat("it-IT", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(thought.createdAt))}
            </span>
          </div>
          <p className="mt-3 line-clamp-1 text-base font-semibold leading-6 text-ink-900">
            {thought.title}
          </p>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-ink-500">
            {thought.summary}
          </p>
        </div>
        <ChevronRight className="mt-1 shrink-0 text-ink-500" size={19} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {thought.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full bg-ink-50 px-2.5 py-1 text-xs text-ink-500">
            #{tag}
          </span>
        ))}
      </div>

      {thought.tasks.length > 0 && (
        <div className="mt-4 flex items-center gap-3 text-xs text-ink-500">
          <span className="inline-flex items-center gap-1.5">
            <ListTodo size={15} />
            {thought.tasks.length} task
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={15} />
            {openTasks} aperti
          </span>
          {nextDueHint && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock size={15} />
              {nextDueHint}
            </span>
          )}
          {hasHighPriority && (
            <span className="inline-flex items-center gap-1.5 text-red-600">
              <Flag size={15} />
              alta
            </span>
          )}
        </div>
      )}
    </button>
  );
}
