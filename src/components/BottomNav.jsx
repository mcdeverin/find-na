import { NavLink } from "react-router-dom";
import { Users, Video, BookOpen, Heart, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Meetings", icon: Users, end: true },
  { to: "/online", label: "Online", icon: Video },
  { to: "/basic-text", label: "Basic Text", icon: BookOpen },
  { to: "/saved", label: "Saved", icon: Heart },
  { to: "/more", label: "More", icon: MoreHorizontal },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-border bg-background/90 backdrop-blur-lg safe-bottom">
      <div className="flex items-stretch justify-around px-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className="flex flex-1 flex-col items-center gap-1 py-2.5"
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      "h-6 w-6 transition-colors",
                      isActive ? "text-accent" : "text-muted-foreground"
                    )}
                    strokeWidth={isActive ? 2.4 : 2}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-medium tracking-tight transition-colors",
                      isActive ? "text-accent" : "text-muted-foreground"
                    )}
                  >
                    {t.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}