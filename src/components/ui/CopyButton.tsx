"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useToast } from "./Toast";

interface CopyButtonProps {
  text: string;
  className?: string;
  label?: string;
  toastMessage?: string;
  size?: "sm" | "md" | "lg";
}

export function CopyButton({
  text,
  className = "",
  label,
  toastMessage = "Copied to clipboard!",
  size = "md",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({ type: "success", title: toastMessage });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ type: "error", title: "Failed to copy to clipboard" });
    }
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const buttonPaddings = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-xs font-medium",
    lg: "px-4 py-2 text-sm font-medium",
  };

  return (
    <button
      onClick={handleCopy}
      disabled={!text}
      title="Copy to clipboard (Ctrl+Shift+C)"
      className={`inline-flex items-center gap-1.5 rounded-md border border-zinc-700/60 bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed ${buttonPaddings[size]} ${className}`}
    >
      {copied ? (
        <Check className={`${iconSizes[size]} text-emerald-400`} />
      ) : (
        <Copy className={`${iconSizes[size]} text-zinc-400 group-hover:text-zinc-200`} />
      )}
      <span>{copied ? "Copied!" : label || "Copy"}</span>
    </button>
  );
}
