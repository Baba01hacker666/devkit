"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { CopyButton } from "@/components/ui/CopyButton";
import { RefreshCw, TextQuote } from "lucide-react";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "eu", "fugiat", "nulla", "pariatur", "excepteur",
  "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui",
  "officia", "deserunt", "mollit", "anim", "id", "est", "laborum", "harum",
  "quidem", "rerum", "facilis", "expedita", "distinctio", "nam", "libero",
  "tempore", "cum", "soluta", "nobis", "eligendi", "optio", "cumque", "nihil",
  "impedit", "quo", "minus", "quod", "maxime", "placeat", "facere", "possimus",
  "omnis", "voluptas", "assumenda", "repellendus", "temporibus", "quibusdam",
  "aut", "officiis", "debitis", "rerum", "necessitatibus", "saepe", "eveniet",
];

const CLASSIC_OPENER = "lorem ipsum dolor sit amet, consectetur adipiscing elit,";

function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function randomWord(): string {
  return LOREM_WORDS[randomInt(LOREM_WORDS.length)];
}

function makeSentence(startClassic: boolean): string {
  if (startClassic) {
    return "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  }
  const wordCount = 6 + randomInt(9); // 6-14 words
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(randomWord());
  }
  return capitalize(words.join(" ")) + ".";
}

function makeParagraph(startClassic: boolean): string {
  const sentenceCount = 3 + randomInt(4); // 3-6 sentences
  const sentences: string[] = [];
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(makeSentence(startClassic && i === 0));
  }
  return sentences.join(" ");
}

function generateLorem(
  mode: "words" | "sentences" | "paragraphs",
  count: number,
  startClassic: boolean,
  html: boolean
): string {
  const capped = Math.min(Math.max(count, 1), 1000);

  if (mode === "words") {
    const words: string[] = [];
    if (startClassic) {
      words.push(...CLASSIC_OPENER.split(" "));
    }
    while (words.length < capped) {
      words.push(randomWord());
    }
    const text = capitalize(words.slice(0, capped).join(" ")) + ".";
    return text;
  }

  if (mode === "sentences") {
    const sentences: string[] = [];
    for (let i = 0; i < capped; i++) {
      sentences.push(makeSentence(startClassic && i === 0));
    }
    return sentences.join(" ");
  }

  // paragraphs
  const paragraphs: string[] = [];
  for (let i = 0; i < capped; i++) {
    const body = makeParagraph(startClassic && i === 0);
    paragraphs.push(html ? `<p>${body}</p>` : body);
  }
  return paragraphs.join("\n\n");
}

const DEFAULT_MODE: "words" | "sentences" | "paragraphs" = "paragraphs";

export function LoremIpsumTool() {
  const [mode, setMode] = useState<"words" | "sentences" | "paragraphs">(DEFAULT_MODE);
  const [count, setCount] = useState(3);
  const [startClassic, setStartClassic] = useState(true);
  const [html, setHtml] = useState(false);
  const [output, setOutput] = useState(() => generateLorem(DEFAULT_MODE, 3, true, false));

  const handleGenerate = () => {
    setOutput(generateLorem(mode, count, startClassic, html));
  };

  return (
    <div>
      <ToolHeader
        id="lorem-ipsum"
        name="Lorem Ipsum Generator"
        description="Generate classic lorem ipsum placeholder text in words, sentences, or paragraphs with optional HTML markup."
        category="Text"
      />

      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            {(["words", "sentences", "paragraphs"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1 rounded-md font-semibold transition capitalize ${
                  mode === m
                    ? "bg-blue-600 text-white shadow"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-300 capitalize">
              {mode}:
            </span>
            <input
              type="number"
              min={1}
              max={1000}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-20 bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={startClassic}
              onChange={(e) => setStartClassic(e.target.checked)}
              className="rounded bg-zinc-950 border-zinc-700 text-blue-600 focus:ring-0"
            />
            <span>Start with classic opener</span>
          </label>

          <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={html}
              onChange={(e) => setHtml(e.target.checked)}
              className="rounded bg-zinc-950 border-zinc-700 text-blue-600 focus:ring-0"
            />
            <span>Wrap paragraphs in HTML</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerate}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate</span>
          </button>

          <CopyButton text={output} label="Copy Text" toastMessage="Lorem ipsum copied!" />
        </div>
      </div>

      {/* Output */}
      <div>
        <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
          Generated Output
        </label>
        <textarea
          readOnly
          value={output}
          placeholder="Generated placeholder text will appear here..."
          className="w-full h-96 font-mono text-xs bg-zinc-950 text-zinc-100 p-3.5 rounded-xl border border-zinc-800 focus:outline-none resize-y"
        />
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-500">
          <TextQuote className="w-3.5 h-3.5" />
          <span>
            {mode === "words"
              ? `${output.trim().split(/\s+/).length} words generated`
              : mode === "sentences"
              ? `${output.split(/[.!?]+/).filter(Boolean).length} sentences generated`
              : `${output.split(/\n\n/).length} paragraphs generated`}
          </span>
        </div>
      </div>
    </div>
  );
}
