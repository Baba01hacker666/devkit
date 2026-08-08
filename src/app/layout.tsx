import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "DevKit - Modern Developer Tools Dashboard",
  description:
    "Production-quality developer tools dashboard. JSON Formatter, JWT Decoder, Regex Tester, Hash Generator, Base64, Timestamp Converter, HTTP Header Analyzer, and more. 100% client-side & privacy-first.",
  keywords: [
    "developer tools",
    "devkit",
    "json formatter",
    "jwt decoder",
    "regex tester",
    "hash generator",
    "base64 encoder",
    "timestamp converter",
    "http header analyzer",
    "text diff",
    "cron helper",
  ],
  authors: [{ name: "DevKit Team" }],
  openGraph: {
    title: "DevKit - All-in-One Developer Tools",
    description: "Modern, secure, client-side developer tools dashboard.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontMono.variable} dark`}>
      <body className="bg-zinc-950 text-zinc-100 font-sans min-h-screen antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
