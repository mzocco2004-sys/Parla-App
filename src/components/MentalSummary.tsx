import { Brain, Sparkles } from "lucide-react";
import type { Thought } from "../types/Thought";

type MentalSummaryProps = {
  thoughts: Thought[];
};

function getTopThemes(thoughts: Thought[]) {
  const counts = thoughts
    .flatMap((thought) => thought.tags)
    .reduce<Record<string, number>>((accumulator, tag) => {
      accumulator[tag] = (accumulator[tag] ?? 0) + 1;
      return accumulator;
    }, {});

  return Object.entries(counts)
    .sort(([, left], [, right]) => right - left)
    .slice(0, 3)
    .map(([tag]) => tag);
}

export function MentalSummary({ thoughts }: MentalSummaryProps) {
  const topThemes = getTopThemes(thoughts);
  const ideaCount = thoughts.filter((thought) => thought.status === "idea").length;
  const taskCount = thoughts.reduce((total, thought) => total + thought.tasks.length, 0);
  const readableThemes = topThemes.length > 0 ? topThemes.join(", ") : "progetti personali";

  return (
    <section className="card overflow-hidden">
      <div className="flex items-start gap-3 p-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-mint-100 text-mint-700">
          <Brain size={21} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-ink-900">Riepilogo mentale</h2>
            <Sparkles size={16} className="text-amber-500" />
          </div>
          <p className="mt-2 text-sm leading-6 text-ink-500">
            Ultimamente stai pensando molto a {readableThemes}.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 border-t border-ink-100 bg-ink-50">
        <div className="p-4">
          <p className="text-xl font-semibold text-ink-900">{topThemes.length}</p>
          <p className="mt-1 text-xs text-ink-500">temi</p>
        </div>
        <div className="border-x border-ink-100 p-4">
          <p className="text-xl font-semibold text-ink-900">{ideaCount}</p>
          <p className="mt-1 text-xs text-ink-500">idee</p>
        </div>
        <div className="p-4">
          <p className="text-xl font-semibold text-ink-900">{taskCount}</p>
          <p className="mt-1 text-xs text-ink-500">task</p>
        </div>
      </div>
    </section>
  );
}
