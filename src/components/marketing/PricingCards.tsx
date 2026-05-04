import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { PLANS, setStoredPlan } from "../../utils/plans";

export function PricingCards() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-mint-700">
          Pricing
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-ink-900">
          Parti gratis. Cresci quando serve.
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ink-500">
          In questa demo puoi attivare Pro o Founder subito. In produzione questi
          pulsanti verranno collegati a pagamento e account.
        </p>
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const isHighlighted = plan.id === "pro";

          return (
            <div
              key={plan.id}
              className={`rounded-[28px] border p-6 ${
                isHighlighted
                  ? "border-ink-900 bg-ink-900 text-white shadow-soft"
                  : "border-ink-100 bg-white text-ink-900"
              }`}
            >
              <h2 className="text-2xl font-semibold">{plan.name}</h2>
              <p className={`mt-2 text-sm ${isHighlighted ? "text-white/70" : "text-ink-500"}`}>
                {plan.description}
              </p>
              <p className="mt-6 text-4xl font-semibold">{plan.price}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm font-medium">
                    <Check
                      size={17}
                      className={isHighlighted ? "text-mint-500" : "text-mint-700"}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to="/app"
                onClick={() => setStoredPlan(plan.id)}
                className={`tap mt-7 inline-flex w-full justify-center rounded-2xl px-5 py-3 text-sm font-semibold ${
                  isHighlighted
                    ? "bg-white text-ink-900 hover:bg-ink-50"
                    : "bg-ink-900 text-white hover:bg-ink-700"
                }`}
              >
                {plan.id === "free" ? "Usa Free" : `Attiva ${plan.name} demo`}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
