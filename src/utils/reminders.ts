import type { Task } from "../types/Thought";

export type ReminderScheduleResult =
  | { ok: true; scheduledFor: Date }
  | { ok: false; reason: string };

const STORAGE_KEY = "parla:reminders";
const timers = new Map<string, number>();

type StoredReminder = {
  id: string;
  taskTitle: string;
  dueHint: string;
  scheduledFor: string;
  createdAt: string;
};

function readReminders(): StoredReminder[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as StoredReminder[]) : [];
  } catch {
    return [];
  }
}

function writeReminder(reminder: StoredReminder) {
  const reminders = readReminders().filter((item) => item.id !== reminder.id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...reminders, reminder]));
}

function normalizeDueHint(dueHint: string) {
  return dueHint.toLowerCase().trim();
}

function getNextHourDate(hour: number, minute = 0) {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);

  if (date.getTime() <= Date.now()) {
    date.setDate(date.getDate() + 1);
  }

  return date;
}

function parseWeekday(targetDay: number) {
  const date = new Date();
  const currentDay = date.getDay();
  const diff = (targetDay - currentDay + 7) % 7 || 7;
  date.setDate(date.getDate() + diff);
  date.setHours(9, 0, 0, 0);
  return date;
}

export function parseDueHintToDate(dueHint: string): Date | null {
  const hint = normalizeDueHint(dueHint);
  const now = new Date();
  const timeMatch = hint.match(/(?:alle|verso le)\s+(\d{1,2})(?::(\d{2}))?/);

  if (timeMatch) {
    return getNextHourDate(Number(timeMatch[1]), Number(timeMatch[2] ?? 0));
  }

  if (hint.includes("stamattina")) {
    return getNextHourDate(9);
  }

  if (hint.includes("stasera")) {
    return getNextHourDate(20);
  }

  if (hint.includes("oggi")) {
    const date = new Date(now.getTime() + 60 * 60 * 1000);
    date.setSeconds(0, 0);
    return date;
  }

  if (hint.includes("domani")) {
    const date = new Date(now);
    date.setDate(date.getDate() + 1);
    date.setHours(9, 0, 0, 0);
    return date;
  }

  if (hint.includes("questo weekend")) {
    return parseWeekday(6);
  }

  if (hint.includes("settimana prossima")) {
    const date = new Date(now);
    date.setDate(date.getDate() + 7);
    date.setHours(9, 0, 0, 0);
    return date;
  }

  if (hint.includes("mese prossimo")) {
    const date = new Date(now);
    date.setMonth(date.getMonth() + 1);
    date.setHours(9, 0, 0, 0);
    return date;
  }

  const weekdays: Record<string, number> = {
    lunedi: 1,
    "lunedì": 1,
    "lunedì": 1,
    martedi: 2,
    "martedì": 2,
    mercoledi: 3,
    "mercoledì": 3,
    giovedi: 4,
    "giovedì": 4,
    venerdi: 5,
    "venerdì": 5,
    sabato: 6,
    domenica: 0,
  };

  const weekday = Object.entries(weekdays).find(([label]) => hint.includes(label));
  return weekday ? parseWeekday(weekday[1]) : null;
}

async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission === "denied") {
    return false;
  }

  return (await Notification.requestPermission()) === "granted";
}

function showReminderNotification(task: Task) {
  const title = "Promemoria Parla";
  const body = task.dueHint ? `${task.title} (${task.dueHint})` : task.title;

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) =>
        registration.showNotification(title, {
          body,
          icon: "/icons/icon.svg",
          badge: "/icons/icon.svg",
        })
      )
      .catch(() => new Notification(title, { body }));
    return;
  }

  new Notification(title, { body });
}

export async function scheduleTaskReminder(task: Task): Promise<ReminderScheduleResult> {
  if (!task.dueHint) {
    return { ok: false, reason: "Questo task non ha un riferimento temporale." };
  }

  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    return { ok: false, reason: "Permesso notifiche non concesso." };
  }

  const scheduledFor = parseDueHintToDate(task.dueHint);
  if (!scheduledFor) {
    return { ok: false, reason: "Non riesco a trasformare questo riferimento in orario." };
  }

  const delay = Math.max(scheduledFor.getTime() - Date.now(), 1000);
  const timerKey = task.id;

  if (timers.has(timerKey)) {
    window.clearTimeout(timers.get(timerKey));
  }

  const timer = window.setTimeout(() => showReminderNotification(task), delay);
  timers.set(timerKey, timer);

  writeReminder({
    id: task.id,
    taskTitle: task.title,
    dueHint: task.dueHint,
    scheduledFor: scheduledFor.toISOString(),
    createdAt: new Date().toISOString(),
  });

  return { ok: true, scheduledFor };
}
