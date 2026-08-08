"use client";

import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { CopyButton } from "@/components/ui/CopyButton";
import { useToast } from "@/components/ui/Toast";
import { Trash2, ArrowLeftRight } from "lucide-react";

export function HtmlEntitiesTool() {
  const [input, setInput] = useState('<div class="container" id="app">Hello & Welcome!</div>');
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const { toast } = useToast();

  const output = useMemo(() => {
    if (!input) return "";

    if (mode === "encode") {
      return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    } else {
      return input
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&");
    }
  }, [input, mode]);

  const handleSwap = () => {
    if (output) {
      setInput(output);
      setMode((prev) => (prev === "encode" ? "decode" : "encode"));
      toast({ type: "info", title: "Swapped mode" });
    }
  };

  return (
    <div>
      <ToolHeader
        id="html-entities"
        name="HTML Entity Encoder / Decoder"
        description="Escape raw HTML characters into HTML entities or decode entity strings back into HTML."
        category="Encoding"
      />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs">
        <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 font-semibold">
          <button
            onClick={() => setMode("encode")}
            className={`px-3 py-1 rounded-md transition ${
              mode === "encode" ? "bg-blue-600 text-white shadow" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Encode Entities
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-3 py-1 rounded-md transition ${
              mode === "decode" ? "bg-blue-600 text-white shadow" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Decode Entities
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSwap}
            disabled={!output}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition disabled:opacity-40"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Swap Mode</span>
          </button>
          <CopyButton text={output} label="Copy Output" toastMessage="HTML entities copied!" />
          <button
            onClick={() => setInput("")}
            className="p-2 bg-zinc-800 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 rounded-lg transition"
            title="Clear text"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
            {mode === "encode" ? "Raw HTML Input" : "HTML Entities Input"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type HTML here..."
            className="w-full h-80 font-mono text-xs bg-zinc-950 text-zinc-100 p-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-blue-500/50 resize-y"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
            {mode === "encode" ? "Escaped HTML Entities Output" : "Decoded HTML Output"}
          </label>
          <textarea
            readOnly
            value={output}
            placeholder="Result will appear here..."
            className="w-full h-80 font-mono text-xs bg-zinc-950 text-zinc-100 p-3.5 rounded-xl border border-zinc-800 focus:outline-none resize-y"
          />
        </div>
      </div>
    </div>
  );
}
