import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const CONTENT = {
  privacy: {
    title: "Privacy Policy",
    body: [
      "Find NA does not require an account to search for meetings, get directions, or join an online meeting.",
      "Saved meetings are stored locally on your device. Meeting confirmations and update suggestions are submitted anonymously unless you choose to include optional contact information.",
      "We do not sell personal data. Any contact information you provide is used only to verify meeting details and is never displayed publicly.",
    ],
  },
  terms: {
    title: "Terms",
    body: [
      "Find NA is an independent meeting-discovery tool and is not affiliated with or endorsed by Narcotics Anonymous World Services.",
      "Meeting information is contributed by local service bodies and community members and may be out of date. Always confirm meeting details before attending.",
      "Use Find NA responsibly. By using this tool you acknowledge that meeting details may change without notice.",
    ],
  },
  feedback: {
    title: "Send Feedback",
    body: [
      "Thanks for using Find NA. Your feedback helps us make it easier for people to find a meeting when they need one.",
      "This is a prototype screen. In the full version, you'll be able to send feedback, report issues, and suggest improvements directly from here.",
    ],
  },
};

export default function Legal({ kind }) {
  const navigate = useNavigate();
  const content = CONTENT[kind] || CONTENT.privacy;
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex items-center gap-2 bg-background/90 px-3 py-3 backdrop-blur-lg">
        <button onClick={() => navigate(-1)} className="rounded-full p-1.5 active:bg-muted">
          <ChevronLeft className="h-6 w-6 text-foreground" />
        </button>
        <h1 className="text-[17px] font-semibold text-foreground">{content.title}</h1>
      </header>
      <div className="px-5 py-6">
        <div className="space-y-4">
          {content.body.map((p, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-muted-foreground">{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}