"use client";

import Link from "next/link";
import { Star, ShieldCheck, Share2, ChevronRight } from "lucide-react";
import { useFavorites } from "@/lib/use-favorites";
import { useToast } from "@/components/ui/Toast";

interface ToolHeaderProps {
  id: string;
  name: string;
  description: string;
  category: string;
}

export function ToolHeader({ id, name, description, category }: ToolHeaderProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const fav = isFavorite(id);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ type: "success", title: "Tool URL copied to clipboard!" });
    } catch {
      toast({ type: "error", title: "Could not copy URL" });
    }
  };

  return (
    <div className="mb-6 border-b border-zinc-800/80 pb-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-zinc-400 mb-2">
        <Link href="/" className="hover:text-zinc-200 transition">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-zinc-600" />
        <span className="text-zinc-400">{category}</span>
        <ChevronRight className="w-3 h-3 text-zinc-600" />
        <span className="text-zinc-200 font-medium">{name}</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">{name}</h1>
            <span className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {category}
            </span>
            <span
              title="All data is processed strictly client-side in your browser. No data leaves your machine."
              className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-help"
            >
              <ShieldCheck className="w-3 h-3" />
              Client-Side
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">{description}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavorite(id)}
            title={fav ? "Remove from Favorites" : "Add to Favorites"}
            className={`p-2 rounded-lg border transition-all ${
              fav
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                : "bg-zinc-800/60 border-zinc-700/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            }`}
          >
            <Star className={`w-4 h-4 ${fav ? "fill-amber-400 text-amber-400" : ""}`} />
          </button>
          <button
            onClick={handleShare}
            title="Share tool URL"
            className="p-2 rounded-lg border border-zinc-700/60 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
