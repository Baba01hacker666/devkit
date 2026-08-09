"use client";

import { useMemo, useState } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { Network, AlertCircle } from "lucide-react";

function ipToInt(ip: string): number | null {
  const octets = ip.split(".");
  if (octets.length !== 4) return null;
  let result = 0;
  for (const octet of octets) {
    if (!/^\d{1,3}$/.test(octet)) return null;
    const value = Number(octet);
    if (value < 0 || value > 255) return null;
    result = (result << 8) | value;
  }
  return result >>> 0;
}

function intToIp(value: number): string {
  return [
    (value >>> 24) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 8) & 0xff,
    value & 0xff,
  ].join(".");
}

function intToBinary(value: number): string {
  return value.toString(2).padStart(32, "0");
}

function binaryToDotted(binary: string): string {
  return binary.match(/.{8}/g)?.join(" ") ?? binary;
}

interface SubnetResult {
  ip: string;
  prefix: number;
  network: string;
  broadcast: string;
  firstUsable: string;
  lastUsable: string;
  totalHosts: string;
  usableHosts: string;
  maskDecimal: string;
  maskBinary: string;
  wildcard: string;
  ipClass: string;
  ipBinary: string;
  isPrivate: boolean;
  isLoopback: boolean;
  isCgn: boolean;
  notes: string;
}

function calculate(ip: string, prefix: number): SubnetResult {
  const ipInt = ipToInt(ip) ?? 0;
  const p = Math.min(Math.max(prefix, 0), 32);
  const mask = p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0;
  const network = (ipInt & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const hostBits = 32 - p;

  let firstUsable = network;
  let lastUsable = broadcast;
  let usableHosts = 0;

  if (p === 32) {
    usableHosts = 1;
  } else if (p === 31) {
    usableHosts = 2;
    firstUsable = network;
    lastUsable = broadcast;
  } else {
    usableHosts = 2 ** hostBits - 2;
    firstUsable = network + 1;
    lastUsable = broadcast - 1;
  }

  const totalHosts = 2 ** hostBits;
  const firstOctet = network >>> 24;
  const ipClass =
    firstOctet <= 127 ? "A" : firstOctet <= 191 ? "B" : firstOctet <= 223 ? "C" : firstOctet <= 239 ? "D" : "E";

  const isPrivate =
    (firstOctet === 10) ||
    (firstOctet === 172 && (network >>> 16 & 0xff) >= 16 && (network >>> 16 & 0xff) <= 31) ||
    (firstOctet === 192 && (network >>> 16 & 0xff) === 168);
  const isLoopback = firstOctet === 127;
  const isCgn =
    firstOctet === 100 && (network >>> 16 & 0xff) >= 64 && (network >>> 16 & 0xff) <= 127;

  let notes = "";
  if (p === 31) notes = "/31 networks are point-to-point links: both addresses are usable.";
  else if (p === 32) notes = "/32 is a single-host route: network and broadcast equal the address.";
  else if (isPrivate) notes = "This is a private (RFC 1918) IPv4 range.";
  else if (isLoopback) notes = "Loopback range (127.0.0.0/8) — not routable on the internet.";
  else if (isCgn) notes = "Carrier-grade NAT range (100.64.0.0/10, RFC 6598).";

  return {
    ip,
    prefix: p,
    network: intToIp(network),
    broadcast: intToIp(broadcast),
    firstUsable: intToIp(firstUsable),
    lastUsable: intToIp(lastUsable),
    totalHosts: totalHosts.toLocaleString("en-US"),
    usableHosts: usableHosts.toLocaleString("en-US"),
    maskDecimal: intToIp(mask),
    maskBinary: binaryToDotted(intToBinary(mask)),
    wildcard: intToIp(~mask >>> 0),
    ipClass,
    ipBinary: binaryToDotted(intToBinary(ipInt)),
    isPrivate,
    isLoopback,
    isCgn,
    notes,
  };
}

function parseCidr(input: string): { ip: string; prefix: number } | null {
  const trimmed = input.trim().replace(/\s+/g, "");
  const match = trimmed.match(/^(\d{1,3}(?:\.\d{1,3}){3})\/(\d{1,2})$/);
  if (!match) return null;
  const ip = match[1];
  const prefix = Number(match[2]);
  if (prefix < 0 || prefix > 32) return null;
  if (ipToInt(ip) === null) return null;
  return { ip, prefix };
}

const PRESETS = [
  { label: "Home /24", value: "192.168.1.0/24" },
  { label: "Private /16", value: "172.16.0.0/16" },
  { label: "RFC1918 /8", value: "10.0.0.0/8" },
  { label: "Small /29", value: "203.0.113.8/29" },
  { label: "Point-to-Point /31", value: "10.0.0.0/31" },
  { label: "Single Host /32", value: "198.51.100.7/32" },
];

export function SubnetCalculatorTool() {
  const [input, setInput] = useState("192.168.1.0/24");

  const parsed = useMemo(() => parseCidr(input), [input]);
  const result = useMemo(
    () => (parsed ? calculate(parsed.ip, parsed.prefix) : null),
    [parsed]
  );

  const rows: Array<{ label: string; value: string }> = result
    ? [
        { label: "Network Address", value: result.network },
        { label: "Broadcast Address", value: result.broadcast },
        { label: "First Usable Host", value: result.firstUsable },
        { label: "Last Usable Host", value: result.lastUsable },
        { label: "Total Addresses", value: result.totalHosts },
        { label: "Usable Hosts", value: result.usableHosts },
        { label: "Subnet Mask", value: `${result.maskDecimal} / ${result.maskBinary}` },
        { label: "Wildcard Mask", value: result.wildcard },
        { label: "IP Class", value: `Class ${result.ipClass}` },
        { label: "IP in Binary", value: result.ipBinary },
        { label: "Type", value: result.isPrivate ? "Private (RFC 1918)" : result.isLoopback ? "Loopback" : result.isCgn ? "CGNAT (RFC 6598)" : "Public" },
      ]
    : [];

  return (
    <div>
      <ToolHeader
        id="subnet-calculator"
        name="Subnet (CIDR) Calculator"
        description="Compute network, broadcast, usable hosts, wildcard mask, and address ranges for any IPv4 CIDR block."
        category="Utilities"
      />

      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-300">CIDR:</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. 192.168.1.0/24"
              spellCheck={false}
              className="w-48 bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-zinc-500 font-medium">Presets:</span>
            {PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => setInput(preset.value)}
                className={`px-2 py-1 rounded-md border transition font-mono text-[11px] ${
                  input === preset.value
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-zinc-950 border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!result && (
        <div className="mb-4 p-3 bg-rose-950/40 border border-rose-500/40 rounded-lg text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            Invalid CIDR notation. Expected format: <code className="font-mono">x.x.x.x/prefix</code> (prefix 0–32).
          </span>
        </div>
      )}

      {result && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-3 p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl"
              >
                <span className="text-xs text-zinc-500 font-medium">{row.label}</span>
                <span className="text-xs text-zinc-100 font-mono text-right break-all select-all">
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {result.notes && (
            <div className="mt-4 flex items-start gap-2 p-3 bg-blue-950/30 border border-blue-500/30 rounded-lg text-blue-300 text-xs">
              <Network className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>{result.notes}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
