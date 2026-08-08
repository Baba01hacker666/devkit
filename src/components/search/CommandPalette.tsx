"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Command, ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";
import { TOOLS, ToolMeta } from "@/lib/tools-registry";
import { useRecent } from "@/lib/use-recent";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { addRecent } = useRecent();

  const filteredTools = React.useMemo(() => {
    if (!query.trim()) return TOOLS;
    const q = query.toLowerCase().trim();
    return TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setSelectedIndex(0);
  };

  const handleSelect = (tool: ToolMeta) => {
    addRecent(tool.id);
    onClose();
    router.push(tool.route);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredTools.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredTools.length) % (filteredTools.length || 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredTools[selectedIndex]) {
        handleSelect(filteredTools[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input header */}
        <div className="relative flex items-center border-b border-zinc-800 px-4 py-3">
          <Search className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search developer tools (e.g. JWT, JSON, Regex, Base64)..."
            className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => handleQueryChange("")}
              className="text-zinc-500 hover:text-zinc-300 p-1 mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-medium text-zinc-400 bg-zinc-800 border border-zinc-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-zinc-800/40">
          {filteredTools.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-sm">
              No developer tools found for &quot;{query}&quot;
            </div>
          ) : (
            filteredTools.map((tool, idx) => {
              const IconComp =
                (Icons as unknown as Record<string, React.ElementType>)[tool.iconName] || Icons.Wrench;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={tool.id}
                  onClick={() => handleSelect(tool)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-blue-600/20 text-blue-100 border border-blue-500/30"
                      : "hover:bg-zinc-800/60 text-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{tool.name}</p>
                      <p className="text-xs text-zinc-400 truncate">{tool.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                      {tool.category}
                    </span>
                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? "text-blue-400 translate-x-0.5" : "text-zinc-600"
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="border-t border-zinc-800 px-4 py-2 bg-zinc-950/60 text-xs text-zinc-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-800 rounded border border-zinc-700">↑</kbd>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-800 rounded border border-zinc-700">↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-800 rounded border border-zinc-700">↵</kbd> Select
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Command className="w-3 h-3" /> + K
          </span>
        </div>
      </div>
    </div>
  );
}
