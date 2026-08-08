"use client";

import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { CopyButton } from "@/components/ui/CopyButton";
import { Editor } from "@/components/ui/Editor";
import { useToast } from "@/components/ui/Toast";

const SAMPLE_MARKDOWN = `# DevKit Markdown Previewer

Welcome to the live **Markdown** editor!

## Key Features
- **Fast**: Renders live preview as you type
- **Clean**: Renders tables, code blocks, & blockquotes
- **Exportable**: Copy rendered HTML or download \`.md\` / \`.html\`

### Code Example
\`\`\`typescript
const app = "DevKit";
console.log(\`Running \${app}\`);
\`\`\`

> "Simplicity is prerequisite for reliability." – Edsger W. Dijkstra
`;

export function MarkdownPreviewTool() {
  const [mdInput, setMdInput] = useState(SAMPLE_MARKDOWN);
  const [viewMode, setViewMode] = useState<"preview" | "html">("preview");
  const { toast } = useToast();

  const htmlResult = useMemo(() => {
    return parseMarkdownToHtml(mdInput);
  }, [mdInput]);

  const handleDownloadMd = () => {
    const blob = new Blob([mdInput], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    a.click();
    URL.revokeObjectURL(url);
    toast({ type: "success", title: "Downloaded document.md" });
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([htmlResult], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.html";
    a.click();
    URL.revokeObjectURL(url);
    toast({ type: "success", title: "Downloaded document.html" });
  };

  return (
    <div>
      <ToolHeader
        id="markdown"
        name="Markdown Live Preview & HTML Converter"
        description="Write Markdown and preview formatted HTML, headers, tables, and code blocks in real time."
        category="Text"
      />

      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs">
        <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 font-semibold">
          <button
            onClick={() => setViewMode("preview")}
            className={`px-3 py-1 rounded-md transition ${
              viewMode === "preview" ? "bg-blue-600 text-white shadow" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Formatted Preview
          </button>
          <button
            onClick={() => setViewMode("html")}
            className={`px-3 py-1 rounded-md transition ${
              viewMode === "html" ? "bg-blue-600 text-white shadow" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Raw HTML Output
          </button>
        </div>

        <div className="flex items-center gap-2">
          <CopyButton text={viewMode === "html" ? htmlResult : mdInput} label="Copy Output" toastMessage="Copied to clipboard!" />
          <button
            onClick={handleDownloadMd}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition text-[11px] font-mono"
            title="Download .md"
          >
            .MD
          </button>
          <button
            onClick={handleDownloadHtml}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition text-[11px] font-mono"
            title="Download .html"
          >
            .HTML
          </button>
        </div>
      </div>

      {/* Side-by-Side Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Markdown Input</label>
          <textarea
            value={mdInput}
            onChange={(e) => setMdInput(e.target.value)}
            placeholder="Type Markdown here..."
            className="w-full h-[450px] font-mono text-xs bg-zinc-950 text-zinc-100 p-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-blue-500/50 resize-y"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
            {viewMode === "preview" ? "Rendered HTML Preview" : "Raw HTML Markup"}
          </label>

          {viewMode === "preview" ? (
            <div
              dangerouslySetInnerHTML={{ __html: htmlResult }}
              className="w-full h-[450px] overflow-y-auto bg-zinc-950 p-5 rounded-xl border border-zinc-800 text-zinc-200 text-sm space-y-3 prose prose-invert max-w-none"
            />
          ) : (
            <Editor value={htmlResult} readOnly language="html" height="450px" />
          )}
        </div>
      </div>
    </div>
  );
}

/** Basic Markdown parser for headings, bold, italic, code, quotes, lists */
function parseMarkdownToHtml(md: string): string {
  const html = md
    .replace(/^### (.*$)/gim, '<h3 className="text-lg font-bold text-blue-400 mt-3 mb-1">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 className="text-xl font-bold text-zinc-100 mt-4 mb-2 border-b border-zinc-800 pb-1">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 className="text-2xl font-extrabold text-zinc-100 mt-2 mb-3">$1</h1>')
    .replace(/^> (.*$)/gim, '<blockquote className="border-l-4 border-blue-500 pl-3 italic text-zinc-400 bg-zinc-900/50 py-1 rounded-r">$1</blockquote>')
    .replace(/\*\*(.* logic)?\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*)\*/gim, "<em>$1</em>")
    .replace(/```([\s\S]*?)```/gim, '<pre className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg font-mono text-xs text-emerald-300 overflow-x-auto"><code>$1</code></pre>')
    .replace(/`([^`]+)`/gim, '<code className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded font-mono text-xs text-blue-300">$1</code>')
    .replace(/^- (.*$)/gim, '<li className="list-disc ml-5 text-zinc-300">$1</li>')
    .replace(/\n/g, "<br/>");

  return html;
}
