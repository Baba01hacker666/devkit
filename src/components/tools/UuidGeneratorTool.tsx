"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { CopyButton } from "@/components/ui/CopyButton";
import { useToast } from "@/components/ui/Toast";
import { RefreshCw, Download, Fingerprint } from "lucide-react";

function createUuids(
  count: number,
  useHyphens: boolean,
  useUppercase: boolean,
  useBraces: boolean
): string[] {
  const list: string[] = [];
  const limit = Math.min(Math.max(1, count), 500);

  for (let i = 0; i < limit; i++) {
    let raw = crypto.randomUUID();
    if (!useHyphens) {
      raw = raw.replace(/-/g, "");
    }
    if (useUppercase) {
      raw = raw.toUpperCase();
    }
    if (useBraces) {
      raw = `{${raw}}`;
    }
    list.push(raw);
  }
  return list;
}

export function UuidGeneratorTool() {
  const [quantity, setQuantity] = useState(5);
  const [useHyphens, setUseHyphens] = useState(true);
  const [useUppercase, setUseUppercase] = useState(false);
  const [useBraces, setUseBraces] = useState(false);
  const [uuids, setUuids] = useState<string[]>(() => createUuids(5, true, false, false));
  const { toast } = useToast();

  const handleGenerate = () => {
    setUuids(createUuids(quantity, useHyphens, useUppercase, useBraces));
  };

  const handleDownloadTxt = () => {
    if (uuids.length === 0) return;
    const blob = new Blob([uuids.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "uuids.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast({ type: "success", title: `Downloaded ${uuids.length} UUIDs (.txt)` });
  };

  const handleDownloadJson = () => {
    if (uuids.length === 0) return;
    const blob = new Blob([JSON.stringify(uuids, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "uuids.json";
    a.click();
    URL.revokeObjectURL(url);
    toast({ type: "success", title: `Downloaded ${uuids.length} UUIDs (.json)` });
  };

  return (
    <div>
      <ToolHeader
        id="uuid-generator"
        name="UUID / GUID v4 Generator"
        description="Generate cryptographically secure Version 4 UUID tokens in bulk with formatting options."
        category="Utilities"
      />

      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-300">Quantity:</span>
            <input
              type="number"
              min={1}
              max={500}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useHyphens}
              onChange={(e) => setUseHyphens(e.target.checked)}
              className="rounded bg-zinc-950 border-zinc-700 text-blue-600 focus:ring-0"
            />
            <span>Include Hyphens</span>
          </label>

          <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useUppercase}
              onChange={(e) => setUseUppercase(e.target.checked)}
              className="rounded bg-zinc-950 border-zinc-700 text-blue-600 focus:ring-0"
            />
            <span>UPPERCASE</span>
          </label>

          <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useBraces}
              onChange={(e) => setUseBraces(e.target.checked)}
              className="rounded bg-zinc-950 border-zinc-700 text-blue-600 focus:ring-0"
            />
            <span>Wrap in Braces {'{...}'}</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerate}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate</span>
          </button>

          <CopyButton
            text={uuids.join("\n")}
            label="Copy All"
            toastMessage={`Copied ${uuids.length} UUIDs`}
          />

          <button
            onClick={handleDownloadTxt}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition"
            title="Download .txt"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownloadJson}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition text-[11px] font-mono font-bold"
            title="Download .json"
          >
            JSON
          </button>
        </div>
      </div>

      {/* Generated list */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {uuids.map((id, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 rounded-xl transition"
          >
            <div className="flex items-center gap-3">
              <Fingerprint className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="font-mono text-xs text-zinc-100 select-all">{id}</span>
            </div>
            <CopyButton text={id} size="sm" toastMessage="UUID copied!" />
          </div>
        ))}
      </div>
    </div>
  );
}
