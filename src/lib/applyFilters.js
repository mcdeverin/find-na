import { DAY_NAMES, nextOccurrence, timeOfDay } from "@/lib/meetings";

// Applies the active filter set (from filtersContext) to a list of meetings.
export function applyFilters(meetings, filters, now = new Date()) {
  return meetings.filter((m) => {
    // Day filter
    if (filters.day && filters.day !== "Any Day") {
      const occ = nextOccurrence(m, now);
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);
      const occDay = new Date(occ);
      occDay.setHours(0, 0, 0, 0);
      const dayDiff = Math.round((occDay - today) / 86400000);

      if (filters.day === "Today" && dayDiff !== 0) return false;
      if (filters.day === "Tomorrow" && dayDiff !== 1) return false;
      if (DAY_NAMES.includes(filters.day) && m.day_of_week !== DAY_NAMES.indexOf(filters.day))
        return false;
    }

    // Time of day
    if (filters.timeOfDay && filters.timeOfDay !== "Any Time") {
      if (timeOfDay(m) !== filters.timeOfDay) return false;
    }

    // Attendance
    if (filters.attendance && filters.attendance !== "Any") {
      if (m.attendance_type !== filters.attendance) return false;
    }

    // Open / Closed
    if (filters.openClosed && filters.openClosed !== "Any") {
      if (m.open_closed !== filters.openClosed) return false;
    }

    // Formats (meeting must include all selected)
    if (filters.formats && filters.formats.length > 0) {
      const has = (m.meeting_formats || []).map((f) => f.toLowerCase());
      const ok = filters.formats.every((f) => has.includes(f.toLowerCase()));
      if (!ok) return false;
    }

    // Accessibility
    if (filters.wheelchairOnly && !m.wheelchair_accessible) return false;

    // Language
    if (filters.language && filters.language !== "Any") {
      if ((m.language || "English") !== filters.language) return false;
    }

    // Distance
    if (filters.distance && filters.distance !== "Any") {
      if (m.distance == null || m.distance > filters.distance) return false;
    }

    // Search text
    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      const hay = [m.name, m.venue_name, m.address, m.city, m.state, m.postal_code]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }

    return true;
  });
}