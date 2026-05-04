export type PlanId = "free" | "pro" | "founder";

export type Plan = {
  id: PlanId;
  name: string;
  price: string;
  description: string;
  features: string[];
};

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "0 EUR",
    description: "Per provare Parla nella vita di tutti i giorni.",
    features: ["Note base", "Task extraction", "Ricerca"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "6 EUR/mese",
    description: "Per chi vive tra idee, clienti e mille promemoria.",
    features: ["AI avanzata", "Riepilogo settimanale", "Memoria contestuale"],
  },
  {
    id: "founder",
    name: "Founder",
    price: "49 EUR lifetime",
    description: "Early access per costruire il prodotto con noi.",
    features: ["Feature sperimentali", "Supporto prioritario", "Accesso lifetime early"],
  },
];

const STORAGE_KEY = "parla:plan";
const PLAN_RANK: Record<PlanId, number> = {
  free: 0,
  pro: 1,
  founder: 2,
};

export function getStoredPlan(): PlanId {
  const storedPlan = localStorage.getItem(STORAGE_KEY);

  if (storedPlan === "pro" || storedPlan === "founder") {
    return storedPlan;
  }

  return "free";
}

export function setStoredPlan(plan: PlanId) {
  localStorage.setItem(STORAGE_KEY, plan);
  window.dispatchEvent(new CustomEvent("parla:plan-changed", { detail: plan }));
}

export function getPlan(planId: PlanId): Plan {
  return PLANS.find((plan) => plan.id === planId) ?? PLANS[0];
}

export function hasPlanAccess(currentPlan: PlanId, requiredPlan: PlanId) {
  return PLAN_RANK[currentPlan] >= PLAN_RANK[requiredPlan];
}
