"use client";

import { useState } from "react";
import { useMounted } from "./use-mounted";

export type Theme = "dark" | "light";

export function useTheme() {
  const mounted = useMounted();
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("devkit_theme") as Theme | null;
      if (saved) {
        document.documentElement.classList.toggle("light", saved === "light");
        return saved;
      }
    }
    return "dark";
  });

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("devkit_theme", next);
    if (next === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  return { theme, toggleTheme, mounted };
}
