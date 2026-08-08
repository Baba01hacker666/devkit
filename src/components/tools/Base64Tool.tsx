"use client";

import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { CopyButton } from "@/components/ui/CopyButton";
import { useToast } from "@/components/ui/Toast";
import { Download, Trash2, ArrowLeftRight, AlertCircle } from "lucide-react";

export function Base64Tool() {
  const [input, setInput] = useState("Hello DevKit! 🚀 Welcome to developer tools.");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [urlSafe, setUrlSafe] = useState(false);
  const { toast } = useToast();

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: null };

    try {
      if (mode === "encode") {
        // UTF-8 friendly encoding using TextEncoder
        const bytes = new TextEncoder().encode(input);
        let binStr = "";
        bytes.forEach((b) => (binStr += String.fromCharCode(b)));
        let b64 = btoa(binStr);
        if (urlSafe) {
          b64 = b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
        }
        return { output: b64, error: null };
      } else {
        // Decoding
        let clean = input.trim();
        if (urlSafe || clean.includes("-") || clean.includes("_")) {
          clean = clean.replace(/-/g, "+").replace(/_/g, "/");
          while (clean.length % 4 !== 0) {
            clean += "=";
          }
        }
        const binStr = atob(clean);
        const bytes = new Uint8Array(binStr.length);
        for (let i = 0; i < binStr.length; i++) {
          bytes[i] = binStr.charCodeAt(i);
        }
        const decoded = new TextDecoder().decode(bytes);
        return { output: decoded, error: null };
      }
    } catch (err: unknown) {
      return {
        output: "",
        error: err instanceof Error ? err.message : "Invalid Base64 string",
      };
    }
  }, [input, mode, urlSafe]);

  const handleSwap = () => {
    if (output && !error) {
      setInput(output);
      setMode((prev) => (prev === "encode" ? "decode" : "encode"));
      toast({ type: "info", title: "Swapped input & output mode" });
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = mode === "encode" ? "encoded.b64.txt" : "decoded.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast({ type: "success", title: "File downloaded" });
  };

  return (
    <div>
      <ToolHeader
        id="base64"
        name="Base64 Encoder / Decoder"
        description="Encode and decode text or binary strings to Base64 and URL-safe Base64 with full UTF-8 Unicode support."
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
              Encode
            </button>
            <button
              onClick={() => setMode("decode")}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                mode === "decode"
                  ? "bg-blue-600 text-white shadow"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Decode
            </button>
          </div>

          <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(e) => setUrlSafe(e.target.checked)}
              className="rounded bg-zinc-950 border-zinc-700 text-blue-600 focus:ring-0"
            />
            <span>URL-Safe Base64 (replace `+` `/` with `-` `_`)</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSwap}
            disabled={!output || !!error}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition disabled:opacity-40"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Swap</span>
          </button>
          <CopyButton text={output} label="Copy Output" toastMessage="Base64 copied!" />
          <button
            onClick={handleDownload}
            disabled={!output || !!error}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition disabled:opacity-40"
            title="Download result"
          >
            <Download className="w-4 h-4" />
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
          <span>Decoding Error: {error}</span>
        </div>
      )}

      {/* Input / Output Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
            {mode === "encode" ? "Raw Text Input" : "Base64 Encoded Input"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? "Enter raw text to encode..."
                : "Paste Base64 encoded string..."
            }
            className="w-full h-80 font-mono text-xs bg-zinc-950 text-zinc-100 p-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-blue-500/50 resize-y"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
            {mode === "encode" ? "Base64 Output" : "Decoded Text Output"}
          </label>
          <textarea
            readOnly
            value={output}
            placeholder="Resulting output will appear here..."
            className="w-full h-80 font-mono text-xs bg-zinc-950 text-zinc-100 p-3.5 rounded-xl border border-zinc-800 focus:outline-none resize-y"
          />
        </div>
      </div>
    </div>
  );
}
