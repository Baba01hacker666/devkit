"use client";

import { useMemo, useState } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { Trash2, BarChart3 } from "lucide-react";

function formatDuration(minutes: number): string {
  const totalSeconds = Math.round(minutes * 60);
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

interface StatItem {
  label: string;
  value: string | number;
}

export function TextStatsTool() {
  const [input, setInput] = useState(
    "DevKit processes everything locally in your browser. No data leaves your machine.\n\nFast, modern developer tools for engineers, security professionals, and technical teams."
  );

  const stats = useMemo(() => {
    const text = input;
    const tokens = text.trim() ? text.trim().split(/\s+/) : [];
    const words = tokens.length;

    // Frequency of words with length >= 3 (strip leading/trailing punctuation)
    const freq = new Map<string, number>();
    for (const raw of tokens) {
      const t = raw.toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, "");
      if (t.length >= 3) {
        freq.set(t, (freq.get(t) ?? 0) + 1);
      }
    }
    const topWords = [...freq.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 10);
    const maxFreq = topWords.length ? topWords[0][1] : 1;

    return {
      chars: text.length,
      charsNoSpaces: text.replace(/\s/g, "").length,
      words,
      uniqueWords: new Set(
        tokens.map((t) => t.toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, ""))
      ).size,
      lines: text ? text.split(/\n/).length : 0,
      paragraphs: text ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0,
      sentences: text ? (text.match(/[^.!?]+[.!?]+/g) || []).length : 0,
      avgWordLength: words
        ? tokens.reduce((acc, w) => acc + w.length, 0) / words
        : 0,
      readingMinutes: words / 200,
      speakingMinutes: words / 130,
      topWords,
      maxFreq,
    };
  }, [input]);

  const statItems: StatItem[] = [
    { label: "Characters", value: stats.chars.toLocaleString() },
    { label: "Characters (no spaces)", value: stats.charsNoSpaces.toLocaleString() },
    { label: "Words", value: stats.words.toLocaleString() },
    { label: "Unique Words", value: stats.uniqueWords.toLocaleString() },
    { label: "Sentences", value: stats.sentences.toLocaleString() },
    { label: "Lines", value: stats.lines.toLocaleString() },
    { label: "Paragraphs", value: stats.paragraphs.toLocaleString() },
    { label: "Avg. Word Length", value: stats.avgWordLength.toFixed(1) },
    { label: "Reading Time (~200 wpm)", value: formatDuration(stats.readingMinutes) },
    { label: "Speaking Time (~130 wpm)", value: formatDuration(stats.speakingMinutes) },
  ];

  return (
    <div>
      <ToolHeader
        id="text-stats"
        name="Text Statistics"
        description="Analyze any text instantly: word count, characters, sentences, reading time, and top keyword frequency."
        category="Text"
      />

      {/* Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-zinc-400">
            Text Input
          </label>
          <button
            onClick={() => setInput("")}
            className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-800 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 rounded-lg transition text-[11px]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste or type text to analyze..."
          className="w-full h-56 font-mono text-xs bg-zinc-950 text-zinc-100 p-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-blue-500/50 resize-y"
        />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl"
          >
            <p className="text-[11px] text-zinc-500 font-medium mb-1">{item.label}</p>
            <p className="text-lg font-bold text-zinc-100 font-mono">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Keyword Frequency */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-zinc-200">
            Top Keyword Frequency
          </h3>
        </div>
        {stats.topWords.length === 0 ? (
          <p className="text-xs text-zinc-500 bg-zinc-900/40 border border-zinc-800 rounded-xl p-4">
            No keywords found. Enter at least one word with 3+ characters to see frequency analysis.
          </p>
        ) : (
          <div className="space-y-2">
            {stats.topWords.map(([word, count]) => (
              <div key={word} className="flex items-center gap-3 text-xs">
                <span className="w-40 truncate text-zinc-300 font-mono">{word}</span>
                <div className="flex-1 h-5 bg-zinc-900 border border-zinc-800 rounded-md overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600/70 to-blue-500/40 rounded-r-md transition-all"
                    style={{ width: `${Math.max(8, (count / stats.maxFreq) * 100)}%` }}
                  />
                </div>
                <span className="w-8 text-right text-zinc-400 font-mono">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
