"use client";

import { useMemo, useState } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { CopyButton } from "@/components/ui/CopyButton";
import { ArrowLeftRight, AlertCircle, FileSpreadsheet } from "lucide-react";

const DEFAULT_CSV =
  'name,email,role\nAda Lovelace,ada@example.com,Engineer\nGrace Hopper,grace@example.com,Admiral\nAlan Turing,alan@example.com,Mathematician';

/** RFC-4180 style CSV parser: quoted fields, escaped quotes, commas & newlines inside quotes. */
export function parseCsv(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const src = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      field = "";
      if (row.some((c) => c !== "")) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }

  if (field !== "" || row.length > 0) {
    row.push(field);
    if (row.some((c) => c !== "")) rows.push(row);
  }

  return rows;
}

function escapeCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function csvToJson(csv: string, delimiter: string, hasHeader: boolean): string {
  const rows = parseCsv(csv, delimiter);
  if (rows.length === 0) throw new Error("No rows found in input CSV.");

  if (!hasHeader) {
    return JSON.stringify(rows, null, 2);
  }

  const headers = rows[0];
  const body = rows.slice(1);
  const objects = body.map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((header, idx) => {
      obj[header] = row[idx] ?? "";
    });
    return obj;
  });
  return JSON.stringify(objects, null, 2);
}

function jsonToCsv(jsonText: string, delimiter: string): string {
  let data: unknown;
  try {
    data = JSON.parse(jsonText);
  } catch {
    throw new Error("Input is not valid JSON.");
  }

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("JSON must be a non-empty array of objects.");
  }

  const isArrayOfArrays = data.every((r) => Array.isArray(r));
  if (isArrayOfArrays) {
    const rows = data as unknown[][];
    return rows.map((r) => r.map((v) => escapeCsvField(String(v))).join(delimiter)).join("\n");
  }

  if (!data.every((r) => r !== null && typeof r === "object" && !Array.isArray(r))) {
    throw new Error("JSON array items must be objects (or arrays).");
  }
  const objects = data as Record<string, unknown>[];

  const headers = new Set<string>();
  for (const obj of objects) {
    for (const key of Object.keys(obj)) {
      headers.add(key);
    }
  }
  const headerList = [...headers];
  const lines = [headerList.map((h) => escapeCsvField(h)).join(delimiter)];
  for (const obj of objects) {
    lines.push(
      headerList
        .map((h) => escapeCsvField(obj[h] === undefined || obj[h] === null ? "" : String(obj[h])))
        .join(delimiter)
    );
  }
  return lines.join("\n");
}

type Mode = "csv-to-json" | "json-to-csv";

const DELIMITERS = [
  { label: "Comma (,)", value: "," },
  { label: "Semicolon (;)", value: ";" },
  { label: "Tab", value: "\t" },
  { label: "Pipe (|)", value: "|" },
];

export function CsvToJsonTool() {
  const [mode, setMode] = useState<Mode>("csv-to-json");
  const [input, setInput] = useState(DEFAULT_CSV);
  const [delimiter, setDelimiter] = useState(",");
  const [hasHeader, setHasHeader] = useState(true);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null };
    try {
      if (mode === "csv-to-json") {
        return { output: csvToJson(input, delimiter, hasHeader), error: null };
      }
      return { output: jsonToCsv(input, delimiter), error: null };
    } catch (err: unknown) {
      return {
        output: "",
        error: err instanceof Error ? err.message : "Conversion failed.",
      };
    }
  }, [input, mode, delimiter, hasHeader]);

  const handleSwap = () => {
    if (output && !error) {
      setInput(output);
      setMode((prev) => (prev === "csv-to-json" ? "json-to-csv" : "csv-to-json"));
    }
  };

  return (
    <div>
      <ToolHeader
        id="csv-json"
        name="CSV ↔ JSON Converter"
        description="Convert between CSV and JSON instantly, with support for quoted fields, custom delimiters, and header rows."
        category="Encoding"
      />

      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setMode("csv-to-json")}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                mode === "csv-to-json"
                  ? "bg-blue-600 text-white shadow"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              CSV → JSON
            </button>
            <button
              onClick={() => setMode("json-to-csv")}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                mode === "json-to-csv"
                  ? "bg-blue-600 text-white shadow"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              JSON → CSV
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-300">Delimiter:</span>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100 focus:outline-none"
            >
              {DELIMITERS.map((d) => (
                <option key={d.label} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {mode === "csv-to-json" && (
            <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasHeader}
                onChange={(e) => setHasHeader(e.target.checked)}
                className="rounded bg-zinc-950 border-zinc-700 text-blue-600 focus:ring-0"
              />
              <span>First row is header</span>
            </label>
          )}
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
          <CopyButton text={output} label="Copy Output" toastMessage="Converted output copied!" />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-950/40 border border-rose-500/40 rounded-lg text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Input / Output Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
            {mode === "csv-to-json" ? "CSV Input" : "JSON Input"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "csv-to-json" ? "Paste CSV data..." : 'Paste JSON array of objects, e.g. [{"name":"Ada"}]'}
            className="w-full h-96 font-mono text-xs bg-zinc-950 text-zinc-100 p-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-blue-500/50 resize-y"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
            {mode === "csv-to-json" ? "JSON Output" : "CSV Output"}
          </label>
          <textarea
            readOnly
            value={output}
            placeholder="Converted output will appear here..."
            className="w-full h-96 font-mono text-xs bg-zinc-950 text-zinc-100 p-3.5 rounded-xl border border-zinc-800 focus:outline-none resize-y"
          />
        </div>
      </div>

      {mode === "csv-to-json" && (
        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-500">
          <FileSpreadsheet className="w-3.5 h-3.5" />
          Handles quoted fields, escaped quotes ({'"""'}), commas and newlines inside quoted fields.
        </p>
      )}
    </div>
  );
}
