import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Dashboard } from "../components/Dashboard";
import { Filters } from "../components/Filters";
import { MentalSummary } from "../components/MentalSummary";
import { OnboardingModal } from "../components/onboarding/OnboardingModal";
import { PWAInstallButton } from "../components/PWAInstallButton";
import { ThoughtDetail } from "../components/ThoughtDetail";
import { VoiceRecorder } from "../components/VoiceRecorder";
import { useThoughts } from "../hooks/useThoughts";
import type { ThoughtStatus } from "../types/Thought";

type ActiveFilter = ThoughtStatus | "tutte";

function hasCompletedOnboarding() {
  return localStorage.getItem("parla:onboarding-completed") === "true";
}

export function AppPage() {
  const { thoughts, error, isAnalyzing, addThought, deleteThought, toggleTask } =
    useThoughts();
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("tutte");
  const [search, setSearch] = useState("");
  const [selectedThoughtId, setSelectedThoughtId] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(!hasCompletedOnboarding());

  const selectedThought = thoughts.find((thought) => thought.id === selectedThoughtId);

  const visibleThoughts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return thoughts.filter((thought) => {
      const matchesFilter =
        activeFilter === "tutte" || thought.status === activeFilter;
      const searchableText = [
        thought.originalText,
        thought.title,
        thought.summary,
        thought.status,
        thought.emotionalTone ?? "",
        thought.suggestedAction ?? "",
        ...thought.tags,
        ...thought.tasks.map((task) => task.title),
      ]
        .join(" ")
        .toLowerCase();

      return matchesFilter && (!query || searchableText.includes(query));
    });
  }, [activeFilter, search, thoughts]);

  async function handleAddThought(text: string) {
    const thought = await addThought(text);
    if (thought) {
      setSelectedThoughtId(null);
    }
  }

  function handleDeleteThought(id: string) {
    deleteThought(id);
    setSelectedThoughtId(null);
  }

  return (
    <main className="min-h-screen bg-ink-50 px-4 py-5 text-ink-900 sm:px-6">
      {showOnboarding && (
        <OnboardingModal onComplete={() => setShowOnboarding(false)} />
      )}

      <div className="mx-auto mb-4 flex w-full max-w-5xl items-center justify-between">
        <Link
          to="/"
          className="tap inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-700"
        >
          <ArrowLeft size={17} />
          Parla
        </Link>
        <div className="flex items-center gap-2">
          <PWAInstallButton />
          <Link
            to="/pricing"
            className="tap rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Pro
          </Link>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 lg:grid lg:grid-cols-[390px_1fr] lg:items-start">
        <div className="space-y-5 lg:sticky lg:top-5">
          <VoiceRecorder onSave={handleAddThought} isAnalyzing={isAnalyzing} />
          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <MentalSummary thoughts={thoughts} />
        </div>

        <div className="space-y-5">
          {selectedThought ? (
            <ThoughtDetail
              thought={selectedThought}
              onBack={() => setSelectedThoughtId(null)}
              onDelete={handleDeleteThought}
              onToggleTask={toggleTask}
            />
          ) : (
            <>
              <Filters
                activeFilter={activeFilter}
                search={search}
                onFilterChange={setActiveFilter}
                onSearchChange={setSearch}
              />
              <Dashboard
                thoughts={visibleThoughts}
                allThoughts={thoughts}
                onOpenThought={setSelectedThoughtId}
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
