"use client";

import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { CopyButton } from "@/components/ui/CopyButton";
import { Sparkles, AlertTriangle } from "lucide-react";

interface RegexExample {
  title: string;
  pattern: string;
  flags: string;
  testText: string;
  description: string;
}

const COMMON_REGEXES: RegexExample[] = [
  {
    title: "Email Address",
    pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
    flags: "g",
    testText: "Contact support@devkit.io or dev-team@google.com for assistance.",
    description: "Matches standard internet email addresses.",
  },
  {
    title: "URL / Web Link",
    pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)",
    flags: "g",
    testText: "Visit https://devkit.io or http://localhost:3000/dev/regex for live testing.",
    description: "Matches HTTP and HTTPS URLs.",
  },
  {
    title: "IPv4 Address",
    pattern: "\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b",
    flags: "g",
    testText: "Server IPs: 192.168.1.1, 10.0.0.254, and external gateway 8.8.8.8.",
    description: "Matches valid IPv4 addresses (0.0.0.0 to 255.255.255.255).",
  },
  {
    title: "HEX Color Code",
    pattern: "#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})\\b",
    flags: "g",
    testText: "Theme palette: primary #3b82f6, background #09090b, accent #fff.",
    description: "Matches 3 or 6 digit CSS hex color codes.",
  },
];

export function RegexTesterTool() {
  const [pattern, setPattern] = useState(COMMON_REGEXES[0].pattern);
  const [flags, setFlags] = useState({ g: true, i: true, m: false, s: false, u: false, y: false });
  const [testText, setTestText] = useState(COMMON_REGEXES[0].testText);
  const [replaceText, setReplaceText] = useState("[REDACTED]");
  const [activeTab, setActiveTab] = useState<"matches" | "replace">("matches");

  const flagStr = useMemo(() => {
    return Object.entries(flags)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join("");
  }, [flags]);

  const { matches, error, replacedResult } = useMemo(() => {
    if (!pattern) {
      return { matches: [], error: null, replacedResult: testText };
    }

    try {
      const reg = new RegExp(pattern, flagStr);
      const matchResults: { index: number; match: string; groups: string[] }[] = [];

      if (flagStr.includes("g")) {
        let m: RegExpExecArray | null;
        let lastIndex = -1;
        while ((m = reg.exec(testText)) !== null) {
          if (reg.lastIndex === lastIndex) {
            break; // prevent infinite loop on empty match
          }
          lastIndex = reg.lastIndex;
          matchResults.push({
            index: m.index,
            match: m[0],
            groups: m.slice(1),
          });
        }
      } else {
        const m = reg.exec(testText);
        if (m) {
          matchResults.push({
            index: m.index,
            match: m[0],
            groups: m.slice(1),
          });
        }
      }

      const replaced = testText.replace(reg, replaceText);

      return {
        matches: matchResults,
        error: null,
        replacedResult: replaced,
      };
    } catch (err: unknown) {
      return {
        matches: [],
        error: err instanceof Error ? err.message : "Invalid regular expression pattern",
        replacedResult: "",
      };
    }
  }, [pattern, flagStr, testText, replaceText]);

  const loadExample = (ex: RegexExample) => {
    setPattern(ex.pattern);
    setTestText(ex.testText);
  };

  return (
    <div>
      <ToolHeader
        id="regex-tester"
        name="Regex Tester & Playground"
        description="Test, debug, and replace regular expressions live with match highlighting, capture groups, and explanation."
        category="Text"
      />

      {/* Preset Library */}
      <div className="mb-6 p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300 mb-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Common Regex Templates</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {COMMON_REGEXES.map((ex, i) => (
            <button
              key={i}
              onClick={() => loadExample(ex)}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium transition border border-zinc-700/60"
            >
              {ex.title}
            </button>
          ))}
        </div>
      </div>

      {/* Regex Pattern Input */}
      <div className="mb-6 p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-zinc-300">Regex Expression</label>
            <CopyButton text={`/${pattern}/${flagStr}`} size="sm" label="Copy Pattern" />
          </div>

          <div className="flex items-center bg-zinc-950 border border-zinc-800 focus-within:border-blue-500 rounded-xl overflow-hidden px-3 py-2 font-mono text-sm">
            <span className="text-zinc-500 text-base mr-1">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g. ([a-z]+)"
              className="flex-1 bg-transparent text-blue-400 placeholder-zinc-600 focus:outline-none"
            />
            <span className="text-zinc-500 text-base ml-1">/</span>
            <span className="text-amber-400 font-bold ml-1 text-xs">{flagStr}</span>
          </div>
        </div>

        {/* Flags Checkboxes */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <span className="font-semibold text-zinc-400">Flags:</span>
          {(["g", "i", "m", "s", "u", "y"] as const).map((flag) => (
            <label
              key={flag}
              className="flex items-center gap-1.5 text-zinc-300 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={flags[flag]}
                onChange={(e) =>
                  setFlags((prev) => ({ ...prev, [flag]: e.target.checked }))
                }
                className="rounded bg-zinc-950 border-zinc-700 text-blue-600 focus:ring-0"
              />
              <span className="font-mono font-bold text-amber-400">{flag}</span>
              <span className="text-[10px] text-zinc-500">
                ({flag === "g" ? "global" : flag === "i" ? "ignoreCase" : flag === "m" ? "multiline" : flag === "s" ? "dotAll" : flag === "u" ? "unicode" : "sticky"})
              </span>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Regex Error: {error}</span>
        </div>
      )}

      {/* Test String Input */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Test String</label>
        <textarea
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          placeholder="Paste sample text to test matches..."
          className="w-full h-36 font-mono text-xs bg-zinc-950 text-zinc-100 p-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-blue-500/50 resize-y"
        />
      </div>

      {/* Results Tabs */}
      <div className="border border-zinc-800 rounded-xl bg-zinc-900/60 overflow-hidden">
        <div className="flex border-b border-zinc-800 bg-zinc-950 px-4 pt-2">
          <button
            onClick={() => setActiveTab("matches")}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition ${
              activeTab === "matches"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Matches ({matches.length})
          </button>
          <button
            onClick={() => setActiveTab("replace")}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition ${
              activeTab === "replace"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Replace Preview
          </button>
        </div>

        <div className="p-4">
          {activeTab === "matches" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>
                  Matches Found: <strong className="text-emerald-400">{matches.length}</strong>
                </span>
              </div>

              {matches.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 text-xs italic">
                  No regex matches found in test string.
                </div>
              ) : (
                <div className="space-y-3">
                  {matches.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-blue-400">Match #{idx + 1}</span>
                        <span className="font-mono text-[10px] text-zinc-500">
                          Index: {m.index} | Length: {m.match.length}
                        </span>
                      </div>
                      <p className="font-mono bg-zinc-900 p-2 rounded border border-zinc-800 text-emerald-300 break-all">
                        {m.match}
                      </p>

                      {m.groups.length > 0 && (
                        <div className="pt-2 border-t border-zinc-800/60">
                          <span className="text-[11px] font-semibold text-zinc-400 block mb-1">
                            Capture Groups:
                          </span>
                          <div className="space-y-1 pl-2">
                            {m.groups.map((g, gIdx) => (
                              <div key={gIdx} className="font-mono text-[11px] flex gap-2">
                                <span className="text-amber-400 font-bold">${gIdx + 1}:</span>
                                <span className="text-zinc-200">{g || <em className="text-zinc-600">undefined</em>}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Replacement Pattern
                </label>
                <input
                  type="text"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  placeholder="e.g. [REDACTED] or $1"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Resulting Text Preview
                </label>
                <textarea
                  readOnly
                  value={replacedResult}
                  className="w-full h-36 font-mono text-xs bg-zinc-950 text-zinc-100 p-3.5 rounded-xl border border-zinc-800 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
