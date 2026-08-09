# DevKit 🛠️

> A modern, production-quality developer tools dashboard designed for software engineers, cybersecurity professionals, and technical teams.

![Client-Side](https://img.shields.io/badge/Privacy-100%25%20Client--Side-emerald?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Framework-Next.js%2016-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge)

DevKit brings essential, high-performance developer utilities into a single, unified dashboard with dark mode UI, keyboard shortcuts (`Cmd+K`), Monaco Editor, and client-side processing.

---

## 🚀 Built-In Developer Tools (26 Tools)

### 📄 JSON Category
- **JSON Formatter & Validator** (`/dev/json`): Format, minify, and validate JSON payloads with precise line & column syntax error detection, file upload/download, and configurable indentations.
- **JSON → TypeScript** (`/dev/json-to-typescript`): Generate strongly typed TypeScript interfaces or type aliases from raw JSON objects, supporting nested objects and array types.
- **JSON Diff** (`/dev/json-diff`): Compare two JSON structures side-by-side or inline using Monaco Diff Editor.

### 🔒 Security Category
- **JWT Decoder** (`/dev/jwt`): Decode JSON Web Tokens (Header, Payload, Claims, Expiration countdown) 100% locally in your browser.
- **Cryptographic Hash Generator** (`/dev/hash`): Compute SHA-1, SHA-256, SHA-384, and SHA-512 digests simultaneously using browser Web Crypto APIs.
- **HTTP Header Security Analyzer** (`/dev/headers`): Inspect response headers for security best practices (CSP, HSTS, XFO, CORS, Cookies, Server disclosure) with overall Security Rating (Grade A+, B, C, F).
- **Password Generator** (`/dev/password-generator`): Generate cryptographically secure random passwords with custom length, character sets, and ambiguous-character exclusion.

### 🔤 Text Category
- **Regex Tester & Playground** (`/dev/regex`): Live pattern matching, match highlighting, capture groups breakdown, replace preview, common regex templates, and syntax explanation.
- **Text Diff Comparator** (`/dev/text-diff`): Side-by-side text diff engine with visual addition (+) and deletion (-) line metrics.
- **Text Case Converter** (`/dev/case-converter`): Convert text between camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case, etc.
- **Markdown Live Previewer** (`/dev/markdown`): Live Markdown editor with split-screen rendered HTML preview & HTML markup converter.
- **Whitespace Cleaner** (`/dev/whitespace`): Strip trailing spaces, remove duplicate empty lines, convert tabs to spaces, and clean formatting.
- **Lorem Ipsum Generator** (`/dev/lorem-ipsum`): Generate lorem ipsum placeholder text in words, sentences, or paragraphs with optional HTML markup.
- **Text Statistics** (`/dev/text-stats`): Analyze word count, characters, sentences, paragraphs, reading time, and top keyword frequency.

### ⏱️ Time Category
- **Unix Timestamp Converter** (`/dev/timestamp`): Convert Epoch timestamps (seconds/ms) to UTC, Local Date, ISO 8601, and relative times ("in 5 minutes", "2 hours ago"), plus live clock.
- **Cron Expression Helper** (`/dev/cron`): 5-field crontab breakdown, human-readable English explanations (`cronstrue`), and predicted upcoming execution times.

### 🛠️ Encoding & Utilities
- **Base64 Encoder / Decoder** (`/dev/base64`): Convert text & files to standard or URL-safe Base64 with full UTF-8 Unicode support.
- **URL Encoder / Decoder** (`/dev/url`): Encode/decode URI components and automatically parse query strings into key-value tables with 1-click copy buttons.
- **UUID / GUID v4 Generator** (`/dev/uuid`): Generate cryptographically secure UUID v4 tokens in bulk (1–500) with custom hyphens, uppercase, or brace formatting.
- **Color Converter & Accessibility Checker** (`/dev/color`): Convert HEX, RGB, HSL, RGBA color codes with live WCAG AA/AAA contrast testing.
- **Number Base Converter** (`/dev/base-converter`): Convert numbers between Binary, Octal, Decimal, and Hexadecimal with bit-grid visualization.
- **Random Data / Mock Generator** (`/dev/random-data`): Generate mock dataset records (Users, Emails, UUIDs, IPs) in JSON, CSV, or SQL Insert format.
- **HTML Entity Converter** (`/dev/html-entities`): Escape raw HTML characters into HTML entities or decode entity strings back into HTML.
- **CSV ↔ JSON Converter** (`/dev/csv-json`): Convert CSV to JSON and back with custom delimiters, quoted fields, and header rows.
- **Subnet (CIDR) Calculator** (`/dev/subnet-calculator`): Compute network, broadcast, usable hosts, wildcard mask, and ranges for any IPv4 CIDR block.
- **HTTP Status Codes Reference** (`/dev/http-status`): Browse every standard HTTP status code by class with descriptions.

---

## 🎨 Features & UX Highlights

- **Command Palette (`Ctrl/Cmd + K`)**: Instant search across all 26 tools, descriptions, categories, and keywords with full keyboard navigation (`↑`, `↓`, `Enter`, `ESC`).
- **Favorites & Pinned Tools**: Pin your most frequently used tools to your sidebar & dashboard homepage (`localStorage` backed).
- **Recently Used Tools**: Automatically tracks your recently accessed tools (`localStorage` backed).
- **Monaco Code Editor**: Powered by VS Code's editor engine with dynamic loading for maximum performance.
- **Dark & Light Modes**: Sleek dark mode by default with 1-click light mode switching.
- **100% Client-Side Privacy**: All data parsing, decoding, and hashing is executed inside your browser. No data is sent to external servers.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Code Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **CI/CD**: GitHub Actions

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js 18+ installed

### Installation & Run

```bash
# 1. Clone repository
git clone https://github.com/Baba01hacker666/devkit.git
cd devkit

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## 🔒 Privacy & Security

All data processed within DevKit tools is handled **strictly client-side** in your browser:
- No data logging or telemetry on tool inputs
- No third-party API processing
- Zero server-side persistence

---

## 📄 License

This project is licensed under the MIT License.
