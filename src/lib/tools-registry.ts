export type ToolCategory =
  | "Encoding"
  | "JSON"
  | "Security"
  | "Text"
  | "Time"
  | "Utilities";

export interface ToolMeta {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  iconName: string;
  route: string;
  keywords: string[];
  isPopular?: boolean;
}

export const CATEGORIES: ToolCategory[] = [
  "Encoding",
  "JSON",
  "Security",
  "Text",
  "Time",
  "Utilities",
];

export const TOOLS: ToolMeta[] = [
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Format, validate, and minify JSON with line & column error reports",
    category: "JSON",
    iconName: "FileJson",
    route: "/dev/json",
    keywords: ["json", "format", "minify", "validate", "prettier", "parse"],
    isPopular: true,
  },
  {
    id: "json-to-typescript",
    name: "JSON → TypeScript",
    description: "Convert raw JSON payload into strongly typed TypeScript interfaces",
    category: "JSON",
    iconName: "Code2",
    route: "/dev/json-to-typescript",
    keywords: ["json", "typescript", "ts", "interface", "type", "generate", "convert"],
    isPopular: true,
  },
  {
    id: "json-diff",
    name: "JSON Diff",
    description: "Compare two JSON structures side-by-side with structural diff detection",
    category: "JSON",
    iconName: "Split",
    route: "/dev/json-diff",
    keywords: ["json", "diff", "compare", "side-by-side", "changes"],
    isPopular: false,
  },
  {
    id: "jwt-decoder",
    name: "JWT Decoder",
    description: "Decode JSON Web Tokens locally to inspect Header, Payload, and Expiration",
    category: "Security",
    iconName: "KeyRound",
    route: "/dev/jwt",
    keywords: ["jwt", "token", "decode", "bearer", "auth", "claims", "header", "payload"],
    isPopular: true,
  },
  {
    id: "base64",
    name: "Base64 Encoder / Decoder",
    description: "Encode and decode standard and URL-safe Base64 strings and files",
    category: "Encoding",
    iconName: "Binary",
    route: "/dev/base64",
    keywords: ["base64", "encode", "decode", "url-safe", "unicode", "atob", "btoa"],
    isPopular: true,
  },
  {
    id: "url-encoder",
    name: "URL Encoder / Decoder",
    description: "Encode/decode URI components & extract query string parameters",
    category: "Encoding",
    iconName: "Link2",
    route: "/dev/url",
    keywords: ["url", "uri", "encode", "decode", "percent", "query", "params"],
    isPopular: false,
  },
  {
    id: "hash-generator",
    name: "Hash Generator",
    description: "Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes using Web Crypto API",
    category: "Security",
    iconName: "ShieldCheck",
    route: "/dev/hash",
    keywords: ["hash", "sha256", "sha512", "sha1", "crypto", "checksum", "digest"],
    isPopular: true,
  },
  {
    id: "uuid-generator",
    name: "UUID Generator",
    description: "Generate cryptographically secure UUID v4 tokens individually or in batch",
    category: "Utilities",
    iconName: "Fingerprint",
    route: "/dev/uuid",
    keywords: ["uuid", "guid", "v4", "random", "identifier", "generate"],
    isPopular: true,
  },
  {
    id: "regex-tester",
    name: "Regex Tester",
    description: "Test regular expressions live with match highlights, capture groups, and explanation",
    category: "Text",
    iconName: "Regex",
    route: "/dev/regex",
    keywords: ["regex", "regexp", "regular expression", "test", "match", "replace", "capture"],
    isPopular: true,
  },
  {
    id: "timestamp-converter",
    name: "Unix Timestamp Converter",
    description: "Convert Unix seconds/ms timestamps to UTC, Local Date, ISO 8601 & relative times",
    category: "Time",
    iconName: "Clock",
    route: "/dev/timestamp",
    keywords: ["unix", "epoch", "timestamp", "date", "time", "iso8601", "utc"],
    isPopular: true,
  },
  {
    id: "http-header-analyzer",
    name: "HTTP Header Analyzer",
    description: "Audit HTTP response headers for security best practices (CSP, HSTS, CORS, Cookies)",
    category: "Security",
    iconName: "ShieldAlert",
    route: "/dev/headers",
    keywords: ["http", "header", "security", "csp", "hsts", "cors", "cookie", "analyzer"],
    isPopular: false,
  },
  {
    id: "text-diff",
    name: "Text Diff",
    description: "Compare plain text or code snippets line-by-line or character-by-character",
    category: "Text",
    iconName: "FileDiff",
    route: "/dev/text-diff",
    keywords: ["diff", "compare", "text", "git", "additions", "deletions"],
    isPopular: false,
  },
  {
    id: "case-converter",
    name: "Case Converter",
    description: "Convert text into camelCase, snake_case, kebab-case, PascalCase, CONSTANT_CASE, etc.",
    category: "Text",
    iconName: "Type",
    route: "/dev/case-converter",
    keywords: ["case", "camelcase", "snakecase", "kebabcase", "pascalcase", "uppercase", "lowercase"],
    isPopular: false,
  },
  {
    id: "cron-helper",
    name: "Cron Expression Helper",
    description: "Parse cron schedule expressions into human-readable text & predicted execution dates",
    category: "Time",
    iconName: "CalendarClock",
    route: "/dev/cron",
    keywords: ["cron", "schedule", "crontab", "timer", "expression", "next run"],
    isPopular: false,
  },
];

export function getToolByRouteOrId(idOrRoute: string): ToolMeta | undefined {
  const clean = idOrRoute.replace(/^\/(dev|tools)\//, "");
  return TOOLS.find(
    (t) => t.id === clean || t.route === `/dev/${clean}` || t.route === `/tools/${clean}`
  );
}
