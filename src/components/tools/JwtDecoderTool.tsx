"use client";

import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { CopyButton } from "@/components/ui/CopyButton";
import { Editor } from "@/components/ui/Editor";
import { ShieldAlert, AlertCircle, Clock, KeyRound, Sparkles } from "lucide-react";

// Sample JWT token (standard JWT example with exp, iat, sub, iss)
const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlzcyI6Imh0dHBzOi8vYXV0aC5kZXZraXQuaW8iLCJhdWQiOiJkZXZraXQtYXBwIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MDk3ODI0MDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

interface ParsedJwt {
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  signature: string;
  error?: string;
}

export function JwtDecoderTool() {
  const [jwtToken, setJwtToken] = useState(SAMPLE_JWT);
  const [currentNowSec] = useState(() => Math.floor(Date.now() / 1000));

  const parsedJwt = useMemo<ParsedJwt>(() => {
    if (!jwtToken.trim()) {
      return { header: null, payload: null, signature: "" };
    }

    const parts = jwtToken.trim().split(".");
    if (parts.length !== 3) {
      return {
        header: null,
        payload: null,
        signature: "",
        error: "Invalid JWT format. A valid JWT consists of 3 dot-separated Base64Url parts (Header.Payload.Signature).",
      };
    }

    try {
      const headerStr = base64UrlDecode(parts[0]);
      const payloadStr = base64UrlDecode(parts[1]);

      return {
        header: JSON.parse(headerStr),
        payload: JSON.parse(payloadStr),
        signature: parts[2],
      };
    } catch (e: unknown) {
      return {
        header: null,
        payload: null,
        signature: parts[2] || "",
        error: `Base64 / JSON decode failure: ${e instanceof Error ? e.message : "Malformed encoding"}`,
      };
    }
  }, [jwtToken]);

  // Expiration calculation
  const expirationInfo = useMemo(() => {
    if (!parsedJwt.payload) return null;

    const exp = parsedJwt.payload.exp;
    const iat = parsedJwt.payload.iat;
    const nbf = parsedJwt.payload.nbf;

    let isExpired = false;
    let timeRemaining = "";
    let formattedExp = "";
    let formattedIat = "";

    if (typeof exp === "number") {
      const expDate = new Date(exp * 1000);
      formattedExp = expDate.toUTCString() + ` (${expDate.toLocaleString()})`;
      if (exp < currentNowSec) {
        isExpired = true;
        const agoSec = currentNowSec - exp;
        timeRemaining = `Expired ${formatDuration(agoSec)} ago`;
      } else {
        isExpired = false;
        const diffSec = exp - currentNowSec;
        timeRemaining = `Expires in ${formatDuration(diffSec)}`;
      }
    }

    if (typeof iat === "number") {
      const iatDate = new Date(iat * 1000);
      formattedIat = iatDate.toUTCString() + ` (${iatDate.toLocaleString()})`;
    }

    return { exp, iat, nbf, isExpired, timeRemaining, formattedExp, formattedIat };
  }, [parsedJwt, currentNowSec]);

  return (
    <div>
      <ToolHeader
        id="jwt-decoder"
        name="JWT Decoder"
        description="Decode JSON Web Tokens locally to inspect headers, payload claims, timestamps, and signature status."
        category="Security"
      />

      {/* Security notice callout */}
      <div className="mb-6 p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-200">Local Browser Decoding & Security Notice</p>
          <p className="mt-1 text-amber-400/90 leading-relaxed">
            Your JWT token is decoded 100% locally inside your browser. No token is ever transmitted over the network or sent to external servers.
            <strong className="text-amber-200 font-semibold ml-1">
              Note: This tool decodes token contents for inspection and does not verify signature authenticity.
            </strong>
          </p>
        </div>
      </div>

      {/* Input section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-semibold text-zinc-300">
            Encoded JWT Token (Header.Payload.Signature)
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setJwtToken(SAMPLE_JWT)}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" /> Load Sample JWT
            </button>
            {jwtToken && (
              <button
                onClick={() => setJwtToken("")}
                className="text-xs text-zinc-400 hover:text-zinc-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <textarea
          value={jwtToken}
          onChange={(e) => setJwtToken(e.target.value)}
          placeholder="Paste JWT string starting with eyJ..."
          className="w-full h-28 font-mono text-xs bg-zinc-950 text-zinc-100 p-3 rounded-xl border border-zinc-800 focus:outline-none focus:border-blue-500/50 resize-y break-all"
        />
      </div>

      {parsedJwt.error ? (
        <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{parsedJwt.error}</span>
        </div>
      ) : (
        parsedJwt.header && (
          <div className="space-y-6">
            {/* Expiration & Token Status Banner */}
            {expirationInfo && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className={`p-4 rounded-xl border flex items-center gap-3 ${
                    expirationInfo.isExpired
                      ? "bg-rose-950/30 border-rose-500/40 text-rose-200"
                      : "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                  }`}
                >
                  <Clock className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider opacity-80">
                      Token Status
                    </p>
                    <p className="text-sm font-bold mt-0.5">
                      {expirationInfo.isExpired ? "Expired Token" : "Active / Valid Time"}
                    </p>
                    <p className="text-xs mt-0.5 opacity-90">{expirationInfo.timeRemaining}</p>
                  </div>
                </div>

                <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl text-zinc-300">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Algorithm (alg)
                    </span>
                    <KeyRound className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-sm font-mono font-bold text-zinc-100 mt-1">
                    {String(parsedJwt.header.alg || "None")}
                  </p>
                </div>

                <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl text-zinc-300">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Type (typ)
                  </span>
                  <p className="text-sm font-mono font-bold text-zinc-100 mt-1">
                    {String(parsedJwt.header.typ || "JWT")}
                  </p>
                </div>
              </div>
            )}

            {/* Header & Payload Editors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-zinc-300">Header</span>
                  <CopyButton
                    text={JSON.stringify(parsedJwt.header, null, 2)}
                    size="sm"
                    label="Copy Header"
                  />
                </div>
                <Editor
                  value={JSON.stringify(parsedJwt.header, null, 2)}
                  readOnly
                  language="json"
                  height="260px"
                />
              </div>

              {/* Payload */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-zinc-300">Payload Claims</span>
                  <CopyButton
                    text={JSON.stringify(parsedJwt.payload, null, 2)}
                    size="sm"
                    label="Copy Payload"
                  />
                </div>
                <Editor
                  value={JSON.stringify(parsedJwt.payload, null, 2)}
                  readOnly
                  language="json"
                  height="260px"
                />
              </div>
            </div>

            {/* Signature */}
            <div>
              <span className="block text-xs font-semibold text-zinc-300 mb-2">
                Signature (Raw Base64Url)
              </span>
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-xs text-zinc-400 break-all">
                {parsedJwt.signature || "No signature found"}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

/** Helper Base64Url decoder */
function base64UrlDecode(str: string): string {
  let output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw new Error("Illegal base64url string!");
  }
  return decodeURIComponent(
    atob(output)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

function formatDuration(seconds: number): string {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0 || parts.length === 0) parts.push(`${s}s`);

  return parts.join(" ");
}
