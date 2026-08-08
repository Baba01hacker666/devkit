"use client";

import { useState, useEffect } from "react";
import { useMounted } from "./use-mounted";

export type Theme = "dark" | "light";

export function useTheme() {
  const mounted = useMounted();
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("devkit_theme") as Theme | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle("light", saved === "light");
    }
  }, []);

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
