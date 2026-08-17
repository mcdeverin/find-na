import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Trash2, Video, MapPin } from "lucide-react";
import ScreenHeader from "@/components/ScreenHeader";
import { useSaved } from "@/lib/useSaved";
import { fetchMeetingByIds } from "@/lib/bmlt";
import { nextOccurrence, formatTime, relativeDayLabel, sortByNextOccurrence } from "@/lib/meetings";

export default function Saved() {
  const navigate = useNavigate();
  const { saved, removeSaved } = useSaved();
  const now = new Date();
  const [meetings, setMeetings] = useState([]);
  const [status, setStatus] = useState("loading");

  const ids = useMemo(() => saved.map((s) => s.external_id), [saved]);

  useEffect(() => {
    let alive = true;
    if (ids.length === 0) {
      setMeetings([]);
      setStatus("success");
      return;
    }
    setStatus("loading");
    fetchMeetingByIds(ids)
      .then((list) => {
        if (!alive) return;
        setMeetings(sortByNextOccurrence(list, now));
        setStatus("success");
      })
      .catch(() => alive && setStatus("error"));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join("|")]);

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const groups = useMemo(() => {
    const todayList = [];
    const weekList = [];
    const otherList = [];
    meetings.forEach((m) => {
      const occ = nextOccurrence(m, now);
      const d = new Date(occ);
      d.setHours(0, 0, 0, 0);
      const diff = Math.round((d - today) / 86400000);
      if (diff === 0) todayList.push(m);
      else if (diff >= 1 && diff <= 6) weekList.push(m);
      else otherList.push(m);
    });
    return { todayList, weekList, otherList };
  }, [meetings]);

  const open = (id) => navigate(`/meeting/${id}`);

  return (
    <div>
      <ScreenHeader title="Saved Meetings" />
      {status === "loading" && (
        <div className="px-5 py-4 text-sm text-muted-foreground">Loading saved meetings…</div>
      )}
      {status === "error" && (
        <div className="flex flex-col items-center px-8 py-16 text-center">
          <p className="text-sm font-medium text-foreground">We couldn't load saved meetings.</p>
          <p className="mt-1 text-sm text-muted-foreground">Check your connection and try again.</p>
        </div>
      )}
      {status === "success" && meetings.length === 0 && (
        <div className="flex flex-col items-center px-8 py-20 text-center">
          <Heart className="h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium text-foreground">No saved meetings yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap the heart on any meeting to save it here.
          </p>
        </div>
      )}
      {status === "success" && meetings.length > 0 && (
        <div className="space-y-6 px-5 py-4">
          <SavedSection title="Today" list={groups.todayList} now={now} onOpen={open} onRemove={removeSaved} />
          <SavedSection title="This Week" list={groups.weekList} now={now} onOpen={open} onRemove={removeSaved} />
          <SavedSection title="Other Saved Meetings" list={groups.otherList} now={now} onOpen={open} onRemove={removeSaved} />
        </div>
      )}
    </div>
  );
}

function SavedSection({ title, list, now, onOpen, onRemove }) {
  if (list.length === 0) return null;
  return (
    <section>
      <h2 className="px-1 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      <div className="space-y-2.5">
        {list.map((m) => {
          const occ = nextOccurrence(m, now);
          const isVirtual = m.attendance_type === "Online";
          return (
            <div key={m.id} className="rounded-2xl border border-border bg-card p-4">
              <button onClick={() => onOpen(m.id)} className="w-full text-left">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[15px] font-semibold text-foreground">{m.name}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(m.id);
                    }}
                    className="shrink-0 rounded-full p-1 text-muted-foreground active:bg-muted"
                    aria-label="Remove from saved"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {relativeDayLabel(m, now)} · {formatTime(occ)}
                </p>
                <p className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  {isVirtual ? (
                    <>
                      <Video className="h-3.5 w-3.5 text-accent" /> Online
                    </>
                  ) : (
                    <>
                      <MapPin className="h-3.5 w-3.5 text-accent" />{" "}
                      {m.distance != null ? `${Math.round(m.distance)} mi · ` : ""}
                      {m.attendance_type}
                    </>
                  )}
                </p>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}