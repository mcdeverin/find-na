import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Trash2, Video, MapPin } from "lucide-react";
import ScreenHeader from "@/components/ScreenHeader";
import { useSaved } from "@/lib/useSaved";
import { getMeetingById, nextOccurrence, formatTime, relativeDayLabel } from "@/lib/meetings";

export default function Saved() {
  const navigate = useNavigate();
  const { saved, removeSaved } = useSaved();
  const now = new Date();

  const meetings = useMemo(
    () =>
      saved
        .map(getMeetingById)
        .filter(Boolean)
        .map((m) => ({ m, occ: nextOccurrence(m, now) })),
    [saved]
  );

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const groups = useMemo(() => {
    const todayList = [];
    const weekList = [];
    const otherList = [];
    meetings.forEach(({ m, occ }) => {
      const d = new Date(occ);
      d.setHours(0, 0, 0, 0);
      const diff = Math.round((d - today) / 86400000);
      if (diff === 0) todayList.push(m);
      else if (diff >= 1 && diff <= 6) weekList.push(m);
      else otherList.push(m);
    });
    return { todayList, weekList, otherList };
  }, [meetings]);

  return (
    <div>
      <ScreenHeader title="Saved Meetings" />
      {meetings.length === 0 ? (
        <div className="flex flex-col items-center px-8 py-20 text-center">
          <Heart className="h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium text-foreground">No saved meetings yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap the heart on any meeting to save it here.
          </p>
        </div>
      ) : (
        <div className="px-5 py-4 space-y-6">
          <SavedSection title="Today" list={groups.todayList} now={now} onOpen={(id) => navigate(`/meeting/${id}`)} onRemove={removeSaved} />
          <SavedSection title="This Week" list={groups.weekList} now={now} onOpen={(id) => navigate(`/meeting/${id}`)} onRemove={removeSaved} />
          <SavedSection title="Other Saved Meetings" list={groups.otherList} now={now} onOpen={(id) => navigate(`/meeting/${id}`)} onRemove={removeSaved} />
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
                    onClick={(e) => { e.stopPropagation(); onRemove(m.id); }}
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
                    <><Video className="h-3.5 w-3.5 text-accent" /> Online</>
                  ) : (
                    <><MapPin className="h-3.5 w-3.5 text-accent" /> {m.distance} mi · In-Person</>
                  )}
                  {m.attendance_type === "Hybrid" && " · Hybrid"}
                </p>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}