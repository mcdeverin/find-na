// Time + sorting helpers for meetings. Timezone-aware: each meeting's next
// occurrence is computed in the meeting's own IANA timezone, then displayed
// in the user's local timezone. No mock data lives here anymore.

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseTimeToParts(t) {
  if (!t) return { h: 0, m: 0 };
  const parts = String(t).split(":").map(Number);
  return { h: parts[0] || 0, m: parts[1] || 0 };
}

const WEEKDAY_MAP = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

function getZonedParts(date, tz) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const o = {};
  for (const p of fmt.formatToParts(date)) o[p.type] = p.value;
  let h = parseInt(o.hour, 10);
  if (h === 24) h = 0;
  return {
    year: parseInt(o.year, 10),
    month: parseInt(o.month, 10) - 1,
    day: parseInt(o.day, 10),
    hour: h,
    minute: parseInt(o.minute, 10),
    weekday: WEEKDAY_MAP[o.weekday],
  };
}

// Convert a wall-clock time in `tz` to a UTC Date (handles DST).
function zonedToUTC(year, month, day, hour, minute, tz) {
  const asUTC = Date.UTC(year, month, day, hour, minute, 0);
  const parts = getZonedParts(new Date(asUTC), tz);
  const tzAsUTC = Date.UTC(parts.year, parts.month, parts.day, parts.hour, parts.minute, 0);
  const offset = asUTC - tzAsUTC;
  return new Date(asUTC + offset);
}

// Next upcoming occurrence of a meeting (UTC Date), relative to `now`.
export function nextOccurrence(meeting, now = new Date()) {
  const tz = meeting.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (meeting.day_of_week == null) return new Date(NaN);
  const cur = getZonedParts(now, tz);
  const { h, m } = parseTimeToParts(meeting.start_time);
  let diff = (meeting.day_of_week - cur.weekday + 7) % 7;
  let occ = zonedToUTC(cur.year, cur.month, cur.day + diff, h, m, tz);
  if (occ <= now) {
    occ = new Date(occ.getTime() + 7 * 86400000);
  }
  return occ;
}

export function formatTime(date) {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function formatTimeRange(meeting, occ) {
  const start = formatTime(occ);
  let end = "";
  if (meeting.end_time) {
    const { h, m } = parseTimeToParts(meeting.end_time);
    const endDate = new Date(occ);
    endDate.setHours(h, m, 0, 0);
    const startMins = parseTimeToParts(meeting.start_time).h * 60 + parseTimeToParts(meeting.start_time).m;
    const endMins = h * 60 + m;
    if (endMins <= startMins) endDate.setDate(endDate.getDate() + 1); // crossed midnight
    end = " – " + formatTime(endDate);
  }
  return start + end;
}

// "Starts in 24 min" when the meeting starts within the next ~90 minutes.
export function startsInLabel(meeting, now = new Date()) {
  const occ = nextOccurrence(meeting, now);
  const diffMin = Math.round((occ - now) / 60000);
  if (diffMin <= 0) return null;
  if (diffMin < 60) return `Starts in ${diffMin} min`;
  if (diffMin < 90) return "Starts in 1 hr";
  return null;
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isSameDay(a, b) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function relativeDayLabel(meeting, now = new Date()) {
  const occ = nextOccurrence(meeting, now);
  const today = startOfDay(now);
  const occDay = startOfDay(occ);
  const dayDiff = Math.round((occDay - today) / 86400000);
  if (dayDiff === 0) return "Today";
  if (dayDiff === 1) return "Tomorrow";
  return DAY_NAMES[meeting.day_of_week] || "";
}

export function sortByNextOccurrence(meetings, now = new Date()) {
  return [...meetings].sort((a, b) => nextOccurrence(a, now) - nextOccurrence(b, now));
}

export function lastConfirmedLabel(meeting, now = new Date()) {
  if (!meeting.last_verified_at) return null;
  const then = new Date(meeting.last_verified_at);
  const days = Math.floor((now - then) / 86400000);
  if (days <= 0) return "Last confirmed today";
  if (days === 1) return "Last confirmed 1 day ago";
  return `Last confirmed ${days} days ago`;
}

export const TIME_OF_DAY = ["Morning", "Afternoon", "Evening", "Late Night"];

// Filter the fetched BMLT meetings for the active view and sort by upcoming
// occurrence. Day/time/attendance/distance/formats are already applied
// server-side; this handles the view-specific upcoming window plus the
// remaining client-side filters (open/closed, wheelchair, language, late night).
export function prepareMeetings(meetings, filters, now = new Date()) {
  const withOcc = [];
  for (const m of meetings) {
    if (m.day_of_week == null) continue;
    const occ = nextOccurrence(m, now);
    if (!(occ > now)) continue; // upcoming only
    if (filters.day === "Today" && !isSameDay(occ, now)) continue;
    if (filters.day === "Tomorrow" && !isSameDay(occ, addDays(now, 1))) continue;
    if (DAY_NAMES.includes(filters.day) && occ.getDay() !== DAY_NAMES.indexOf(filters.day)) continue;
    if (filters.openClosed && filters.openClosed !== "Any" && m.open_closed !== filters.openClosed) continue;
    if (filters.wheelchairOnly && !m.wheelchair_accessible) continue;
    if (filters.language && filters.language !== "Any" && (m.language || "English") !== filters.language) continue;
    if (filters.timeOfDay === "Late Night") {
      const h = occ.getHours();
      if (!(h >= 21 || h < 5)) continue;
    }
    withOcc.push({ m, occ });
  }
  withOcc.sort((a, b) => a.occ - b.occ);
  return withOcc.map((x) => x.m);
}