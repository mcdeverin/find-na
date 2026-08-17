import { createContext, useContext, useMemo, useState } from "react";

const FilterContext = createContext(null);

export const defaultFilters = {
  day: "Today", // Today | Tomorrow | Any Day | Monday..Sunday
  timeOfDay: "Any Time", // Morning | Afternoon | Evening | Late Night | Any Time
  attendance: "Any", // In-Person | Online | Hybrid | Any
  openClosed: "Any", // Open | Closed | Any
  formats: [], // Discussion, Speaker, ...
  wheelchairOnly: false,
  language: "Any", // English | Spanish | Other | Any
  distance: 25, // miles, or "Any"
  search: "",
};

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState(defaultFilters);
  const value = useMemo(() => ({ filters, setFilters }), [filters]);
  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used within FilterProvider");
  return ctx;
}