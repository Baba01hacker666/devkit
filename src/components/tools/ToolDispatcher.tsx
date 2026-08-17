"use client";

import { notFound } from "next/navigation";
import { JsonFormatterTool } from "./JsonFormatterTool";
import { JsonToTsTool } from "./JsonToTsTool";
import { JsonDiffTool } from "./JsonDiffTool";
import { JwtDecoderTool } from "./JwtDecoderTool";
import { Base64Tool } from "./Base64Tool";
import { UrlEncoderTool } from "./UrlEncoderTool";
import { HashGeneratorTool } from "./HashGeneratorTool";
import { UuidGeneratorTool } from "./UuidGeneratorTool";
import { RegexTesterTool } from "./RegexTesterTool";
import { TimestampConverterTool } from "./TimestampConverterTool";
import { HttpHeaderAnalyzerTool } from "./HttpHeaderAnalyzerTool";
import { TextDiffTool } from "./TextDiffTool";
import { CaseConverterTool } from "./CaseConverterTool";
import { CronHelperTool } from "./CronHelperTool";
import { ColorConverterTool } from "./ColorConverterTool";
import { NumberBaseConverterTool } from "./NumberBaseConverterTool";
import { RandomDataTool } from "./RandomDataTool";
import { MarkdownPreviewTool } from "./MarkdownPreviewTool";
import { HtmlEntitiesTool } from "./HtmlEntitiesTool";
import { WhitespaceCleanerTool } from "./WhitespaceCleanerTool";
import { PasswordGeneratorTool } from "./PasswordGeneratorTool";
import { LoremIpsumTool } from "./LoremIpsumTool";
import { TextStatsTool } from "./TextStatsTool";
import { SubnetCalculatorTool } from "./SubnetCalculatorTool";
import { CsvToJsonTool } from "./CsvToJsonTool";
import { HttpStatusTool } from "./HttpStatusTool";
import { QrCodeTool } from "./QrCodeTool";
import { ShieldCheck, Info } from "lucide-react";

interface ToolDispatcherProps {
  slug: string;
}

export function ToolDispatcher({ slug }: ToolDispatcherProps) {
  const toolKey = slug.toLowerCase();

  const renderTool = () => {
    switch (toolKey) {
      case "json":
      case "json-formatter":
        return <JsonFormatterTool />;
      case "json-to-typescript":
        return <JsonToTsTool />;
      case "json-diff":
        return <JsonDiffTool />;
      case "jwt":
      case "jwt-decoder":
        return <JwtDecoderTool />;
      case "base64":
        return <Base64Tool />;
      case "url":
      case "url-encoder":
        return <UrlEncoderTool />;
      case "hash":
      case "hash-generator":
        return <HashGeneratorTool />;
      case "uuid":
      case "uuid-generator":
        return <UuidGeneratorTool />;
      case "regex":
      case "regex-tester":
        return <RegexTesterTool />;
      case "timestamp":
      case "timestamp-converter":
        return <TimestampConverterTool />;
      case "headers":
      case "http-header-analyzer":
        return <HttpHeaderAnalyzerTool />;
      case "text-diff":
        return <TextDiffTool />;
      case "case-converter":
        return <CaseConverterTool />;
      case "cron":
      case "cron-helper":
        return <CronHelperTool />;
      case "color":
      case "color-converter":
        return <ColorConverterTool />;
      case "base-converter":
      case "number-base-converter":
        return <NumberBaseConverterTool />;
      case "random-data":
        return <RandomDataTool />;
      case "markdown":
        return <MarkdownPreviewTool />;
      case "html-entities":
        return <HtmlEntitiesTool />;
      case "whitespace":
        return <WhitespaceCleanerTool />;
      case "password-generator":
        return <PasswordGeneratorTool />;
      case "lorem-ipsum":
        return <LoremIpsumTool />;
      case "text-stats":
        return <TextStatsTool />;
      case "subnet-calculator":
        return <SubnetCalculatorTool />;
      case "csv-json":
        return <CsvToJsonTool />;
      case "http-status":
        return <HttpStatusTool />;
      case "qr":
      case "qr-code":
      case "qrcode":
        return <QrCodeTool />;
      default:
        notFound();
    }
  };

  return (
    <div className="space-y-12">
      {/* Primary Tool View */}
      {renderTool()}

      {/* Static Documentation & Helpful Tips Footer */}
      <footer className="mt-12 pt-8 border-t border-zinc-800 text-xs text-zinc-400 space-y-4 bg-zinc-900/40 p-6 rounded-xl">
        <div className="flex items-center gap-2 text-zinc-200 font-semibold text-sm">
          <Info className="w-4 h-4 text-blue-400" />
          <span>About this Developer Tool</span>
        </div>
        <p className="leading-relaxed">
          DevKit tools are designed to provide maximum privacy and performance. All calculations, parsing, formatting, and cryptographic operations are executed locally within your browser context.
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] text-zinc-500">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side Processing
          </span>
          <span>Zero Server Data Retention</span>
          <span>Deployable to Vercel</span>
          <span>Open-Source Developer Kit</span>
        </div>
      </footer>
    </div>
  );
}
