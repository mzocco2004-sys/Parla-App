import { FormEvent, useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { MarketingShell } from "../components/marketing/MarketingShell";
import {
  addWaitlistEntry,
  type WaitlistProblem,
  type WaitlistRole,
} from "../utils/waitlist";

const ROLES: WaitlistRole[] = ["studente", "freelance", "founder", "altro"];
const PROBLEMS: WaitlistProblem[] = [
  "dimentico task",
  "troppe idee",
  "note confuse",
  "altro",
];

export function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<WaitlistRole>("freelance");
  const [problem, setProblem] = useState<WaitlistProblem>("troppe idee");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.includes("@")) {
      setError("Inserisci una email valida.");
      return;
    }

    try {
      addWaitlistEntry({ email, role, problem });
      setSubmitted(true);
      setError(null);
    } catch {
      setError("Non sono riuscito a salvare la richiesta in locale.");
    }
  }

  return (
    <MarketingShell>
      <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <section>
          <p className="inline-flex items-center gap-2 rounded-full border border-ink-100 bg-white px-3 py-1.5 text-sm font-semibold text-ink-500">
            <Mail size={16} />
            Accesso anticipato
          </p>
          <h1 className="mt-6 text-5xl font-semibold leading-tight text-ink-900">
            Entra nella waitlist di Parla.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-ink-500">
            Stiamo costruendo il modo piu' rapido per trasformare pensieri in
            azioni. Lascia la tua email e aiutaci a dare priorita' alle funzioni.
          </p>
        </section>

        <section className="card p-5 sm:p-7">
          {submitted ? (
            <div className="py-8 text-center">
              <CheckCircle2 size={42} className="mx-auto text-mint-700" />
              <h2 className="mt-4 text-2xl font-semibold text-ink-900">
                Sei in lista.
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink-500">
                Ti avviseremo quando la versione Pro sara' pronta per i primi
                utenti.
              </p>
              <Link
                to="/app"
                className="tap mt-6 inline-flex rounded-2xl bg-ink-900 px-5 py-3 text-sm font-semibold text-white"
              >
                Prova l'MVP
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-ink-900">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="nome@email.com"
                  className="mt-2 h-12 w-full rounded-2xl border border-ink-100 bg-ink-50 px-4 text-sm outline-none transition focus:border-mint-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-ink-900">Ruolo</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {ROLES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setRole(item)}
                      className={`tap rounded-2xl px-4 py-3 text-sm font-semibold ${
                        role === item
                          ? "bg-ink-900 text-white"
                          : "bg-ink-50 text-ink-500"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-ink-900">
                  Problema principale
                </label>
                <select
                  value={problem}
                  onChange={(event) => setProblem(event.target.value as WaitlistProblem)}
                  className="mt-2 h-12 w-full rounded-2xl border border-ink-100 bg-ink-50 px-4 text-sm outline-none transition focus:border-mint-500 focus:bg-white"
                >
                  {PROBLEMS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {error && <p className="text-sm font-medium text-red-600">{error}</p>}

              <button
                type="submit"
                className="tap w-full rounded-2xl bg-ink-900 px-5 py-4 text-sm font-semibold text-white hover:bg-ink-700"
              >
                Entra in waitlist
              </button>
            </form>
          )}
        </section>
      </main>
    </MarketingShell>
  );
}
