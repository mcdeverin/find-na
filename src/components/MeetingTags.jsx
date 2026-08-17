import { cn } from "@/lib/utils";

const STYLE =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium";

export default function MeetingTags({ tags, className }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {tags.map((t) => (
        <span
          key={t}
          className={cn(
            STYLE,
            "border-accent/25 bg-accent-soft text-accent"
          )}
        >
          {t}
        </span>
      ))}
    </div>
  );
}