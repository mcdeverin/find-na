import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useFilters } from "@/lib/filtersContext";
import { searchMeetings, geocode, buildParams } from "@/lib/bmlt";

const CACHE_TTL = 10 * 60 * 1000;
const Ctx = createContext(null);

export function MeetingsProvider({ children }) {
  const { filters } = useFilters();
  const [location, setLocation] = useState(null); // { lat, long, label }
  const [meetings, setMeetings] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | locating | loading | success | error | denied
  const [error, setError] = useState(null);
  const cache = useRef({});
  const locRequested = useRef(false);

  const fetchKey = JSON.stringify({
    lat: location?.lat,
    long: location?.long,
    day: filters.day,
    att: filters.attendance,
    dist: filters.distance,
    tod: filters.timeOfDay,
    fmts: filters.formats,
  });

  const runSearch = useCallback(
    async (loc, bypass = false) => {
      const key = JSON.stringify({
        lat: loc?.lat,
        long: loc?.long,
        day: filters.day,
        att: filters.attendance,
        dist: filters.distance,
        tod: filters.timeOfDay,
        fmts: filters.formats,
      });
      if (!bypass && cache.current[key] && Date.now() - cache.current[key].at < CACHE_TTL) {
        const c = cache.current[key];
        setMeetings(c.meetings);
        setStatus("success");
        setError(null);
        return;
      }
      setStatus("loading");
      try {
        const params = buildParams(loc, filters);
        const data = await searchMeetings(params);
        cache.current[key] = { meetings: data.meetings, at: Date.now() };
        setMeetings(data.meetings);
        setStatus("success");
        setError(null);
      } catch (e) {
        setError(e?.message || "Failed to load meetings");
        setStatus("error");
      }
    },
    [filters]
  );

  // Request geolocation once on mount.
  useEffect(() => {
    if (locRequested.current) return;
    locRequested.current = true;
    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          long: pos.coords.longitude,
          label: "Current Location",
        });
      },
      () => setStatus("denied"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  // Re-fetch when location or the server-side filter set changes.
  useEffect(() => {
    if (!location) return;
    runSearch(location);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchKey]);

  const useCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          long: pos.coords.longitude,
          label: "Current Location",
        });
      },
      () => setStatus("denied"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  const searchByLocation = useCallback(async (query) => {
    if (!query || !query.trim()) return;
    setStatus("loading");
    try {
      const g = await geocode(query.trim());
      setLocation({ lat: g.lat, long: g.long, label: g.displayName });
    } catch {
      setError("Couldn't find that location. Try another city, state, or ZIP.");
      setStatus("error");
    }
  }, []);

  const refresh = useCallback(() => {
    if (location) runSearch(location, true);
  }, [location, runSearch]);

  const getMeetingById = useCallback(
    (id) => meetings.find((m) => m.id === id) || null,
    [meetings]
  );

  return (
    <Ctx.Provider
      value={{
        meetings,
        status,
        error,
        location,
        refresh,
        useCurrentLocation,
        searchByLocation,
        getMeetingById,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useMeetings() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMeetings must be used within MeetingsProvider");
  return ctx;
}