import { useState, useEffect, useCallback } from "react";

const KEY = "findna:saved";

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    // Normalize legacy entries (plain id strings) to { source, external_id }.
    return parsed.map((e) =>
      typeof e === "string" ? { source: "bmlt", external_id: e } : e
    );
  } catch {
    return [];
  }
}

export function useSaved() {
  const [saved, setSaved] = useState(() => read());

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(saved));
    } catch {
      /* ignore */
    }
  }, [saved]);

  const isSaved = useCallback(
    (id) => saved.some((s) => s.external_id === id),
    [saved]
  );

  const toggleSaved = useCallback((id) => {
    setSaved((prev) =>
      prev.some((s) => s.external_id === id)
        ? prev.filter((s) => s.external_id !== id)
        : [...prev, { source: "bmlt", external_id: id }]
    );
  }, []);

  const removeSaved = useCallback((id) => {
    setSaved((prev) => prev.filter((s) => s.external_id !== id));
  }, []);

  return { saved, isSaved, toggleSaved, removeSaved };
}