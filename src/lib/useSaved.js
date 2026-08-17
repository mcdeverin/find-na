import { useCallback, useEffect, useState } from "react";

const KEY = "findna:saved";

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useSaved() {
  const [saved, setSaved] = useState(read);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(saved));
    } catch {
      /* ignore */
    }
  }, [saved]);

  const isSaved = useCallback((id) => saved.includes(id), [saved]);
  const toggleSaved = useCallback((id) => {
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);
  const removeSaved = useCallback((id) => {
    setSaved((prev) => prev.filter((x) => x !== id));
  }, []);

  return { saved, isSaved, toggleSaved, removeSaved };
}