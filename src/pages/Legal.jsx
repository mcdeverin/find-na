import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const CONTENT = {
  privacy: {
    title: "Privacy Policy",
    sections: [
      {
        paragraphs: [
          "Find NA is an independent app designed to help users locate Narcotics Anonymous meetings and access recovery resources. Find NA does not require an account to search for meetings, get directions, or join an online meeting.",
        ],
      },
      {
        heading: "Location & Search Information",
        paragraphs: [
          "If you choose to allow location access, Find NA uses your device's location to find meetings near you while you are using the app. If you do not share your location, you can search using a city, state, ZIP code, or other location instead.",
          "Location and search information may be sent to third-party services used to retrieve meeting information and provide app functionality. Find NA does not use this information to create a personal profile or for advertising.",
        ],
      },
      {
        heading: "Meeting Information",
        paragraphs: [
          "Meeting information is obtained from third-party NA service resources, including BMLT (Basic Meeting List Toolbox). Meeting details may change, and Find NA cannot guarantee the accuracy or availability of individual meeting listings.",
        ],
      },
      {
        heading: "Saved Meetings",
        paragraphs: [
          "Meetings you save are stored locally on your device and are not uploaded to a Find NA account.",
        ],
      },
      {
        heading: "Meeting Feedback",
        paragraphs: [
          "If you submit a meeting confirmation, correction, or update suggestion, the information you submit may be used to review and improve meeting information. Submissions are anonymous unless you voluntarily provide contact information.",
          "If you provide contact information, it will only be used when necessary to follow up about your submission and will not be displayed publicly.",
        ],
      },
      {
        heading: "Analytics",
        paragraphs: [
          "Find NA may collect limited usage information, such as which screens or features are used, to understand how the app is used and improve its functionality. This analytics information does not include your meeting searches or precise location.",
        ],
      },
      {
        heading: "Third-Party Services",
        paragraphs: [
          "Find NA relies on third-party services to provide certain functionality, including meeting data and map functionality. When these services are accessed, they may receive technical information ordinarily transmitted when communicating with an internet service, such as your IP address.",
        ],
      },
      {
        heading: "Data Sales & Advertising",
        paragraphs: [
          "Find NA does not sell your personal information and does not use your information for targeted advertising.",
        ],
      },
      {
        heading: "Children's Privacy",
        paragraphs: [
          "Find NA does not knowingly collect personal information from children.",
        ],
      },
      {
        heading: "Independence",
        paragraphs: [
          "Find NA is an independent app and is not affiliated with, endorsed by, sponsored by, or produced by Narcotics Anonymous World Services, Inc. “Narcotics Anonymous” and “NA” are trademarks of Narcotics Anonymous World Services, Inc.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: [
          "Questions about this Privacy Policy or Find NA's privacy practices can be sent to:",
          "Work OnDeck LLC",
          "support@workondeck.com",
          "Last updated: August 17, 2026",
        ],
      },
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
        {content.sections ? (
          <div className="space-y-6">
            {content.sections.map((s, i) => (
              <section key={i} className="space-y-2">
                {s.heading && (
                  <h2 className="text-[15px] font-semibold text-foreground">{s.heading}</h2>
                )}
                <div className="space-y-3">
                  {s.paragraphs.map((p, j) => (
                    <p key={j} className="text-[15px] leading-relaxed text-muted-foreground">{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {content.body.map((p, i) => (
              <p key={i} className="text-[15px] leading-relaxed text-muted-foreground">{p}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}