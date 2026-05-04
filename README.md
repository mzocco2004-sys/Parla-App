# Parla

**Parla. Il resto succede.**

Parla e' una web app mobile-first che trasforma pensieri vocali o testuali in note, task, idee e promemoria. L'MVP usa React, TypeScript, Vite, Tailwind CSS, LocalStorage, riconoscimento vocale del browser quando disponibile e un layer AI-ready con fallback locale.

## Prodotto

Target iniziale:

- studenti
- freelance
- founder
- persone piene di idee e poco tempo

Promessa:

> Scarica un pensiero a voce. Parla lo trasforma in task, idee e promemoria automaticamente.

## Setup Locale

```bash
npm install
npm run dev
```

Comandi utili:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Routing

- `/` landing page
- `/app` app principale
- `/pricing` pagina pricing
- `/waitlist` form waitlist

## Variabili Env

Frontend Vite, solo valori pubblici:

```bash
VITE_ENABLE_MOCK_AI=false
VITE_AI_ENDPOINT=
```

Mock AI locale:

```bash
VITE_ENABLE_MOCK_AI=true
```

Endpoint AI opzionale:

```bash
VITE_AI_ENDPOINT=/api/analyze-thought
```

Importante: non mettere segreti nelle variabili `VITE_*`. Le chiavi AI devono stare solo su backend o serverless function, per esempio:

```bash
AI_API_KEY=...
AI_MODEL=...
AI_PROVIDER_URL=...
```

Gli esempi backend sono in `src/server-example/`.

## Waitlist

La waitlist salva i dati in LocalStorage con chiave `parla:waitlist`.

Per testarla:

1. Apri `/waitlist`.
2. Inserisci email, ruolo e problema principale.
3. Invia il form.
4. Controlla LocalStorage nel browser.

## Analytics Locale

Gli eventi vengono salvati in LocalStorage con chiave `parla:analytics-events`.

Eventi tracciati:

- `landing_cta_clicked`
- `waitlist_submitted`
- `thought_created`
- `task_completed`
- `pricing_viewed`
- `onboarding_completed`

## Deploy su Vercel

1. Collega il repository a Vercel.
2. Framework preset: Vite.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Aggiungi solo variabili pubbliche `VITE_*` nel frontend.
6. Se usi AI reale, crea una Vercel Function o un backend separato e configura li' i segreti.

Per SPA routing su Vercel, Vite viene servito correttamente come app client-side; se aggiungi routing server custom, configura rewrite verso `index.html`.

## Installazione Come App

Parla e' configurata come PWA installabile:

- `public/manifest.webmanifest`
- `public/sw.js`
- icona in `public/icons/icon.svg`
- registrazione service worker in `src/utils/registerServiceWorker.ts`

Per provarla:

```bash
npm run dev
```

Apri `/app` da `localhost` e usa il comando del browser:

- Chrome/Edge desktop: icona installazione nella barra indirizzi oppure menu > Installa app.
- Android: menu browser > Aggiungi a schermata Home.
- iPhone/Safari: Condividi > Aggiungi alla schermata Home.

Nota: l'installazione PWA richiede `localhost` in sviluppo oppure HTTPS in produzione. Non funziona in modo affidabile aprendo `APRI_PARLA.html` come file locale.

## Roadmap Startup

Fase 1:

- MVP + landing + waitlist
- pricing pubblico
- analytics locale
- onboarding iniziale

Fase 2:

- AI backend reale
- speech-to-text reale
- email waitlist
- validazione pricing Pro

Fase 3:

- app mobile
- widget rapido
- memoria contestuale
- abbonamento Pro

## Stato Tecnico

- Nessuna chiave API hardcoded.
- LocalStorage compatibile con le note gia' create.
- AI opzionale via `VITE_AI_ENDPOINT`.
- Fallback locale sempre disponibile.
- Dettatura vocale via Web Speech API nei browser compatibili, con input manuale e fallback demo.
- UI mobile-first con pagine marketing e app separata.
