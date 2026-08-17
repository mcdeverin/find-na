// Shared BMLT Aggregator helpers used by the bmltSearch / bmltGeocode /
// bmltFormats backend functions. Read-only public API, no auth required.

const BMLT_BASE = "https://aggregator.bmltenabled.org/main_server";
const NOMINATIM = "https://nominatim.openstreetmap.org";

// In-memory format cache (per Worker instance). Formats rarely change.
let formatCache = { data: null as any, at: 0 };
const FORMAT_TTL = 24 * 60 * 60 * 1000;

export async function fetchFormats() {
  if (formatCache.data && Date.now() - formatCache.at < FORMAT_TTL) {
    return formatCache.data;
  }
  const url = `${BMLT_BASE}/client_interface/json/?switcher=GetFormats`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`BMLT formats returned ${res.status}`);
  const data = await res.json();
  formatCache = { data, at: Date.now() };
  return data;
}

export function buildFormatMap(formatsArr: any[]) {
  const map: Record<string, { name: string; lang: string }> = {};
  for (const f of formatsArr || []) {
    const code = String(f.key_string || f.format_id || "");
    if (!code) continue;
    map[code] = { name: f.name_string || code, lang: f.lang || "" };
  }
  return map;
}

// Curated, human-readable format list actually present in the BMLT data.
// Used by the Filters sheet. Returns [{ code, name }].
const CURATED_FORMATS: { match: string[]; name: string }[] = [
  { match: ["open"], name: "Open" },
  { match: ["closed"], name: "Closed" },
  { match: ["speaker"], name: "Speaker" },
  { match: ["basic text"], name: "Basic Text" },
  { match: ["beginner", "newcomer"], name: "Beginners" },
  { match: ["step"], name: "Step Study" },
  { match: ["literature"], name: "Literature" },
  { match: ["tradition"], name: "Traditions" },
  { match: ["women"], name: "Women" },
  { match: ["men"], name: "Men" },
  { match: ["young people", "young peoples", "yp"], name: "Young People" },
  { match: ["lgbt"], name: "LGBTQ+" },
  { match: ["wheelchair"], name: "Wheelchair Accessible" },
  { match: ["discussion"], name: "Discussion" },
  { match: ["meditation"], name: "Meditation" },
  { match: ["candlelight"], name: "Candlelight" },
  { match: ["spanish"], name: "Spanish" },
  { match: ["asl", "sign language"], name: "ASL" },
];

export function curatedFormats(formatsArr: any[]) {
  const map = buildFormatMap(formatsArr);
  const byName: Record<string, { code: string; name: string }> = {};
  for (const [code, info] of Object.entries(map)) {
    const nm = (info.name || "").toLowerCase();
    for (const c of CURATED_FORMATS) {
      if (c.match.some((m) => nm.includes(m))) {
        if (!byName[c.name]) byName[c.name] = { code, name: c.name };
        break;
      }
    }
  }
  return Object.values(byName).sort((a, b) => a.name.localeCompare(b.name));
}

function num(v: any): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
}

export function normalizeMeeting(raw: any, formatMap: Record<string, { name: string; lang: string }>) {
  const formatsRaw = String(raw.formats || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const fmtNames = formatsRaw.map((c) => formatMap[c]?.name).filter(Boolean);

  const vt = raw.venue_type != null ? String(raw.venue_type) : "";
  let attendance = "In-Person";
  if (vt === "2") attendance = "Online";
  else if (vt === "3") attendance = "Hybrid";
  else if (!vt && raw.virtual_meeting_link) attendance = "Online";

  let openClosed: string | null = null;
  let wheelchair = false;
  let spanish = false;
  for (const c of formatsRaw) {
    const nm = (formatMap[c]?.name || c).toLowerCase();
    if (nm === "open" || nm.includes("open meeting")) openClosed = "Open";
    else if (nm === "closed" || nm.includes("closed meeting")) openClosed = "Closed";
    if (nm.includes("wheelchair") || c === "W" || c === "WA") wheelchair = true;
    if (nm.includes("spanish")) spanish = true;
  }

  const vurl = raw.virtual_meeting_link || "";
  let platform = "";
  try {
    const h = new URL(vurl).hostname.toLowerCase();
    if (h.includes("zoom")) platform = "Zoom";
    else if (h.includes("meet.google")) platform = "Google Meet";
    else if (h.includes("teams")) platform = "Microsoft Teams";
    else if (h.includes("skype")) platform = "Skype";
    else if (h.includes("discord")) platform = "Discord";
    else platform = h;
  } catch {
    platform = "";
  }

  // BMLT weekday_tinyint: 1=Sunday..7=Saturday -> JS 0=Sunday..6=Saturday
  const dow =
    raw.weekday_tinyint != null && raw.weekday_tinyint !== ""
      ? Number(raw.weekday_tinyint) - 1
      : null;

  const start = String(raw.start_time || "").slice(0, 5); // HH:mm

  let end = "";
  if (raw.duration_time) {
    const [dh, dm] = String(raw.duration_time).split(":").map(Number);
    const [sh, sm] = String(raw.start_time || "0:0").split(":").map(Number);
    let mins = (sh * 60 + sm || 0) + (dh * 60 + dm || 0);
    mins = ((mins % 1440) + 1440) % 1440;
    end = `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
  }

  const dist =
    raw.distance_in_miles != null && raw.distance_in_miles !== ""
      ? num(raw.distance_in_miles)
      : raw.distance_in_km != null && raw.distance_in_km !== ""
      ? num(raw.distance_in_km) * 0.621371
      : null;

  return {
    id: String(raw.id_bigint || raw.id || raw.meeting_id || ""),
    external_id: String(raw.id_bigint || raw.id || ""),
    source: "BMLT Aggregator",
    source_system: "bmlt",
    name: raw.meeting_name || "NA Meeting",
    day_of_week: dow,
    start_time: start,
    end_time: end,
    timezone: raw.time_zone || "America/New_York",
    attendance_type: attendance,
    meeting_formats: fmtNames,
    open_closed: openClosed,
    venue_name: raw.location_text || "",
    address: raw.location_street || "",
    city: raw.location_municipality || "",
    state: raw.location_province || "",
    postal_code: raw.location_postal_code_1 || "",
    country: raw.location_nation || "",
    latitude: num(raw.latitude),
    longitude: num(raw.longitude),
    distance: dist,
    virtual_url: vurl,
    virtual_platform: platform,
    phone: raw.phone_meeting_number || "",
    language: spanish ? "Spanish" : "English",
    wheelchair_accessible: wheelchair,
    comments: raw.comments || "",
    service_body_id: raw.service_body_bigint || "",
    verification_status: "Official Source",
    last_verified_at: null,
  };
}

export async function searchMeetings(params: any) {
  const {
    lat,
    long,
    geo_width,
    weekdays,
    venue_types,
    formats,
    starts_after,
    starts_before,
    meeting_ids,
  } = params || {};

  const u = new URL(`${BMLT_BASE}/client_interface/json/?switcher=GetSearchResults`);
  if (lat != null && long != null) {
    u.searchParams.set("lat_val", String(lat));
    u.searchParams.set("long_val", String(long));
    if (geo_width != null && geo_width !== "Any") {
      u.searchParams.set("geo_width", String(geo_width));
    }
  }
  if (weekdays && weekdays.length) {
    weekdays.forEach((w: number) => u.searchParams.append("weekdays[]", String(w)));
  }
  if (venue_types && venue_types.length) {
    venue_types.forEach((v: number) => u.searchParams.append("venue_types[]", String(v)));
  }
  if (formats && formats.length) {
    formats.forEach((f: string) => u.searchParams.append("formats[]", String(f)));
  }
  if (starts_after) {
    u.searchParams.set("StartsAfterH", String(starts_after.h));
    u.searchParams.set("StartsAfterM", String(starts_after.m));
  }
  if (starts_before) {
    u.searchParams.set("StartsBeforeH", String(starts_before.h));
    u.searchParams.set("StartsBeforeM", String(starts_before.m));
  }
  if (meeting_ids && meeting_ids.length) {
    meeting_ids.forEach((id: string) => u.searchParams.append("meeting_ids[]", String(id)));
  }

  const res = await fetch(u.toString(), { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`BMLT search returned ${res.status}`);
  const data = await res.json();
  const formatMap = buildFormatMap(await fetchFormats());
  const meetings = (Array.isArray(data) ? data : []).map((r: any) =>
    normalizeMeeting(r, formatMap)
  );
  return { meetings, location: lat != null ? { lat, long } : null };
}

export async function geocode(query: string) {
  const u = new URL(`${NOMINATIM}/search`);
  u.searchParams.set("q", query);
  u.searchParams.set("format", "json");
  u.searchParams.set("limit", "1");
  u.searchParams.set("addressdetails", "0");
  const res = await fetch(u.toString(), {
    headers: { Accept: "application/json", "User-Agent": "FindNA/1.0" },
  });
  if (!res.ok) throw new Error(`Geocode returned ${res.status}`);
  const data = await res.json();
  if (!data || !data.length) throw new Error("Location not found");
  return {
    lat: parseFloat(data[0].lat),
    long: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  };
}