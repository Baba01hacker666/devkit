"use client";

import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { CopyButton } from "@/components/ui/CopyButton";
import { Type, Trash2, FileText } from "lucide-react";

export function CaseConverterTool() {
  const [input, setInput] = useState("Developer tools dashboard for modern software engineers");

  // Calculate text statistics
  const stats = useMemo(() => {
    const chars = input.length;
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    const lines = input ? input.split("\n").length : 0;
    const bytes = new TextEncoder().encode(input).length;
    return { chars, words, lines, bytes };
  }, [input]);

  // Transformed outputs
  const conversions = useMemo(() => {
    if (!input.trim()) return [];

    const words = input
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[^a-zA-Z0-9]+/g, " ")
      .trim()
      .split(/\s+/);

    return [
      {
        name: "lowercase",
        value: input.toLowerCase(),
        description: "all letters in lower case",
      },
      {
        name: "UPPERCASE",
        value: input.toUpperCase(),
        description: "ALL LETTERS IN UPPER CASE",
      },
      {
        name: "camelCase",
        value: words
          .map((w, i) =>
            i === 0
              ? w.toLowerCase()
              : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
          )
          .join(""),
        description: "firstLetterLowercaseThenCapitalized",
      },
      {
        name: "PascalCase",
        value: words
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(""),
        description: "FirstLetterEveryWordCapitalized",
      },
      {
        name: "snake_case",
        value: words.map((w) => w.toLowerCase()).join("_"),
        description: "words_joined_by_underscores",
      },
      {
        name: "kebab-case",
        value: words.map((w) => w.toLowerCase()).join("-"),
        description: "words-joined-by-hyphens",
      },
      {
        name: "CONSTANT_CASE",
        value: words.map((w) => w.toUpperCase()).join("_"),
        description: "ALL_CAPS_JOINED_BY_UNDERSCORES",
      },
      {
        name: "Title Case",
        value: words
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" "),
        description: "Every Word Capitalized",
      },
      {
        name: "Sentence case",
        value: input.charAt(0).toUpperCase() + input.slice(1).toLowerCase(),
        description: "First letter capitalized",
      },
      {
        name: "dot.case",
        value: words.map((w) => w.toLowerCase()).join("."),
        description: "words.joined.by.dots",
      },
      {
        name: "path/case",
        value: words.map((w) => w.toLowerCase()).join("/"),
        description: "words/joined/by/slashes",
      },
      {
        name: "aLtErNaTiNg cAsE",
        value: input
          .split("")
          .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
          .join(""),
        description: "aLtErNaTiNg cHaRaCtEr cAsE",
      },
    ];
  }, [input]);

  return (
    <div>
      <ToolHeader
        id="case-converter"
        name="Text Case Converter"
        description="Convert string casing between camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and more."
        category="Text"
      />

      {/* Input & Stats Header */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-zinc-300">Input String</label>
          <button
            onClick={() => setInput("")}
            className="text-xs text-zinc-400 hover:text-rose-400 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text to transform..."
          className="w-full h-32 font-mono text-xs bg-zinc-950 text-zinc-100 p-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-blue-500/50 resize-y"
        />

        {/* Text statistics badges */}
        <div className="flex flex-wrap items-center gap-3 p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="font-semibold">Text Metrics:</span>
          </div>
          <span className="text-zinc-400">
            Characters: <strong className="text-zinc-200">{stats.chars}</strong>
          </span>
          <span className="text-zinc-400">
            Words: <strong className="text-zinc-200">{stats.words}</strong>
          </span>
          <span className="text-zinc-400">
            Lines: <strong className="text-zinc-200">{stats.lines}</strong>
          </span>
          <span className="text-zinc-400">
            Bytes: <strong className="text-zinc-200">{stats.bytes} B</strong>
          </span>
        </div>
      </div>

      {/* Casing Conversion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {conversions.map((item, idx) => (
          <div
            key={idx}
            className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl hover:border-zinc-700 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-blue-400 uppercase tracking-wide">
                  {item.name}
                </span>
                <CopyButton text={item.value} size="sm" />
              </div>
              <p className="font-mono text-xs text-zinc-100 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 break-all select-all font-medium">
                {item.value || <em className="text-zinc-600">empty</em>}
              </p>
            </div>
            <p className="text-[10px] text-zinc-500 mt-2 italic">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
