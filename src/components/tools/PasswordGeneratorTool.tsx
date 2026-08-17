"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { animate } from "animejs";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { CopyButton } from "@/components/ui/CopyButton";
import { RefreshCw, Key, AlertCircle } from "lucide-react";

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>?";
const AMBIGUOUS = "Il1O0o|`'\"";

/** Crypto-secure random integer in [0, max). */
function randomInt(max: number): number {
  const buf = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / max) * max;
  let value = 0;
  do {
    crypto.getRandomValues(buf);
    value = buf[0];
  } while (value >= limit);
  return value % max;
}

interface GenerateOptions {
  length: number;
  count: number;
  useUpper: boolean;
  useLower: boolean;
  useDigits: boolean;
  useSymbols: boolean;
  excludeAmbiguous: boolean;
}

function generatePasswords(opts: GenerateOptions): string[] {
  let pool = "";
  const mandatory: string[] = [];
  const sets: Array<[boolean, string]> = [
    [opts.useUpper, UPPERCASE],
    [opts.useLower, LOWERCASE],
    [opts.useDigits, DIGITS],
    [opts.useSymbols, SYMBOLS],
  ];

  for (const [enabled, set] of sets) {
    if (!enabled) continue;
    const cleaned = opts.excludeAmbiguous
      ? [...set].filter((c) => !AMBIGUOUS.includes(c)).join("")
      : set;
    if (!cleaned) continue;
    pool += cleaned;
    mandatory.push(cleaned);
  }

  if (!pool || mandatory.length === 0) return [];

  const len = Math.max(Math.min(opts.length, 128), Math.max(4, mandatory.length));
  const limit = Math.min(Math.max(opts.count, 1), 50);
  const result: string[] = [];

  for (let n = 0; n < limit; n++) {
    const chars: string[] = [];
    for (const set of mandatory) {
      chars.push(set[randomInt(set.length)]);
    }
    while (chars.length < len) {
      chars.push(pool[randomInt(pool.length)]);
    }
    // Fisher-Yates shuffle so guaranteed chars are not positionally predictable
    for (let i = chars.length - 1; i > 0; i--) {
      const j = randomInt(i + 1);
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    result.push(chars.join(""));
  }

  return result;
}

const DEFAULT_OPTS: GenerateOptions = {
  length: 16,
  count: 5,
  useUpper: true,
  useLower: true,
  useDigits: true,
  useSymbols: false,
  excludeAmbiguous: false,
};

export function PasswordGeneratorTool() {
  const [length, setLength] = useState(DEFAULT_OPTS.length);
  const [count, setCount] = useState(DEFAULT_OPTS.count);
  const [useUpper, setUseUpper] = useState(DEFAULT_OPTS.useUpper);
  const [useLower, setUseLower] = useState(DEFAULT_OPTS.useLower);
  const [useDigits, setUseDigits] = useState(DEFAULT_OPTS.useDigits);
  const [useSymbols, setUseSymbols] = useState(DEFAULT_OPTS.useSymbols);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(DEFAULT_OPTS.excludeAmbiguous);
  const [passwords, setPasswords] = useState<string[]>(() =>
    generatePasswords(DEFAULT_OPTS)
  );
  const listRef = useRef<HTMLDivElement | null>(null);

  const handleGenerate = () => {
    setPasswords(generatePasswords({ length, count, useUpper, useLower, useDigits, useSymbols, excludeAmbiguous }));
    if (listRef.current) {
      animate(listRef.current, {
        opacity: [0.4, 1],
        translateY: [-4, 0],
        duration: 250,
        ease: "easeOutQuad",
      });
    }
  };

  const noCharsetSelected = !(useUpper || useLower || useDigits || useSymbols);

  return (
    <div>
      <ToolHeader
        id="password-generator"
        name="Password Generator"
        description="Generate cryptographically secure random passwords using the browser's Web Crypto API."
        category="Security"
      />

      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-300">Length:</span>
            <input
              type="number"
              min={4}
              max={128}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-20 bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-300">Count:</span>
            <input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-16 bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          {(
            [
              [useUpper, setUseUpper, "A-Z"],
              [useLower, setUseLower, "a-z"],
              [useDigits, setUseDigits, "0-9"],
              [useSymbols, setUseSymbols, "Symbols"],
            ] as Array<[boolean, (v: boolean) => void, string]>
          ).map(([checked, onChange, label]) => (
            <label
              key={label}
              className="flex items-center gap-1.5 text-zinc-300 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="rounded bg-zinc-950 border-zinc-700 text-blue-600 focus:ring-0"
              />
              <span>{label}</span>
            </label>
          ))}

          <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={(e) => setExcludeAmbiguous(e.target.checked)}
              className="rounded bg-zinc-950 border-zinc-700 text-blue-600 focus:ring-0"
            />
            <span>Exclude ambiguous (Il1O0)</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleGenerate}
            disabled={noCharsetSelected}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate</span>
          </motion.button>

          <CopyButton
            text={passwords.join("\n")}
            label="Copy All"
            toastMessage={`Copied ${passwords.length} passwords`}
          />
        </div>
      </div>

      {noCharsetSelected && (
        <div className="mb-4 p-3 bg-rose-950/40 border border-rose-500/40 rounded-lg text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Select at least one character set to generate passwords.</span>
        </div>
      )}

      {/* Generated list */}
      <div ref={listRef} className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {passwords.map((pw, idx) => (
            <motion.div
              key={`${pw}-${idx}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-between p-3 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 rounded-xl transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Key className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-mono text-xs text-zinc-100 select-all break-all">{pw}</span>
              </div>
              <CopyButton text={pw} size="sm" toastMessage="Password copied!" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
