import { cn } from "@/lib/utils";

export default function ScreenHeader({ title, subtitle, right }) {
  return (
    <header className="sticky top-0 z-30 bg-background/90 px-5 pb-3 pt-6 backdrop-blur-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-[26px] font-semibold leading-tight tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    </header>
  );
}