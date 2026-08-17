import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Heart, MapPin, Video, Navigation, CheckCircle2, PencilLine, ShieldCheck, Globe, Languages, Users, Clock } from "lucide-react";
import { getMeetingById, nextOccurrence, formatTimeRange, relativeDayLabel, lastConfirmedLabel, DAY_NAMES } from "@/lib/meetings";
import { useSaved } from "@/lib/useSaved";
import MeetingTags from "@/components/MeetingTags";
import { cn } from "@/lib/utils";

export default function MeetingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggleSaved } = useSaved();
  const meeting = getMeetingById(id);
  const now = new Date();

  if (!meeting) {
    return (
      <div className="flex flex-col items-center px-8 py-24 text-center">
        <p className="text-sm font-medium text-foreground">Meeting not found</p>
        <button onClick={() => navigate(-1)} className="mt-3 text-sm font-medium text-accent">Go back</button>
      </div>
    );
  }

  const occ = nextOccurrence(meeting, now);
  const saved = isSaved(meeting.id);
  const isVirtual = meeting.attendance_type === "Online";
  const isHybrid = meeting.attendance_type === "Hybrid";
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${meeting.address}, ${meeting.city}, ${meeting.state} ${meeting.postal_code}`
  )}`;

  return (
    <div className="min-h-screen bg-background">
      {/* sticky sub-header */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-background/90 px-3 py-3 backdrop-blur-lg">
        <button onClick={() => navigate(-1)} className="rounded-full p-1.5 active:bg-muted">
          <ChevronLeft className="h-6 w-6 text-foreground" />
        </button>
        <button
          onClick={() => toggleSaved(meeting.id)}
          className="rounded-full p-1.5 active:bg-muted"
          aria-label={saved ? "Unsave" : "Save"}
        >
          <Heart className={cn("h-6 w-6", saved ? "fill-accent text-accent" : "text-foreground")} />
        </button>
      </header>

      <div className="px-5 pb-10">
        {/* title block */}
        <h1 className="font-heading text-[26px] font-semibold leading-tight tracking-tight text-foreground">
          {meeting.name}
        </h1>
        <p className="mt-1.5 text-[15px] text-muted-foreground">
          {DAY_NAMES[meeting.day_of_week]} · {formatTimeRange(meeting, occ)}
        </p>
        {!isVirtual && meeting.distance != null && (
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
            <MapPin className="h-4 w-4 text-accent" /> {meeting.distance} miles away
          </p>
        )}

        {/* primary actions */}
        <div className="mt-5 space-y-2.5">
          {!isVirtual && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-3.5 text-[15px] font-semibold text-accent-foreground transition-opacity active:opacity-85"
            >
              <Navigation className="h-5 w-5" /> Get Directions
            </a>
          )}
          {(isVirtual || isHybrid) && meeting.virtual_url && (
            <a
              href={meeting.virtual_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-accent bg-accent-soft py-3.5 text-[15px] font-semibold text-accent transition-opacity active:opacity-85"
            >
              <Video className="h-5 w-5" /> Join Online Meeting
            </a>
          )}
        </div>

        {/* venue */}
        {!isVirtual && (
          <div className="mt-5 rounded-2xl border border-border bg-card p-4">
            <p className="text-[15px] font-semibold text-foreground">{meeting.venue_name}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{meeting.address}</p>
            <p className="text-sm text-muted-foreground">
              {meeting.city}, {meeting.state} {meeting.postal_code}
            </p>
          </div>
        )}

        {/* meeting details */}
        <section className="mt-7">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Meeting Details
          </h2>
          <div className="mt-2 overflow-hidden rounded-2xl border border-border">
            <DetailRow icon={Users} label="Attendance" value={meeting.attendance_type} />
            <DetailRow icon={ShieldCheck} label="Open / Closed" value={meeting.open_closed} />
            <DetailRow icon={Clock} label="Format" value={(meeting.meeting_formats || []).join(", ")} />
            <DetailRow icon={Navigation} label="Wheelchair Accessible" value={meeting.wheelchair_accessible ? "Yes" : "No"} />
            <DetailRow icon={Languages} label="Language" value={meeting.language || "English"} last />
          </div>

          {(meeting.meeting_formats || []).length > 0 && (
            <MeetingTags tags={meeting.meeting_formats} className="mt-3" />
          )}
        </section>

        {/* meeting information / freshness */}
        <section className="mt-7">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Meeting Information
          </h2>
          <div className="mt-2 rounded-2xl border border-border bg-card p-4">
            {meeting.source && (
              <p className="inline-flex items-center gap-1.5 text-sm text-foreground">
                <Globe className="h-4 w-4 text-accent" /> Listed by {meeting.source}
              </p>
            )}
            {lastConfirmedLabel(meeting, now) && (
              <p className="mt-1.5 text-sm text-muted-foreground">
                {lastConfirmedLabel(meeting, now)}
              </p>
            )}
            <div className="mt-3 flex items-center gap-2">
              <span className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                meeting.verification_status === "Official Source"
                  ? "bg-accent-soft text-accent"
                  : meeting.verification_status === "Community Verified"
                  ? "bg-amber-50 text-amber-700"
                  : "bg-muted text-muted-foreground"
              )}>
                {meeting.verification_status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <button className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background py-2.5 text-sm font-medium text-foreground active:bg-muted">
                <CheckCircle2 className="h-4 w-4 text-accent" /> Confirm this meeting
              </button>
              <button
                onClick={() => navigate(`/suggest-update/${meeting.id}`)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background py-2.5 text-sm font-medium text-foreground active:bg-muted"
              >
                <PencilLine className="h-4 w-4 text-accent" /> Suggest an update
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value, last }) {
  return (
    <div className={cn("flex items-center justify-between gap-3 px-4 py-3", !last && "border-b border-border")}>
      <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4 text-muted-foreground" /> {label}
      </span>
      <span className="text-right text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}