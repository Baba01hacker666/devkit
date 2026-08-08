"use client";

import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { CopyButton } from "@/components/ui/CopyButton";
import { Editor } from "@/components/ui/Editor";
import { useToast } from "@/components/ui/Toast";
import { RefreshCw, Download, Database } from "lucide-react";

const FIRST_NAMES = ["Alex", "Jordan", "Taylor", "Morgan", "Sam", "Chris", "Casey", "Riley", "Jamie", "Dakota"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
const DOMAINS = ["gmail.com", "dev-mail.io", "techcorp.com", "acme.org", "cybersec.net"];
const ROLES = ["Frontend Developer", "Backend Engineer", "DevOps Specialist", "Security Researcher", "Data Scientist", "Product Manager"];
const CITIES = ["San Francisco", "Austin", "New York", "Seattle", "Berlin", "London", "Tokyo", "Sydney"];

export function RandomDataTool() {
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState<"json" | "csv" | "sql">("json");
  const [seed, setSeed] = useState(0);
  const { toast } = useToast();

  const generatedData = useMemo(() => {
    const list = [];
    for (let i = 0; i < Math.min(Math.max(1, count), 100); i++) {
      const first = FIRST_NAMES[(i + seed) % FIRST_NAMES.length];
      const last = LAST_NAMES[(i + seed * 2) % LAST_NAMES.length];
      const email = `${first.toLowerCase()}.${last.toLowerCase()}@${DOMAINS[i % DOMAINS.length]}`;
      const role = ROLES[i % ROLES.length];
      const city = CITIES[i % CITIES.length];
      const ip = `192.168.${(i * 3) % 255}.${(i * 7) % 255}`;
      const uuid = crypto.randomUUID();

      list.push({
        id: i + 1,
        uuid,
        name: `${first} ${last}`,
        email,
        role,
        city,
        ipAddress: ip,
        active: i % 3 !== 0,
      });
    }

    if (format === "json") {
      return JSON.stringify(list, null, 2);
    } else if (format === "csv") {
      const headers = Object.keys(list[0]).join(",");
      const rows = list.map((obj) => Object.values(obj).map((v) => `"${v}"`).join(","));
      return [headers, ...rows].join("\n");
    } else {
      // SQL
      const rows = list
        .map(
          (o) =>
            `INSERT INTO users (id, uuid, name, email, role, city, ip_address, active) VALUES (${o.id}, '${o.uuid}', '${o.name}', '${o.email}', '${o.role}', '${o.city}', '${o.ipAddress}', ${o.active});`
        )
        .join("\n");
      return rows;
    }
  }, [count, format, seed]);

  const handleDownload = () => {
    const blob = new Blob([generatedData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mock_data.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ type: "success", title: `Downloaded mock_data.${format}` });
  };

  return (
    <div>
      <ToolHeader
        id="random-data"
        name="Random Data / Mock Generator"
        description="Generate realistic mock dataset records in JSON, CSV, or SQL Insert format."
        category="Utilities"
      />

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-300">Records:</span>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-16 bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100 font-mono focus:outline-none"
            />
          </div>

          <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 font-semibold">
            {(["json", "csv", "sql"] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`px-3 py-1 rounded-md uppercase transition ${
                  format === fmt ? "bg-blue-600 text-white shadow" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSeed((prev) => prev + 1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate New Data</span>
          </button>
          <CopyButton text={generatedData} label="Copy Data" toastMessage="Mock data copied!" />
          <button
            onClick={handleDownload}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition"
            title="Download file"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <Editor
        value={generatedData}
        readOnly
        language={format === "json" ? "json" : format === "sql" ? "sql" : "plaintext"}
        height="450px"
      />
    </div>
  );
}
