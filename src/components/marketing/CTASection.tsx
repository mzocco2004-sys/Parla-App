import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { trackEvent } from "../../utils/analytics";

export function CTASection() {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl rounded-[32px] bg-ink-900 px-5 py-12 text-center text-white sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-mint-500">
          Lancio privato
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-4xl font-semibold leading-tight">
          Dai una casa ai pensieri prima che diventino rumore.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/70">
          Prova il flusso MVP o entra in waitlist per ricevere gli update del
          lancio.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/app"
            onClick={() => trackEvent("landing_cta_clicked", { cta: "final_try" })}
            className="tap inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-ink-900"
          >
            Provala gratis
            <ArrowRight size={18} />
          </Link>
          <Link
            to="/waitlist"
            onClick={() => trackEvent("landing_cta_clicked", { cta: "final_waitlist" })}
            className="tap inline-flex items-center justify-center rounded-2xl border border-white/20 px-6 py-4 text-sm font-semibold text-white"
          >
            Entra in waitlist
          </Link>
        </div>
      </div>
    </section>
  );
}
