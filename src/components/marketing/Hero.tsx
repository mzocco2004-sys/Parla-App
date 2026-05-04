import { ArrowRight, Mic, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { trackEvent } from "../../utils/analytics";

export function Hero() {
  return (
    <section className="relative isolate min-h-[calc(100vh-73px)] overflow-hidden border-b border-ink-100">
      <div className="absolute inset-0 -z-10 bg-[#f7f8f5]" />
      <div className="absolute left-1/2 top-12 -z-10 hidden w-[620px] -translate-x-[5%] rounded-[36px] border border-white bg-white/70 p-5 shadow-soft lg:block">
        <div className="rounded-[28px] bg-ink-900 p-5 text-white">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Pensiero registrato</span>
            <span className="rounded-full bg-mint-500 px-3 py-1 text-xs font-semibold">
              AI pronta
            </span>
          </div>
          <p className="mt-8 text-2xl font-semibold leading-tight">
            Domani devo chiamare il dentista e prenotare il treno
          </p>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {["Task creati", "Tag salute", "Promemoria domani"].map((item) => (
            <div key={item} className="rounded-2xl bg-ink-50 p-4 text-sm font-semibold">
              {item}
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-ink-100 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint-100 text-mint-700">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold">Suggerimento</p>
              <p className="text-sm text-ink-500">Imposta un promemoria per domani.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl items-center px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-ink-100 bg-white px-3 py-1.5 text-sm font-semibold text-ink-500">
            <Mic size={16} />
            Per studenti, freelance e founder
          </p>
          <h1 className="mt-6 text-5xl font-semibold leading-[1.02] text-ink-900 sm:text-7xl">
            Parla. Il resto succede.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-ink-700">
            Scarica un pensiero a voce. Parla lo trasforma in task, idee e
            promemoria automaticamente.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/app"
              onClick={() => trackEvent("landing_cta_clicked", { cta: "try_free" })}
              className="tap inline-flex items-center justify-center gap-2 rounded-2xl bg-ink-900 px-6 py-4 text-sm font-semibold text-white hover:bg-ink-700"
            >
              Provala gratis
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/waitlist"
              onClick={() => trackEvent("landing_cta_clicked", { cta: "waitlist" })}
              className="tap inline-flex items-center justify-center rounded-2xl border border-ink-200 bg-white px-6 py-4 text-sm font-semibold text-ink-900 hover:border-mint-500"
            >
              Entra in waitlist
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
