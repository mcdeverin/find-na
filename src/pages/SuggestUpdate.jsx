import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import { useMeetings } from "@/lib/MeetingsContext";
import { fetchMeetingByIds } from "@/lib/bmlt";
import { cn } from "@/lib/utils";

const REASONS = [
  "Meeting no longer exists",
  "Time changed",
  "Location changed",
  "Online link changed",
  "Meeting format changed",
  "Accessibility information changed",
  "Other",
];

const inputCls =
  "w-full rounded-xl border border-input bg-background px-3.5 py-3 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30";

export default function SuggestUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMeetingById } = useMeetings();
  const [meeting, setMeeting] = useState(() => getMeetingById(id));
  const [reason, setReason] = useState(null);
  const [details, setDetails] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (meeting) return;
    let alive = true;
    fetchMeetingByIds([id]).then((list) => {
      if (alive && list && list.length) setMeeting(list[0]);
    }).catch(() => {});
    return () => { alive = false; };
  }, [id, meeting]);

  if (done) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-8 text-center">
        <div className="rounded-full bg-accent-soft p-4">
          <CheckCircle2 className="h-12 w-12 text-accent" />
        </div>
        <h1 className="mt-5 font-heading text-2xl font-semibold text-foreground">Thank you.</h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          Thanks for helping keep Find NA accurate. We'll look into this update.
        </p>
        <button onClick={() => navigate("/")} className="mt-8 rounded-2xl bg-accent px-8 py-3 text-[15px] font-semibold text-accent-foreground active:opacity-85">
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex items-center gap-2 bg-background/90 px-3 py-3 backdrop-blur-lg">
        <button onClick={() => navigate(-1)} className="rounded-full p-1.5 active:bg-muted">
          <ChevronLeft className="h-6 w-6 text-foreground" />
        </button>
        <h1 className="text-[17px] font-semibold text-foreground">Suggest an Update</h1>
      </header>

      <div className="px-5 py-5">
        {meeting && (
          <div className="mb-5 rounded-2xl border border-border bg-card p-4">
            <p className="text-[15px] font-semibold text-foreground">{meeting.name}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{meeting.venue_name || "Online Meeting"}</p>
          </div>
        )}

        <h2 className="mb-3 text-sm font-medium text-foreground">What needs updating?</h2>
        <div className="space-y-2">
          {REASONS.map((r) => (
            <button
              key={r}
              onClick={() => setReason(r)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left text-[15px] font-medium transition-colors",
                reason === r ? "border-accent bg-accent-soft text-accent" : "border-border bg-background text-foreground"
              )}
            >
              {r}
              <span className={cn("h-4 w-4 rounded-full border-2", reason === r ? "border-accent bg-accent" : "border-muted-foreground/40")} />
            </button>
          ))}
        </div>

        {reason && (
          <div className="mt-5">
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Corrected information
            </label>
            <textarea
              className={inputCls}
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Share the updated details so we can verify them."
            />
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 border-t border-border bg-background/95 p-4 backdrop-blur-lg safe-bottom">
        <button
          onClick={() => setDone(true)}
          disabled={!reason}
          className="w-full rounded-2xl bg-accent py-3.5 text-[15px] font-semibold text-accent-foreground disabled:opacity-40 active:opacity-85"
        >
          Submit Update
        </button>
      </div>
    </div>
  );
}