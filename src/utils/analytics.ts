export type AnalyticsEventName =
  | "landing_cta_clicked"
  | "waitlist_submitted"
  | "thought_created"
  | "task_completed"
  | "reminder_scheduled"
  | "pricing_viewed"
  | "onboarding_completed";

export type AnalyticsEvent = {
  id: string;
  name: AnalyticsEventName;
  createdAt: string;
  properties?: Record<string, string | number | boolean>;
};

const STORAGE_KEY = "parla:analytics-events";

function readEvents(): AnalyticsEvent[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AnalyticsEvent[]) : [];
  } catch {
    return [];
  }
}

export function trackEvent(
  name: AnalyticsEventName,
  properties?: AnalyticsEvent["properties"]
) {
  const event: AnalyticsEvent = {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
    properties,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...readEvents(), event]));
  } catch {
    console.info("Analytics locale non salvata.", event);
  }
}

export function getAnalyticsEvents(): AnalyticsEvent[] {
  return readEvents();
}
