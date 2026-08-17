import { useNavigate } from "react-router-dom";
import { ChevronLeft, Info } from "lucide-react";

export default function About() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex items-center gap-2 bg-background/90 px-3 py-3 backdrop-blur-lg">
        <button onClick={() => navigate(-1)} className="rounded-full p-1.5 active:bg-muted">
          <ChevronLeft className="h-6 w-6 text-foreground" />
        </button>
        <h1 className="text-[17px] font-semibold text-foreground">About Find NA</h1>
      </header>
      <div className="px-5 py-6">
        <div className="flex items-center gap-2">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Find <span className="text-accent">NA</span>
          </h2>
        </div>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          Find NA is an independent meeting-discovery tool built to help people
          quickly find a Narcotics Anonymous meeting they can attend — in person
          or online.
        </p>

        <div className="mt-5 flex gap-3 rounded-2xl border border-border bg-accent-soft/50 p-4">
          <Info className="h-5 w-5 shrink-0 text-accent" />
          <p className="text-sm leading-relaxed text-foreground">
            Find NA is an independent meeting-discovery tool and is not
            affiliated with, endorsed by, or officially recognized by Narcotics
            Anonymous World Services. All trademarks and NA literature belong to
            their respective rights holders.
          </p>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          Meeting information is contributed by local NA service bodies and
          community members, and is reviewed before being shown as verified. We
          do not require an account to search, get directions, or join a meeting.
        </p>
      </div>
    </div>
  );
}