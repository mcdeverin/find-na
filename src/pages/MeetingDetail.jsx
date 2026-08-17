import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft, Heart, MapPin, Video, Navigation, Phone, Globe, Languages, Users, Clock, MessageSquare, ShieldCheck, PencilLine,
} from "lucide-react";
import { useMeetings } from "@/lib/MeetingsContext";
import { fetchMeetingByIds } from "@/lib/bmlt";
import { nextOccurrence, formatTimeRange, DAY_NAMES } from "@/lib/meetings";
import { useSaved } from "@/lib/useSaved";
import MeetingTags from "@/components/MeetingTags";
import { cn } from "@/lib/utils";

export default function MeetingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggleSaved } = useSaved();
  const { getMeetingById } = useMeetings();
  const [meeting, setMeeting] = useState(() => getMeetingById(id));
  const [status, setStatus] = useState(meeting ? "success" : "loading");
  const now = new Date();

  useEffect(() => {
    if (meeting) return;
    let alive = true;
    setStatus("loading");
    fetchMeetingByIds([id])
      .then((list) => {
        if (!alive) return;
        if (list && list.length) {
          setMeeting(list[0]);
          setStatus("success");
        } else {
          setStatus("notfound");
        }
      })
      .catch(() => alive && setStatus("error"));
    return () => {
      alive = false;
    };
  }, [id, meeting]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background px-5 pt-6">
        <div className="h-7 w-2/3 animate-pulse rounded bg-muted" />
        <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="mt-6 h-12 w-full animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  if (status === "notfound" || !meeting) {
    return (
      <div className="flex flex-col items-center px-8 py-24 text-center">
        <p className="text-sm font-medium text-foreground">Meeting not found</p>
        <button onClick={() => navigate(-1)} className="mt-3 text-sm font-medium text-accent">
          Go back
        </button>
      </div>
    );
  }

  const occ = nextOccurrence(meeting, now);
  const saved = isSaved(meeting.id);
  const isVirtual = meeting.attendance_type === "Online";
  const isHybrid = meeting.attendance_type === "Hybrid";

  const directionsUrl =
    meeting.latitude != null && meeting.longitude != null
      ? `https://www.google.com/maps/dir/?api=1&destination=${meeting.latitude},${meeting.longitude}`
      : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
          [meeting.address, meeting.city, meeting.state, meeting.postal_code]
            .filter(Boolean)
            .join(", ")
        )}`;

  return (
    <div className="min-h-screen bg-background">
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
        <h1 className="font-heading text-[26px] font-semibold leading-tight tracking-tight text-foreground">
          {meeting.name}
        </h1>
        <p className="mt-1.5 text-[15px] text-muted-foreground">
          {DAY_NAMES[meeting.day_of_week]} · {formatTimeRange(meeting, occ)}
        </p>
        {!isVirtual && meeting.distance != null && (
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
            <MapPin className="h-4 w-4 text-accent" /> {Math.round(meeting.distance)} miles away
          </p>
        )}

        {/* primary actions */}
        <div className="mt-5 space-y-2.5">
          {!isVirtual && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-3.5 text-[15px] font-semibold text-accent-foreground active:opacity-85"
            >
              <Navigation className="h-5 w-5" /> Get Directions
            </a>
          )}
          {(isVirtual || isHybrid) && meeting.virtual_url && (
            <a
              href={meeting.virtual_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-accent bg-accent-soft py-3.5 text-[15px] font-semibold text-accent active:opacity-85"
            >
              <Video className="h-5 w-5" /> Join Online Meeting
            </a>
          )}
          {(isVirtual || isHybrid) && meeting.phone && (
            <a
              href={`tel:${meeting.phone.replace(/^tel:/i, "").split(/\s+/)[0].replace(/[^0-9+*,#]/g, "")}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-background py-3.5 text-[15px] font-semibold text-foreground active:bg-muted"
            >
              <Phone className="h-5 w-5" /> Phone Meeting
            </a>
          )}
        </div>

        {/* venue */}
        {!isVirtual && (meeting.venue_name || meeting.address || meeting.city) && (
          <div className="mt-5 rounded-2xl border border-border bg-card p-4">
            {meeting.venue_name && (
              <p className="text-[15px] font-semibold text-foreground">{meeting.venue_name}</p>
            )}
            {meeting.address && <p className="mt-0.5 text-sm text-muted-foreground">{meeting.address}</p>}
            <p className="text-sm text-muted-foreground">
              {[meeting.city, meeting.state, meeting.postal_code].filter(Boolean).join(", ")}
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
            {meeting.open_closed && (
              <DetailRow icon={ShieldCheck} label="Open / Closed" value={meeting.open_closed} />
            )}
            <DetailRow
              icon={Clock}
              label="Format"
              value={(meeting.meeting_formats || []).join(", ") || "—"}
            />
            <DetailRow
              icon={Navigation}
              label="Wheelchair Accessible"
              value={meeting.wheelchair_accessible ? "Yes" : "No"}
            />
            <DetailRow icon={Languages} label="Language" value={meeting.language || "English"} last />
          </div>

          {(meeting.meeting_formats || []).length > 0 && (
            <MeetingTags tags={meeting.meeting_formats} className="mt-3" />
          )}
        </section>

        {/* comments */}
        {meeting.comments && (
          <section className="mt-7">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Meeting Notes
            </h2>
            <div className="mt-2 rounded-2xl border border-border bg-card p-4">
              <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4 text-accent" /> Notes from the group
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">{meeting.comments}</p>
            </div>
          </section>
        )}

        {/* meeting information */}
        <section className="mt-7">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Meeting Information
          </h2>
          <div className="mt-2 rounded-2xl border border-border bg-card p-4">
            <p className="inline-flex items-center gap-1.5 text-sm text-foreground">
              <Globe className="h-4 w-4 text-accent" /> Listed by {meeting.source}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
                {meeting.verification_status}
              </span>
            </div>

            <div className="mt-4">
              <button
                onClick={() => navigate(`/suggest-update/${meeting.id}`)}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-background py-2.5 text-sm font-medium text-foreground active:bg-muted"
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