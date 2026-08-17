import { useNavigate } from "react-router-dom";
import { Plus, PencilLine, Phone, BookOpen, Globe, MapPin, Info, MessageSquare, Share2, Shield, FileText, ChevronRight } from "lucide-react";
import ScreenHeader from "@/components/ScreenHeader";

function Row({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-border bg-card px-4 py-3.5 text-left transition-colors last:border-b-0 active:bg-muted/60"
    >
      <Icon className="h-5 w-5 shrink-0 text-accent" />
      <span className="flex-1 text-[15px] font-medium text-foreground">{label}</span>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50" />
    </button>
  );
}

function Section({ title, children }) {
  return (
    <section className="px-5">
      <h2 className="px-1 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      <div className="overflow-hidden rounded-2xl border border-border">{children}</div>
    </section>
  );
}

export default function More() {
  const navigate = useNavigate();
  return (
    <div>
      <ScreenHeader title="More" />
      <div className="space-y-6 px-0 py-4">
        <Section title="Meetings">
          <Row icon={Plus} label="Add a Meeting" onClick={() => navigate("/add-meeting")} />
          <Row icon={PencilLine} label="Suggest a Meeting Update" onClick={() => navigate("/suggest-update")} />
          <Row icon={Phone} label="Contact NA Near Me" onClick={() => window.open("https://na.org", "_blank")} />
        </Section>

        <Section title="Resources">
          <Row icon={BookOpen} label="NA Literature" onClick={() => navigate("/basic-text")} />
          <Row icon={Globe} label="NA World Services" onClick={() => window.open("https://na.org", "_blank")} />
          <Row icon={MapPin} label="Local NA Resources" onClick={() => window.open("https://na.org/meetingsearch", "_blank")} />
        </Section>

        <Section title="Find NA">
          <Row icon={Info} label="About Find NA" onClick={() => navigate("/about")} />
          <Row icon={MessageSquare} label="Send Feedback" onClick={() => navigate("/feedback")} />
          <Row icon={Share2} label="Share Find NA" onClick={() => navigator.share?.({ title: "Find NA", text: "Find NA meetings near you", url: window.location.href }).catch(() => {})} />
          <Row icon={Shield} label="Privacy Policy" onClick={() => navigate("/privacy")} />
          <Row icon={FileText} label="Terms" onClick={() => navigate("/terms")} />
        </Section>
      </div>
    </div>
  );
}