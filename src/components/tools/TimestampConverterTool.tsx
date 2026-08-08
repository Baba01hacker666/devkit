"use client";

import { useState, useEffect, useMemo } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { CopyButton } from "@/components/ui/CopyButton";
import { Clock, Play, Pause, Calendar, RefreshCw } from "lucide-react";

export function TimestampConverterTool() {
  const [nowSec, setNowSec] = useState<number>(Math.floor(Date.now() / 1000));
  const [isTicking, setIsTicking] = useState(true);
  const [timestampInput, setTimestampInput] = useState<string>(
    Math.floor(Date.now() / 1000).toString()
  );
  const [dateInput, setDateInput] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );

  // Live ticking clock effect
  useEffect(() => {
    if (!isTicking) return;
    const interval = setInterval(() => {
      setNowSec(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTicking]);

  // Convert input timestamp to date details
  const parsedFromTimestamp = useMemo(() => {
    if (!timestampInput.trim()) return null;
    const num = Number(timestampInput.trim());
    if (isNaN(num)) return null;

    // Detect if milliseconds (length >= 12)
    const isMs = timestampInput.trim().length >= 12 || num > 99999999999;
    const dateObj = new Date(isMs ? num : num * 1000);

    if (isNaN(dateObj.getTime())) return null;

    const sec = Math.floor(dateObj.getTime() / 1000);
    const ms = dateObj.getTime();
    const iso = dateObj.toISOString();
    const utc = dateObj.toUTCString();
    const local = dateObj.toLocaleString();

    return { sec, ms, iso, utc, local, relative: getRelativeTime(sec) };
  }, [timestampInput]);

  // Convert input date to timestamp details
  const parsedFromDate = useMemo(() => {
    if (!dateInput) return null;
    const dateObj = new Date(dateInput);
    if (isNaN(dateObj.getTime())) return null;

    const sec = Math.floor(dateObj.getTime() / 1000);
    const ms = dateObj.getTime();
    const iso = dateObj.toISOString();
    const utc = dateObj.toUTCString();
    const local = dateObj.toLocaleString();

    return { sec, ms, iso, utc, local, relative: getRelativeTime(sec) };
  }, [dateInput]);

  const handleSetCurrent = () => {
    const s = Math.floor(Date.now() / 1000).toString();
    setTimestampInput(s);
    setDateInput(new Date().toISOString().slice(0, 16));
  };

  return (
    <div>
      <ToolHeader
        id="timestamp-converter"
        name="Unix Timestamp Converter"
        description="Convert Epoch timestamps to human-readable dates, ISO 8601 strings, UTC, and relative time ranges."
        category="Time"
      />

      {/* Live Ticking Header Card */}
      <div className="mb-6 p-6 bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
            <Clock className="w-4 h-4 animate-spin-slow" />
            <span>Current Epoch Timestamp</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-3xl font-bold text-zinc-100">{nowSec}</span>
            <span className="font-mono text-sm text-zinc-400">({nowSec * 1000} ms)</span>
          </div>
          <p className="text-xs text-zinc-500 mt-1 font-mono">{new Date(nowSec * 1000).toUTCString()}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTicking((prev) => !prev)}
            className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
          >
            {isTicking ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            <span>{isTicking ? "Pause Live Clock" : "Resume Live Clock"}</span>
          </button>

          <button
            onClick={handleSetCurrent}
            className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Use Current Timestamp</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timestamp -> Date Converter */}
        <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            Timestamp → Date
          </h3>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">Unix Timestamp (Seconds or Milliseconds)</label>
            <input
              type="text"
              value={timestampInput}
              onChange={(e) => setTimestampInput(e.target.value)}
              placeholder="e.g. 1700000000"
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none"
            />
          </div>

          {parsedFromTimestamp ? (
            <div className="space-y-2 pt-2 border-t border-zinc-800/80">
              <ResultRow label="Unix Seconds" value={String(parsedFromTimestamp.sec)} />
              <ResultRow label="Unix Milliseconds" value={String(parsedFromTimestamp.ms)} />
              <ResultRow label="ISO 8601" value={parsedFromTimestamp.iso} />
              <ResultRow label="UTC Time" value={parsedFromTimestamp.utc} />
              <ResultRow label="Local Time" value={parsedFromTimestamp.local} />
              <ResultRow label="Relative Time" value={parsedFromTimestamp.relative} />
            </div>
          ) : (
            <p className="text-xs text-rose-400 italic">Invalid timestamp format</p>
          )}
        </div>

        {/* Date -> Timestamp Converter */}
        <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            Date → Timestamp
          </h3>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">Select Date & Time</label>
            <input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none"
            />
          </div>

          {parsedFromDate ? (
            <div className="space-y-2 pt-2 border-t border-zinc-800/80">
              <ResultRow label="Unix Seconds" value={String(parsedFromDate.sec)} />
              <ResultRow label="Unix Milliseconds" value={String(parsedFromDate.ms)} />
              <ResultRow label="ISO 8601" value={parsedFromDate.iso} />
              <ResultRow label="UTC Time" value={parsedFromDate.utc} />
              <ResultRow label="Local Time" value={parsedFromDate.local} />
              <ResultRow label="Relative Time" value={parsedFromDate.relative} />
            </div>
          ) : (
            <p className="text-xs text-rose-400 italic">Invalid date input</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-2 rounded bg-zinc-950/70 border border-zinc-800/60 text-xs">
      <span className="text-zinc-400 font-medium">{label}:</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-zinc-200 font-semibold">{value}</span>
        <CopyButton text={value} size="sm" />
      </div>
    </div>
  );
}

function getRelativeTime(timestampSec: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = timestampSec - now;
  const abs = Math.abs(diff);

  const m = Math.floor(abs / 60);
  const h = Math.floor(abs / 3600);
  const d = Math.floor(abs / 86400);

  if (diff === 0) return "Just now";
  if (diff > 0) {
    if (d > 0) return `in ${d} day${d > 1 ? "s" : ""}`;
    if (h > 0) return `in ${h} hour${h > 1 ? "s" : ""}`;
    if (m > 0) return `in ${m} minute${m > 1 ? "s" : ""}`;
    return `in ${abs} second${abs > 1 ? "s" : ""}`;
  } else {
    if (d > 0) return `${d} day${d > 1 ? "s" : ""} ago`;
    if (h > 0) return `${h} hour${h > 1 ? "s" : ""} ago`;
    if (m > 0) return `${m} minute${m > 1 ? "s" : ""} ago`;
    return `${abs} second${abs > 1 ? "s" : ""} ago`;
  }
}
