import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Map, List, SlidersHorizontal, MapPin, Search } from "lucide-react";
import FilterDropdown from "@/components/FilterDropdown";
import MeetingRow from "@/components/MeetingRow";
import { useFilters } from "@/lib/filtersContext";
import { mockMeetings, DAY_NAMES, sortByNextOccurrence } from "@/lib/meetings";
import { applyFilters } from "@/lib/applyFilters";
import { cn } from "@/lib/utils";

const DAY_OPTIONS = ["Today", "Tomorrow", "Any Day", ...DAY_NAMES];
const TIME_OPTIONS = ["Any Time", "Morning", "Afternoon", "Evening", "Late Night"];
const ATTEND_OPTIONS = ["Any", "In-Person", "Online", "Hybrid"];

export default function Meetings() {
  const navigate = useNavigate();
  const { filters, setFilters } = useFilters();
  const [view, setView] = useState("list"); // list | map
  const now = new Date();

  const filtered = useMemo(
    () => sortByNextOccurrence(applyFilters(mockMeetings, filters, now), now),
    [filters]
  );

  return (
    <div>
      {/* Brand header */}
      <header className="sticky top-0 z-30 bg-background/90 px-5 pb-2 pt-6 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-[28px] font-semibold tracking-tight text-foreground">
            Find <span className="text-accent">NA</span>
          </h1>
        </div>

        {/* Search / location field */}
        <button
          onClick={() => document.getElementById("search-input")?.focus()}
          className="mt-3 flex w-full items-center gap-2.5 rounded-2xl border border-border bg-secondary/60 px-3.5 py-3 text-left"
        >
          <MapPin className="h-5 w-5 shrink-0 text-accent" />
          <input
            id="search-input"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Meetings near Current Location"
            className="w-full bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>

        {/* List / Map toggle */}
        <div className="mt-2.5 flex items-center justify-end">
          <div className="inline-flex rounded-full border border-border p-0.5">
            <button
              onClick={() => setView("list")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                view === "list" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )}
            >
              <List className="h-3.5 w-3.5" /> List
            </button>
            <button
              onClick={() => navigate("/map")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                "text-muted-foreground"
              )}
            >
              <Map className="h-3.5 w-3.5" /> Map
            </button>
          </div>
        </div>
      </header>

      {/* Filter chips */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-2.5">
        <FilterDropdown
          label={filters.day}
          options={{ list: DAY_OPTIONS, default: "Any Day" }}
          value={filters.day}
          onChange={(v) => setFilters({ ...filters, day: v })}
        />
        <FilterDropdown
          label={filters.timeOfDay}
          options={{ list: TIME_OPTIONS, default: "Any Time" }}
          value={filters.timeOfDay}
          onChange={(v) => setFilters({ ...filters, timeOfDay: v })}
        />
        <FilterDropdown
          label={filters.attendance === "Any" ? "In-Person" : filters.attendance}
          options={{ list: ATTEND_OPTIONS, default: "Any" }}
          value={filters.attendance}
          onChange={(v) => setFilters({ ...filters, attendance: v })}
        />
        <button
          onClick={() => navigate("/filters")}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            "border-border bg-background text-foreground"
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
        </button>
      </div>

      {/* Body */}
      <div className="border-t border-border">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map((m) => <MeetingRow key={m.id} meeting={m} />)
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center px-8 py-16 text-center">
      <MapPin className="h-10 w-10 text-muted-foreground/40" />
      <p className="mt-3 text-sm font-medium text-foreground">No meetings match your filters</p>
      <p className="mt-1 text-sm text-muted-foreground">Try widening the distance or day.</p>
    </div>
  );
}