import { BookOpen, ExternalLink, Sunrise, FileText } from "lucide-react";
import ScreenHeader from "@/components/ScreenHeader";

const LITERATURE = [
  { title: "Basic Text", desc: "The primary text of Narcotics Anonymous." },
  { title: "Just for Today", desc: "Daily meditations for people in recovery." },
  { title: "It Works: How and Why", desc: "A look at the principles of recovery." },
  { title: "Sponsorship", desc: "Guidance on sponsorship in NA." },
  { title: "The NA Step Working Guides", desc: "Help working through the Twelve Steps." },
  { title: "Informational Pamphlets", desc: "Introductory and topical NA pamphlets." },
];

const NA_WS = "https://na.org";

export default function BasicText() {
  return (
    <div>
      <ScreenHeader title="Basic Text" subtitle="Read through official NA resources" />

      <div className="space-y-3 px-5 py-4">
        {/* Basic Text feature card */}
        <article className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-accent-soft p-2.5">
              <BookOpen className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
              <h2 className="text-[17px] font-semibold text-foreground">
                Narcotics Anonymous — Basic Text
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Read or access the Basic Text through official NA resources.
              </p>
            </div>
          </div>
          <a
            href={NA_WS}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-accent-foreground transition-opacity active:opacity-80"
          >
            Open Official Resource <ExternalLink className="h-4 w-4" />
          </a>
        </article>

        {/* Just for Today feature card */}
        <article className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-accent-soft p-2.5">
              <Sunrise className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
              <h2 className="text-[17px] font-semibold text-foreground">Just for Today</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Access today's Just for Today meditation through official NA resources.
              </p>
            </div>
          </div>
          <a
            href={`${NA_WS}/daily`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-accent-foreground transition-opacity active:opacity-80"
          >
            Read Today's Meditation <ExternalLink className="h-4 w-4" />
          </a>
        </article>
      </div>

      {/* NA Literature list */}
      <section className="px-5 pb-6">
        <h2 className="px-1 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          NA Literature
        </h2>
        <div className="overflow-hidden rounded-2xl border border-border">
          {LITERATURE.map((l, i) => (
            <a
              key={l.title}
              href={NA_WS}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 border-b border-border bg-card px-4 py-3.5 last:border-b-0 transition-colors active:bg-muted/60"
            >
              <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-medium text-foreground">{l.title}</p>
                <p className="truncate text-xs text-muted-foreground">{l.desc}</p>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground/60" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}