"use client";

import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { CopyButton } from "@/components/ui/CopyButton";
import { useToast } from "@/components/ui/Toast";
import { Trash2, AlertCircle, Link2 } from "lucide-react";

const SAMPLE_URL =
  "https://devkit.io/search?q=developer+tools&category=security&ref=github#section";

export function UrlEncoderTool() {
  const [input, setInput] = useState(SAMPLE_URL);
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [componentMode, setComponentMode] = useState(true);
  const { toast } = useToast();

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: null };
    try {
      if (mode === "encode") {
        const encoded = componentMode
          ? encodeURIComponent(input)
          : encodeURI(input);
        return { output: encoded, error: null };
      } else {
        const decoded = componentMode
          ? decodeURIComponent(input)
          : decodeURI(input);
        return { output: decoded, error: null };
      }
    } catch (err: unknown) {
      return {
        output: "",
        error: err instanceof Error ? err.message : "Malformed URI sequence",
      };
    }
  }, [input, mode, componentMode]);

  // Query String Parameter breakdown table
  const queryParams = useMemo(() => {
    if (!input.trim()) return [];
    try {
      const urlObj = input.includes("://")
        ? new URL(input)
        : new URL(`http://dummy.local/${input.startsWith("?") ? input : "?" + input}`);
      const entries: { key: string; value: string }[] = [];
      urlObj.searchParams.forEach((value, key) => {
        entries.push({ key, value });
      });
      return entries;
    } catch {
      return [];
    }
  }, [input]);

  return (
    <div>
      <ToolHeader
        id="url-encoder"
        name="URL Encoder / Decoder"
        description="Encode and decode URLs and URI parameters, plus parse query strings into structured key-value parameters."
        category="Encoding"
      />

      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setMode("encode")}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                mode === "encode"
                  ? "bg-blue-600 text-white shadow"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Encode URL
            </button>
            <button
              onClick={() => setMode("decode")}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                mode === "decode"
                  ? "bg-blue-600 text-white shadow"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Decode URL
            </button>
          </div>

          <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={componentMode}
              onChange={(e) => setComponentMode(e.target.checked)}
              className="rounded bg-zinc-950 border-zinc-700 text-blue-600 focus:ring-0"
            />
            <span>Full Component Mode (`encodeURIComponent` handles `/` `:` `?` `#`)</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <CopyButton text={output} label="Copy Output" toastMessage="URL output copied!" />
          <button
            onClick={() => setInput(SAMPLE_URL)}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-lg transition"
            title="Load sample URL"
          >
            <Link2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setInput("")}
            className="p-2 bg-zinc-800 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 rounded-lg transition"
            title="Clear text"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-950/40 border border-rose-500/40 rounded-lg text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>URI Error: {error}</span>
        </div>
      )}

      {/* Input / Output Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Input Text / URL</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste URL or raw string here..."
            className="w-full h-44 font-mono text-xs bg-zinc-950 text-zinc-100 p-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-blue-500/50 resize-y"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Encoded / Decoded Result</label>
          <textarea
            readOnly
            value={output}
            placeholder="Output will appear here..."
            className="w-full h-44 font-mono text-xs bg-zinc-950 text-zinc-100 p-3.5 rounded-xl border border-zinc-800 focus:outline-none resize-y"
          />
        </div>
      </div>

      {/* Query String Parser Table */}
      {queryParams.length > 0 && (
        <div className="border border-zinc-800 rounded-xl bg-zinc-900/60 p-4">
          <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-blue-400" />
            Parsed Query String Parameters ({queryParams.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950 text-zinc-400 font-semibold border-b border-zinc-800">
                <tr>
                  <th className="p-2.5">Parameter Key</th>
                  <th className="p-2.5">Parameter Value</th>
                  <th className="p-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {queryParams.map((param, idx) => (
                  <tr key={idx} className="hover:bg-zinc-800/40 transition">
                    <td className="p-2.5 font-mono text-blue-400 font-semibold">{param.key}</td>
                    <td className="p-2.5 font-mono text-zinc-200 break-all">{param.value}</td>
                    <td className="p-2.5 text-right space-x-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(param.key);
                          toast({ type: "success", title: `Copied key: ${param.key}` });
                        }}
                        className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-[11px]"
                      >
                        Copy Key
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(param.value);
                          toast({ type: "success", title: `Copied value: ${param.value}` });
                        }}
                        className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-[11px]"
                      >
                        Copy Value
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
