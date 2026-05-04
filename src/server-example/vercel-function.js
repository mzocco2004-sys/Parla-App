/**
 * Esempio Vercel Function: /api/analyze-thought
 *
 * Copia questo file in `api/analyze-thought.js` dentro un progetto Vercel.
 * Non viene importato dal frontend e non deve contenere chiavi hardcoded.
 *
 * Variabili server:
 * - AI_PROVIDER_URL: endpoint del provider AI scelto
 * - AI_API_KEY: chiave privata del provider, solo lato server
 * - AI_MODEL: modello da usare
 */

function buildThoughtAnalysisPrompt(text) {
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

function buildProviderPayload(prompt) {
  return {
    model: process.env.AI_MODEL,
    input: prompt,
    response_format: { type: "json_object" },
  };
}

function extractJsonFromProvider(data) {
  if (data && typeof data === "object" && !Array.isArray(data)) {
    if (typeof data.output_text === "string") {
      return JSON.parse(data.output_text);
    }

    if (typeof data.text === "string") {
      return JSON.parse(data.text);
    }

    if (data.title && data.summary && data.category) {
      return data;
    }
  }

  throw new Error("Risposta AI non riconosciuta.");
}

async function callModel(prompt) {
  if (!process.env.AI_PROVIDER_URL || !process.env.AI_API_KEY) {
    throw new Error("Provider AI non configurato.");
  }

  const response = await fetch(process.env.AI_PROVIDER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AI_API_KEY}`,
    },
    body: JSON.stringify(buildProviderPayload(prompt)),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Errore provider AI ${response.status}: ${detail}`);
  }

  return extractJsonFromProvider(await response.json());
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Metodo non consentito." });
  }

  try {
    const { text, prompt } = req.body ?? {};

    if (typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Campo text mancante." });
    }

    const analysis = await callModel(
      typeof prompt === "string" && prompt.trim()
        ? prompt
        : buildThoughtAnalysisPrompt(text)
    );
    return res.status(200).json(analysis);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Analisi AI non riuscita." });
  }
}
