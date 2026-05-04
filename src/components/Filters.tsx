import { Search } from "lucide-react";
import type { ThoughtStatus } from "../types/Thought";

const FILTERS: Array<ThoughtStatus | "tutte"> = [
  "tutte",
  "nota",
  "task",
  "idea",
  "sfogo",
  "promemoria",
];

type FiltersProps = {
  activeFilter: ThoughtStatus | "tutte";
  search: string;
  onFilterChange: (filter: ThoughtStatus | "tutte") => void;
  onSearchChange: (value: string) => void;
};

export function Filters({
  activeFilter,
  search,
  onFilterChange,
  onSearchChange,
}: FiltersProps) {
  return (
    <div className="space-y-3">
      <label className="relative block">
        <Search
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-500"
        />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cerca note, tag, task..."
          className="h-12 w-full rounded-2xl border border-ink-100 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-mint-500"
        />
      </label>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            className={`tap whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
              activeFilter === filter
                ? "bg-ink-900 text-white"
                : "bg-white text-ink-500 hover:text-ink-900"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}
