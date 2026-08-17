import { useEffect, useState, useCallback, useRef } from "react";
import { searchMeetings } from "@/lib/bmlt";
import { sortByNextOccurrence } from "@/lib/meetings";
import { useMeetings } from "@/lib/MeetingsContext";

const CACHE_TTL = 10 * 60 * 1000;
const ONLINE_RADIUS = 250; // miles — BMLT requires a geo bound; wide enough
// to surface regional online meetings without a multi-second, multi-MB response.
const DEFAULT_CENTER = { lat: 40.7128, long: -74.006 }; // NYC fallback

// Fetches online + hybrid meetings (venue_types 2 and 3) sorted by next
// occurrence in the user's local timezone. BMLT does not support a locationless
// query, so we search near the user (or a sensible default) with a wide radius.
export function useOnlineMeetings() {
  const { location } = useMeetings();
  const [meetings, setMeetings] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const cache = useRef(null);
  const lastKey = useRef("");

  const locKey =
    location && location.lat != null
      ? `${location.lat},${location.long}`
      : "default";

  const load = useCallback(
    async (key, bypass = false) => {
      if (!bypass && cache.current && cache.current.key === key && Date.now() - cache.current.at < CACHE_TTL) {
        setMeetings(cache.current.meetings);
        setStatus("success");
        return;
      }
      setStatus("loading");
      try {
        const center =
          location && location.lat != null ? location : DEFAULT_CENTER;
        const data = await searchMeetings({
          venue_types: [2, 3],
          lat: center.lat,
          long: center.long,
          geo_width: ONLINE_RADIUS,
        });
        const sorted = sortByNextOccurrence(data.meetings, new Date());
        cache.current = { key, meetings: sorted, at: Date.now() };
        setMeetings(sorted);
        setStatus("success");
        setError(null);
      } catch (e) {
        setError(e?.message || "Failed to load meetings");
        setStatus("error");
      }
    },
    [location]
  );

  useEffect(() => {
    load(locKey);
  }, [locKey, load]);

  return { meetings, status, error, refresh: () => load(locKey, true) };
}