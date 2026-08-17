"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import * as Icons from "lucide-react";
import { Star, Clock, ChevronDown, ChevronRight, Home, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TOOLS, CATEGORIES } from "@/lib/tools-registry";
import { useFavorites } from "@/lib/use-favorites";
import { useRecent } from "@/lib/use-recent";

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ isMobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { favorites, mounted: favMounted } = useFavorites();
  const { recent, mounted: recentMounted } = useRecent();

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    JSON: true,
    Security: true,
    Encoding: true,
    Text: true,
    Time: true,
    Utilities: true,
  });

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const favoriteTools = favMounted
    ? TOOLS.filter((t) => favorites.includes(t.id))
    : [];

  const recentTools = recentMounted
    ? recent.map((id) => TOOLS.find((t) => t.id === id)).filter(Boolean)
    : [];

  const SidebarContent = (
    <div className="flex flex-col h-full py-4 text-xs select-none">
      {/* Home link */}
      <div className="px-3 mb-4">
        <Link
          href="/"
          onClick={onCloseMobile}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition ${
            pathname === "/"
              ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
              : "text-zinc-300 hover:bg-zinc-800/60 hover:text-white"
          }`}
        >
          <Home className="w-4 h-4 text-blue-400" />
          <span>Dashboard Overview</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-5">
        {/* Favorites section */}
        {favoriteTools.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 px-3 py-1 font-semibold text-[11px] uppercase tracking-wider text-amber-400/90">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>Favorites</span>
            </div>
            <div className="mt-1 space-y-0.5">
              {favoriteTools.map((tool) => {
                const IconComp = (Icons as unknown as Record<string, React.ElementType>)[tool.iconName] || Icons.Wrench;
                const active = pathname === tool.route;
                return (
                  <Link
                    key={`fav-${tool.id}`}
                    href={tool.route}
                    onClick={onCloseMobile}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition ${
                      active
                        ? "bg-zinc-800 text-white font-medium border border-zinc-700"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{tool.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Recently used section */}
        {recentTools.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 px-3 py-1 font-semibold text-[11px] uppercase tracking-wider text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Recently Used</span>
            </div>
            <div className="mt-1 space-y-0.5">
              {recentTools.slice(0, 5).map((tool) => {
                if (!tool) return null;
                const IconComp = (Icons as unknown as Record<string, React.ElementType>)[tool.iconName] || Icons.Wrench;
                const active = pathname === tool.route;
                return (
                  <Link
                    key={`rec-${tool.id}`}
                    href={tool.route}
                    onClick={onCloseMobile}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition ${
                      active
                        ? "bg-zinc-800 text-white font-medium border border-zinc-700"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate">{tool.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Categories section */}
        <div>
          <div className="flex items-center gap-1.5 px-3 py-1 font-semibold text-[11px] uppercase tracking-wider text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>All Categories</span>
          </div>

          <div className="mt-2 space-y-3">
            {CATEGORIES.map((cat) => {
              const catTools = TOOLS.filter((t) => t.category === cat);
              const isExpanded = expandedCategories[cat] !== false;

              return (
                <div key={cat} className="space-y-0.5">
                  <button
                    onClick={() => toggleCategory(cat)}
                    className="w-full flex items-center justify-between px-3 py-1 text-zinc-400 hover:text-zinc-200 font-medium transition"
                  >
                    <span className="text-[11px] font-semibold tracking-wide text-zinc-300">{cat}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-zinc-500 bg-zinc-800/60 px-1.5 py-0.2 rounded">
                        {catTools.length}
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-3 h-3 text-zinc-500" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-zinc-500" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="space-y-0.5 pl-2 overflow-hidden"
                      >
                        {catTools.map((tool) => {
                          const IconComp = (Icons as unknown as Record<string, React.ElementType>)[tool.iconName] || Icons.Wrench;
                          const active = pathname === tool.route;

                          return (
                            <Link
                              key={tool.id}
                              href={tool.route}
                              onClick={onCloseMobile}
                              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition ${
                                active
                                  ? "bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/30"
                                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                              }`}
                            >
                              <IconComp className={`w-3.5 h-3.5 shrink-0 ${active ? "text-blue-400" : "text-zinc-400"}`} />
                              <span className="truncate">{tool.name}</span>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 border-r border-zinc-800/80 bg-zinc-950/60 h-[calc(100vh-3.5rem)] sticky top-14">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer with AnimatePresence */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="w-72 bg-zinc-950 border-r border-zinc-800 h-full flex flex-col relative z-50 shadow-2xl"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                <span className="font-bold text-sm text-zinc-100">DevKit Navigation</span>
                <button
                  onClick={onCloseMobile}
                  className="p-1 rounded-md text-zinc-400 hover:text-zinc-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {SidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
