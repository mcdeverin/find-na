import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video, RotateCw } from "lucide-react";
import ScreenHeader from "@/components/ScreenHeader";
import { useOnlineMeetings } from "@/lib/useOnlineMeetings";
import { formatTime, nextOccurrence, startsInLabel } from "@/lib/meetings";
import { cn } from "@/lib/utils";

const CHIPS = ["Up Next", "Today"];

export default function Online() {
  const navigate = useNavigate();
  const { meetings, status, error, refresh } = useOnlineMeetings();
  const [chip, setChip] = useState("Up Next");
  const now = new Date();

  const list = useMemo(() => {
    if (chip === "Today") {
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);
      return meetings.filter((m) => {
        const occ = nextOccurrence(m, now);
        const d = new Date(occ);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime() && occ > now;
      });
    }
    return meetings; // already sorted by next occurrence
  }, [meetings, chip]);

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
        {status === "success" &&
          list.map((m) => {
            const occ = nextOccurrence(m, now);
            const startsIn = startsInLabel(m, now);
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