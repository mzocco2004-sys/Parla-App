import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppPage } from "./pages/AppPage";
import { LandingPage } from "./pages/LandingPage";
import { PricingPage } from "./pages/PricingPage";
import { WaitlistPage } from "./pages/WaitlistPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<AppPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/waitlist" element={<WaitlistPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
