# Server AI Example

Questa cartella contiene esempi non collegati direttamente alla build frontend.

Il frontend chiama un endpoint AI solo se `VITE_AI_ENDPOINT` e' configurato. L'endpoint deve ricevere:

```json
{
  "text": "...",
  "prompt": "..."
}
```

e restituire un oggetto compatibile con `ThoughtAnalysis`.

## Variabili server consigliate

```bash
AI_PROVIDER_URL=https://provider.example.com/v1/responses
AI_API_KEY=...
AI_MODEL=...
```

Non esporre `AI_API_KEY` nel frontend. Deve vivere solo nel backend o nella serverless function.

## Frontend

Nel file `.env.local` del frontend:

```bash
VITE_AI_ENDPOINT=/api/analyze-thought
```

Se `VITE_AI_ENDPOINT` non esiste, l'app usa prima `VITE_ENABLE_MOCK_AI=true`, poi il fallback locale.
