import { useNavigate } from "react-router-dom";
import { ChevronRight, Video } from "lucide-react";
import { formatTime, nextOccurrence, startsInLabel } from "@/lib/meetings";

export default function MeetingRow({ meeting, now = new Date() }) {
  const navigate = useNavigate();
  const occ = nextOccurrence(meeting, now);
  const startsIn = startsInLabel(meeting, now);
  const isVirtual = meeting.attendance_type === "Online";
  const isHybrid = meeting.attendance_type === "Hybrid";

  const locationLine = [meeting.city, meeting.state].filter(Boolean).join(", ");

  return (
    <button
      onClick={() => navigate(`/meeting/${meeting.id}`)}
      className="flex w-full items-stretch gap-3 border-b border-border px-5 py-3.5 text-left transition-colors active:bg-muted/60"
    >
      {/* time / distance block */}
      <div className="flex w-[68px] shrink-0 flex-col items-start">
        <span className="text-[17px] font-semibold leading-tight tracking-tight text-foreground">
          {formatTime(occ)}
        </span>
        {isVirtual ? (
          <Video className="mt-1 h-4 w-4 text-accent" />
        ) : (
          meeting.distance != null && (
            <span className="mt-1 text-xs text-muted-foreground">
              {Math.round(meeting.distance * 10) / 10} mi
            </span>
          )
        )}
      </div>

      {/* details */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <h3 className="truncate text-[15px] font-semibold text-foreground">{meeting.name}</h3>
          {isHybrid && <Video className="h-3.5 w-3.5 shrink-0 text-accent" />}
        </div>
        {meeting.venue_name && (
          <p className="mt-0.5 truncate text-sm text-muted-foreground">{meeting.venue_name}</p>
        )}
        {meeting.address && <p className="truncate text-sm text-muted-foreground">{meeting.address}</p>}
        <p className="truncate text-sm text-muted-foreground">
          {locationLine || (isVirtual ? meeting.virtual_platform || "Online Meeting" : "")}
        </p>
        {startsIn && <p className="mt-1 text-xs font-medium text-accent/80">{startsIn}</p>}
      </div>

      <ChevronRight className="my-auto h-5 w-5 shrink-0 text-muted-foreground/60" />
    </button>
  );
}