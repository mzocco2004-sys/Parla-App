import { Link, NavLink } from "react-router-dom";
import { BrainCircuit } from "lucide-react";
import type { ReactNode } from "react";
import { PWAInstallButton } from "../PWAInstallButton";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-semibold transition ${isActive ? "text-ink-900" : "text-ink-500 hover:text-ink-900"}`;

type MarketingShellProps = {
  children: ReactNode;
};

export function MarketingShell({ children }: MarketingShellProps) {
  return (
    <div className="min-h-screen bg-[#f7f8f5] text-ink-900">
      <header className="sticky top-0 z-40 border-b border-ink-100/70 bg-[#f7f8f5]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-ink-900 text-white">
              <BrainCircuit size={19} />
            </span>
            <span className="text-lg font-semibold">Parla</span>
          </Link>

          <nav className="hidden items-center gap-7 sm:flex">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/pricing" className={navLinkClass}>
              Pricing
            </NavLink>
            <NavLink to="/waitlist" className={navLinkClass}>
              Waitlist
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <PWAInstallButton />
            <Link
              to="/app"
              className="tap rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-700"
            >
              Apri app
            </Link>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
