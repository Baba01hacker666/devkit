"use client";

import { useState, useTransition } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { CopyButton } from "@/components/ui/CopyButton";
import { ShieldCheck, Trash2, Key } from "lucide-react";

interface HashesState {
  "SHA-1": string;
  "SHA-256": string;
  "SHA-384": string;
  "SHA-512": string;
}

export function HashGeneratorTool() {
  const [input, setInput] = useState("DevKit production cryptographic hash testing");
  const [isUppercase, setIsUppercase] = useState(false);
  const [hashes, setHashes] = useState<HashesState>({
    "SHA-1": "",
    "SHA-256": "",
    "SHA-384": "",
    "SHA-512": "",
  });

  const [, startTransition] = useTransition();

  const handleInputChange = (val: string) => {
    setInput(val);
    if (!val) {
      setHashes({ "SHA-1": "", "SHA-256": "", "SHA-384": "", "SHA-512": "" });
      return;
    }
    computeAllHashes(val, isUppercase);
  };

  const handleUppercaseToggle = (upper: boolean) => {
    setIsUppercase(upper);
    computeAllHashes(input, upper);
  };

  const computeAllHashes = (text: string, upper: boolean) => {
    startTransition(() => {
      async function run() {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const algos = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;
        const res: Partial<HashesState> = {};

        for (const algo of algos) {
          try {
            const buffer = await crypto.subtle.digest(algo, data);
            const hashArray = Array.from(new Uint8Array(buffer));
            let hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
            if (upper) hashHex = hashHex.toUpperCase();
            res[algo] = hashHex;
          } catch {
            res[algo] = "Error computing hash";
          }
        }
        setHashes(res as HashesState);
      }
      run();
    });
  };

  return (
    <div>
      <ToolHeader
        id="hash-generator"
        name="Cryptographic Hash Generator"
        description="Compute SHA-1, SHA-256, SHA-384, and SHA-512 message digests using browser-native Web Crypto API."
        category="Security"
      />

      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" /> Web Crypto API (100% Client-Side)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isUppercase}
              onChange={(e) => handleUppercaseToggle(e.target.checked)}
              className="rounded bg-zinc-950 border-zinc-700 text-blue-600 focus:ring-0"
            />
            <span>UPPERCASE Hashes</span>
          </label>

          <button
            onClick={() => handleInputChange("")}
            className="p-2 bg-zinc-800 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 rounded-lg transition"
            title="Clear text"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Input area */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Input Text</label>
        <textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Enter text to generate hashes..."
          className="w-full h-32 font-mono text-xs bg-zinc-950 text-zinc-100 p-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-blue-500/50 resize-y"
        />
      </div>

      {/* Hash outputs */}
      <div className="space-y-4">
        {(["SHA-256", "SHA-512", "SHA-1", "SHA-384"] as const).map((algo) => (
          <div
            key={algo}
            className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl transition hover:border-zinc-700"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-zinc-200 uppercase tracking-wide">
                  {algo}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  ({algo === "SHA-256" ? "256 bits / 32 bytes" : algo === "SHA-512" ? "512 bits / 64 bytes" : algo === "SHA-1" ? "160 bits" : "384 bits"})
                </span>
              </div>
              <CopyButton text={hashes[algo]} size="sm" toastMessage={`${algo} hash copied!`} />
            </div>

            <div className="font-mono text-xs bg-zinc-950 p-3 rounded-lg border border-zinc-800 text-blue-300 break-all select-all">
              {hashes[algo] || <span className="text-zinc-600 italic">Enter input to view hash...</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
