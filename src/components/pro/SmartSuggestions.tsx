import { CheckCircle2, Lightbulb, ListTodo } from "lucide-react";
import type { Thought } from "../../types/Thought";

type SmartSuggestionsProps = {
  thoughts: Thought[];
};

function buildSuggestions(thoughts: Thought[]) {
  const openTasks = thoughts.flatMap((thought) => thought.tasks).filter((task) => !task.completed);
  const ideas = thoughts.filter((thought) => thought.status === "idea");
  const stressedNotes = thoughts.filter((thought) => thought.emotionalTone === "stressed");

  return [
    {
      icon: ListTodo,
      title: "Chiudi il prossimo task",
      text:
        openTasks[0]?.title ??
        "Crea un task concreto dalla prossima nota per rendere Parla piu' utile.",
    },
    {
      icon: Lightbulb,
      title: "Trasforma un'idea in esperimento",
      text:
        ideas[0]?.title ??
        "Quando salvi un'idea, aggiungi anche il primo passo per provarla.",
    },
    {
      icon: CheckCircle2,
      title: "Riduci rumore mentale",
      text:
        stressedNotes.length > 0
          ? "Hai alcune note stressate: separa cio' che puoi controllare da cio' che puoi lasciare."
          : "Il tuo spazio mentale sembra stabile. Continua a catturare pensieri rapidi.",
    },
  ];
}

export function SmartSuggestions({ thoughts }: SmartSuggestionsProps) {
  const suggestions = buildSuggestions(thoughts);

  return (
    <section className="card p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-700">
        Pro
      </p>
      <h2 className="mt-2 text-lg font-semibold text-ink-900">Suggerimenti smart</h2>
      <div className="mt-4 space-y-3">
        {suggestions.map((suggestion) => {
          const Icon = suggestion.icon;

          return (
            <div key={suggestion.title} className="rounded-2xl border border-ink-100 p-4">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint-100 text-mint-700">
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-ink-900">{suggestion.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-ink-500">{suggestion.text}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
