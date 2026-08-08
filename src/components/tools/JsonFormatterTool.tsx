"use client";

import { useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { Editor } from "@/components/ui/Editor";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { useToast } from "@/components/ui/Toast";
import { Upload, Download, Trash2, CheckCircle2, AlertTriangle, FileCode } from "lucide-react";

const SAMPLE_JSON = `{
  "appName": "DevKit",
  "version": "1.0.0",
  "description": "Production-quality developer tools dashboard",
  "active": true,
  "features": [
    "JSON Formatter",
    "JWT Decoder",
    "Regex Tester",
    "HTTP Header Security Analyzer"
  ],
  "environment": {
    "node": "v26.5.0",
    "framework": "Next.js",
    "theme": "dark"
  }
}`;

export function JsonFormatterTool() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [indent, setIndent] = useState<number>(2);
  const [errorInfo, setErrorInfo] = useState<{ message: string; line?: number; col?: number } | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(true);
  const { toast } = useToast();

  const handleFormat = () => {
    try {
      if (!input.trim()) {
        setErrorInfo(null);
        setIsValid(null);
        return;
      }
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indent);
      setInput(formatted);
      setErrorInfo(null);
      setIsValid(true);
      toast({ type: "success", title: "JSON Formatted successfully" });
    } catch (err: unknown) {
      setIsValid(false);
      parseErrorLocation(err, input);
      toast({ type: "error", title: "Invalid JSON format" });
    }
  };

  const handleMinify = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setInput(minified);
      setErrorInfo(null);
      setIsValid(true);
      toast({ type: "success", title: "JSON Minified successfully" });
    } catch (err: unknown) {
      setIsValid(false);
      parseErrorLocation(err, input);
      toast({ type: "error", title: "Invalid JSON format" });
    }
  };

  const handleValidate = () => {
    try {
      if (!input.trim()) {
        toast({ type: "info", title: "Input is empty" });
        return;
      }
      JSON.parse(input);
      setErrorInfo(null);
      setIsValid(true);
      toast({ type: "success", title: "Valid JSON syntax!" });
    } catch (err: unknown) {
      setIsValid(false);
      parseErrorLocation(err, input);
      toast({ type: "error", title: "Invalid JSON syntax" });
    }
  };

  const parseErrorLocation = (err: unknown, str: string) => {
    const msg = err instanceof Error ? err.message : "Unknown JSON syntax error";
    // Parse line and column from error message if available (e.g. "at position 45" or "line 3 column 5")
    let line: number | undefined;
    let col: number | undefined;

    const posMatch = msg.match(/position\s+(\d+)/i);
    if (posMatch && posMatch[1]) {
      const pos = parseInt(posMatch[1], 10);
      const lines = str.substring(0, pos).split("\n");
      line = lines.length;
      col = (lines[lines.length - 1]?.length || 0) + 1;
    } else {
      const lineColMatch = msg.match(/line\s+(\d+)\s+column\s+(\d+)/i);
      if (lineColMatch) {
        line = parseInt(lineColMatch[1], 10);
        col = parseInt(lineColMatch[2], 10);
      }
    }

    setErrorInfo({ message: msg, line, col });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInput(text);
      toast({ type: "success", title: `Loaded ${file.name}` });
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (!input) return;
    const blob = new Blob([input], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
    toast({ type: "success", title: "Downloaded data.json" });
  };

  return (
    <div>
      <ToolHeader
        id="json-formatter"
        name="JSON Formatter & Validator"
        description="Format, validate, and minify JSON payloads with line & column error identification."
        category="JSON"
      />

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleFormat}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow transition"
          >
            Format JSON
          </button>
          <button
            onClick={handleMinify}
            className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold transition"
          >
            Minify JSON
          </button>
          <button
            onClick={handleValidate}
            className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold transition"
          >
            Validate JSON
          </button>

          <div className="h-4 w-px bg-zinc-700 mx-1 hidden sm:block" />

          {/* Indentation Selector */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span>Indent:</span>
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-200 focus:outline-none"
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
              <option value={1}>Tab</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="json-file-input"
            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium transition"
          >
            <Upload className="w-3.5 h-3.5 text-zinc-400" />
            <span>Upload</span>
            <input
              id="json-file-input"
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <CopyButton text={input} toastMessage="JSON copied to clipboard!" />

          <button
            onClick={handleDownload}
            disabled={!input}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium transition disabled:opacity-40"
            title="Download JSON file"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => setInput(SAMPLE_JSON)}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-lg transition"
            title="Load sample JSON"
          >
            <FileCode className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setInput("");
              setErrorInfo(null);
              setIsValid(null);
            }}
            className="p-2 bg-zinc-800 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 rounded-lg transition"
            title="Clear editor"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error & Validation Status Badge */}
      {isValid === true && (
        <div className="mb-3 p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Valid JSON structure</span>
        </div>
      )}

      {isValid === false && errorInfo && (
        <div className="mb-3 p-3.5 bg-rose-950/40 border border-rose-500/40 rounded-lg text-rose-300 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Syntax Error: {errorInfo.message}</p>
            {errorInfo.line && (
              <p className="text-rose-400 font-mono text-[11px]">
                Error identified at Line {errorInfo.line}
                {errorInfo.col ? `, Column ${errorInfo.col}` : ""}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Editor */}
      <Editor
        value={input}
        onChange={(val) => {
          setInput(val);
          setIsValid(null);
          setErrorInfo(null);
        }}
        language="json"
        height="450px"
        placeholder="Paste or type JSON content here..."
      />
    </div>
  );
}
