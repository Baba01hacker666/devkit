"use client";

import Link from "next/link";
import { motion } from "motion/react";
import * as Icons from "lucide-react";
import { Star, ArrowUpRight } from "lucide-react";
import { ToolMeta } from "@/lib/tools-registry";
import { useFavorites } from "@/lib/use-favorites";

interface ToolCardProps {
  tool: ToolMeta;
}

export function ToolCard({ tool }: ToolCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(tool.id);

  // Dynamic Lucide Icon fallback
  const IconComponent = (Icons as unknown as Record<string, React.ElementType>)[tool.iconName] || Icons.Wrench;

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.18, ease: "easeOut" } }}
      whileTap={{ scale: 0.985 }}
      className="group relative bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-zinc-700/80 rounded-xl p-5 transition-colors duration-200 shadow-sm hover:shadow-md flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <motion.div
            whileHover={{ scale: 1.08 }}
            className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 transition-colors duration-200"
          >
            <IconComponent className="w-5 h-5" />
          </motion.div>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(tool.id);
            }}
            title={fav ? "Remove from Favorites" : "Add to Favorites"}
            className="p-1.5 rounded-md text-zinc-500 hover:text-amber-400 transition"
          >
            <Star className={`w-4 h-4 ${fav ? "fill-amber-400 text-amber-400" : ""}`} />
          </motion.button>
        </div>

        <Link href={tool.route} className="block focus:outline-none">
          <h3 className="text-base font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors flex items-center gap-1">
            {tool.name}
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
          </h3>
          <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
            {tool.description}
          </p>
        </Link>
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-800/50 flex items-center justify-between">
        <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded bg-zinc-800/60 text-zinc-400 border border-zinc-700/40">
          {tool.category}
        </span>
        <Link
          href={tool.route}
          className="text-xs font-medium text-blue-400 group-hover:text-blue-300 flex items-center gap-1"
        >
          Open Tool
        </Link>
      </div>
    </motion.div>
  );
}
