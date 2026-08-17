// Client-side BMLT data layer. Talks to the bmltSearch / bmltGeocode /
// bmltFormats backend functions and builds BMLT query params from the
// app's filter state.
import { base44 } from "@/api/base44Client";
import { DAY_NAMES } from "@/lib/meetings";

export async function searchMeetings(params) {
  const res = await base44.functions.invoke("bmltSearch", params);
  return res.data;
}

export async function geocode(query) {
  const res = await base44.functions.invoke("bmltGeocode", { query });
  return res.data;
}

export async function fetchFormats() {
  const res = await base44.functions.invoke("bmltFormats", {});
  return res.data.formats; // [{ code, name }]
}

export async function fetchMeetingByIds(ids) {
  if (!ids || ids.length === 0) return [];
  const res = await base44.functions.invoke("bmltSearch", { meeting_ids: ids });
  return res.data.meetings;
}

// BMLT weekday: 1=Sunday..7=Saturday. JS getDay: 0=Sunday..6=Saturday.
export function weekdayParam(day, now = new Date()) {
  if (!day || day === "Any Day") return [];
  if (day === "Today") return [now.getDay() + 1];
  if (day === "Tomorrow") return [((now.getDay() + 1) % 7) + 1];
  if (DAY_NAMES.includes(day)) return [DAY_NAMES.indexOf(day) + 1];
  return [];
}

export function venueParam(att) {
  const map = { "In-Person": 1, Online: 2, Hybrid: 3 };
  if (!att || att.length === 0) return [1, 2, 3]; // Any
  return att.map((a) => map[a]).filter(Boolean);
}

// Morning/Afternoon/Evening use BMLT time params; Late Night crosses
// midnight and is filtered client-side instead.
export function timeParam(tod) {
  if (tod === "Morning") return { after: { h: 5, m: 0 }, before: { h: 11, m: 59 } };
  if (tod === "Afternoon") return { after: { h: 12, m: 0 }, before: { h: 16, m: 59 } };
  if (tod === "Evening") return { after: { h: 17, m: 0 }, before: { h: 20, m: 59 } };
  return null;
}

export function buildParams(loc, filters) {
  const p = {};
  if (loc && loc.lat != null && loc.long != null) {
    p.lat = loc.lat;
    p.long = loc.long;
    p.geo_width = filters.distance === "Any" ? 1000 : filters.distance;
  }
  p.weekdays = weekdayParam(filters.day);
  p.venue_types = venueParam(filters.attendance);
  p.formats = filters.formats || [];
  const tp = timeParam(filters.timeOfDay);
  if (tp) {
    p.starts_after = tp.after;
    p.starts_before = tp.before;
  }
  return p;
}