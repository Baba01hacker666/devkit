"use client";

import { useState } from "react";
import { useMounted } from "./use-mounted";

const FAVORITES_KEY = "devkit_favorites";
const DEFAULT_FAVORITES = ["json-formatter", "jwt-decoder", "hash-generator", "uuid-generator"];

export function useFavorites() {
  const mounted = useMounted();
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(FAVORITES_KEY);
        if (stored) return JSON.parse(stored);
      } catch {
        // Ignore
      }
    }
    return DEFAULT_FAVORITES;
  });

  const toggleFavorite = (toolId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId];
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const isFavorite = (toolId: string) => favorites.includes(toolId);

  return { favorites, toggleFavorite, isFavorite, mounted };
}
