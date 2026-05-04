import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const PLANS = [
  {
    name: "Free",
    price: "0€",
    description: "Per provare Parla nella vita di tutti i giorni.",
    features: ["Note base", "Task extraction", "Ricerca"],
    cta: "Provala gratis",
    href: "/app",
  },
  {
    name: "Pro",
    price: "6€/mese",
    description: "Per chi vive tra idee, clienti e mille promemoria.",
    features: ["AI avanzata", "Riepilogo settimanale", "Memoria contestuale"],
    cta: "Entra in waitlist",
    href: "/waitlist",
    highlighted: true,
  },
  {
    name: "Founder",
    price: "49€ lifetime",
    description: "Early access per costruire il prodotto con noi.",
    features: ["Feature sperimentali", "Supporto prioritario", "Accesso lifetime early"],
    cta: "Blocca il posto",
    href: "/waitlist",
  },
];

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
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-[28px] border p-6 ${
              plan.highlighted
                ? "border-ink-900 bg-ink-900 text-white shadow-soft"
                : "border-ink-100 bg-white text-ink-900"
            }`}
          >
            <h2 className="text-2xl font-semibold">{plan.name}</h2>
            <p className={`mt-2 text-sm ${plan.highlighted ? "text-white/70" : "text-ink-500"}`}>
              {plan.description}
            </p>
            <p className="mt-6 text-4xl font-semibold">{plan.price}</p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm font-medium">
                  <Check size={17} className={plan.highlighted ? "text-mint-500" : "text-mint-700"} />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              to={plan.href}
              className={`tap mt-7 inline-flex w-full justify-center rounded-2xl px-5 py-3 text-sm font-semibold ${
                plan.highlighted
                  ? "bg-white text-ink-900 hover:bg-ink-50"
                  : "bg-ink-900 text-white hover:bg-ink-700"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
