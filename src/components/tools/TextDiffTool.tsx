"use client";

import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { CopyButton } from "@/components/ui/CopyButton";
import { DiffEditorComponent } from "@/components/ui/DiffEditor";
import { useToast } from "@/components/ui/Toast";
import { Trash2, ArrowLeftRight, FileDiff } from "lucide-react";

const SAMPLE_TEXT_ORIGINAL = `import React from 'react';

function Header() {
  return (
    <header className="bg-white">
      <h1>DevTools Dashboard</h1>
    </header>
  );
}

export default Header;`;

const SAMPLE_TEXT_MODIFIED = `import React from 'react';
import { Wrench } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-zinc-900 border-b">
      <Wrench className="w-5 h-5 text-blue-500" />
      <h1 className="text-xl font-bold">DevKit Dashboard</h1>
    </header>
  );
}

export default Header;`;

export function TextDiffTool() {
  const [original, setOriginal] = useState(SAMPLE_TEXT_ORIGINAL);
  const [modified, setModified] = useState(SAMPLE_TEXT_MODIFIED);
  const [renderSideBySide, setRenderSideBySide] = useState(true);
  const { toast } = useToast();

  // Basic diff statistics calculation
  const stats = useMemo(() => {
    const origLines = original.split("\n");
    const modLines = modified.split("\n");

    const added = modLines.filter((l) => !origLines.includes(l)).length;
    const removed = origLines.filter((l) => !modLines.includes(l)).length;

    return { added, removed, totalOrig: origLines.length, totalMod: modLines.length };
  }, [original, modified]);

  const handleSwap = () => {
    const temp = original;
    setOriginal(modified);
    setModified(temp);
    toast({ type: "info", title: "Swapped Original and Modified text" });
  };

  return (
    <div>
      <ToolHeader
        id="text-diff"
        name="Text Diff Comparator"
        description="Compare arbitrary text snippets line-by-line with visual addition and deletion highlights."
        category="Text"
      />

      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSwap}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium rounded-lg transition"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Swap Sides</span>
          </button>

          <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={renderSideBySide}
              onChange={(e) => setRenderSideBySide(e.target.checked)}
              className="rounded bg-zinc-950 border-zinc-700 text-blue-600 focus:ring-0"
            />
            <span>Side-by-side view</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-zinc-400 font-mono text-[11px] px-2 py-1 bg-zinc-950 rounded border border-zinc-800">
            <span className="text-emerald-400 font-bold">+{stats.added}</span> /{" "}
            <span className="text-rose-400 font-bold">-{stats.removed}</span> lines
          </span>

          <CopyButton text={modified} label="Copy Modified" toastMessage="Copied modified text!" />

          <button
            onClick={() => {
              setOriginal("");
              setModified("");
            }}
            className="p-2 bg-zinc-800 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 rounded-lg transition"
            title="Clear text"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editable inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1">
            Original Text / Input 1
          </label>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste original text..."
            className="w-full h-36 font-mono text-xs bg-zinc-950 text-zinc-100 p-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-blue-500/50 resize-y"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1">
            Modified Text / Input 2
          </label>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Paste modified text..."
            className="w-full h-36 font-mono text-xs bg-zinc-950 text-zinc-100 p-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-blue-500/50 resize-y"
          />
        </div>
      </div>

      {/* Visual Diff Output */}
      <div>
        <label className="block text-xs font-semibold text-zinc-400 mb-1.5 flex items-center gap-1.5">
          <FileDiff className="w-4 h-4 text-blue-400" /> Visual Diff Engine Output
        </label>
        <DiffEditorComponent
          original={original}
          modified={modified}
          language="plaintext"
          height="450px"
          renderSideBySide={renderSideBySide}
        />
      </div>
    </div>
  );
}
