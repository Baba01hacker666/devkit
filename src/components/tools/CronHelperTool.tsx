"use client";

import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { CopyButton } from "@/components/ui/CopyButton";
import cronstrue from "cronstrue";
import { CalendarClock, Sparkles, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

interface CronPreset {
  label: string;
  expression: string;
  description: string;
}

const CRON_PRESETS: CronPreset[] = [
  { label: "Every Minute", expression: "* * * * *", description: "Runs once per minute" },
  { label: "Every 5 Minutes", expression: "*/5 * * * *", description: "Runs at minute 0, 5, 10, 15..." },
  { label: "Every 15 Minutes", expression: "*/15 * * * *", description: "Runs every 15 minutes" },
  { label: "Every Hour", expression: "0 * * * *", description: "Runs at minute 0 of every hour" },
  { label: "Daily at Midnight", expression: "0 0 * * *", description: "Runs at 00:00 every day" },
  { label: "Weekdays at 8:00 AM", expression: "0 8 * * 1-5", description: "Runs at 08:00 AM Monday through Friday" },
  { label: "Monthly on 1st at Noon", expression: "0 12 1 * *", description: "Runs at 12:00 PM on the 1st of every month" },
];

export function CronHelperTool() {
  const [expression, setExpression] = useState("*/15 0 1-5 * *");

  const { explanation, error, fields, nextExecutions } = useMemo(() => {
    if (!expression.trim()) {
      return { explanation: "", error: null, fields: [], nextExecutions: [] };
    }

    try {
      const exp = cronstrue.toString(expression, { use24HourTimeFormat: true });
      const parts = expression.trim().split(/\s+/);

      const fieldNames = ["Minute", "Hour", "Day of Month", "Month", "Day of Week"];
      const parsedFields = fieldNames.map((name, idx) => ({
        name,
        value: parts[idx] || "*",
      }));

      // Compute next execution timestamps (simple schedule predictor)
      const mockNextDates = predictNextCronDates(expression, 10);

      return {
        explanation: exp,
        error: null,
        fields: parsedFields,
        nextExecutions: mockNextDates,
      };
    } catch (err: unknown) {
      return {
        explanation: "",
        error: err instanceof Error ? err.message : "Invalid cron expression syntax",
        fields: [],
        nextExecutions: [],
      };
    }
  }, [expression]);

  return (
    <div>
      <ToolHeader
        id="cron-helper"
        name="Cron Expression Helper & Parser"
        description="Convert crontab schedule expressions into human-readable English and forecast upcoming execution dates."
        category="Time"
      />

      {/* Preset Buttons */}
      <div className="mb-6 p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300 mb-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Common Schedule Presets</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {CRON_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setExpression(preset.expression)}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium transition border border-zinc-700/60"
            >
              {preset.label} ({preset.expression})
            </button>
          ))}
        </div>
      </div>

      {/* Cron Expression Input */}
      <div className="mb-6 p-5 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-zinc-300">Cron Expression (5-part format)</label>
          <CopyButton text={expression} size="sm" label="Copy Expression" />
        </div>

        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="e.g. */15 * * * *"
          className="w-full bg-zinc-950 border border-zinc-700 focus:border-blue-500 rounded-xl px-4 py-3 font-mono text-base text-blue-400 font-bold tracking-wider focus:outline-none"
        />

        {/* Parsed 5-field breakdown */}
        {fields.length === 5 && (
          <div className="grid grid-cols-5 gap-2 pt-2 text-center">
            {fields.map((f, i) => (
              <div key={i} className="p-2 bg-zinc-950 rounded-lg border border-zinc-800">
                <span className="block text-[10px] text-zinc-400 uppercase font-semibold">{f.name}</span>
                <span className="font-mono text-sm font-bold text-amber-400">{f.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Explanation Banner */}
      {error ? (
        <div className="mb-6 p-4 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>Cron Validation Error: {error}</span>
        </div>
      ) : (
        explanation && (
          <div className="mb-6 p-5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-emerald-200 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-xs text-emerald-400 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Human-Readable Explanation</span>
            </div>
            <p className="text-lg font-bold text-zinc-100">&quot;{explanation}&quot;</p>
          </div>
        )
      )}

      {/* Predicted Upcoming Executions */}
      {nextExecutions.length > 0 && (
        <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-3">
          <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            Predicted Next 10 Execution Times
          </h3>

          <div className="space-y-1.5">
            {nextExecutions.map((dateStr, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-lg border border-zinc-800/80 text-xs font-mono text-zinc-300"
              >
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500 font-bold w-6">#{i + 1}</span>
                  <CalendarClock className="w-3.5 h-3.5 text-blue-400" />
                  <span>{dateStr}</span>
                </div>
                <CopyButton text={dateStr} size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Basic schedule predictor for standard cron expressions */
function predictNextCronDates(expr: string, count: number): string[] {
  const list: string[] = [];
  const now = new Date();
  let current = new Date(now.getTime());

  // Increment by 1 minute intervals and check if simple pattern matches
  for (let i = 0; i < 50000 && list.length < count; i++) {
    current = new Date(current.getTime() + 60000);
    if (matchesCron(current, expr)) {
      list.push(current.toUTCString() + ` (${current.toLocaleString()})`);
    }
  }

  return list;
}

function matchesCron(d: Date, expr: string): boolean {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return false;

  const min = d.getMinutes();
  const hr = d.getHours();
  const dom = d.getDate();
  const mon = d.getMonth() + 1;
  const dow = d.getDay();

  return (
    matchField(min, parts[0]) &&
    matchField(hr, parts[1]) &&
    matchField(dom, parts[2]) &&
    matchField(mon, parts[3]) &&
    matchField(dow, parts[4])
  );
}

function matchField(val: number, field: string): boolean {
  if (field === "*") return true;
  if (field.startsWith("*/")) {
    const step = parseInt(field.replace("*/", ""), 10);
    return !isNaN(step) && step > 0 && val % step === 0;
  }
  if (field.includes(",")) {
    return field.split(",").some((item) => matchField(val, item));
  }
  if (field.includes("-")) {
    const [start, end] = field.split("-").map((n) => parseInt(n, 10));
    return val >= start && val <= end;
  }
  return parseInt(field, 10) === val;
}
