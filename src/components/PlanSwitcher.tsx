import { Check } from "lucide-react";
import { PLANS, type PlanId } from "../utils/plans";

type PlanSwitcherProps = {
  activePlan: PlanId;
  onPlanChange: (plan: PlanId) => void;
};

export function PlanSwitcher({ activePlan, onPlanChange }: PlanSwitcherProps) {
  return (
    <section className="card p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink-900">Versione app</h2>
          <p className="mt-1 text-xs leading-5 text-ink-500">
            Demo locale dei piani, pronta per billing reale.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {PLANS.map((plan) => {
          const isActive = activePlan === plan.id;

          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => onPlanChange(plan.id)}
              className={`tap rounded-2xl px-3 py-3 text-left ${
                isActive ? "bg-ink-900 text-white" : "bg-ink-50 text-ink-700"
              }`}
            >
              <span className="flex items-center justify-between gap-2 text-sm font-semibold">
                {plan.name}
                {isActive && <Check size={15} />}
              </span>
              <span className={`mt-1 block text-xs ${isActive ? "text-white/70" : "text-ink-500"}`}>
                {plan.price}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
