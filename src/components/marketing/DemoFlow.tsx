import { Brain, CheckSquare, Mic } from "lucide-react";

const FLOW = [
  {
    icon: Mic,
    title: "Parli",
    text: "Registra o scrivi un pensiero in pochi secondi.",
  },
  {
    icon: Brain,
    title: "AI capisce",
    text: "Categoria, tono, tag e riassunto vengono generati per te.",
  },
  {
    icon: CheckSquare,
    title: "Task creati",
    text: "Le azioni concrete diventano task ritrovabili.",
  },
];

export function DemoFlow() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-3 md:grid-cols-3">
        {FLOW.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="card p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mint-100 text-mint-700">
                <Icon size={21} />
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-ink-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-ink-500">{item.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
