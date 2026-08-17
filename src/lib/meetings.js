// Realistic mock NA meeting data + helpers.
// Structured to mirror the Meeting entity so it can later be swapped for a
// real source (e.g. BMLT) without touching the UI.

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const mockMeetings = [
  {
    id: "m1",
    name: "Just for Today",
    day_of_week: 1, // Monday
    start_time: "19:00",
    end_time: "20:00",
    timezone: "America/New_York",
    attendance_type: "In-Person",
    meeting_formats: ["Open", "Discussion", "Basic Text"],
    open_closed: "Open",
    venue_name: "First Presbyterian Church",
    address: "320 North Main Street",
    city: "Hightstown",
    state: "NJ",
    postal_code: "08520",
    country: "US",
    latitude: 40.2669,
    longitude: -74.5213,
    distance: 2.4,
    language: "English",
    wheelchair_accessible: true,
    source: "New Jersey Region NA",
    source_url: "https://www.njna.org",
    last_verified_at: "2026-08-11T00:00:00Z",
    verification_status: "Official Source",
  },
  {
    id: "m2",
    name: "Living Clean",
    day_of_week: 1,
    start_time: "20:30",
    end_time: "21:30",
    timezone: "America/New_York",
    attendance_type: "Online",
    meeting_formats: ["Open", "Speaker", "Literature Study"],
    open_closed: "Open",
    venue_name: "Zoom Meeting",
    language: "English",
    virtual_url: "https://zoom.us/j/1234567890",
    virtual_platform: "Zoom",
    phone: "+1-301-715-8592,,1234567890#",
    distance: null,
    wheelchair_accessible: true,
    source: "Never Alone Online Group",
    source_url: "https://neveralone-na.org",
    last_verified_at: "2026-08-15T00:00:00Z",
    verification_status: "Community Verified",
  },
  {
    id: "m3",
    name: "Never Alone",
    day_of_week: 1,
    start_time: "22:15",
    end_time: "23:15",
    timezone: "America/New_York",
    attendance_type: "Online",
    meeting_formats: ["Open", "Discussion", "Young People"],
    open_closed: "Open",
    venue_name: "Online Meeting",
    language: "English",
    virtual_url: "https://meet.google.com/abc-defg-hij",
    virtual_platform: "Google Meet",
    distance: null,
    wheelchair_accessible: true,
    source: "Never Alone Online Group",
    source_url: "https://neveralone-na.org",
    last_verified_at: "2026-08-16T00:00:00Z",
    verification_status: "Community Verified",
  },
  {
    id: "m4",
    name: "Serenity Seekers",
    day_of_week: 2, // Tuesday
    start_time: "18:30",
    end_time: "19:30",
    timezone: "America/New_York",
    attendance_type: "Hybrid",
    meeting_formats: ["Open", "Discussion", "Beginners"],
    open_closed: "Open",
    venue_name: "St. Mary's Community Hall",
    address: "45 Maple Avenue",
    city: "Princeton",
    state: "NJ",
    postal_code: "08540",
    country: "US",
    latitude: 40.3573,
    longitude: -74.6672,
    distance: 6.1,
    language: "English",
    virtual_url: "https://zoom.us/j/9988776655",
    virtual_platform: "Zoom",
    wheelchair_accessible: true,
    source: "New Jersey Region NA",
    source_url: "https://www.njna.org",
    last_verified_at: "2026-08-09T00:00:00Z",
    verification_status: "Official Source",
  },
  {
    id: "m5",
    name: "Women in Recovery",
    day_of_week: 2,
    start_time: "20:00",
    end_time: "21:00",
    timezone: "America/New_York",
    attendance_type: "In-Person",
    meeting_formats: ["Closed", "Discussion", "Women"],
    open_closed: "Closed",
    venue_name: "Unity Fellowship Hall",
    address: "12 Church Street",
    city: "Trenton",
    state: "NJ",
    postal_code: "08608",
    country: "US",
    latitude: 40.2171,
    longitude: -74.7429,
    distance: 8.8,
    language: "English",
    wheelchair_accessible: false,
    source: "Greater Trenton Area NA",
    source_url: "https://trentonna.org",
    last_verified_at: "2026-08-14T00:00:00Z",
    verification_status: "Official Source",
  },
  {
    id: "m6",
    name: "Miracles Happen",
    day_of_week: 3, // Wednesday
    start_time: "12:00",
    end_time: "13:00",
    timezone: "America/New_York",
    attendance_type: "In-Person",
    meeting_formats: ["Open", "Speaker", "Basic Text"],
    open_closed: "Open",
    venue_name: "Community Center",
    address: "88 Broad Street",
    city: "Freehold",
    state: "NJ",
    postal_code: "07728",
    country: "US",
    latitude: 40.2601,
    longitude: -74.2940,
    distance: 14.2,
    language: "English",
    wheelchair_accessible: true,
    source: "New Jersey Region NA",
    source_url: "https://www.njna.org",
    last_verified_at: "2026-08-10T00:00:00Z",
    verification_status: "Official Source",
  },
  {
    id: "m7",
    name: "Recovery en Español",
    day_of_week: 3,
    start_time: "19:30",
    end_time: "20:30",
    timezone: "America/New_York",
    attendance_type: "Hybrid",
    meeting_formats: ["Open", "Discussion", "Beginners"],
    open_closed: "Open",
    venue_name: "Centro Comunitario",
    address: "150 Park Avenue",
    city: "New Brunswick",
    state: "NJ",
    postal_code: "08901",
    country: "US",
    latitude: 40.4862,
    longitude: -74.4518,
    distance: 11.5,
    language: "Spanish",
    virtual_url: "https://zoom.us/j/4455667788",
    virtual_platform: "Zoom",
    wheelchair_accessible: true,
    source: "New Jersey Region NA",
    source_url: "https://www.njna.org",
    last_verified_at: "2026-08-13T00:00:00Z",
    verification_status: "Official Source",
  },
  {
    id: "m8",
    name: "Step Into Recovery",
    day_of_week: 4, // Thursday
    start_time: "19:00",
    end_time: "20:00",
    timezone: "America/New_York",
    attendance_type: "In-Person",
    meeting_formats: ["Open", "Step Study", "Discussion"],
    open_closed: "Open",
    venue_name: "Grace Lutheran Church",
    address: "23 Hamilton Street",
    city: "Somerville",
    state: "NJ",
    postal_code: "08876",
    country: "US",
    latitude: 40.5742,
    longitude: -74.6099,
    distance: 19.7,
    language: "English",
    wheelchair_accessible: true,
    source: "New Jersey Region NA",
    source_url: "https://www.njna.org",
    last_verified_at: "2026-08-08T00:00:00Z",
    verification_status: "Official Source",
  },
  {
    id: "m9",
    name: "LGBTQ+ Recovery Group",
    day_of_week: 4,
    start_time: "21:00",
    end_time: "22:00",
    timezone: "America/New_York",
    attendance_type: "Online",
    meeting_formats: ["Open", "Discussion", "LGBTQ+"],
    open_closed: "Open",
    venue_name: "Online Meeting",
    language: "English",
    virtual_url: "https://zoom.us/j/3344556677",
    virtual_platform: "Zoom",
    distance: null,
    wheelchair_accessible: true,
    source: "Community Submitted",
    last_verified_at: null,
    verification_status: "Community Submitted",
  },
  {
    id: "m10",
    name: "Men's Journey",
    day_of_week: 5, // Friday
    start_time: "18:00",
    end_time: "19:00",
    timezone: "America/New_York",
    attendance_type: "In-Person",
    meeting_formats: ["Closed", "Discussion", "Men"],
    open_closed: "Closed",
    venue_name: "VFW Post 217",
    address: "44 Veterans Way",
    city: "Hightstown",
    state: "NJ",
    postal_code: "08520",
    country: "US",
    latitude: 40.2701,
    longitude: -74.5301,
    distance: 2.9,
    language: "English",
    wheelchair_accessible: false,
    source: "New Jersey Region NA",
    source_url: "https://www.njna.org",
    last_verified_at: "2026-08-12T00:00:00Z",
    verification_status: "Official Source",
  },
  {
    id: "m11",
    name: "Freedom Group",
    day_of_week: 6, // Saturday
    start_time: "10:00",
    end_time: "11:00",
    timezone: "America/New_York",
    attendance_type: "In-Person",
    meeting_formats: ["Open", "Speaker", "Basic Text"],
    open_closed: "Open",
    venue_name: "First Methodist Church",
    address: "5 Pennington Avenue",
    city: "Trenton",
    state: "NJ",
    postal_code: "08618",
    country: "US",
    latitude: 40.2488,
    longitude: -74.7640,
    distance: 9.3,
    language: "English",
    wheelchair_accessible: true,
    source: "Greater Trenton Area NA",
    source_url: "https://trentonna.org",
    last_verified_at: "2026-08-15T00:00:00Z",
    verification_status: "Official Source",
  },
  {
    id: "m12",
    name: "Sunrise Recovery",
    day_of_week: 0, // Sunday
    start_time: "08:30",
    end_time: "09:30",
    timezone: "America/New_York",
    attendance_type: "In-Person",
    meeting_formats: ["Open", "Discussion", "Beginners"],
    open_closed: "Open",
    venue_name: "Community Chapel",
    address: "9 Ridge Road",
    city: "Princeton",
    state: "NJ",
    postal_code: "08540",
    country: "US",
    latitude: 40.3501,
    longitude: -74.6601,
    distance: 6.4,
    language: "English",
    wheelchair_accessible: true,
    source: "New Jersey Region NA",
    source_url: "https://www.njna.org",
    last_verified_at: "2026-08-07T00:00:00Z",
    verification_status: "Official Source",
  },
  {
    id: "m13",
    name: "Hope Alive",
    day_of_week: 0,
    start_time: "19:00",
    end_time: "20:00",
    timezone: "America/New_York",
    attendance_type: "Hybrid",
    meeting_formats: ["Open", "Speaker", "Literature Study"],
    open_closed: "Open",
    venue_name: "St. Andrew's Church",
    address: "50 River Road",
    city: "Hightstown",
    state: "NJ",
    postal_code: "08520",
    country: "US",
    latitude: 40.2655,
    longitude: -74.5190,
    distance: 2.1,
    language: "English",
    virtual_url: "https://zoom.us/j/7788990011",
    virtual_platform: "Zoom",
    wheelchair_accessible: true,
    source: "New Jersey Region NA",
    source_url: "https://www.njna.org",
    last_verified_at: "2026-08-16T00:00:00Z",
    verification_status: "Community Verified",
  },
  {
    id: "m14",
    name: "Late Night Lights",
    day_of_week: 1,
    start_time: "23:30",
    end_time: "00:30",
    timezone: "America/New_York",
    attendance_type: "Online",
    meeting_formats: ["Open", "Discussion"],
    open_closed: "Open",
    venue_name: "Online Meeting",
    language: "English",
    virtual_url: "https://zoom.us/j/2233445566",
    virtual_platform: "Zoom",
    distance: null,
    wheelchair_accessible: true,
    source: "Never Alone Online Group",
    source_url: "https://neveralone-na.org",
    last_verified_at: "2026-08-16T00:00:00Z",
    verification_status: "Community Verified",
  },
  {
    id: "m15",
    name: "Traditions Study",
    day_of_week: 2,
    start_time: "17:30",
    end_time: "18:30",
    timezone: "America/New_York",
    attendance_type: "In-Person",
    meeting_formats: ["Open", "Traditions", "Literature Study"],
    open_closed: "Open",
    venue_name: "Public Library Annex",
    address: "110 Main Street",
    city: "Freehold",
    state: "NJ",
    postal_code: "07728",
    country: "US",
    latitude: 40.2610,
    longitude: -74.2960,
    distance: 14.0,
    language: "English",
    wheelchair_accessible: true,
    source: "New Jersey Region NA",
    source_url: "https://www.njna.org",
    last_verified_at: "2026-08-06T00:00:00Z",
    verification_status: "Official Source",
  },
  {
    id: "m16",
    name: "Newcomers Welcome",
    day_of_week: 0,
    start_time: "16:00",
    end_time: "17:00",
    timezone: "America/New_York",
    attendance_type: "In-Person",
    meeting_formats: ["Open", "Beginners", "Discussion"],
    open_closed: "Open",
    venue_name: "Recovery Community Center",
    address: "200 Hope Lane",
    city: "New Brunswick",
    state: "NJ",
    postal_code: "08901",
    country: "US",
    latitude: 40.4870,
    longitude: -74.4500,
    distance: 11.8,
    language: "English",
    wheelchair_accessible: true,
    source: "Community Submitted",
    last_verified_at: null,
    verification_status: "Community Submitted",
  },
];

// ---- Time helpers -------------------------------------------------------

function parseTimeToParts(t) {
  const [h, m] = t.split(":").map(Number);
  return { h, m };
}

// Returns the next Date a meeting occurs, relative to `now`.
export function nextOccurrence(meeting, now = new Date()) {
  const tz = meeting.timezone || "America/New_York";
  const today = new Date(now);
  let diff = (meeting.day_of_week - today.getDay() + 7) % 7;
  // Build a date in the meeting's local timezone using a simple offset approach.
  // For the prototype this approximation is sufficient.
  const target = new Date(today);
  target.setDate(today.getDate() + diff);
  const { h, m } = parseTimeToParts(meeting.start_time);
  target.setHours(h, m, 0, 0);
  if (target <= now) {
    // already passed today (or same weekday in past) -> next week
    target.setDate(target.getDate() + 7);
  }
  return target;
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
    if (meeting.end_time === "00:30") endDate.setDate(endDate.getDate() + 1);
    end = " – " + formatTime(endDate);
  }
  return start + end;
}

// "Starts in 24 min" when the meeting starts within the next 90 minutes.
export function startsInLabel(meeting, now = new Date()) {
  const occ = nextOccurrence(meeting, now);
  const diffMin = Math.round((occ - now) / 60000);
  if (diffMin <= 0) return null;
  if (diffMin < 60) return `Starts in ${diffMin} min`;
  if (diffMin < 90) return `Starts in 1 hr`;
  return null;
}

export function relativeDayLabel(meeting, now = new Date()) {
  const occ = nextOccurrence(meeting, now);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const occDay = new Date(occ);
  occDay.setHours(0, 0, 0, 0);
  const dayDiff = Math.round((occDay - today) / 86400000);
  if (dayDiff === 0) return "Today";
  if (dayDiff === 1) return "Tomorrow";
  return DAY_NAMES[meeting.day_of_week];
}

export function sortByNextOccurrence(meetings, now = new Date()) {
  return [...meetings].sort((a, b) => nextOccurrence(a, now) - nextOccurrence(b, now));
}

// "Last confirmed 6 days ago"
export function lastConfirmedLabel(meeting, now = new Date()) {
  if (!meeting.last_verified_at) return null;
  const then = new Date(meeting.last_verified_at);
  const days = Math.floor((now - then) / 86400000);
  if (days <= 0) return "Last confirmed today";
  if (days === 1) return "Last confirmed 1 day ago";
  return `Last confirmed ${days} days ago`;
}

export function getMeetingById(id) {
  return mockMeetings.find((m) => m.id === id);
}

export const TIME_OF_DAY = ["Morning", "Afternoon", "Evening", "Late Night"];

export function timeOfDay(meeting) {
  const { h } = parseTimeToParts(meeting.start_time);
  if (h < 12) return "Morning";
  if (h < 17) return "Afternoon";
  if (h < 21) return "Evening";
  return "Late Night";
}