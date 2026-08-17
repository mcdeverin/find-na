import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video, RotateCw } from "lucide-react";
import ScreenHeader from "@/components/ScreenHeader";
import { useOnlineMeetings } from "@/lib/useOnlineMeetings";
import { formatTime, nextOccurrence, currentWeekOccurrence, startsInLabel } from "@/lib/meetings";
import { cn } from "@/lib/utils";

const CHIPS = ["Up Next", "Today"];

export default function Online() {
  const navigate = useNavigate();
  const { meetings, status, error, refresh } = useOnlineMeetings();
  const [chip, setChip] = useState("Up Next");
  const now = new Date();

  const list = useMemo(() => {
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    if (chip === "Today") {
      return meetings
        .map((m) => ({ meeting: m, occ: currentWeekOccurrence(m, now) }))
        .filter(({ occ }) => {
          if (isNaN(occ)) return false;
          const d = new Date(occ);
          d.setHours(0, 0, 0, 0);
          return d.getTime() === today.getTime();
        })
        .sort((a, b) => a.occ - b.occ);
    }

    const horizon = new Date(now.getTime() + 7 * 86400000);
    return meetings
      .map((m) => ({ meeting: m, occ: nextOccurrence(m, now) }))
      .filter(({ occ }) => !isNaN(occ) && occ >= now && occ <= horizon)
      .sort((a, b) => a.occ - b.occ);
  }, [meetings, chip]);

  const groups = useMemo(() => {
    const result = [];
    for (const item of list) {
      const key = item.occ.toLocaleDateString("en-CA");
      let group = result[result.length - 1];
      if (!group || group.key !== key) {
        group = { key, occ: item.occ, items: [] };
        result.push(group);
      }
      group.items.push(item);
    }
    return result;
  }, [list]);

  return (
    <div>
      <ScreenHeader
        title="Online Meetings"
        subtitle="Times shown in your local timezone"
        right={
          <button
            onClick={refresh}
            aria-label="Refresh"
            className="rounded-full p-1.5 text-muted-foreground active:bg-muted"
          >
            <RotateCw className={cn("h-5 w-5", status === "loading" && "animate-spin")} />
          </button>
        }
      />

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-2.5">
        {CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => setChip(c)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              chip === c ? "border-accent bg-accent text-accent-foreground" : "border-border bg-background text-foreground"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="border-t border-border">
        {status === "loading" && <SkeletonList />}
        {status === "error" && (
          <div className="flex flex-col items-center px-8 py-16 text-center">
            <p className="text-base font-semibold text-foreground">
              We couldn't load meetings right now.
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">Check your connection and try again.</p>
            <button
              onClick={refresh}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-5 py-3 text-[15px] font-semibold text-foreground active:bg-muted"
            >
              <RotateCw className="h-4 w-4" /> Try Again
            </button>
          </div>
        )}
        {status === "success" && list.length === 0 && (
          <div className="flex flex-col items-center px-8 py-16 text-center">
            <Video className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-medium text-foreground">No online meetings found.</p>
          </div>
        )}
        {status === "success" && groups.map((group) => (
          <div key={group.key}>
            <DateHeader date={group.occ} now={now} />
            {group.items.map(({ meeting: m, occ }) => {
              const startsIn = occ > now ? startsInLabel(m, now) : null;
              return (
                <button
                  key={m.id}
                  onClick={() => navigate(`/meeting/${m.id}`)}
                  className="flex w-full items-stretch gap-3 border-b border-border px-5 py-3.5 text-left transition-colors active:bg-muted/60"
                >
                  <div className="flex w-[68px] shrink-0 flex-col items-start">
                    <span className="text-[17px] font-semibold leading-tight tracking-tight text-foreground">
                      {formatTime(occ)}
                    </span>
                    <Video className="mt-1 h-4 w-4 text-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[15px] font-semibold text-foreground">{m.name}</h3>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">Online Meeting</p>
                    {m.virtual_platform && (
                      <p className="truncate text-sm text-muted-foreground">{m.virtual_platform}</p>
                    )}
                    {startsIn && <p className="mt-1 text-xs font-medium text-accent/80">{startsIn}</p>}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
        {status === "success" && chip === "Up Next" && list.length > 0 && (
          <div className="px-5 py-4 text-center text-xs text-muted-foreground">
            Showing the next 7 days
          </div>
        )}
      </div>
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
            <div className="h-3 w-6 animate-pulse rounded bg-muted" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
function DateHeader({ date, now }) {
  const start = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
  const diff = Math.round((start(date) - start(now)) / 86400000);
  const prefix = diff === 0 ? "Today" : diff === 1 ? "Tomorrow" : date.toLocaleDateString("en-US", { weekday: "long" });
  const rest = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return (
    <div className="border-b border-border bg-secondary/40 px-5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {prefix} · {rest}
    </div>
  );
}
