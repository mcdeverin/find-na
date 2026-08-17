import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { List, Navigation, Video, X } from "lucide-react";
import { useMeetings } from "@/lib/MeetingsContext";
import { useFilters } from "@/lib/filtersContext";
import {
  prepareMeetingOccurrences,
  nextOccurrence,
  formatTime,
  relativeDayLabel,
} from "@/lib/meetings";

// Generic teal pin (NOT the NA logo).
const pinIcon = L.divIcon({
  className: "",
  html: `<span style="display:block;width:26px;height:26px;border-radius:50% 50% 50% 0;background:hsl(178 42% 28%);transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.3)"></span>`,
  iconSize: [26, 26],
  iconAnchor: [13, 26],
});

const userIcon = L.divIcon({
  className: "",
  html: `<span style="display:block;width:16px;height:16px;border-radius:50%;background:#2f6df6;border:3px solid #fff;box-shadow:0 0 0 4px rgba(47,109,246,.25)"></span>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function clusterIcon(count) {
  return L.divIcon({
    className: "",
    html: `<span style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:hsl(178 42% 28%);color:#fff;font-size:13px;font-weight:700;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.3)">${count}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

function clusterPoints(points, zoom) {
  const step = 6 / Math.pow(2, zoom); // degrees; coarser when zoomed out
  const groups = {};
  for (const p of points) {
    const key = `${Math.round(p.latitude / step)}_${Math.round(p.longitude / step)}`;
    (groups[key] ||= []).push(p);
  }
  return Object.values(groups).map((g) => {
    if (g.length === 1) return { type: "single", meeting: g[0] };
    const lat = g.reduce((s, p) => s + p.latitude, 0) / g.length;
    const lng = g.reduce((s, p) => s + p.longitude, 0) / g.length;
    return { type: "cluster", count: g.length, meetings: g, lat, lng };
  });
}

function MapContent({ points, userPos, selected, onSelect }) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  useMapEvents({ zoomend: () => setZoom(map.getZoom()) });
  const clusters = useMemo(() => clusterPoints(points, zoom), [points, zoom]);

  return (
    <>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap"
      />
      {userPos && <Marker position={userPos} icon={userIcon} />}
      {clusters.map((c, i) =>
        c.type === "single" ? (
          <Marker
            key={c.meeting.id}
            position={[c.meeting.latitude, c.meeting.longitude]}
            icon={pinIcon}
            eventHandlers={{ click: () => onSelect(c.meeting) }}
          />
        ) : (
          <Marker
            key={`c${i}`}
            position={[c.lat, c.lng]}
            icon={clusterIcon(c.count)}
            eventHandlers={{
              click: () => {
                map.setView([c.lat, c.lng], Math.min(map.getZoom() + 2, 16));
              },
            }}
          />
        )
      )}
    </>
  );
}

function Recenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 11);
  }, [center, map]);
  return null;
}

export default function MapView() {
  const navigate = useNavigate();
  const { filters } = useFilters();
  const { meetings, location } = useMeetings();
  const now = new Date();
  const [selected, setSelected] = useState(null);

  const prepared = useMemo(
    () => prepareMeetingOccurrences(meetings, filters, now),
    [meetings, filters]
  );
  const points = useMemo(
    () => prepared.filter((o) => o.meeting.latitude && o.meeting.longitude).map((o) => o.meeting),
    [prepared]
  );
  // Resolved occurrence per meeting, so an earlier-today meeting still reads
  // "Today" in the sheet instead of jumping to next week's date.
  const occById = useMemo(
    () => new Map(prepared.map((o) => [o.meeting.id, o.occ])),
    [prepared]
  );
  const selectedOcc = selected ? occById.get(selected.id) || nextOccurrence(selected, now) : null;

  const userPos = location?.lat != null ? [location.lat, location.long] : null;
  const center = points[0]
    ? [points[0].latitude, points[0].longitude]
    : userPos || [40.3573, -74.6672];

  return (
    <div className="relative h-screen w-full">
      {/* top controls */}
      <div className="absolute left-0 right-0 top-0 z-[500] bg-background/90 px-4 pb-3 pt-4 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-[17px] font-semibold text-foreground">Map</h1>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground active:bg-muted"
          >
            <List className="h-4 w-4" /> List
          </button>
        </div>
      </div>

      <MapContainer center={center} zoom={11} className="h-full w-full" zoomControl={false}>
        <Recenter center={center} />
        <MapContent
          points={points}
          userPos={userPos}
          selected={selected}
          onSelect={setSelected}
        />
      </MapContainer>

      {/* bottom sheet */}
      {selected && (
        <div className="absolute inset-x-0 bottom-0 z-[500] rounded-t-2xl border-t border-border bg-background p-5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-bottom">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-[17px] font-semibold text-foreground">{selected.name}</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {relativeDayLabel(selected, now, selectedOcc)} · {formatTime(selectedOcc)}
              </p>
              <p className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                {selected.attendance_type === "Online" ? (
                  <>
                    <Video className="h-3.5 w-3.5 text-accent" /> Online
                  </>
                ) : (
                  <>
                    <Navigation className="h-3.5 w-3.5 text-accent" />{" "}
                    {selected.distance != null ? `${selected.distance} mi away · ` : ""}
                    {selected.attendance_type}
                  </>
                )}
              </p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="rounded-full p-1 text-muted-foreground active:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={() => navigate(`/meeting/${selected.id}`)}
            className="mt-4 w-full rounded-2xl bg-accent py-3 text-[15px] font-semibold text-accent-foreground active:opacity-85"
          >
            View Meeting
          </button>
        </div>
      )}
    </div>
  );
}