import { useEffect, useState } from "react";
import { getStoredPlan, setStoredPlan, type PlanId } from "../utils/plans";

export function usePlan() {
  const [plan, setPlanState] = useState<PlanId>(getStoredPlan);

  useEffect(() => {
    function handlePlanChange() {
      setPlanState(getStoredPlan());
    }

    window.addEventListener("parla:plan-changed", handlePlanChange);
    window.addEventListener("storage", handlePlanChange);

    return () => {
      window.removeEventListener("parla:plan-changed", handlePlanChange);
      window.removeEventListener("storage", handlePlanChange);
    };
  }, []);

  function setPlan(planId: PlanId) {
    setStoredPlan(planId);
    setPlanState(planId);
  }

  return { plan, setPlan };
}
