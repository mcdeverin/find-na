import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video } from "lucide-react";
import ScreenHeader from "@/components/ScreenHeader";
import { mockMeetings, sortByNextOccurrence, formatTime, nextOccurrence, startsInLabel } from "@/lib/meetings";
import { cn } from "@/lib/utils";

export default function Online() {
  const navigate = useNavigate();
  const [chip, setChip] = useState("Up Next");
  const now = new Date();

  const online = useMemo(
    () =>
      sortByNextOccurrence(
        mockMeetings.filter((m) => m.attendance_type === "Online" || m.attendance_type === "Hybrid"),
        now
      ),
    []
  );

  return (
    <div>
      <ScreenHeader title="Online Meetings" subtitle="Times shown in your local timezone" />

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-2.5">
        {["Up Next", "Today", "Language", "Format"].map((c) => (
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
        {online.map((m) => {
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
                <p className="truncate text-sm text-muted-foreground">{m.virtual_platform}</p>
                {startsIn && (
                  <p className="mt-1 text-xs font-medium text-accent/80">{startsIn}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}