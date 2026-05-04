import { Crown } from "lucide-react";
import { getPlan, type PlanId } from "../utils/plans";

type PlanBadgeProps = {
  plan: PlanId;
};

export function PlanBadge({ plan }: PlanBadgeProps) {
  const activePlan = getPlan(plan);

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-ink-700">
      <Crown size={15} className={plan === "free" ? "text-ink-500" : "text-amber-500"} />
      {activePlan.name}
    </span>
  );
}
