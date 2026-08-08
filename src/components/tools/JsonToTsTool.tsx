"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { Editor } from "@/components/ui/Editor";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { useToast } from "@/components/ui/Toast";
import { Download, Trash2, FileCode, AlertTriangle } from "lucide-react";

const SAMPLE_JSON = `{
  "id": 101,
  "username": "johndoe",
  "email": "john@example.com",
  "isVerified": true,
  "roles": ["admin", "developer"],
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "avatarUrl": null,
    "score": 98.5
  },
  "settings": {
    "theme": "dark",
    "notifications": {
      "email": true,
      "push": false
    }
  }
}`;

export function JsonToTsTool() {
  const [jsonInput, setJsonInput] = useState(SAMPLE_JSON);
  const [rootName, setRootName] = useState("Root");
  const [useType, setUseType] = useState(false);
  const [useExport, setUseExport] = useState(true);
  const { toast } = useToast();

  const { tsOutput, parseError } = useMemo(() => {
    if (!jsonInput.trim()) {
      return { tsOutput: "", parseError: null };
    }

    try {
      const parsed = JSON.parse(jsonInput);
      return {
        tsOutput: generateTs(parsed, rootName, { useType, useExport }),
        parseError: null,
      };
    } catch (err: unknown) {
      return {
        tsOutput: "",
        parseError: err instanceof Error ? err.message : "Invalid JSON syntax",
      };
    }
  }, [jsonInput, rootName, useType, useExport]);

  const handleDownload = () => {
    if (!tsOutput) return;
    const blob = new Blob([tsOutput], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${rootName.toLowerCase() || "types"}.ts`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ type: "success", title: "Downloaded TypeScript interfaces" });
  };

  return (
    <div>
      <ToolHeader
        id="json-to-typescript"
        name="JSON → TypeScript Converter"
        description="Convert raw JSON payloads into strongly typed TypeScript interfaces or type definitions instantly."
        category="JSON"
      />

      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400 font-medium">Root Name:</span>
            <input
              type="text"
              value={rootName}
              onChange={(e) => setRootName(e.target.value.replace(/[^a-zA-Z0-9_]/g, "") || "Root")}
              className="bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1 text-xs text-zinc-100 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useType}
              onChange={(e) => setUseType(e.target.checked)}
              className="rounded bg-zinc-950 border-zinc-700 text-blue-600 focus:ring-0"
            />
            <span>Use `type` instead of `interface`</span>
          </label>

          <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useExport}
              onChange={(e) => setUseExport(e.target.checked)}
              className="rounded bg-zinc-950 border-zinc-700 text-blue-600 focus:ring-0"
            />
            <span>Add `export` keyword</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <CopyButton text={tsOutput} label="Copy TS" toastMessage="TypeScript code copied!" />
          <button
            onClick={handleDownload}
            disabled={!tsOutput}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition disabled:opacity-40"
            title="Download .ts file"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => setJsonInput(SAMPLE_JSON)}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-lg transition"
            title="Load sample JSON"
          >
            <FileCode className="w-4 h-4" />
          </button>
          <button
            onClick={() => setJsonInput("")}
            className="p-2 bg-zinc-800 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 rounded-lg transition"
            title="Clear input"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {parseError && (
        <div className="mb-3 p-3 bg-rose-950/40 border border-rose-500/40 rounded-lg text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Invalid JSON: {parseError}</span>
        </div>
      )}

      {/* Side-by-Side Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">JSON Input</label>
          <Editor
            value={jsonInput}
            onChange={setJsonInput}
            language="json"
            height="450px"
            placeholder="Paste JSON here..."
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Generated TypeScript</label>
          <Editor
            value={tsOutput}
            readOnly
            language="typescript"
            height="450px"
            placeholder="TypeScript definitions will appear here automatically..."
          />
        </div>
      </div>
    </div>
  );
}

/** TypeScript Generator helper function */
function generateTs(
  obj: unknown,
  rootTypeName: string,
  options: { useType: boolean; useExport: boolean }
): string {
  const interfaces: string[] = [];
  const exp = options.useExport ? "export " : "";

  function toPascalCase(str: string): string {
    return str
      .replace(/[^a-zA-Z0-9]/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("");
  }

  function getType(val: unknown, keyName: string): string {
    if (val === null) return "any | null";
    if (val === undefined) return "undefined";
    const t = typeof val;

    if (t === "string") return "string";
    if (t === "number") return "number";
    if (t === "boolean") return "boolean";

    if (Array.isArray(val)) {
      if (val.length === 0) return "any[]";
      const itemTypes = Array.from(
        new Set(val.map((item, idx) => getType(item, `${keyName}Item${idx}`)))
      );
      if (itemTypes.length === 1) return `${itemTypes[0]}[]`;
      return `(${itemTypes.join(" | ")})[]`;
    }

    if (t === "object") {
      const typeName = toPascalCase(keyName) || "NestedObject";
      generateObjectInterface(val as Record<string, unknown>, typeName);
      return typeName;
    }

    return "any";
  }

  function generateObjectInterface(record: Record<string, unknown>, name: string) {
    const keys = Object.keys(record);
    const lines: string[] = [];

    for (const key of keys) {
      const val = record[key];
      const fieldType = getType(val, key);
      const isNullable = val === null ? "?" : "";
      const validKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
      lines.push(`  ${validKey}${isNullable}: ${fieldType};`);
    }

    if (options.useType) {
      interfaces.push(`${exp}type ${name} = {\n${lines.join("\n")}\n};`);
    } else {
      interfaces.push(`${exp}interface ${name} {\n${lines.join("\n")}\n}`);
    }
  }

  if (Array.isArray(obj)) {
    const itemType = getType(obj[0], `${rootTypeName}Item`);
    if (options.useType) {
      return `${exp}type ${rootTypeName} = ${itemType}[];\n\n` + interfaces.reverse().join("\n\n");
    }
    return `${exp}interface ${rootTypeName} Array<${itemType}> {}\n\n` + interfaces.reverse().join("\n\n");
  }

  if (typeof obj === "object" && obj !== null) {
    generateObjectInterface(obj as Record<string, unknown>, rootTypeName);
    return interfaces.reverse().join("\n\n");
  }

  return `${exp}type ${rootTypeName} = ${typeof obj};`;
}
