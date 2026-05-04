import type { Task } from "../types/Thought";

type Priority = NonNullable<Task["priority"]>;

const OPERATIONAL_VERBS = [
  "chiamare",
  "comprare",
  "prenotare",
  "pagare",
  "mandare",
  "inviare",
  "scrivere",
  "sistemare",
  "pulire",
  "fare",
  "studiare",
  "leggere",
  "rispondere",
  "controllare",
  "preparare",
  "organizzare",
  "cercare",
  "fissare",
  "annullare",
  "completare",
  "consegnare",
] as const;

const INTENT_PATTERNS = [
  /\bdevo\s+assolutamente\b/i,
  /\bper favore\s+ricordami\s+di\b/i,
  /\bmi devo ricordare\s+di\b/i,
  /\bricordami\s+di\b/i,
  /\bricordami\b/i,
  /\bdovrei\b/i,
  /\bdevo\b/i,
  /\bbisogna\b/i,
  /\bvorrei\b/i,
];

const CLEANUP_PATTERNS = [
  /\bper favore\s+ricordami\s+di\b/gi,
  /\bmi devo ricordare\s+di\b/gi,
  /\bdevo\s+assolutamente\b/gi,
  /\bricordami\s+di\b/gi,
  /\bricordami\b/gi,
  /\bdovrei\b/gi,
  /\bdevo\b/gi,
  /\bbisogna\b/gi,
  /\bvorrei\b/gi,
];

const DUE_HINT_PATTERNS = [
  /\bquesto weekend\b/i,
  /\bsettimana prossima\b/i,
  /\bmese prossimo\b/i,
  /\bverso le\s+\d{1,2}(?::\d{2})?\b/i,
  /\balle\s+\d{1,2}(?::\d{2})?\b/i,
  /\bluned(?:i|\u00ec)\b/i,
  /\bmarted(?:i|\u00ec)\b/i,
  /\bmercoled(?:i|\u00ec)\b/i,
  /\bgioved(?:i|\u00ec)\b/i,
  /\bvenerd(?:i|\u00ec)\b/i,
  /\bsabato\b/i,
  /\bdomenica\b/i,
  /\bstamattina\b/i,
  /\bstasera\b/i,
  /\bdomani\b/i,
  /\boggi\b/i,
];

const HIGH_PRIORITY_PATTERNS = [
  /\burgente\b/i,
  /\bimportante\b/i,
  /\bassolutamente\b/i,
  /\bsubito\b/i,
  /\bentro oggi\b/i,
];

const MEDIUM_PRIORITY_PATTERNS = [
  /\bquesta settimana\b/i,
  /\bappena posso\b/i,
];

const TASK_SEPARATOR = /\s*(?:[,;.!?]+|\s+e\s+|\s+poi\s+|\s+anche\s+)\s*/i;
const OPERATIONAL_VERB_REGEX = new RegExp(
  `\\b(${OPERATIONAL_VERBS.join("|")})\\b`,
  "i"
);

type PatternMatch = {
  value: string;
  index: number;
};

function isPatternMatch(match: PatternMatch | null): match is PatternMatch {
  return match !== null;
}

function stableTaskId(title: string, index: number): string {
  const hash = [...title.toLowerCase()].reduce(
    (accumulator, char) => (accumulator * 31 + char.charCodeAt(0)) >>> 0,
    7
  );

  return `task-${index}-${hash.toString(36)}`;
}

function normalizeSpaces(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function findFirstMatch(text: string, patterns: RegExp[]): string | undefined {
  const matches = patterns
    .map((pattern) => {
      const match = text.match(pattern);
      return match ? { value: match[0].toLowerCase(), index: match.index ?? 0 } : null;
    })
    .filter(isPatternMatch)
    .sort((left, right) => left.index - right.index);

  return matches[0]?.value;
}

function detectPriority(text: string): Priority | undefined {
  if (HIGH_PRIORITY_PATTERNS.some((pattern) => pattern.test(text))) {
    return "high";
  }

  if (MEDIUM_PRIORITY_PATTERNS.some((pattern) => pattern.test(text))) {
    return "medium";
  }

  return undefined;
}

function removeKnownNoise(text: string): string {
  const withoutIntent = CLEANUP_PATTERNS.reduce(
    (current, pattern) => current.replace(pattern, " "),
    text
  );
  const withoutPriorityHints = [
    ...HIGH_PRIORITY_PATTERNS,
    ...MEDIUM_PRIORITY_PATTERNS,
  ].reduce((current, pattern) => current.replace(pattern, " "), withoutIntent);
  const withoutDueHints = DUE_HINT_PATTERNS.reduce(
    (current, pattern) => current.replace(pattern, " "),
    withoutPriorityHints
  );

  return normalizeSpaces(withoutDueHints.replace(/^[:\-\s]+|[:\-\s]+$/g, ""));
}

function formatTitle(text: string): string {
  const cleaned = normalizeSpaces(text);
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function hasIntent(text: string): boolean {
  return INTENT_PATTERNS.some((pattern) => pattern.test(text));
}

function startsWithOperationalVerb(text: string): boolean {
  return new RegExp(`^(${OPERATIONAL_VERBS.join("|")})\\b`, "i").test(text);
}

function hasUsefulObject(title: string): boolean {
  const withoutVerb = title.replace(OPERATIONAL_VERB_REGEX, "").trim();
  return withoutVerb.length > 2;
}

function shouldExtractSegment(
  rawSegment: string,
  title: string,
  globalHasIntent: boolean,
  dueHint?: string,
  priority?: Priority
): boolean {
  if (!OPERATIONAL_VERB_REGEX.test(title) || !hasUsefulObject(title)) {
    return false;
  }

  // Se manca un marker di intenzione, accettiamo solo frasi che partono gia'
  // come un comando operativo. Questo evita falsi positivi tipo "mi piace leggere".
  return (
    globalHasIntent ||
    hasIntent(rawSegment) ||
    Boolean(dueHint) ||
    Boolean(priority) ||
    startsWithOperationalVerb(title)
  );
}

export function extractTasks(text: string): Task[] {
  const source = normalizeSpaces(text);

  if (!OPERATIONAL_VERB_REGEX.test(source)) {
    return [];
  }

  const globalDueHint = findFirstMatch(source, DUE_HINT_PATTERNS);
  const globalPriority = detectPriority(source);
  const globalHasIntent = hasIntent(source);

  return source
    .split(TASK_SEPARATOR)
    .map((rawSegment) => {
      const title = formatTitle(removeKnownNoise(rawSegment));
      const dueHint = findFirstMatch(rawSegment, DUE_HINT_PATTERNS) ?? globalDueHint;
      const priority = detectPriority(rawSegment) ?? globalPriority;

      return { rawSegment, title, dueHint, priority };
    })
    .filter(({ rawSegment, title, dueHint, priority }) =>
      shouldExtractSegment(rawSegment, title, globalHasIntent, dueHint, priority)
    )
    .map(({ title, dueHint, priority }, index) => ({
      id: stableTaskId(title, index),
      title,
      completed: false,
      ...(dueHint ? { dueHint } : {}),
      ...(priority ? { priority } : {}),
    }));
}

export const extractTasksDemoCases = [
  "Domani devo chiamare il dentista e comprare il regalo per Luca",
  "Ricordami di prenotare il treno e mandare la mail a Marco",
  "Dovrei sistemare la scrivania, pagare la bolletta e fare la spesa",
  "Idea: creare un'app per organizzare note vocali",
  "Mi sento stressato per il lavoro",
  "Mi piace leggere",
  "Entro oggi devo assolutamente inviare il preventivo e chiamare Sara alle 14:30",
];

export function logExtractTasksDemo(): void {
  if (!import.meta.env.DEV) {
    return;
  }

  console.group("extractTasks demo");
  extractTasksDemoCases.forEach((input) => {
    console.log(input, extractTasks(input));
  });
  console.groupEnd();
}
