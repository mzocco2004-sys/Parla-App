export function buildThoughtAnalysisPrompt(text: string): string {
  return `
Analizza questo pensiero vocale trascritto e restituisci SOLO JSON valido, senza markdown, senza testo extra.

Rispondi in italiano.
Non inventare task se il testo non contiene azioni concrete.
Non trasformare desideri vaghi in task.
Se il testo contiene piu' azioni, separale.
Mantieni titoli brevi.
Usa tag brevi e utili.
Se c'e' un riferimento temporale, preservalo come dueHint.
Se il testo e' emotivo, riconosci il tono.
Se non sei sicuro, usa categoria "nota".

Schema obbligatorio:
{
  "title": string,
  "summary": string,
  "category": "task" | "idea" | "promemoria" | "sfogo" | "nota",
  "tags": string[],
  "tasks": [
    {
      "title": string,
      "dueHint": string | null,
      "priority": "low" | "medium" | "high"
    }
  ],
  "emotionalTone": "neutral" | "positive" | "stressed" | "sad" | "excited" | "confused",
  "suggestedAction": string | null
}

Pensiero:
"${text.replace(/"/g, '\\"')}"
`.trim();
}
