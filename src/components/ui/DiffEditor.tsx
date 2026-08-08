"use client";

import dynamic from "next/dynamic";
import { useMounted } from "@/lib/use-mounted";

const MonacoDiffEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.DiffEditor),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-zinc-950/80 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 text-sm">
        <span className="inline-block animate-pulse">Loading diff engine...</span>
      </div>
    ),
  }
);

interface DiffEditorProps {
  original: string;
  modified: string;
  language?: string;
  height?: string;
  renderSideBySide?: boolean;
}

export function DiffEditorComponent({
  original,
  modified,
  language = "json",
  height = "420px",
  renderSideBySide = true,
}: DiffEditorProps) {
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1">Original</label>
          <textarea
            readOnly
            value={original}
            className="w-full h-[350px] font-mono text-xs bg-zinc-950 text-zinc-100 p-3 rounded-lg border border-zinc-800"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1">Modified</label>
          <textarea
            readOnly
            value={modified}
            className="w-full h-[350px] font-mono text-xs bg-zinc-950 text-zinc-100 p-3 rounded-lg border border-zinc-800"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
      <MonacoDiffEditor
        height={height}
        language={language}
        original={original}
        modified={modified}
        theme="vs-dark"
        options={{
          readOnly: true,
          renderSideBySide,
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: "on",
          lineNumbers: "on",
        }}
      />
    </div>
  );
}
