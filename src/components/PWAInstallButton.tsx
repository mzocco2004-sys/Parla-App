import { useEffect, useState } from "react";
import { Download } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PWAInstallButton() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  async function handleInstall() {
    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  }

  if (!installPrompt) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleInstall}
      className="tap inline-flex items-center gap-2 rounded-full bg-mint-100 px-4 py-2 text-sm font-semibold text-mint-700"
    >
      <Download size={16} />
      Installa
    </button>
  );
}
