"use client";

import Link from "next/link";
import { Wrench, Search, Sun, Moon, Menu, Command } from "lucide-react";
import { useTheme } from "@/lib/use-theme";

interface NavbarProps {
  onOpenSearch: () => void;
  onToggleMobileSidebar: () => void;
}

export function Navbar({ onOpenSearch, onToggleMobileSidebar }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Left: Brand & Mobile Menu toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
            aria-label="Toggle mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center gap-2.5 font-semibold text-zinc-100 group">
            <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-4 h-4" />
            </div>
            <span className="text-base tracking-tight font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              DevKit
            </span>
          </Link>
        </div>

        {/* Center: Search Bar Trigger */}
        <button
          onClick={onOpenSearch}
          className="hidden sm:flex items-center justify-between w-full max-w-md px-3.5 py-1.5 text-xs text-zinc-400 bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all shadow-inner group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
            <span>Search developer tools...</span>
          </div>
          <kbd className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-medium text-zinc-400 bg-zinc-800/90 border border-zinc-700/80 rounded">
            <Command className="w-3 h-3" /> K
          </kbd>
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
            aria-label="Search tools"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
          </button>
        </div>
      </div>
    </header>
  );
}
