"use client";

import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { CopyButton } from "@/components/ui/CopyButton";
import { Palette, AlertTriangle } from "lucide-react";

export function ColorConverterTool() {
  const [colorInput, setColorInput] = useState("#3b82f6");

  const parsed = useMemo(() => {
    let hex = colorInput.trim();
    if (!hex.startsWith("#")) hex = "#" + hex;

    // Validate 3, 4, 6, 8 digit HEX
    const validHex = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(hex);

    if (!validHex) {
      return { valid: false, error: "Invalid HEX color format" };
    }

    let r = 0, g = 0, b = 0, a = 1;

    if (hex.length === 4 || hex.length === 5) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
      if (hex.length === 5) a = parseInt(hex[4] + hex[4], 16) / 255;
    } else {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
      if (hex.length === 9) a = parseInt(hex.substring(7, 9), 16) / 255;
    }

    // HSL
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rNorm:
          h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
          break;
        case gNorm:
          h = (bNorm - rNorm) / d + 2;
          break;
        case bNorm:
          h = (rNorm - gNorm) / d + 4;
          break;
      }
      h /= 6;
    }

    const hDeg = Math.round(h * 360);
    const sPct = Math.round(s * 100);
    const lPct = Math.round(l * 100);

    // WCAG Contrast against White and Black
    const luminance = 0.2126 * rNorm + 0.7152 * gNorm + 0.0722 * bNorm;
    const contrastWhite = ((1.0 + 0.05) / (luminance + 0.05)).toFixed(2);
    const contrastBlack = ((luminance + 0.05) / (0.0 + 0.05)).toFixed(2);

    return {
      valid: true,
      hex: hex.toUpperCase(),
      rgb: `rgb(${r}, ${g}, ${b})`,
      rgba: `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`,
      hsl: `hsl(${hDeg}, ${sPct}%, ${lPct}%)`,
      hsla: `hsla(${hDeg}, ${sPct}%, ${lPct}%, ${a.toFixed(2)})`,
      luminance: luminance.toFixed(4),
      contrastWhite: Number(contrastWhite),
      contrastBlack: Number(contrastBlack),
      r, g, b, a,
    };
  }, [colorInput]);

  return (
    <div>
      <ToolHeader
        id="color-converter"
        name="Color Converter & Contrast Checker"
        description="Convert HEX, RGB, HSL, RGBA, and HSLA color codes with live color picker and WCAG contrast validation."
        category="Utilities"
      />

      {/* Input Section */}
      <div className="mb-6 p-5 bg-zinc-900/80 border border-zinc-800 rounded-xl flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="color"
            value={parsed.valid ? parsed.hex.slice(0, 7) : "#3b82f6"}
            onChange={(e) => setColorInput(e.target.value)}
            className="w-12 h-12 rounded-lg cursor-pointer border border-zinc-700 bg-transparent p-1"
          />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-zinc-300 mb-1">HEX / Color Code</label>
            <input
              type="text"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              placeholder="e.g. #3b82f6 or #fff"
              className="w-48 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 font-mono text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {parsed.valid && (
          <div
            className="w-full sm:w-48 h-12 rounded-lg border border-zinc-700 shadow-inner flex items-center justify-center font-mono text-xs font-bold"
            style={{ backgroundColor: parsed.hex, color: parsed.contrastWhite > 4.5 ? "#ffffff" : "#000000" }}
          >
            Preview Color
          </div>
        )}
      </div>

      {!parsed.valid ? (
        <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{parsed.error}</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Converted Formats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ColorCard label="HEX Code" value={parsed.hex} />
            <ColorCard label="RGB String" value={parsed.rgb} />
            <ColorCard label="RGBA String" value={parsed.rgba} />
            <ColorCard label="HSL String" value={parsed.hsl} />
          </div>

          {/* WCAG Contrast Ratings */}
          <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-3">
            <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-400" />
              WCAG Accessibility Contrast Ratings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-zinc-400 block font-medium">Contrast vs White (#FFFFFF)</span>
                  <span className="font-mono text-base font-bold text-zinc-100">{parsed.contrastWhite}:1</span>
                </div>
                <span
                  className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                    parsed.contrastWhite >= 4.5
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}
                >
                  {parsed.contrastWhite >= 4.5 ? "Pass AA (4.5+)" : "Fail AA"}
                </span>
              </div>

              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-zinc-400 block font-medium">Contrast vs Black (#000000)</span>
                  <span className="font-mono text-base font-bold text-zinc-100">{parsed.contrastBlack}:1</span>
                </div>
                <span
                  className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                    parsed.contrastBlack >= 4.5
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}
                >
                  {parsed.contrastBlack >= 4.5 ? "Pass AA (4.5+)" : "Fail AA"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ColorCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-400">{label}</span>
        <CopyButton text={value} size="sm" />
      </div>
      <p className="font-mono text-sm font-bold text-zinc-100 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 select-all">
        {value}
      </p>
    </div>
  );
}
