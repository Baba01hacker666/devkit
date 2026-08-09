"use client";

import { useMemo, useState } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { Search, Server, Info } from "lucide-react";

interface StatusCode {
  code: number;
  name: string;
  description: string;
}

const STATUS_CODES: StatusCode[] = [
  // 1xx Informational
  { code: 100, name: "Continue", description: "The server has received the request headers and the client should proceed to send the body." },
  { code: 101, name: "Switching Protocols", description: "The requester has asked the server to switch protocols and the server has agreed." },
  { code: 102, name: "Processing", description: "WebDAV: the server has received and is processing the request, but no response is available yet." },
  { code: 103, name: "Early Hints", description: "Allows the client to start preloading resources while the server prepares a final response." },
  // 2xx Successful
  { code: 200, name: "OK", description: "The request succeeded. The meaning depends on the HTTP method used (GET, POST, PUT, etc.)." },
  { code: 201, name: "Created", description: "The request succeeded and a new resource was created, typically after POST or PUT." },
  { code: 202, name: "Accepted", description: "The request has been accepted for processing, but processing is not complete." },
  { code: 203, name: "Non-Authoritative Information", description: "The response came from a copy or transform of the origin server and may differ." },
  { code: 204, name: "No Content", description: "The request succeeded but there is no content to send in the response body." },
  { code: 205, name: "Reset Content", description: "The server successfully processed the request and asks the client to reset its document view." },
  { code: 206, name: "Partial Content", description: "The server is delivering only part of the resource, per a Range header from the client." },
  { code: 207, name: "Multi-Status", description: "WebDAV: conveys information about multiple resources in one response body." },
  { code: 208, name: "Already Reported", description: "WebDAV: used to avoid repeating the status of already-reported members in a binding." },
  { code: 226, name: "IM Used", description: "The server has fulfilled a GET request for a resource after applying instance manipulations." },
  // 3xx Redirection
  { code: 300, name: "Multiple Choices", description: "The request has more than one possible response; the client may choose one." },
  { code: 301, name: "Moved Permanently", description: "The resource has permanently moved; all future requests should use the new URL." },
  { code: 302, name: "Found", description: "The resource is temporarily located elsewhere; clients should continue using the original URL." },
  { code: 303, name: "See Other", description: "The response to the request can be found under a different URI, via GET." },
  { code: 304, name: "Not Modified", description: "The resource has not been modified since the last request; use the cached version." },
  { code: 305, name: "Use Proxy", description: "The requested resource must be accessed through the proxy given by the Location header." },
  { code: 307, name: "Temporary Redirect", description: "The resource is temporarily under a different URI; the method must not change." },
  { code: 308, name: "Permanent Redirect", description: "The resource has permanently moved; the method must not change." },
  // 4xx Client Error
  { code: 400, name: "Bad Request", description: "The server cannot process the request due to malformed syntax." },
  { code: 401, name: "Unauthorized", description: "Authentication is required and has failed or has not been provided." },
  { code: 402, name: "Payment Required", description: "Reserved for future use; originally for digital payment systems." },
  { code: 403, name: "Forbidden", description: "The client is authenticated but does not have permission to access the resource." },
  { code: 404, name: "Not Found", description: "The server cannot find the requested resource. The URL may be mistyped." },
  { code: 405, name: "Method Not Allowed", description: "The request method is not supported for the requested resource." },
  { code: 406, name: "Not Acceptable", description: "The server cannot produce a response matching the client's Accept headers." },
  { code: 407, name: "Proxy Authentication Required", description: "The client must first authenticate itself with the proxy." },
  { code: 408, name: "Request Timeout", description: "The server timed out waiting for the request from the client." },
  { code: 409, name: "Conflict", description: "The request conflicts with the current state of the server." },
  { code: 410, name: "Gone", description: "The resource is no longer available and no forwarding address is known." },
  { code: 411, name: "Length Required", description: "The request did not specify the length of its content, which is required." },
  { code: 412, name: "Precondition Failed", description: "One or more conditional request header fields evaluated to false." },
  { code: 413, name: "Payload Too Large", description: "The request body is larger than the server is willing to process." },
  { code: 414, name: "URI Too Long", description: "The URI requested by the client is longer than the server is willing to interpret." },
  { code: 415, name: "Unsupported Media Type", description: "The media format of the requested data is not supported by the server." },
  { code: 416, name: "Range Not Satisfiable", description: "The Range header cannot be satisfied by the server for the requested resource." },
  { code: 417, name: "Expectation Failed", description: "The expectation given in the Expect header could not be met by the server." },
  { code: 418, name: "I'm a Teapot", description: "An April Fools' joke: the server refuses to brew coffee because it is a teapot." },
  { code: 421, name: "Misdirected Request", description: "The request was sent to a server that cannot produce a response for the target." },
  { code: 422, name: "Unprocessable Entity", description: "The request was well-formed but contains semantic errors (validation failed)." },
  { code: 423, name: "Locked", description: "WebDAV: the resource that is being accessed is locked." },
  { code: 424, name: "Failed Dependency", description: "WebDAV: the request failed because a previous request it depends on failed." },
  { code: 425, name: "Too Early", description: "The server is unwilling to risk processing a request that might be replayed." },
  { code: 426, name: "Upgrade Required", description: "The client should switch to a different protocol, such as TLS/1.0." },
  { code: 428, name: "Precondition Required", description: "The origin server requires the request to be conditional to prevent lost updates." },
  { code: 429, name: "Too Many Requests", description: "The user has sent too many requests in a given amount of time (rate limiting)." },
  { code: 431, name: "Request Header Fields Too Large", description: "The server refuses to process the request because header fields are too large." },
  { code: 451, name: "Unavailable For Legal Reasons", description: "The resource is unavailable due to legal reasons, such as censorship or DMCA." },
  // 5xx Server Error
  { code: 500, name: "Internal Server Error", description: "The server encountered an unexpected condition that prevented it from fulfilling the request." },
  { code: 501, name: "Not Implemented", description: "The server does not support the functionality required to fulfill the request." },
  { code: 502, name: "Bad Gateway", description: "The server, acting as a gateway, received an invalid response from the upstream server." },
  { code: 503, name: "Service Unavailable", description: "The server is not ready to handle the request, often due to maintenance or overload." },
  { code: 504, name: "Gateway Timeout", description: "The server, acting as a gateway, did not get a timely response from the upstream server." },
  { code: 505, name: "HTTP Version Not Supported", description: "The HTTP version used in the request is not supported by the server." },
  { code: 506, name: "Variant Also Negotiates", description: "A server error caused by a configuration error in content negotiation." },
  { code: 507, name: "Insufficient Storage", description: "WebDAV: the method could not be performed because the server cannot store the representation." },
  { code: 508, name: "Loop Detected", description: "WebDAV: the server detected an infinite loop while processing the request." },
  { code: 510, name: "Not Extended", description: "Further extensions to the request are required for the server to fulfill it." },
  { code: 511, name: "Network Authentication Required", description: "The client needs to authenticate to gain network access, e.g. captive portals." },
];

const GROUPS: Array<{ label: string; range: [number, number]; badge: string }> = [
  { label: "Informational (1xx)", range: [100, 199], badge: "bg-sky-500/10 text-sky-400 border-sky-500/30" },
  { label: "Successful (2xx)", range: [200, 299], badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
  { label: "Redirection (3xx)", range: [300, 399], badge: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  { label: "Client Errors (4xx)", range: [400, 499], badge: "bg-orange-500/10 text-orange-400 border-orange-500/30" },
  { label: "Server Errors (5xx)", range: [500, 599], badge: "bg-rose-500/10 text-rose-400 border-rose-500/30" },
];

function codeBadgeClass(code: number): string {
  const group = GROUPS.find((g) => code >= g.range[0] && code <= g.range[1]);
  return group ? group.badge : "bg-zinc-500/10 text-zinc-400 border-zinc-500/30";
}

export function HttpStatusTool() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return STATUS_CODES;
    return STATUS_CODES.filter(
      (s) =>
        String(s.code).includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }, [query]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of STATUS_CODES) {
      const group = GROUPS.find((g) => s.code >= g.range[0] && s.code <= g.range[1]);
      if (group) map.set(group.label, (map.get(group.label) ?? 0) + 1);
    }
    return map;
  }, []);

  return (
    <div>
      <ToolHeader
        id="http-status"
        name="HTTP Status Codes Reference"
        description="Browse every standard HTTP status code by class with descriptions for debugging and API development."
        category="Utilities"
      />

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by code or name (e.g. 404, not found)..."
          className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition-all"
        />
      </div>

      {query ? (
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <p className="p-8 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
              No status codes match &quot;{query}&quot;.
            </p>
          ) : (
            filtered.map((s) => (
              <div
                key={s.code}
                className="flex items-start gap-3 p-3.5 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 rounded-xl transition"
              >
                <span className={`shrink-0 px-2 py-0.5 rounded-md border font-mono text-[11px] font-bold ${codeBadgeClass(s.code)}`}>
                  {s.code}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-200">{s.name}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {GROUPS.map((group) => {
            const items = STATUS_CODES.filter((s) => s.code >= group.range[0] && s.code <= group.range[1]);
            return (
              <section key={group.label}>
                <div className="flex items-center gap-2 mb-3">
                  <Server className="w-4 h-4 text-zinc-500" />
                  <h3 className="text-sm font-semibold text-zinc-200">{group.label}</h3>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    {counts.get(group.label) ?? 0} codes
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {items.map((s) => (
                    <div
                      key={s.code}
                      className="flex items-start gap-3 p-3 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 rounded-xl transition"
                    >
                      <span className={`shrink-0 px-2 py-0.5 rounded-md border font-mono text-[11px] font-bold ${codeBadgeClass(s.code)}`}>
                        {s.code}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-zinc-200">{s.name}</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">{s.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          <p className="flex items-start gap-2 text-[11px] text-zinc-500 p-3 bg-zinc-900/40 border border-zinc-800 rounded-xl">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-blue-400" />
            <span>
              Covers the standards-track status codes from RFC 9110 plus common extended codes
              (WebDAV, RFC 6585, RFC 7725, RFC 8297). Not all codes are used by every server.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
