"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
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
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleCopy}
      disabled={!text}
      title="Copy to clipboard"
      className={`inline-flex items-center gap-1.5 rounded-md border border-zinc-700/60 bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${buttonPaddings[size]} ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            <Check className={`${iconSizes[size]} text-emerald-400`} />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            <Copy className={`${iconSizes[size]} text-zinc-400`} />
          </motion.span>
        )}
      </AnimatePresence>
      <span>{copied ? "Copied!" : label || "Copy"}</span>
    </motion.button>
  );
}
