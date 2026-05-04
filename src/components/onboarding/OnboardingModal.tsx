import { Check, Mic, Sparkles, SearchCheck } from "lucide-react";
import { trackEvent } from "../../utils/analytics";

const STEPS = [
  {
    icon: Mic,
    title: "Registra un pensiero",
    text: "Scarica a voce quello che hai in testa, senza sistemarlo prima.",
  },
  {
    icon: Sparkles,
    title: "Lascia che Parla lo organizzi",
    text: "Categoria, titolo, riassunto e task arrivano in automatico.",
  },
  {
    icon: SearchCheck,
    title: "Ritrova task, idee e promemoria",
    text: "Tutto resta cercabile e ordinato, anche quando la giornata corre.",
  },
];

type OnboardingModalProps = {
  onComplete: () => void;
};

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  function handleComplete() {
    localStorage.setItem("parla:onboarding-completed", "true");
    trackEvent("onboarding_completed");
    onComplete();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-ink-900/30 px-4 pb-4 backdrop-blur-sm sm:items-center sm:justify-center">
      <div className="w-full max-w-md rounded-[28px] bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-700">
              Benvenuto in Parla
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-ink-900">
              La tua mente, finalmente ordinata.
            </h2>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mint-100 text-mint-700">
            <Check size={20} />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="rounded-2xl border border-ink-100 p-4">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink-50 text-ink-700">
                    <Icon size={19} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-ink-900">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-ink-500">{step.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleComplete}
          className="tap mt-6 w-full rounded-2xl bg-ink-900 px-5 py-4 text-sm font-semibold text-white hover:bg-ink-700"
        >
          Inizia a usare Parla
        </button>
      </div>
    </div>
  );
}
