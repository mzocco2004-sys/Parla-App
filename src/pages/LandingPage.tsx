import { CTASection } from "../components/marketing/CTASection";
import { DemoFlow } from "../components/marketing/DemoFlow";
import { FAQ } from "../components/marketing/FAQ";
import { FeatureGrid } from "../components/marketing/FeatureGrid";
import { Hero } from "../components/marketing/Hero";
import { MarketingShell } from "../components/marketing/MarketingShell";
import { PricingCards } from "../components/marketing/PricingCards";

const USE_CASES = [
  "Studenti che vogliono trasformare appunti vocali in azioni.",
  "Freelance che passano da idea a task senza perdere contesto.",
  "Founder che pensano sempre a prodotto, clienti e priorita'.",
  "Persone piene di idee e poco tempo per scriverle bene.",
];

export function LandingPage() {
  return (
    <MarketingShell>
      <Hero />
      <DemoFlow />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-mint-700">
              Problema
            </p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight text-ink-900">
              Pensieri sparsi. Note dimenticate. Task persi.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {["Pensieri sparsi", "Note dimenticate", "Task persi"].map((item) => (
              <div key={item} className="rounded-2xl border border-ink-100 bg-white p-5">
                <p className="text-lg font-semibold text-ink-900">{item}</p>
                <p className="mt-2 text-sm leading-6 text-ink-500">
                  Il problema non e' pensare troppo. E' non ritrovare nulla.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeatureGrid />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-mint-700">
          Use case
        </p>
        <h2 className="mt-3 text-4xl font-semibold text-ink-900">
          Fatto per chi pensa in movimento.
        </h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {USE_CASES.map((useCase) => (
            <div key={useCase} className="rounded-2xl border border-ink-100 bg-white p-5">
              <p className="text-base font-semibold leading-7 text-ink-900">{useCase}</p>
            </div>
          ))}
        </div>
      </section>

      <PricingCards />
      <FAQ />
      <CTASection />
    </MarketingShell>
  );
}
