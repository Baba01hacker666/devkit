"use client";

import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { CopyButton } from "@/components/ui/CopyButton";
import { useToast } from "@/components/ui/Toast";
import { Trash2, Sparkles } from "lucide-react";

const SAMPLE_TEXT = `   function example() {   
\tconst a = 1;   

\tconst b = 2;   


\treturn a + b;   
   }   `;

export function WhitespaceCleanerTool() {
  const [input, setInput] = useState(SAMPLE_TEXT);
  const [trimLines, setTrimLines] = useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);
  const [tabSpaces, setTabSpaces] = useState<number>(2);
  const { toast } = useToast();

  const cleanedOutput = useMemo(() => {
    if (!input) return "";

    let lines = input.split("\n");

    if (trimLines) {
      lines = lines.map((l) => l.trimEnd());
    }

    if (removeEmptyLines) {
      lines = lines.filter((l, i, arr) => !(l.trim() === "" && arr[i - 1]?.trim() === ""));
    }

    if (tabSpaces > 0) {
      const spaces = " ".repeat(tabSpaces);
      lines = lines.map((l) => l.replace(/\t/g, spaces));
    }

    return lines.join("\n");
  }, [input, trimLines, removeEmptyLines, tabSpaces]);

  const origStats = { lines: input.split("\n").length, chars: input.length };
  const cleanStats = { lines: cleanedOutput.split("\n").length, chars: cleanedOutput.length };

  return (
    <div>
      <ToolHeader
        id="whitespace"
        name="Whitespace & Line Cleaner"
        description="Strip trailing spaces, remove duplicate empty lines, convert tabs to spaces, and clean text formatting."
        category="Text"
      />

      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={trimLines}
              onChange={(e) => setTrimLines(e.target.checked)}
              className="rounded bg-zinc-950 border-zinc-700 text-blue-600 focus:ring-0"
            />
            <span>Trim Trailing Spaces</span>
          </label>

          <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={removeEmptyLines}
              onChange={(e) => setRemoveEmptyLines(e.target.checked)}
              className="rounded bg-zinc-950 border-zinc-700 text-blue-600 focus:ring-0"
            />
            <span>Remove Duplicate Blank Lines</span>
          </label>

          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400 font-medium">Replace Tabs with:</span>
            <select
              value={tabSpaces}
              onChange={(e) => setTabSpaces(Number(e.target.value))}
              className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100 focus:outline-none"
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
              <option value={0}>Keep Tabs</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CopyButton text={cleanedOutput} label="Copy Cleaned" toastMessage="Cleaned text copied!" />
          <button
            onClick={() => setInput("")}
            className="p-2 bg-zinc-800 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 rounded-lg transition"
            title="Clear text"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="mb-4 p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs flex flex-wrap items-center gap-4 text-zinc-300">
        <span>
          Original: <strong>{origStats.lines}</strong> lines, <strong>{origStats.chars}</strong> chars
        </span>
        <span className="text-zinc-600">→</span>
        <span className="text-emerald-400">
          Cleaned: <strong>{cleanStats.lines}</strong> lines, <strong>{cleanStats.chars}</strong> chars (Saved {origStats.chars - cleanStats.chars} chars)
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Original Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste text with messy whitespaces..."
            className="w-full h-80 font-mono text-xs bg-zinc-950 text-zinc-100 p-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-blue-500/50 resize-y"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Cleaned Text Output</label>
          <textarea
            readOnly
            value={cleanedOutput}
            placeholder="Cleaned output will appear here..."
            className="w-full h-80 font-mono text-xs bg-zinc-950 text-zinc-100 p-3.5 rounded-xl border border-zinc-800 focus:outline-none resize-y"
          />
        </div>
      </div>
    </div>
  );
}
