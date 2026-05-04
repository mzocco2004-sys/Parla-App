import { Lightbulb, ListTodo, Mic, Search, Sparkles, TimerReset } from "lucide-react";

const FEATURES = [
  ["Zero scrittura", "Cattura pensieri a voce o testo, senza form lunghi.", Mic],
  ["Task automatici", "Parla separa le azioni e le rende completabili.", ListTodo],
  ["Idee ritrovabili", "Tag, ricerca e categorie tengono vivo quello che conta.", Lightbulb],
  ["Riepilogo mentale", "Capisci cosa ti occupa la testa questa settimana.", Sparkles],
  ["Promemoria chiari", "I riferimenti temporali restano agganciati ai task.", TimerReset],
  ["Ricerca veloce", "Trova note, tag e attività senza scavare nelle app.", Search],
] as const;

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-mint-700">
          Soluzione
        </p>
        <h2 className="mt-3 text-4xl font-semibold leading-tight text-ink-900">
          Un secondo cervello che non chiede disciplina.
        </h2>
        <p className="mt-4 text-base leading-7 text-ink-500">
          Parla organizza il caos leggero della giornata: idee, task, sfoghi e
          promemoria finiscono nel posto giusto.
        </p>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(([title, text, Icon]) => (
          <div key={title} className="rounded-2xl border border-ink-100 bg-white p-5">
            <Icon size={22} className="text-ink-900" />
            <h3 className="mt-4 text-lg font-semibold text-ink-900">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink-500">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
