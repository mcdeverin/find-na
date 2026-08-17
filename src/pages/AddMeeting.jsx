import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CheckCircle2, Video, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Meeting", "Location", "Details", "Online", "Verification"];

const inputCls =
  "w-full rounded-xl border border-input bg-background px-3.5 py-3 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30";
const labelCls = "mb-1.5 block text-sm font-medium text-foreground";

function Field({ label, children, required }) {
  return (
    <div>
      <label className={labelCls}>
        {label} {required && <span className="text-accent">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function AddMeeting() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "", type: "In-Person", day: "Monday", start: "", end: "", timezone: "America/New_York",
    venue: "", address: "", city: "", state: "", postal: "", country: "US",
    format: "Discussion", openClosed: "Open", language: "English", wheelchair: false, notes: "",
    url: "", platform: "Zoom", meetingId: "", password: "", dialIn: "",
    listed: "Not Sure", website: "", contact: "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const showOnline = form.type === "Online" || form.type === "Hybrid";
  const steps = showOnline ? STEPS : STEPS.filter((s) => s !== "Online");

  if (done) return <ThankYou onDone={() => navigate("/")} />;

  const canNext = () => {
    if (steps[step] === "Meeting") return form.name && form.start;
    return true;
  };

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => (step === 0 ? navigate(-1) : setStep((s) => s - 1));

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background/90 px-3 py-3 backdrop-blur-lg">
        <div className="flex items-center gap-2">
          <button onClick={back} className="rounded-full p-1.5 active:bg-muted">
            <ChevronLeft className="h-6 w-6 text-foreground" />
          </button>
          <h1 className="text-[17px] font-semibold text-foreground">Add a Meeting</h1>
        </div>
        {/* progress */}
        <div className="mt-3 flex gap-1.5">
          {steps.map((s, i) => (
            <div key={s} className={cn("h-1 flex-1 rounded-full", i <= step ? "bg-accent" : "bg-muted")} />
          ))}
        </div>
      </header>

      <div className="px-5 py-5">
        {step === 0 && steps[0] === "Meeting" && (
          <Intro />
        )}
        {renderStep(steps[step], form, set)}
      </div>

      {/* footer nav */}
      <div className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 border-t border-border bg-background/95 p-4 backdrop-blur-lg safe-bottom">
        {step < steps.length - 1 ? (
          <button
            onClick={next}
            disabled={!canNext()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-3.5 text-[15px] font-semibold text-accent-foreground disabled:opacity-40 active:opacity-85"
          >
            Continue <ChevronRight className="h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={() => setDone(true)}
            className="w-full rounded-2xl bg-accent py-3.5 text-[15px] font-semibold text-accent-foreground active:opacity-85"
          >
            Submit Meeting
          </button>
        )}
      </div>
    </div>
  );
}

function Intro() {
  return (
    <div className="mb-5 rounded-2xl border border-border bg-accent-soft/60 p-4">
      <p className="text-[15px] font-semibold text-foreground">Know about an NA meeting we're missing?</p>
      <p className="mt-1 text-sm text-muted-foreground">Help others find it.</p>
      <p className="mt-2 text-xs text-muted-foreground">
        Submitted meetings are reviewed before appearing as verified meeting information.
      </p>
    </div>
  );
}

function renderStep(name, form, set) {
  switch (name) {
    case "Meeting":
      return (
        <div className="space-y-4">
          <Field label="Meeting Name" required>
            <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Just for Today" />
          </Field>
          <Field label="Meeting Type">
            <div className="flex gap-2">
              {["In-Person", "Online", "Hybrid"].map((t) => (
                <button key={t} onClick={() => set("type", t)}
                  className={cn("flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium",
                    form.type === t ? "border-accent bg-accent text-accent-foreground" : "border-border bg-background text-foreground")}>
                  {t === "Online" ? <Video className="mx-auto mb-1 h-4 w-4" /> : t === "In-Person" ? <MapPin className="mx-auto mb-1 h-4 w-4" /> : null}
                  {t}
                </button>
              ))}
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Day" required>
              <select className={inputCls} value={form.day} onChange={(e) => set("day", e.target.value)}>
                {["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map((d) => <option key={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Timezone">
              <select className={inputCls} value={form.timezone} onChange={(e) => set("timezone", e.target.value)}>
                <option>America/New_York</option><option>America/Chicago</option><option>America/Denver</option><option>America/Los_Angeles</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Time" required>
              <input type="time" className={inputCls} value={form.start} onChange={(e) => set("start", e.target.value)} />
            </Field>
            <Field label="End Time">
              <input type="time" className={inputCls} value={form.end} onChange={(e) => set("end", e.target.value)} />
            </Field>
          </div>
        </div>
      );
    case "Location":
      return (
        <div className="space-y-4">
          <Field label="Venue Name"><input className={inputCls} value={form.venue} onChange={(e) => set("venue", e.target.value)} placeholder="e.g. First Presbyterian Church" /></Field>
          <Field label="Street Address"><input className={inputCls} value={form.address} onChange={(e) => set("address", e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City"><input className={inputCls} value={form.city} onChange={(e) => set("city", e.target.value)} /></Field>
            <Field label="State / Province"><input className={inputCls} value={form.state} onChange={(e) => set("state", e.target.value)} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Postal Code"><input className={inputCls} value={form.postal} onChange={(e) => set("postal", e.target.value)} /></Field>
            <Field label="Country"><input className={inputCls} value={form.country} onChange={(e) => set("country", e.target.value)} /></Field>
          </div>
        </div>
      );
    case "Details":
      return (
        <div className="space-y-4">
          <Field label="Format">
            <select className={inputCls} value={form.format} onChange={(e) => set("format", e.target.value)}>
              {["Discussion","Speaker","Basic Text","Literature Study","Step Study","Traditions","Beginners","Women","Men","LGBTQ+","Young People"].map((f) => <option key={f}>{f}</option>)}
            </select>
          </Field>
          <Field label="Open or Closed">
            <div className="flex gap-2">
              {["Open", "Closed"].map((o) => (
                <button key={o} onClick={() => set("openClosed", o)} className={cn("flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium", form.openClosed === o ? "border-accent bg-accent text-accent-foreground" : "border-border bg-background text-foreground")}>{o}</button>
              ))}
            </div>
          </Field>
          <Field label="Language">
            <select className={inputCls} value={form.language} onChange={(e) => set("language", e.target.value)}>
              <option>English</option><option>Spanish</option><option>Other</option>
            </select>
          </Field>
          <Field label="Wheelchair Accessible">
            <button onClick={() => set("wheelchair", !form.wheelchair)} className={cn("rounded-xl border px-4 py-2.5 text-sm font-medium", form.wheelchair ? "border-accent bg-accent text-accent-foreground" : "border-border bg-background text-foreground")}>
              {form.wheelchair ? "Yes" : "No"}
            </button>
          </Field>
          <Field label="Additional Notes">
            <textarea className={inputCls} rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Anything else helpful to know" />
          </Field>
        </div>
      );
    case "Online":
      return (
        <div className="space-y-4">
          <Field label="Meeting URL"><input className={inputCls} value={form.url} onChange={(e) => set("url", e.target.value)} placeholder="https://zoom.us/j/..." /></Field>
          <Field label="Platform">
            <select className={inputCls} value={form.platform} onChange={(e) => set("platform", e.target.value)}>
              <option>Zoom</option><option>Google Meet</option><option>Web</option><option>Phone Dial-In</option>
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Meeting ID"><input className={inputCls} value={form.meetingId} onChange={(e) => set("meetingId", e.target.value)} /></Field>
            <Field label="Password"><input className={inputCls} value={form.password} onChange={(e) => set("password", e.target.value)} /></Field>
          </div>
          <Field label="Phone Dial-In"><input className={inputCls} value={form.dialIn} onChange={(e) => set("dialIn", e.target.value)} placeholder="+1-555-..." /></Field>
        </div>
      );
    case "Verification":
      return (
        <div className="space-y-4">
          <Field label="Is this meeting currently listed by a local NA Area or Region?">
            <div className="flex gap-2">
              {["Yes", "No", "Not Sure"].map((o) => (
                <button key={o} onClick={() => set("listed", o)} className={cn("flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium", form.listed === o ? "border-accent bg-accent text-accent-foreground" : "border-border bg-background text-foreground")}>{o}</button>
              ))}
            </div>
          </Field>
          <Field label="Local NA website (optional)"><input className={inputCls} value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://" /></Field>
          <Field label="Contact information for verification (optional)">
            <input className={inputCls} value={form.contact} onChange={(e) => set("contact", e.target.value)} placeholder="Email or phone" />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Contact information will <span className="font-medium">not</span> be displayed publicly.
            </p>
          </Field>
        </div>
      );
    default:
      return null;
  }
}

function ThankYou({ onDone }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-8 text-center">
      <div className="rounded-full bg-accent-soft p-4">
        <CheckCircle2 className="h-12 w-12 text-accent" />
      </div>
      <h1 className="mt-5 font-heading text-2xl font-semibold text-foreground">Thank you.</h1>
      <p className="mt-2 text-[15px] text-muted-foreground">
        We'll review this meeting information before adding it to Find NA.
      </p>
      <button onClick={onDone} className="mt-8 rounded-2xl bg-accent px-8 py-3 text-[15px] font-semibold text-accent-foreground active:opacity-85">
        Done
      </button>
    </div>
  );
}