"use client";

import { useState } from "react";
import { DiffEditorComponent } from "@/components/ui/DiffEditor";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { useToast } from "@/components/ui/Toast";
import { CopyButton } from "@/components/ui/CopyButton";
import { ArrowLeftRight, Trash2, Wand2 } from "lucide-react";

const SAMPLE_ORIGINAL = `{
  "id": 100,
  "name": "DevKit API",
  "version": "1.0.0",
  "status": "active",
  "features": ["formatter", "jwt"]
}`;

const SAMPLE_MODIFIED = `{
  "id": 100,
  "name": "DevKit API v2",
  "version": "2.1.0",
  "status": "production",
  "features": ["formatter", "jwt", "regex", "diff"],
  "environment": "production"
}`;

export function JsonDiffTool() {
  const [original, setOriginal] = useState(SAMPLE_ORIGINAL);
  const [modified, setModified] = useState(SAMPLE_MODIFIED);
  const [sideBySide, setSideBySide] = useState(true);
  const { toast } = useToast();

  const handleFormatBoth = () => {
    try {
      if (original.trim()) {
        const pOrig = JSON.parse(original);
        setOriginal(JSON.stringify(pOrig, null, 2));
      }
      if (modified.trim()) {
        const pMod = JSON.parse(modified);
        setModified(JSON.stringify(pMod, null, 2));
      }
      toast({ type: "success", title: "Formatted both JSON inputs" });
    } catch {
      toast({ type: "error", title: "One of the inputs is not valid JSON" });
    }
  };

  const handleSwap = () => {
    const temp = original;
    setOriginal(modified);
    setModified(temp);
    toast({ type: "info", title: "Swapped Original and Modified" });
  };

  const handleClear = () => {
    setOriginal("");
    setModified("");
  };

  return (
    <div>
      <ToolHeader
        id="json-diff"
        name="JSON Diff Comparator"
        description="Compare two JSON objects side-by-side or inline to highlight structural additions, deletions, and updates."
        category="JSON"
      />

      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleFormatBoth}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition shadow"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Format Both</span>
          </button>
          <button
            onClick={handleSwap}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium rounded-lg transition"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Swap Sides</span>
          </button>

          <div className="h-4 w-px bg-zinc-700 mx-1 hidden sm:block" />

          <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={sideBySide}
              onChange={(e) => setSideBySide(e.target.checked)}
              className="rounded bg-zinc-950 border-zinc-700 text-blue-600 focus:ring-0"
            />
            <span>Side-by-side view</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <CopyButton text={modified} label="Copy Modified" toastMessage="Copied modified text!" />
          <button
            onClick={handleClear}
            className="p-2 bg-zinc-800 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 rounded-lg transition"
            title="Clear both editors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Input textareas for editing before diff */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1">
            Original JSON / Input 1
          </label>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste original JSON..."
            className="w-full h-32 font-mono text-xs bg-zinc-950 text-zinc-100 p-3 rounded-lg border border-zinc-800 focus:outline-none focus:border-blue-500/50 resize-y"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1">
            Modified JSON / Input 2
          </label>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Paste modified JSON..."
            className="w-full h-32 font-mono text-xs bg-zinc-950 text-zinc-100 p-3 rounded-lg border border-zinc-800 focus:outline-none focus:border-blue-500/50 resize-y"
          />
        </div>
      </div>

      {/* Interactive Monaco Diff View */}
      <div className="mt-4">
        <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
          Diff Comparison Output
        </label>
        <DiffEditorComponent
          original={original}
          modified={modified}
          language="json"
          height="450px"
          renderSideBySide={sideBySide}
        />
      </div>
    </div>
  );
}
