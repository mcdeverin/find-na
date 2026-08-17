import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Map, List, SlidersHorizontal, MapPin, Search, RotateCw, Locate } from "lucide-react";
import FilterDropdown from "@/components/FilterDropdown";
import MultiFilterDropdown from "@/components/MultiFilterDropdown";
import MeetingRow from "@/components/MeetingRow";
import { useFilters, defaultFilters } from "@/lib/filtersContext";
import { useMeetings } from "@/lib/MeetingsContext";
import { DAY_NAMES, prepareMeetingOccurrences } from "@/lib/meetings";
import { cn } from "@/lib/utils";

const DAY_OPTIONS = ["Today", "Tomorrow", "Any Day", ...DAY_NAMES];
const TIME_OPTIONS = ["Any Time", "Morning", "Afternoon", "Evening", "Late Night"];
const ATTEND_OPTIONS = ["In-Person", "Online", "Hybrid"];
const DISTANCE_OPTIONS = [5, 10, 25, 50, "Any"];

export default function Meetings() {
  const navigate = useNavigate();
  const { filters, setFilters } = useFilters();
  const { meetings, status, error, location, refresh, useCurrentLocation, searchByLocation } =
    useMeetings();
  const [locText, setLocText] = useState("");
  const now = new Date();

  // For the Today view this includes meetings that already started earlier
  // today; they're grouped separately below instead of being hidden.
  const occurrences = useMemo(
    () => prepareMeetingOccurrences(meetings, filters, now),
    [meetings, filters]
  );
  const upcoming = occurrences.filter((o) => !o.isPast);
  const earlier = occurrences.filter((o) => o.isPast);
  const grouped = filters.day === "Today" && earlier.length > 0;

  const submitLocation = (e) => {
    e.preventDefault();
    if (locText.trim()) searchByLocation(locText.trim());
  };

  const expandTarget =
    filters.distance < 50 ? 50 : filters.distance === 50 ? "Any" : null;

  const showSkeleton = status === "locating" || status === "loading";

  return (
    <div>
      {/* Brand header */}
      <header className="sticky top-0 z-30 bg-background/90 px-5 pb-2 pt-6 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-[28px] font-semibold tracking-tight text-foreground">
            Find <span className="text-accent">NA</span>
          </h1>
          <button
            onClick={refresh}
            aria-label="Refresh meetings"
            className="rounded-full p-1.5 text-muted-foreground active:bg-muted"
          >
            <RotateCw className={cn("h-5 w-5", showSkeleton && "animate-spin")} />
          </button>
        </div>

        {/* Location search field */}
        <form onSubmit={submitLocation} className="mt-3 flex w-full items-center gap-2.5 rounded-2xl border border-border bg-secondary/60 px-3.5 py-3">
          <MapPin className="h-5 w-5 shrink-0 text-accent" />
          <input
            value={locText}
            onChange={(e) => setLocText(e.target.value)}
            placeholder={location ? location.label : "Enter city, state, or ZIP"}
            className="w-full bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button type="submit" aria-label="Search location" className="shrink-0 text-muted-foreground">
            <Search className="h-4 w-4" />
          </button>
        </form>

        {/* List / Map toggle */}
        <div className="mt-2.5 flex items-center justify-end">
          <div className="inline-flex rounded-full border border-border p-0.5">
            <button
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground"
            >
              <List className="h-3.5 w-3.5" /> List
            </button>
            <button
              onClick={() => navigate("/map")}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-muted-foreground"
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
        <MultiFilterDropdown
          allLabel="Any"
          triggerLabel="Attendance"
          options={ATTEND_OPTIONS}
          selected={filters.attendance}
          onChange={(arr) => setFilters({ ...filters, attendance: arr })}
        />
        <FilterDropdown
          label={filters.distance === "Any" ? "Any Distance" : `${filters.distance} mi`}
          options={{ list: DISTANCE_OPTIONS, default: 25 }}
          value={filters.distance}
          onChange={(v) => setFilters({ ...filters, distance: v })}
        />
        <button
          onClick={() => navigate("/filters")}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-sm font-medium text-foreground"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
        </button>
      </div>

      {/* Dev-only diagnostics: shows whether the BMLT fetch or the client-side
          filtering is responsible for an empty list. */}
      {import.meta.env.DEV && (status === "success" || status === "error") && (
        <div className="border-t border-dashed border-border bg-muted/40 px-5 py-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
          <div>BMLT returned: {meetings.length} meetings</div>
          <div>
            Displayed after filters: {occurrences.length} meetings
            {filters.day === "Today" &&
              ` (${upcoming.length} upcoming, ${earlier.length} earlier today)`}
          </div>
        </div>
      )}

      {/* Body */}
      <div className="border-t border-border">
        {status === "denied" && (
          <DeniedState onUseLocation={useCurrentLocation} />
        )}
        {showSkeleton && <SkeletonList />}
        {status === "error" && <ErrorState message={error} onRetry={refresh} />}
        {status === "success" && occurrences.length === 0 && (
          <EmptyState
            expandTarget={expandTarget}
            onExpand={() => setFilters({ ...filters, distance: expandTarget })}
            onClear={() => setFilters(defaultFilters)}
          />
        )}

        {status === "success" && !grouped &&
          occurrences.map((o) => (
            <MeetingRow key={o.meeting.id} meeting={o.meeting} occurrence={o.occ} isPast={o.isPast} />
          ))}

        {status === "success" && grouped && (
          <>
            {upcoming.length > 0 && (
              <>
                <SectionLabel>Up Next</SectionLabel>
                <div className="border-l-[3px] border-accent bg-accent/5">
                  <MeetingRow
                    meeting={upcoming[0].meeting}
                    occurrence={upcoming[0].occ}
                  />
                </div>
              </>
            )}
            {upcoming.length > 1 && (
              <>
                <SectionLabel>Later Today</SectionLabel>
                {upcoming.slice(1).map((o) => (
                  <MeetingRow key={o.meeting.id} meeting={o.meeting} occurrence={o.occ} />
                ))}
              </>
            )}
            <SectionLabel>Earlier Today</SectionLabel>
            {earlier.map((o) => (
              <MeetingRow key={o.meeting.id} meeting={o.meeting} occurrence={o.occ} isPast />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="border-b border-border bg-secondary/40 px-5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </div>
  );
}

function SkeletonList() {
  return (
    <div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-stretch gap-3 border-b border-border px-5 py-3.5">
          <div className="w-[68px] shrink-0 space-y-2">
            <div className="h-4 w-12 animate-pulse rounded bg-muted" />
            <div className="h-3 w-8 animate-pulse rounded bg-muted" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

function DeniedState({ onUseLocation }) {
  return (
    <div className="flex flex-col items-center px-8 py-16 text-center">
      <MapPin className="h-10 w-10 text-accent" />
      <p className="mt-4 text-lg font-semibold text-foreground">Find meetings near you</p>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Enter a city, state, or ZIP code in the search field above, or share your
        current location.
      </p>
      <button
        onClick={onUseLocation}
        className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-accent px-5 py-3 text-[15px] font-semibold text-accent-foreground active:opacity-85"
      >
        <Locate className="h-5 w-5" /> Use Current Location
      </button>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center px-8 py-16 text-center">
      <p className="text-base font-semibold text-foreground">
        We couldn't load meetings right now.
      </p>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Check your connection and try again.
      </p>
      <button
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-5 py-3 text-[15px] font-semibold text-foreground active:bg-muted"
      >
        <RotateCw className="h-4 w-4" /> Try Again
      </button>
    </div>
  );
}

function EmptyState({ expandTarget, onExpand, onClear }) {
  return (
    <div className="flex flex-col items-center px-8 py-16 text-center">
      <MapPin className="h-10 w-10 text-muted-foreground/40" />
      <p className="mt-3 text-sm font-medium text-foreground">
        No meetings found with these filters.
      </p>
      <div className="mt-4 flex flex-col gap-2.5">
        {expandTarget && (
          <button
            onClick={onExpand}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 text-[15px] font-semibold text-accent-foreground active:opacity-85"
          >
            {expandTarget === "Any" ? "Expand search to any distance" : "Expand to 50 miles"}
          </button>
        )}
        <button
          onClick={onClear}
          className="inline-flex items-center justify-center rounded-2xl border border-border bg-background px-5 py-3 text-[15px] font-semibold text-foreground active:bg-muted"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}