import { Beaker, Download, Rocket, Vote } from "lucide-react";
import type { Thought } from "../../types/Thought";

type FounderLabProps = {
  thoughts: Thought[];
};

function downloadThoughts(thoughts: Thought[]) {
  const blob = new Blob([JSON.stringify(thoughts, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "parla-export.json";
  link.click();
  URL.revokeObjectURL(url);
}

export function FounderLab({ thoughts }: FounderLabProps) {
  return (
    <section className="card overflow-hidden border-amber-100">
      <div className="bg-ink-900 p-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-500">
              Founder
            </p>
            <h2 className="mt-2 text-lg font-semibold">Laboratorio early access</h2>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Funzioni sperimentali per chi vuole costruire Parla prima degli altri.
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-ink-900">
            <Beaker size={20} />
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-5 sm:grid-cols-3 lg:grid-cols-1">
        <button
          type="button"
          onClick={() => downloadThoughts(thoughts)}
          className="tap rounded-2xl bg-ink-50 p-4 text-left"
        >
          <Download size={18} className="text-ink-900" />
          <h3 className="mt-3 text-sm font-semibold text-ink-900">Export JSON</h3>
          <p className="mt-1 text-sm leading-6 text-ink-500">
            Scarica note e task per migrazioni o backup.
          </p>
        </button>
        <div className="rounded-2xl bg-ink-50 p-4">
          <Rocket size={18} className="text-ink-900" />
          <h3 className="mt-3 text-sm font-semibold text-ink-900">Feature lab</h3>
          <p className="mt-1 text-sm leading-6 text-ink-500">
            Memoria contestuale, widget rapido e comandi vocali sono in coda.
          </p>
        </div>
        <div className="rounded-2xl bg-ink-50 p-4">
          <Vote size={18} className="text-ink-900" />
          <h3 className="mt-3 text-sm font-semibold text-ink-900">Voto roadmap</h3>
          <p className="mt-1 text-sm leading-6 text-ink-500">
            I founder decidono quali esperimenti arrivano prima.
          </p>
        </div>
      </div>
    </section>
  );
}
