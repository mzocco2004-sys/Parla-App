import { Inbox, Lightbulb, ListTodo, NotebookText } from "lucide-react";
import type { Thought } from "../types/Thought";
import { ThoughtCard } from "./ThoughtCard";

type DashboardProps = {
  thoughts: Thought[];
  allThoughts: Thought[];
  onOpenThought: (id: string) => void;
};

export function Dashboard({ thoughts, allThoughts, onOpenThought }: DashboardProps) {
  const openTasks = allThoughts.reduce(
    (total, thought) =>
      total + thought.tasks.filter((task) => !task.completed).length,
    0
  );
  const ideas = allThoughts.filter((thought) => thought.status === "idea").length;

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-3">
          <NotebookText size={18} className="text-mint-700" />
          <p className="mt-3 text-xl font-semibold text-ink-900">{allThoughts.length}</p>
          <p className="text-xs text-ink-500">note</p>
        </div>
        <div className="card p-3">
          <ListTodo size={18} className="text-blue-600" />
          <p className="mt-3 text-xl font-semibold text-ink-900">{openTasks}</p>
          <p className="text-xs text-ink-500">task aperti</p>
        </div>
        <div className="card p-3">
          <Lightbulb size={18} className="text-amber-500" />
          <p className="mt-3 text-xl font-semibold text-ink-900">{ideas}</p>
          <p className="text-xs text-ink-500">idee</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink-900">Ultime note</h2>
        <span className="text-sm text-ink-500">{thoughts.length}</span>
      </div>

      {thoughts.length > 0 ? (
        <div className="space-y-3">
          {thoughts.map((thought) => (
            <ThoughtCard key={thought.id} thought={thought} onOpen={onOpenThought} />
          ))}
        </div>
      ) : (
        <div className="card flex flex-col items-center justify-center px-6 py-10 text-center">
          <Inbox size={30} className="text-ink-500" />
          <p className="mt-3 text-sm font-medium text-ink-900">Nessun pensiero trovato</p>
          <p className="mt-1 text-sm text-ink-500">
            Prova a cambiare filtro o a salvare una nuova nota.
          </p>
        </div>
      )}
    </section>
  );
}
