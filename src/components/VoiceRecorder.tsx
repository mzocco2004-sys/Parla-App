import { FormEvent, useEffect, useRef, useState } from "react";
import { Mic, Send, Square, Wand2 } from "lucide-react";

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
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  function createMockTranscript() {
    return MOCK_TRANSCRIPTS[Math.floor(Math.random() * MOCK_TRANSCRIPTS.length)];
  }

  async function finishRecording() {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    const transcript = createMockTranscript();
    setIsRecording(false);
    setLastTranscript(transcript);
    await onSave(transcript);
  }

  function startRecording() {
    setIsRecording(true);
    setLastTranscript(null);
    timerRef.current = window.setTimeout(finishRecording, 2800);
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
        {isRecording ? "Termina" : isAnalyzing ? "Analisi in corso..." : "Registra pensiero"}
      </button>

      <div className="mt-4 min-h-6 text-sm text-ink-500">
        {isRecording && (
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            Registrazione in corso...
          </span>
        )}
        {!isRecording && lastTranscript && (
          <span className="inline-flex items-center gap-2">
            <Wand2 size={16} className="text-mint-700" />
            Trascrizione simulata salvata.
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
