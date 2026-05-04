/**
 * Esempio Express: POST /api/analyze-thought
 *
 * Installazione in un backend separato:
 * npm install express cors
 *
 * Variabili server:
 * - AI_PROVIDER_URL
 * - AI_API_KEY
 * - AI_MODEL
 *
 * Avvio esempio:
 * node src/server-example/express-endpoint.js
 */

import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT ?? 8787;

app.use(cors({ origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

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

app.post("/api/analyze-thought", async (req, res) => {
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
    return res.json(analysis);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Analisi AI non riuscita." });
  }
});

app.listen(port, () => {
  console.log(`AI example server listening on http://localhost:${port}`);
});
