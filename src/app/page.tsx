"use client";

import { useState } from "react";
import { Search, Sparkles, Star, Clock, Flame, ShieldCheck, Command } from "lucide-react";
import { TOOLS, CATEGORIES, ToolCategory } from "@/lib/tools-registry";
import { ToolCard } from "@/components/ui/ToolCard";
import { useFavorites } from "@/lib/use-favorites";
import { useRecent } from "@/lib/use-recent";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const { favorites, mounted: favMounted } = useFavorites();
  const { recent, mounted: recentMounted } = useRecent();

  const favoriteTools = favMounted
    ? TOOLS.filter((t) => favorites.includes(t.id))
    : [];

  const recentTools = recentMounted
    ? recent.map((id) => TOOLS.find((t) => t.id === id)).filter(Boolean)
    : [];

  const popularTools = TOOLS.filter((t) => t.isPopular);

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory =
      selectedCategory === "All" || tool.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q) ||
      tool.keywords.some((k) => k.toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner & Global Search */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800/80 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Client-Side & Privacy-First</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-100">
            Developer Tools Dashboard
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 mt-2 leading-relaxed">
            Fast, modern, local processing tools for developers, security professionals, and technical teams.
          </p>

          {/* Search bar */}
          <div className="mt-6 relative max-w-xl">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search developer tools (Press Ctrl+K for quick command)..."
              className="w-full bg-zinc-950/80 border border-zinc-700/70 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded-xl pl-12 pr-12 py-3 text-sm text-zinc-100 placeholder-zinc-500 shadow-inner focus:outline-none transition-all"
            />
            <div className="absolute right-3 top-3 hidden sm:flex items-center gap-1 text-[11px] font-mono text-zinc-400 bg-zinc-800 px-2 py-1 rounded border border-zinc-700">
              <Command className="w-3 h-3" /> K
            </div>
          </div>
        </div>
      </div>

      {/* Favorites Section */}
      {favoriteTools.length > 0 && !searchQuery && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-400">
            <Star className="w-4 h-4 fill-amber-400" />
            <h2>Favorite & Pinned Tools</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favoriteTools.map((tool) => (
              <ToolCard key={`fav-${tool.id}`} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Used Section */}
      {recentTools.length > 0 && !searchQuery && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-300">
            <Clock className="w-4 h-4 text-zinc-400" />
            <h2>Recently Used</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recentTools.slice(0, 4).map((tool) => {
              if (!tool) return null;
              return <ToolCard key={`rec-${tool.id}`} tool={tool} />;
            })}
          </div>
        </section>
      )}

      {/* Popular Tools Section */}
      {!searchQuery && selectedCategory === "All" && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-400">
            <Flame className="w-4 h-4" />
            <h2>Popular Developer Tools</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {popularTools.map((tool) => (
              <ToolCard key={`pop-${tool.id}`} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Category Tabs & Tool Grid */}
      <section className="space-y-4 pt-4 border-t border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-base font-bold text-zinc-100">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h2>All Tools Library</h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
                selectedCategory === "All"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              }`}
            >
              All ({TOOLS.length})
            </button>
            {CATEGORIES.map((cat: ToolCategory) => {
              const count = TOOLS.filter((t) => t.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Tools Grid */}
        {filteredTools.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
            <Search className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-zinc-300 font-semibold">No tools found matching your filter</p>
            <p className="text-xs text-zinc-500 mt-1">Try adjusting your search query or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
