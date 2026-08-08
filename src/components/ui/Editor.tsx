"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[220px] bg-zinc-950/80 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 text-sm">
      <span className="inline-block animate-pulse">Loading editor...</span>
    </div>
  ),
});

interface EditorProps {
  value: string;
  onChange?: (val: string) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
  placeholder?: string;
  className?: string;
  lineNumbers?: "on" | "off";
  minimap?: boolean;
}

export function Editor({
  value,
  onChange,
  language = "json",
  readOnly = false,
  height = "320px",
  placeholder,
  className = "",
  lineNumbers = "on",
  minimap = false,
}: EditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        style={{ height }}
        className={`w-full font-mono text-xs bg-zinc-950 text-zinc-100 p-3 rounded-lg border border-zinc-800 focus:outline-none focus:border-blue-500/50 resize-y ${className}`}
      />
    );
  }

  return (
    <div className={`relative border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950 ${className}`}>
      <MonacoEditor
        height={height}
        language={language}
        value={value}
        onChange={(val) => onChange?.(val || "")}
        theme="vs-dark"
        options={{
          readOnly,
          minimap: { enabled: minimap },
          scrollBeyondLastLine: false,
          fontSize: 13,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          lineNumbers,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          padding: { top: 10, bottom: 10 },
          smoothScrolling: true,
          renderLineHighlight: "all",
          cursorBlinking: "smooth",
          domReadOnly: readOnly,
        }}
      />
    </div>
  );
}
