import { FormEvent, useEffect, useRef, useState } from "react";
import { AlertCircle, Mic, Send, Square, Wand2 } from "lucide-react";

const MOCK_TRANSCRIPTS = [
  "Domani devo fare la spesa e chiamare il commercialista",
  "Idea: potrei creare un progetto per ordinare meglio le mie note vocali",
  "Mi sento confuso e un po' stanco dopo questa settimana di lavoro",
  "Ricordami di prenotare il treno alle 18",
];

type VoiceRecorderProps = {
  onSave: (text: string) => Promise<void> | void;
  isAnalyzing?: boolean;
};

export function VoiceRecorder({ onSave, isAnalyzing = false }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [manualText, setManualText] = useState("");
  const [lastTranscript, setLastTranscript] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [recorderMessage, setRecorderMessage] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalTranscriptRef = useRef("");
  const liveTranscriptRef = useRef("");
  const shouldSaveOnEndRef = useRef(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      recognitionRef.current?.abort();
    };
  }, []);

  function createMockTranscript() {
    return MOCK_TRANSCRIPTS[Math.floor(Math.random() * MOCK_TRANSCRIPTS.length)];
  }

  async function saveTranscript(transcript: string, isMock = false) {
    const cleanTranscript = transcript.trim();

    if (!cleanTranscript) {
      setRecorderMessage("Non ho rilevato parole. Riprova o usa il testo manuale.");
      return;
    }

    setLastTranscript(cleanTranscript);
    setRecorderMessage(
      isMock
        ? "Browser non compatibile: ho salvato una trascrizione demo."
        : "Trascrizione vocale salvata."
    );
    await onSave(cleanTranscript);
  }

  async function finishMockRecording() {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    const transcript = createMockTranscript();
    setIsRecording(false);
    setLiveTranscript("");
    await saveTranscript(transcript, true);
  }

  async function finishRecording() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    await finishMockRecording();
  }

  function startRecording() {
    const SpeechRecognition =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;

    setIsRecording(true);
    setLastTranscript(null);
    setLiveTranscript("");
    setRecorderMessage(null);
    finalTranscriptRef.current = "";
    liveTranscriptRef.current = "";
    shouldSaveOnEndRef.current = true;

    if (!SpeechRecognition) {
      timerRef.current = window.setTimeout(finishMockRecording, 2800);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "it-IT";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let index = 0; index < event.results.length; index += 1) {
        const result = event.results[index];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          finalText += transcript;
        } else {
          interimText += transcript;
        }
      }

      if (finalText.trim()) {
        finalTranscriptRef.current = `${finalTranscriptRef.current} ${finalText}`.trim();
      }

      setLiveTranscript(
        `${finalTranscriptRef.current} ${interimText}`.replace(/\s+/g, " ").trim()
      );
      liveTranscriptRef.current = `${finalTranscriptRef.current} ${interimText}`
        .replace(/\s+/g, " ")
        .trim();
    };

    recognition.onerror = (event) => {
      shouldSaveOnEndRef.current = false;
      setIsRecording(false);
      setLiveTranscript("");
      recognitionRef.current = null;

      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setRecorderMessage("Microfono non autorizzato. Consenti il microfono dal browser.");
        return;
      }

      setRecorderMessage("Non sono riuscito ad ascoltare. Puoi riprovare o scrivere il testo.");
    };

    recognition.onend = () => {
      if (!shouldSaveOnEndRef.current) {
        recognitionRef.current = null;
        return;
      }

      const transcript = finalTranscriptRef.current || liveTranscriptRef.current;
      shouldSaveOnEndRef.current = false;
      recognitionRef.current = null;
      setIsRecording(false);
      setLiveTranscript("");
      void saveTranscript(transcript);
    };

    try {
      recognition.start();
    } catch {
      setIsRecording(false);
      recognitionRef.current = null;
      setRecorderMessage("Il registratore e' gia' attivo. Attendi un secondo e riprova.");
    }
  }

  async function handleManualSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!manualText.trim()) {
      return;
    }

    await onSave(manualText);
    setLastTranscript(manualText);
    setManualText("");
  }

  return (
    <section className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-700">
            Cattura rapida
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight text-ink-900">
            Parla
          </h1>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full ${
            isRecording ? "bg-red-50 text-red-500" : "bg-mint-100 text-mint-700"
          }`}
        >
          <Mic size={21} aria-hidden="true" />
        </div>
      </div>

      <button
        type="button"
        onClick={isRecording ? finishRecording : startRecording}
        disabled={isAnalyzing}
        className={`tap mt-6 flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-5 text-base font-semibold text-white shadow-lg ${
          isRecording
            ? "bg-red-500 shadow-red-200"
            : isAnalyzing
              ? "bg-ink-500 shadow-ink-100"
            : "bg-ink-900 shadow-ink-100 hover:bg-ink-700"
        }`}
      >
        {isRecording ? <Square size={20} /> : <Mic size={20} />}
        {isRecording ? "Termina e salva" : isAnalyzing ? "Analisi in corso..." : "Registra pensiero"}
      </button>

      <div className="mt-4 min-h-6 text-sm text-ink-500">
        {isRecording && (
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              Sto ascoltando...
            </span>
            {liveTranscript && (
              <p className="rounded-2xl bg-ink-50 px-4 py-3 text-sm leading-6 text-ink-700">
                {liveTranscript}
              </p>
            )}
          </div>
        )}
        {!isRecording && lastTranscript && (
          <span className="inline-flex items-center gap-2">
            <Wand2 size={16} className="text-mint-700" />
            {recorderMessage ?? "Trascrizione salvata."}
          </span>
        )}
        {!isRecording && !lastTranscript && recorderMessage && (
          <span className="inline-flex items-center gap-2 text-amber-700">
            <AlertCircle size={16} />
            {recorderMessage}
          </span>
        )}
        {!isRecording && isAnalyzing && (
          <span className="inline-flex items-center gap-2">
            <Wand2 size={16} className="text-mint-700" />
            Sto organizzando il pensiero...
          </span>
        )}
      </div>

      <form onSubmit={handleManualSubmit} className="mt-5 space-y-3">
        <textarea
          value={manualText}
          onChange={(event) => setManualText(event.target.value)}
          rows={3}
          placeholder="Oppure scrivi un pensiero..."
          className="w-full resize-none rounded-2xl border border-ink-100 bg-ink-50 px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-mint-500 focus:bg-white"
        />
        <button
          type="submit"
          disabled={isAnalyzing}
          className="tap flex w-full items-center justify-center gap-2 rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm font-semibold text-ink-900 hover:border-mint-500"
        >
          <Send size={17} />
          Salva testo
        </button>
      </form>
    </section>
  );
}
