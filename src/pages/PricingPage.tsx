import { useEffect } from "react";
import { CTASection } from "../components/marketing/CTASection";
import { FAQ } from "../components/marketing/FAQ";
import { MarketingShell } from "../components/marketing/MarketingShell";
import { PricingCards } from "../components/marketing/PricingCards";
import { trackEvent } from "../utils/analytics";

export function PricingPage() {
  useEffect(() => {
    trackEvent("pricing_viewed");
  }, []);

  return (
    <MarketingShell>
      <PricingCards />
      <FAQ />
      <CTASection />
    </MarketingShell>
  );
}
