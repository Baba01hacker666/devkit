"use client";

import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, XCircle, Sparkles, Trash2 } from "lucide-react";

const SAMPLE_SECURE_HEADERS = `HTTP/2 200 OK
content-type: text/html; charset=UTF-8
strict-transport-security: max-age=63072000; includeSubDomains; preload
content-security-policy: default-src 'self'; script-src 'self' 'nonce-12345'; object-src 'none'; frame-ancestors 'none';
x-frame-options: DENY
x-content-type-options: nosniff
referrer-policy: strict-origin-when-cross-origin
permissions-policy: geolocation=(), camera=(), microphone=()
cross-origin-opener-policy: same-origin
cache-control: no-store, max-age=0
set-cookie: session_id=xyz789; Secure; HttpOnly; SameSite=Strict`;

const SAMPLE_INSECURE_HEADERS = `HTTP/1.1 200 OK
Server: Apache/2.4.41 (Ubuntu)
X-Powered-By: PHP/7.4.3
Access-Control-Allow-Origin: *
Cache-Control: public, max-age=3600
Set-Cookie: session=12345`;

interface HeaderAuditItem {
  header: string;
  value: string | null;
  status: "good" | "warning" | "missing";
  explanation: string;
  recommendation: string;
}

export function HttpHeaderAnalyzerTool() {
  const [headersText, setHeadersText] = useState(SAMPLE_SECURE_HEADERS);

  const auditResults = useMemo(() => {
    if (!headersText.trim()) return [];

    // Parse header text into key-value map (case-insensitive keys)
    const headerMap: Record<string, string[]> = {};
    const lines = headersText.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("HTTP/")) continue;
      const colonIdx = trimmed.indexOf(":");
      if (colonIdx > 0) {
        const key = trimmed.substring(0, colonIdx).trim().toLowerCase();
        const val = trimmed.substring(colonIdx + 1).trim();
        if (!headerMap[key]) headerMap[key] = [];
        headerMap[key].push(val);
      }
    }

    const items: HeaderAuditItem[] = [];

    // 1. HSTS
    const hsts = headerMap["strict-transport-security"]?.[0];
    if (hsts) {
      const hasSubdomains = hsts.toLowerCase().includes("includesubdomains");
      items.push({
        header: "Strict-Transport-Security (HSTS)",
        value: hsts,
        status: hasSubdomains ? "good" : "warning",
        explanation: "Enforces HTTPS connections and prevents SSL stripping attacks.",
        recommendation: hasSubdomains
          ? "Excellent configuration."
          : "Add `includeSubDomains; preload` for full domain protection.",
      });
    } else {
      items.push({
        header: "Strict-Transport-Security (HSTS)",
        value: null,
        status: "missing",
        explanation: "Forces browser to communicate only over encrypted HTTPS connections.",
        recommendation: "Add header: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`",
      });
    }

    // 2. CSP
    const csp = headerMap["content-security-policy"]?.[0];
    if (csp) {
      const isUnsafe = csp.includes("'unsafe-inline'") || csp.includes("'unsafe-eval'");
      items.push({
        header: "Content-Security-Policy (CSP)",
        value: csp,
        status: isUnsafe ? "warning" : "good",
        explanation: "Restricts sources from which scripts, styles, and images can be loaded (XSS defense).",
        recommendation: isUnsafe
          ? "Avoid `'unsafe-inline'` and `'unsafe-eval'`. Use nonces or hashes."
          : "Strong CSP directive set.",
      });
    } else {
      items.push({
        header: "Content-Security-Policy (CSP)",
        value: null,
        status: "missing",
        explanation: "Prevents Cross-Site Scripting (XSS) and data injection attacks.",
        recommendation: "Add header: `Content-Security-Policy: default-src 'self';`",
      });
    }

    // 3. X-Frame-Options
    const xfo = headerMap["x-frame-options"]?.[0];
    if (xfo) {
      items.push({
        header: "X-Frame-Options",
        value: xfo,
        status: "good",
        explanation: "Protects against clickjacking attacks by controlling framing.",
        recommendation: "Header is properly configured.",
      });
    } else {
      items.push({
        header: "X-Frame-Options",
        value: null,
        status: "missing",
        explanation: "Prevents your site from being embedded inside malicious iFrames.",
        recommendation: "Add header: `X-Frame-Options: DENY` or `SAMEORIGIN`",
      });
    }

    // 4. X-Content-Type-Options
    const xcto = headerMap["x-content-type-options"]?.[0];
    if (xcto && xcto.toLowerCase() === "nosniff") {
      items.push({
        header: "X-Content-Type-Options",
        value: xcto,
        status: "good",
        explanation: "Prevents MIME-type sniffing by browsers.",
        recommendation: "Header is properly set to `nosniff`.",
      });
    } else {
      items.push({
        header: "X-Content-Type-Options",
        value: xcto || null,
        status: "missing",
        explanation: "Forces browser to strictly adhere to declared MIME types.",
        recommendation: "Add header: `X-Content-Type-Options: nosniff`",
      });
    }

    // 5. Referrer-Policy
    const ref = headerMap["referrer-policy"]?.[0];
    if (ref) {
      items.push({
        header: "Referrer-Policy",
        value: ref,
        status: "good",
        explanation: "Controls how much referrer information is included with requests.",
        recommendation: "Header is active.",
      });
    } else {
      items.push({
        header: "Referrer-Policy",
        value: null,
        status: "missing",
        explanation: "Prevents sensitive URL parameter leakage across origins.",
        recommendation: "Add header: `Referrer-Policy: strict-origin-when-cross-origin`",
      });
    }

    // 6. Permissions-Policy
    const perm = headerMap["permissions-policy"]?.[0];
    if (perm) {
      items.push({
        header: "Permissions-Policy",
        value: perm,
        status: "good",
        explanation: "Disables browser features like camera, geolocation, microphone.",
        recommendation: "Header is set.",
      });
    } else {
      items.push({
        header: "Permissions-Policy",
        value: null,
        status: "missing",
        explanation: "Restricts powerful hardware features in the browser.",
        recommendation: "Add header: `Permissions-Policy: camera=(), microphone=(), geolocation=()`",
      });
    }

    // 7. CORS
    const cors = headerMap["access-control-allow-origin"]?.[0];
    if (cors) {
      items.push({
        header: "Access-Control-Allow-Origin (CORS)",
        value: cors,
        status: cors === "*" ? "warning" : "good",
        explanation: "Controls cross-origin API data access.",
        recommendation:
          cors === "*"
            ? "Wildcard `*` allows any site to access API data. Restrict if API handles credentials."
            : "Specific origin defined.",
      });
    }

    // 8. Server Disclosure
    const server = headerMap["server"]?.[0];
    const poweredBy = headerMap["x-powered-by"]?.[0];
    if (server || poweredBy) {
      items.push({
        header: "Server / Tech Disclosure",
        value: [server, poweredBy].filter(Boolean).join(" | "),
        status: "warning",
        explanation: "Reveals exact server software versions to attackers.",
        recommendation: "Hide or mask `Server` and `X-Powered-By` headers in production.",
      });
    }

    // 9. Cookie Security
    const cookies = headerMap["set-cookie"];
    if (cookies && cookies.length > 0) {
      for (const cookie of cookies) {
        const cLower = cookie.toLowerCase();
        const isSecure = cLower.includes("secure");
        const isHttpOnly = cLower.includes("httponly");
        const hasSameSite = cLower.includes("samesite");

        const status = isSecure && isHttpOnly && hasSameSite ? "good" : "warning";
        items.push({
          header: "Cookie Security (Set-Cookie)",
          value: cookie,
          status,
          explanation: "Protects session cookies from theft via XSS or CSRF.",
          recommendation: `Ensure cookie contains: ${!isSecure ? "Secure; " : ""}${!isHttpOnly ? "HttpOnly; " : ""}${!hasSameSite ? "SameSite=Lax; " : ""}`,
        });
      }
    }

    return items;
  }, [headersText]);

  // Calculate Overall Security Grade
  const scoreGrade = useMemo(() => {
    if (auditResults.length === 0) return { grade: "-", color: "text-zinc-500", bg: "bg-zinc-800" };
    const missingCount = auditResults.filter((r) => r.status === "missing").length;
    const warningCount = auditResults.filter((r) => r.status === "warning").length;

    if (missingCount === 0 && warningCount === 0)
      return { grade: "A+", color: "text-emerald-400", bg: "bg-emerald-950/40 border-emerald-500/40" };
    if (missingCount <= 1)
      return { grade: "B", color: "text-blue-400", bg: "bg-blue-950/40 border-blue-500/40" };
    if (missingCount <= 3)
      return { grade: "C", color: "text-amber-400", bg: "bg-amber-950/40 border-amber-500/40" };
    return { grade: "F", color: "text-rose-400", bg: "bg-rose-950/40 border-rose-500/40" };
  }, [auditResults]);

  return (
    <div>
      <ToolHeader
        id="http-header-analyzer"
        name="HTTP Header Security Analyzer"
        description="Inspect response headers for security best practices, clickjacking, XSS mitigation, and cookie protection."
        category="Security"
      />

      {/* Preset Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setHeadersText(SAMPLE_SECURE_HEADERS)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 font-medium rounded-lg transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Secure Headers Demo</span>
          </button>
          <button
            onClick={() => setHeadersText(SAMPLE_INSECURE_HEADERS)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/30 font-medium rounded-lg transition"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Load Insecure Headers Demo</span>
          </button>
        </div>

        <button
          onClick={() => setHeadersText("")}
          className="p-2 bg-zinc-800 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 rounded-lg transition"
          title="Clear headers"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Input Textarea */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
          HTTP Response Headers
        </label>
        <textarea
          value={headersText}
          onChange={(e) => setHeadersText(e.target.value)}
          placeholder="Paste raw HTTP headers here (e.g. strict-transport-security: max-age=31536000)..."
          className="w-full h-44 font-mono text-xs bg-zinc-950 text-zinc-100 p-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-blue-500/50 resize-y"
        />
      </div>

      {/* Security Grade Banner */}
      {auditResults.length > 0 && (
        <div className={`mb-6 p-4 rounded-xl border ${scoreGrade.bg} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <ShieldCheck className={`w-8 h-8 ${scoreGrade.color}`} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Security Grade Rating
              </p>
              <p className="text-sm text-zinc-200 mt-0.5">
                {auditResults.filter((r) => r.status === "good").length} Good headers |{" "}
                {auditResults.filter((r) => r.status === "warning").length} Warnings |{" "}
                {auditResults.filter((r) => r.status === "missing").length} Missing
              </p>
            </div>
          </div>
          <div className={`text-4xl font-extrabold font-mono ${scoreGrade.color}`}>
            {scoreGrade.grade}
          </div>
        </div>
      )}

      {/* Audit Table */}
      {auditResults.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-zinc-200">Security Header Inspection Breakdown</h3>
          <div className="space-y-3">
            {auditResults.map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.status === "good" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {item.status === "warning" && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                    {item.status === "missing" && <XCircle className="w-4 h-4 text-rose-400" />}
                    <span className="font-semibold text-sm text-zinc-100">{item.header}</span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      item.status === "good"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : item.status === "warning"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {item.status === "good" ? "Good" : item.status === "warning" ? "Warning" : "Missing"}
                  </span>
                </div>

                {item.value && (
                  <p className="font-mono text-xs bg-zinc-950 p-2 rounded border border-zinc-800 text-zinc-300 break-all">
                    {item.value}
                  </p>
                )}

                <p className="text-xs text-zinc-400">{item.explanation}</p>
                <p className="text-xs text-blue-400 font-medium">
                  Recommendation: {item.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
