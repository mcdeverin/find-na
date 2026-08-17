import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MultiFilterDropdown({
  allLabel = "Any",
  options,
  selected,
  onChange,
}) {
  const summary =
    !selected || selected.length === 0
      ? allLabel
      : selected.length <= 2
      ? selected.join(", ")
      : `${selected.length} selected`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            selected && selected.length > 0
              ? "border-accent bg-accent text-accent-foreground"
              : "border-border bg-background text-foreground"
          )}
        >
          {summary}
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[11rem]">
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            onChange([]);
          }}
          className="justify-between"
        >
          <span>{allLabel}</span>
          {(!selected || selected.length === 0) && (
            <Check className="h-4 w-4 text-accent" />
          )}
        </DropdownMenuItem>
        {options.map((opt) => {
          const val = typeof opt === "string" ? opt : opt.value;
          const lbl = typeof opt === "string" ? opt : opt.label;
          const on = selected && selected.includes(val);
          return (
            <DropdownMenuItem
              key={val}
              onSelect={(e) => {
                e.preventDefault();
                onChange(on ? selected.filter((x) => x !== val) : [...selected, val]);
              }}
              className="justify-between"
            >
              <span>{lbl}</span>
              {on && <Check className="h-4 w-4 text-accent" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}