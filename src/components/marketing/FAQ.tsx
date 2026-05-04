const FAQS = [
  [
    "Parla registra davvero la voce?",
    "In questo MVP la registrazione e' simulata. La struttura e' pronta per collegare speech-to-text reale.",
  ],
  [
    "Dove finiscono i dati?",
    "Oggi restano nel LocalStorage del browser. Per il lancio reale servira' un backend sicuro.",
  ],
  [
    "Posso usarla senza AI?",
    "Si. Se l'endpoint AI non e' configurato, Parla usa un fallback locale.",
  ],
  [
    "Per chi e' pensata?",
    "Per persone con molte idee e poco tempo: studenti, freelance, founder e team piccoli.",
  ],
];

export function FAQ() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h2 className="text-center text-4xl font-semibold text-ink-900">FAQ</h2>
      <div className="mt-8 space-y-3">
        {FAQS.map(([question, answer]) => (
          <details
            key={question}
            className="group rounded-2xl border border-ink-100 bg-white p-5"
          >
            <summary className="cursor-pointer list-none text-base font-semibold text-ink-900">
              {question}
            </summary>
            <p className="mt-3 text-sm leading-6 text-ink-500">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
