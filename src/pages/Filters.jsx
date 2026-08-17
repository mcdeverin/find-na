import { useNavigate } from "react-router-dom";
import { ChevronLeft, Check } from "lucide-react";
import { useFilters, defaultFilters } from "@/lib/filtersContext";
import { cn } from "@/lib/utils";

const ATTENDANCE = ["In-Person", "Online", "Hybrid"];
const OPEN_CLOSED = ["Open", "Closed"];
const FORMATS = ["Discussion", "Speaker", "Basic Text", "Literature", "Step Study", "Traditions", "Beginners", "Women", "Men", "LGBTQ+", "Young People"];
const LANGUAGES = ["English", "Spanish", "Other"];
const DISTANCES = [5, 10, 25, 50, "Any"];

export default function Filters() {
  const navigate = useNavigate();
  const { filters, setFilters } = useFilters();
  const set = (patch) => setFilters({ ...filters, ...patch });

  const toggleFormat = (f) => {
    const has = filters.formats.includes(f);
    set({ formats: has ? filters.formats.filter((x) => x !== f) : [...filters.formats, f] });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-background/90 px-3 py-3 backdrop-blur-lg">
        <button onClick={() => navigate(-1)} className="rounded-full p-1.5 active:bg-muted">
          <ChevronLeft className="h-6 w-6 text-foreground" />
        </button>
        <h1 className="text-[17px] font-semibold text-foreground">Filters</h1>
        <button
          onClick={() => setFilters(defaultFilters)}
          className="rounded-full px-3 py-1 text-sm font-medium text-accent active:bg-muted"
        >
          Reset
        </button>
      </header>

      <div className="px-5 pb-28">
        <Group title="Attendance">
          <Pills options={ATTENDANCE} value={filters.attendance === "Any" ? null : filters.attendance} onPick={(v) => set({ attendance: v || "Any" })} allowAny />
        </Group>

        <Group title="Meeting Type">
          <Pills options={OPEN_CLOSED} value={filters.openClosed === "Any" ? null : filters.openClosed} onPick={(v) => set({ openClosed: v || "Any" })} allowAny />
        </Group>

        <Group title="Format">
          <div className="flex flex-wrap gap-2">
            {FORMATS.map((f) => (
              <button
                key={f}
                onClick={() => toggleFormat(f)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  filters.formats.includes(f)
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-background text-foreground"
                )}
              >
                {filters.formats.includes(f) && <Check className="h-3.5 w-3.5" />} {f}
              </button>
            ))}
          </div>
        </Group>

        <Group title="Accessibility">
          <button
            onClick={() => set({ wheelchairOnly: !filters.wheelchairOnly })}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              filters.wheelchairOnly ? "border-accent bg-accent text-accent-foreground" : "border-border bg-background text-foreground"
            )}
          >
            {filters.wheelchairOnly && <Check className="h-3.5 w-3.5" />} Wheelchair Accessible
          </button>
        </Group>

        <Group title="Language">
          <Pills options={LANGUAGES} value={filters.language === "Any" ? null : filters.language} onPick={(v) => set({ language: v || "Any" })} allowAny />
        </Group>

        <Group title="Distance" last>
          <div className="flex flex-wrap gap-2">
            {DISTANCES.map((d) => (
              <button
                key={String(d)}
                onClick={() => set({ distance: d })}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  filters.distance === d ? "border-accent bg-accent text-accent-foreground" : "border-border bg-background text-foreground"
                )}
              >
                {d === "Any" ? "Any Distance" : `${d} miles`}
              </button>
            ))}
          </div>
        </Group>
      </div>

      <div className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 border-t border-border bg-background/95 p-4 backdrop-blur-lg safe-bottom">
        <button
          onClick={() => navigate(-1)}
          className="w-full rounded-2xl bg-accent py-3.5 text-[15px] font-semibold text-accent-foreground transition-opacity active:opacity-85"
        >
          Show Meetings
        </button>
      </div>
    </div>
  );
}

function Group({ title, children, last }) {
  return (
    <section className={cn("py-5", !last && "border-b border-border")}>
      <h2 className="pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}

function Pills({ options, value, onPick, allowAny }) {
  return (
    <div className="flex flex-wrap gap-2">
      {allowAny && (
        <button
          onClick={() => onPick(null)}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            value === null ? "border-accent bg-accent text-accent-foreground" : "border-border bg-background text-foreground"
          )}
        >
          Any
        </button>
      )}
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onPick(o)}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            value === o ? "border-accent bg-accent text-accent-foreground" : "border-border bg-background text-foreground"
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}