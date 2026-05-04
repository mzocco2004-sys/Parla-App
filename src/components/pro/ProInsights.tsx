import { BrainCircuit, CalendarClock, Sparkles, TrendingUp } from "lucide-react";
import type { Thought } from "../../types/Thought";

type ProInsightsProps = {
  thoughts: Thought[];
};

function getMostCommonTone(thoughts: Thought[]) {
  const counts = thoughts.reduce<Record<string, number>>((accumulator, thought) => {
    const tone = thought.emotionalTone ?? "neutral";
    accumulator[tone] = (accumulator[tone] ?? 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(counts).sort(([, left], [, right]) => right - left)[0]?.[0] ?? "neutral";
}

function getNextDueHint(thoughts: Thought[]) {
  return thoughts.flatMap((thought) => thought.tasks).find((task) => task.dueHint)?.dueHint;
}

export function ProInsights({ thoughts }: ProInsightsProps) {
  const openTasks = thoughts.flatMap((thought) => thought.tasks).filter((task) => !task.completed);
  const highPriorityTasks = openTasks.filter((task) => task.priority === "high");
  const commonTone = getMostCommonTone(thoughts);
  const nextDueHint = getNextDueHint(thoughts);

  return (
    <section className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-700">
            Pro
          </p>
          <h2 className="mt-2 text-lg font-semibold text-ink-900">
            Insight avanzati
          </h2>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-900 text-white">
          <BrainCircuit size={20} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
        <div className="rounded-2xl bg-ink-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
            <TrendingUp size={16} />
            Priorita'
          </div>
          <p className="mt-2 text-sm leading-6 text-ink-500">
            Hai {highPriorityTasks.length} task ad alta priorita' e {openTasks.length} task aperti.
          </p>
        </div>
        <div className="rounded-2xl bg-ink-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
            <Sparkles size={16} />
            Tono mentale
          </div>
          <p className="mt-2 text-sm leading-6 text-ink-500">
            Il tono piu' frequente nelle ultime note e' {commonTone}.
          </p>
        </div>
        <div className="rounded-2xl bg-ink-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
            <CalendarClock size={16} />
            Prossimo focus
          </div>
          <p className="mt-2 text-sm leading-6 text-ink-500">
            {nextDueHint
              ? `Rivedi i task collegati a ${nextDueHint}.`
              : "Crea un promemoria con una scadenza chiara."}
          </p>
        </div>
      </div>
    </section>
  );
}
