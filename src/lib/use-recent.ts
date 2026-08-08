"use client";

import { useState } from "react";
import { useMounted } from "./use-mounted";

const RECENT_KEY = "devkit_recent_tools";
const MAX_RECENT = 10;

export function useRecent() {
  const mounted = useMounted();
  const [recent, setRecent] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(RECENT_KEY);
        if (stored) return JSON.parse(stored);
      } catch {
        // Ignore
      }
    }
    return [];
  });

  const addRecent = (toolId: string) => {
    setRecent((prev) => {
      const filtered = prev.filter((id) => id !== toolId);
      const next = [toolId, ...filtered].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const clearRecent = () => {
    setRecent([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {
      // Ignore
    }
  };

  return { recent, addRecent, clearRecent, mounted };
}
