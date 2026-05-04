import { trackEvent } from "./analytics";

export type WaitlistRole = "studente" | "freelance" | "founder" | "altro";
export type WaitlistProblem =
  | "dimentico task"
  | "troppe idee"
  | "note confuse"
  | "altro";

export type WaitlistEntry = {
  id: string;
  email: string;
  role: WaitlistRole;
  problem: WaitlistProblem;
  createdAt: string;
};

const STORAGE_KEY = "parla:waitlist";

function readEntries(): WaitlistEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as WaitlistEntry[]) : [];
  } catch {
    return [];
  }
}

export function addWaitlistEntry(
  entry: Omit<WaitlistEntry, "id" | "createdAt">
): WaitlistEntry {
  const savedEntry: WaitlistEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify([...readEntries(), savedEntry]));
  trackEvent("waitlist_submitted", {
    role: savedEntry.role,
    problem: savedEntry.problem,
  });

  return savedEntry;
}

export function getWaitlistEntries(): WaitlistEntry[] {
  return readEntries();
}
