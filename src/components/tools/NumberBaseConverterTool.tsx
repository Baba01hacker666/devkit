"use client";

import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { CopyButton } from "@/components/ui/CopyButton";
import { Binary, AlertTriangle } from "lucide-react";

type BaseResult =
  | { valid: false; error: string }
  | {
      valid: true;
      dec: string;
      bin: string;
      binPadded: string;
      oct: string;
      hex: string;
      byteCount: number;
    };

export function NumberBaseConverterTool() {
  const [decInput, setDecInput] = useState("255");

  const parsed = useMemo<BaseResult | null>(() => {
    if (!decInput.trim()) return null;
    const num = Number(decInput.trim());
    if (isNaN(num)) return { valid: false, error: "Invalid decimal number" };

    const intVal = Math.floor(num);
    const bin = (intVal >>> 0).toString(2);
    const oct = (intVal >>> 0).toString(8);
    const hex = (intVal >>> 0).toString(16).toUpperCase();

    // 8-bit padded binary
    const binPadded = bin.padStart(Math.ceil(bin.length / 8) * 8 || 8, "0");

    return {
      valid: true,
      dec: String(intVal),
      bin: bin,
      binPadded: binPadded,
      oct: oct,
      hex: hex,
      byteCount: Math.ceil(bin.length / 8) || 1,
    };
  }, [decInput]);

  return (
    <div>
      <ToolHeader
        id="base-converter"
        name="Number Base Converter"
        description="Convert numbers between Binary (Base 2), Octal (Base 8), Decimal (Base 10), and Hexadecimal (Base 16)."
        category="Utilities"
      />

      {/* Input */}
      <div className="mb-6 p-5 bg-zinc-900/80 border border-zinc-800 rounded-xl">
        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Decimal Number Input</label>
        <input
          type="number"
          value={decInput}
          onChange={(e) => setDecInput(e.target.value)}
          placeholder="e.g. 255"
          className="w-full max-w-xs bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2 font-mono text-base text-zinc-100 focus:outline-none focus:border-blue-500"
        />
      </div>

      {parsed && !parsed.valid ? (
        <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{parsed.error}</span>
        </div>
      ) : (
        parsed?.valid && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <BaseCard label="Decimal (Base 10)" value={parsed.dec} />
              <BaseCard label="Binary (Base 2)" value={parsed.binPadded} />
              <BaseCard label="Hexadecimal (Base 16)" value={`0x${parsed.hex}`} />
              <BaseCard label="Octal (Base 8)" value={`0o${parsed.oct}`} />
            </div>

            {/* Bit Grid Visualizer */}
            <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-3">
              <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                <Binary className="w-4 h-4 text-blue-400" />
                Bit Grid Representation ({parsed.binPadded.length} bits)
              </h3>

              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                {parsed.binPadded.split("").map((bit, idx) => (
                  <div
                    key={idx}
                    className={`w-8 h-10 rounded flex flex-col items-center justify-center border ${
                      bit === "1"
                        ? "bg-blue-600/20 border-blue-500/40 text-blue-300 font-bold"
                        : "bg-zinc-950 border-zinc-800 text-zinc-600"
                    }`}
                  >
                    <span>{bit}</span>
                    <span className="text-[9px] text-zinc-500 mt-0.5">{parsed.binPadded.length - 1 - idx}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

function BaseCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-400">{label}</span>
        <CopyButton text={value} size="sm" />
      </div>
      <p className="font-mono text-sm font-bold text-blue-400 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 break-all select-all">
        {value}
      </p>
    </div>
  );
}
