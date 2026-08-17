"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import QRCode from "qrcode";
import { motion, AnimatePresence } from "motion/react";
import { animate } from "animejs";
import { ToolHeader } from "@/components/ui/ToolHeader";
import {
  Link2,
  FileText,
  Wifi,
  User,
  Mail,
  Phone,
  MessageSquare,
  Coins,
  Calendar,
  MapPin,
  Download,
  Copy,
  Check,
  Sparkles,
  Sliders,
  Palette,
  Image as ImageIcon,
  Shield,
  Eye,
  Printer,
  Upload,
  Trash2,
  Share2,
  Zap,
} from "lucide-react";

// Types
export type QrContentType =
  | "url"
  | "text"
  | "wifi"
  | "vcard"
  | "email"
  | "phone"
  | "sms"
  | "crypto"
  | "event"
  | "geo";

export type DotStyle = "square" | "rounded" | "dots" | "diamond";
export type EyeStyle = "square" | "rounded" | "circle";
export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";
export type GradientType = "none" | "linear" | "radial";

interface PresetColor {
  name: string;
  fg: string;
  fg2?: string;
  bg: string;
}

const COLOR_PRESETS: PresetColor[] = [
  { name: "Obsidian Slate", fg: "#0f172a", bg: "#ffffff" },
  { name: "Deep Cobalt", fg: "#1e3a8a", fg2: "#2563eb", bg: "#ffffff" },
  { name: "Forest Emerald", fg: "#064e3b", fg2: "#059669", bg: "#ffffff" },
  { name: "Dark Titanium", fg: "#18181b", bg: "#f4f4f5" },
  { name: "Monochrome Dark", fg: "#ffffff", bg: "#09090b" },
  { name: "Midnight Indigo", fg: "#6366f1", fg2: "#4338ca", bg: "#0f172a" },
  { name: "Warm Amber", fg: "#92400e", fg2: "#d97706", bg: "#ffffff" },
  { name: "Crimson Rose", fg: "#9f1239", fg2: "#e11d48", bg: "#ffffff" },
];

const PRESET_LOGOS = [
  { id: "none", name: "No Logo", icon: null },
  { id: "link", name: "Link", icon: "🔗" },
  { id: "wifi", name: "Wi-Fi", icon: "📶" },
  { id: "user", name: "Contact", icon: "👤" },
  { id: "mail", name: "Email", icon: "✉️" },
  { id: "shield", name: "Secure", icon: "🛡️" },
  { id: "star", name: "Star", icon: "⭐" },
  { id: "crypto", name: "Bitcoin", icon: "₿" },
];

export function QrCodeTool() {
  // Mode state
  const [contentType, setContentType] = useState<QrContentType>("url");

  // Input states
  const [urlInput, setUrlInput] = useState("https://github.com");
  const [textInput, setTextInput] = useState("Hello from DevKit!");
  
  // Wi-Fi
  const [wifiSsid, setWifiSsid] = useState("MyOfficeNetwork");
  const [wifiPassword, setWifiPassword] = useState("SecureKey2026");
  const [wifiEncryption, setWifiEncryption] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);

  // vCard
  const [vcardFirst, setVcardFirst] = useState("Alex");
  const [vcardLast, setVcardLast] = useState("Rivera");
  const [vcardOrg, setVcardOrg] = useState("Acme Labs");
  const [vcardTitle, setVcardTitle] = useState("Lead Engineer");
  const [vcardPhone, setVcardPhone] = useState("+1 (555) 234-5678");
  const [vcardEmail, setVcardEmail] = useState("alex@acmelabs.com");
  const [vcardUrl, setVcardUrl] = useState("https://acmelabs.com");

  // Email
  const [emailTo, setEmailTo] = useState("contact@example.com");
  const [emailSubject, setEmailSubject] = useState("Product Inquiry");
  const [emailBody, setEmailBody] = useState("Hi,\nI would like to inquire about...");

  // Phone / SMS
  const [phoneNum, setPhoneNum] = useState("+15551234567");
  const [smsNum, setSmsNum] = useState("+15551234567");
  const [smsText, setSmsText] = useState("Hey, let's connect!");

  // Crypto
  const [cryptoCoin, setCryptoCoin] = useState<"bitcoin" | "ethereum" | "solana">("bitcoin");
  const [cryptoAddress, setCryptoAddress] = useState("bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq");
  const [cryptoAmount, setCryptoAmount] = useState("0.025");
  const [cryptoLabel, setCryptoLabel] = useState("DevKit Donation");

  // Event
  const [eventTitle, setEventTitle] = useState("Tech Summit 2026");
  const [eventLocation, setEventLocation] = useState("Moscone Center, SF");
  const [eventStart, setEventStart] = useState("2026-09-15T09:00");
  const [eventEnd, setEventEnd] = useState("2026-09-15T17:00");
  const [eventDesc, setEventDesc] = useState("Annual developer gathering & keynote.");

  // Geo
  const [geoLat, setGeoLat] = useState("37.7749");
  const [geoLng, setGeoLng] = useState("-122.4194");
  const [geoQuery, setGeoQuery] = useState("San Francisco");

  // Style Customization States
  const [fgColor, setFgColor] = useState("#0f172a");
  const [fgColor2, setFgColor2] = useState("#2563eb");
  const [gradientType, setGradientType] = useState<GradientType>("none");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [transparentBg, setTransparentBg] = useState(false);
  const [dotStyle, setDotStyle] = useState<DotStyle>("rounded");
  const [eyeStyle, setEyeStyle] = useState<EyeStyle>("rounded");
  const [margin, setMargin] = useState(2);
  const [ecc, setEcc] = useState<ErrorCorrectionLevel>("M");
  const [exportSize, setExportSize] = useState(1024);

  // Logo Overlay States
  const [selectedPresetLogo, setSelectedPresetLogo] = useState("none");
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  const [logoSizePercent, setLogoSizePercent] = useState(22);
  const [logoBgColor, setLogoBgColor] = useState("#ffffff");

  // Active accordion section
  const [activeTabSection, setActiveTabSection] = useState<"style" | "colors" | "logo" | "config">("style");

  // Simulator & Scanner HUD
  const [isScanningActive, setIsScanningActive] = useState(true);
  const [activePreviewMode, setActivePreviewMode] = useState<"canvas" | "simulator">("canvas");
  const [copiedState, setCopiedState] = useState<string | null>(null);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const scanBeamRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const qrContainerRef = useRef<HTMLDivElement | null>(null);

  // Effective ECC (Automatically upgraded to H if a logo is present to maintain scan reliability)
  const effectiveEcc: ErrorCorrectionLevel =
    (selectedPresetLogo !== "none" || customLogoUrl) && (ecc === "L" || ecc === "M")
      ? "H"
      : ecc;

  // Compute final encoded payload string based on current mode
  const encodedPayload = useMemo(() => {
    switch (contentType) {
      case "url":
        return urlInput.trim() || "https://";
      case "text":
        return textInput || "";
      case "wifi":
        return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};H:${wifiHidden ? "true" : "false"};;`;
      case "vcard":
        return [
          "BEGIN:VCARD",
          "VERSION:3.0",
          `N:${vcardLast};${vcardFirst};;;`,
          `FN:${vcardFirst} ${vcardLast}`,
          vcardOrg ? `ORG:${vcardOrg}` : "",
          vcardTitle ? `TITLE:${vcardTitle}` : "",
          vcardPhone ? `TEL;TYPE=CELL:${vcardPhone}` : "",
          vcardEmail ? `EMAIL:${vcardEmail}` : "",
          vcardUrl ? `URL:${vcardUrl}` : "",
          "END:VCARD",
        ]
          .filter(Boolean)
          .join("\n");
      case "email":
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case "phone":
        return `tel:${phoneNum.replace(/\s+/g, "")}`;
      case "sms":
        return `smsto:${smsNum.replace(/\s+/g, "")}:${smsText}`;
      case "crypto":
        if (cryptoCoin === "bitcoin") {
          return `bitcoin:${cryptoAddress}?amount=${cryptoAmount}&label=${encodeURIComponent(cryptoLabel)}`;
        } else if (cryptoCoin === "ethereum") {
          return `ethereum:${cryptoAddress}?value=${cryptoAmount}`;
        } else {
          return `solana:${cryptoAddress}?amount=${cryptoAmount}&label=${encodeURIComponent(cryptoLabel)}`;
        }
      case "event": {
        const fmtDate = (d: string) => d.replace(/[-:]/g, "") + "00Z";
        return [
          "BEGIN:VCALENDAR",
          "VERSION:2.0",
          "BEGIN:VEVENT",
          `SUMMARY:${eventTitle}`,
          `LOCATION:${eventLocation}`,
          `DESCRIPTION:${eventDesc}`,
          `DTSTART:${fmtDate(eventStart)}`,
          `DTEND:${fmtDate(eventEnd)}`,
          "END:VEVENT",
          "END:VCALENDAR",
        ].join("\n");
      }
      case "geo":
        return `geo:${geoLat},${geoLng}${geoQuery ? `?q=${encodeURIComponent(geoQuery)}` : ""}`;
      default:
        return urlInput;
    }
  }, [
    contentType,
    urlInput,
    textInput,
    wifiSsid,
    wifiPassword,
    wifiEncryption,
    wifiHidden,
    vcardFirst,
    vcardLast,
    vcardOrg,
    vcardTitle,
    vcardPhone,
    vcardEmail,
    vcardUrl,
    emailTo,
    emailSubject,
    emailBody,
    phoneNum,
    smsNum,
    smsText,
    cryptoCoin,
    cryptoAddress,
    cryptoAmount,
    cryptoLabel,
    eventTitle,
    eventLocation,
    eventStart,
    eventEnd,
    eventDesc,
    geoLat,
    geoLng,
    geoQuery,
  ]);

  // Draw QR code onto canvas
  const renderQrToCanvas = useCallback(
    async (targetCanvas: HTMLCanvasElement, renderWidth: number = 800) => {
      if (!encodedPayload) return;
      const ctx = targetCanvas.getContext("2d");
      if (!ctx) return;

      try {
        const qrData = QRCode.create(encodedPayload, {
          errorCorrectionLevel: effectiveEcc,
        });

        const matrixSize = qrData.modules.size;
        const totalDimension = matrixSize + margin * 2;
        const cellSize = renderWidth / totalDimension;

        targetCanvas.width = renderWidth;
        targetCanvas.height = renderWidth;

        // Clear canvas
        ctx.clearRect(0, 0, renderWidth, renderWidth);

        // Fill background
        if (!transparentBg) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, renderWidth, renderWidth);
        }

        // Set up foreground paint
        let fgPaint: string | CanvasGradient = fgColor;
        if (gradientType === "linear") {
          const grad = ctx.createLinearGradient(0, 0, renderWidth, renderWidth);
          grad.addColorStop(0, fgColor);
          grad.addColorStop(1, fgColor2);
          fgPaint = grad;
        } else if (gradientType === "radial") {
          const grad = ctx.createRadialGradient(
            renderWidth / 2,
            renderWidth / 2,
            cellSize,
            renderWidth / 2,
            renderWidth / 2,
            renderWidth / 1.3
          );
          grad.addColorStop(0, fgColor);
          grad.addColorStop(1, fgColor2);
          fgPaint = grad;
        }

        // Helper to check if cell is within a finder pattern (7x7 corners)
        const isFinderPattern = (r: number, c: number) => {
          if (r < 7 && c < 7) return true; // Top-Left
          if (r < 7 && c >= matrixSize - 7) return true; // Top-Right
          if (r >= matrixSize - 7 && c < 7) return true; // Bottom-Left
          return false;
        };

        // Helper to draw eye pattern
        const drawFinderEye = (startRow: number, startCol: number) => {
          const x = (startCol + margin) * cellSize;
          const y = (startRow + margin) * cellSize;
          const eyeWidth = 7 * cellSize;

          ctx.fillStyle = fgPaint;

          if (eyeStyle === "circle") {
            // Outer ring
            ctx.beginPath();
            ctx.arc(x + eyeWidth / 2, y + eyeWidth / 2, eyeWidth / 2, 0, Math.PI * 2);
            ctx.arc(x + eyeWidth / 2, y + eyeWidth / 2, (eyeWidth / 2) - cellSize, 0, Math.PI * 2, true);
            ctx.fill();

            // Inner pupil
            ctx.beginPath();
            ctx.arc(x + eyeWidth / 2, y + eyeWidth / 2, (3 * cellSize) / 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (eyeStyle === "rounded") {
            // Outer frame
            ctx.beginPath();
            const radOuter = cellSize * 1.5;
            ctx.roundRect(x, y, eyeWidth, eyeWidth, radOuter);
            ctx.roundRect(
              x + cellSize,
              y + cellSize,
              eyeWidth - 2 * cellSize,
              eyeWidth - 2 * cellSize,
              radOuter * 0.7
            );
            ctx.fill("evenodd");

            // Inner pupil
            ctx.beginPath();
            ctx.roundRect(
              x + 2 * cellSize,
              y + 2 * cellSize,
              3 * cellSize,
              3 * cellSize,
              cellSize * 0.8
            );
            ctx.fill();
          } else {
            // Classic Square frame
            ctx.beginPath();
            ctx.rect(x, y, eyeWidth, eyeWidth);
            ctx.rect(x + cellSize, y + cellSize, eyeWidth - 2 * cellSize, eyeWidth - 2 * cellSize);
            ctx.fill("evenodd");

            // Inner square
            ctx.fillRect(x + 2 * cellSize, y + 2 * cellSize, 3 * cellSize, 3 * cellSize);
          }
        };

        // Calculate center cutout area if logo is enabled
        const hasLogo = selectedPresetLogo !== "none" || Boolean(customLogoUrl);
        const centerLogoSize = hasLogo ? (renderWidth * (logoSizePercent / 100)) : 0;
        const centerBox = {
          x: (renderWidth - centerLogoSize) / 2,
          y: (renderWidth - centerLogoSize) / 2,
          size: centerLogoSize,
        };

        // Draw regular QR modules
        for (let row = 0; row < matrixSize; row++) {
          for (let col = 0; col < matrixSize; col++) {
            const isActive = qrData.modules.get(row, col);

            // Skip finder pattern areas, we draw them cleanly with drawFinderEye
            if (isFinderPattern(row, col)) {
              continue;
            }

            const x = (col + margin) * cellSize;
            const y = (row + margin) * cellSize;

            // Skip modules directly behind the center logo cutout
            if (hasLogo) {
              const moduleCenterX = x + cellSize / 2;
              const moduleCenterY = y + cellSize / 2;
              if (
                moduleCenterX >= centerBox.x - cellSize * 0.5 &&
                moduleCenterX <= centerBox.x + centerBox.size + cellSize * 0.5 &&
                moduleCenterY >= centerBox.y - cellSize * 0.5 &&
                moduleCenterY <= centerBox.y + centerBox.size + cellSize * 0.5
              ) {
                continue;
              }
            }

            if (isActive) {
              ctx.fillStyle = fgPaint;

              if (dotStyle === "dots") {
                ctx.beginPath();
                ctx.arc(x + cellSize / 2, y + cellSize / 2, (cellSize / 2) * 0.88, 0, Math.PI * 2);
                ctx.fill();
              } else if (dotStyle === "rounded") {
                ctx.beginPath();
                const pad = cellSize * 0.08;
                ctx.roundRect(
                  x + pad,
                  y + pad,
                  cellSize - pad * 2,
                  cellSize - pad * 2,
                  cellSize * 0.35
                );
                ctx.fill();
              } else if (dotStyle === "diamond") {
                ctx.beginPath();
                ctx.moveTo(x + cellSize / 2, y + cellSize * 0.1);
                ctx.lineTo(x + cellSize * 0.9, y + cellSize / 2);
                ctx.lineTo(x + cellSize / 2, y + cellSize * 0.9);
                ctx.lineTo(x + cellSize * 0.1, y + cellSize / 2);
                ctx.closePath();
                ctx.fill();
              } else {
                // Classic square
                ctx.fillRect(x, y, cellSize + 0.3, cellSize + 0.3);
              }
            }
          }
        }

        // Draw the 3 finder pattern eyes
        drawFinderEye(0, 0); // Top-left
        drawFinderEye(0, matrixSize - 7); // Top-right
        drawFinderEye(matrixSize - 7, 0); // Bottom-left

        // Render Center Logo if selected
        if (hasLogo) {
          const pad = cellSize * 0.6;
          const bgPadSize = centerBox.size + pad * 2;
          const bgX = (renderWidth - bgPadSize) / 2;
          const bgY = (renderWidth - bgPadSize) / 2;

          // Draw logo background circle/plate
          ctx.fillStyle = logoBgColor;
          ctx.beginPath();
          ctx.roundRect(bgX, bgY, bgPadSize, bgPadSize, bgPadSize * 0.25);
          ctx.fill();

          // Subtle border for logo plate
          ctx.strokeStyle = "rgba(0,0,0,0.08)";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // If preset text/icon logo
          if (selectedPresetLogo !== "none") {
            const preset = PRESET_LOGOS.find((l) => l.id === selectedPresetLogo);
            if (preset && preset.icon) {
              ctx.font = `${Math.floor(centerBox.size * 0.65)}px sans-serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(preset.icon, renderWidth / 2, renderWidth / 2 + 2);
            }
          } else if (customLogoUrl) {
            // If custom uploaded image
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = customLogoUrl;
            await new Promise((resolve) => {
              img.onload = () => {
                ctx.drawImage(
                  img,
                  centerBox.x,
                  centerBox.y,
                  centerBox.size,
                  centerBox.size
                );
                resolve(true);
              };
              img.onerror = () => resolve(false);
            });
          }
        }
      } catch (err) {
        console.error("QR Code Render error:", err);
      }
    },
    [
      encodedPayload,
      effectiveEcc,
      margin,
      transparentBg,
      bgColor,
      fgColor,
      fgColor2,
      gradientType,
      dotStyle,
      eyeStyle,
      selectedPresetLogo,
      customLogoUrl,
      logoSizePercent,
      logoBgColor,
    ]
  );

  // Trigger re-render whenever configuration updates
  useEffect(() => {
    if (canvasRef.current) {
      renderQrToCanvas(canvasRef.current, 600);
    }
  }, [renderQrToCanvas]);

  // Anime.js laser scanning beam animation
  useEffect(() => {
    if (!scanBeamRef.current || !isScanningActive) return;

    const anim = animate(scanBeamRef.current, {
      translateY: ["0%", "100%", "0%"],
      duration: 3200,
      ease: "easeInOutSine",
      loop: true,
    });

    return () => {
      anim.pause();
    };
  }, [isScanningActive]);

  // Anime.js celebration particle burst on export / copy
  const triggerParticleBurst = () => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
      alpha: number;
    }> = [];

    const colors = [fgColor, fgColor2, "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"];

    for (let i = 0; i < 36; i++) {
      const angle = (Math.PI * 2 * i) / 36;
      const speed = 2 + Math.random() * 4;
      particles.push({
        x: 200,
        y: 200,
        radius: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
      });
    }

    const animObj = { progress: 0 };
    animate(animObj, {
      progress: 1,
      duration: 800,
      ease: "easeOutQuad",
      onUpdate: () => {
        ctx.clearRect(0, 0, 400, 400);
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          p.alpha = Math.max(0, 1 - animObj.progress);
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      },
      onComplete: () => {
        ctx.clearRect(0, 0, 400, 400);
      },
    });
  };

  // Export handlers
  const handleDownloadPng = async (res: number = exportSize) => {
    const exportCanvas = document.createElement("canvas");
    await renderQrToCanvas(exportCanvas, res);
    const dataUrl = exportCanvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `qrcode-${contentType}-${res}px.png`;
    a.click();
    triggerParticleBurst();
  };

  const handleDownloadSvg = async () => {
    try {
      const svgString = await QRCode.toString(encodedPayload, {
        type: "svg",
        margin: margin,
        errorCorrectionLevel: effectiveEcc,
        color: {
          dark: fgColor,
          light: transparentBg ? "#00000000" : bgColor,
        },
      });

      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qrcode-${contentType}.svg`;
      a.click();
      URL.revokeObjectURL(url);
      triggerParticleBurst();
    } catch (err) {
      console.error("SVG Export failed:", err);
    }
  };

  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          setCopiedState("image");
          triggerParticleBurst();
          setTimeout(() => setCopiedState(null), 2500);
        }
      });
    } catch {
      // Fallback: Copy Base64 string
      const dataUrl = canvasRef.current.toDataURL("image/png");
      await navigator.clipboard.writeText(dataUrl);
      setCopiedState("base64");
      setTimeout(() => setCopiedState(null), 2500);
    }
  };

  const handleCopyRawPayload = async () => {
    await navigator.clipboard.writeText(encodedPayload);
    setCopiedState("payload");
    setTimeout(() => setCopiedState(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCustomLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomLogoUrl(event.target?.result as string);
        setSelectedPresetLogo("none");
      };
      reader.readAsDataURL(file);
    }
  };

  const clearLogo = () => {
    setSelectedPresetLogo("none");
    setCustomLogoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Nav Tab Definitions
  const TABS: Array<{ id: QrContentType; label: string; icon: React.ElementType }> = [
    { id: "url", label: "URL", icon: Link2 },
    { id: "text", label: "Text", icon: FileText },
    { id: "wifi", label: "Wi-Fi", icon: Wifi },
    { id: "vcard", label: "vCard", icon: User },
    { id: "email", label: "Email", icon: Mail },
    { id: "phone", label: "Phone", icon: Phone },
    { id: "sms", label: "SMS", icon: MessageSquare },
    { id: "crypto", label: "Crypto", icon: Coins },
    { id: "event", label: "Event", icon: Calendar },
    { id: "geo", label: "Location", icon: MapPin },
  ];

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <ToolHeader
        id="qr-code"
        name="QR Code Studio"
        description="Craft, style, and generate high-precision QR codes with instant vector SVG and 4K raster export."
        category="Utilities"
      />

      {/* Content Mode Switcher Bar */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-1.5 overflow-x-auto scrollbar-none flex items-center gap-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = contentType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setContentType(tab.id)}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all shrink-0 select-none ${
                isActive ? "text-white font-semibold" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabBadge"
                  className="absolute inset-0 bg-blue-600 rounded-lg shadow-sm"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Studio Grid: Left Config Panel, Right Live Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Section: Inputs & Customizer Accordions (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Primary Content Inputs Card */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-blue-400" />
                Payload Content
              </span>
              <span className="text-[11px] font-mono text-zinc-500">
                {encodedPayload.length} chars | ~{Math.ceil(encodedPayload.length * 1.2)} bytes
              </span>
            </div>

            {/* URL Mode */}
            {contentType === "url" && (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-zinc-300">Target Website URL</label>
                <div className="flex rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 focus-within:border-blue-500 transition">
                  <span className="px-3 py-2.5 bg-zinc-900/80 text-zinc-500 text-xs border-r border-zinc-800 select-none font-mono">
                    https://
                  </span>
                  <input
                    type="text"
                    value={urlInput.replace(/^https?:\/\//i, "")}
                    onChange={(e) => setUrlInput(`https://${e.target.value}`)}
                    placeholder="example.com/project"
                    className="flex-1 bg-transparent px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none font-mono"
                  />
                </div>
                <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                  <span>Quick Presets:</span>
                  {["github.com", "google.com", "devkit.io"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setUrlInput(`https://${preset}`)}
                      className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Text Mode */}
            {contentType === "text" && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-300">Plain Text / Notes</label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  rows={4}
                  placeholder="Enter message, code snippet, or alphanumeric data..."
                  className="w-full bg-zinc-950 text-zinc-100 p-3 rounded-lg border border-zinc-800 text-xs font-mono focus:outline-none focus:border-blue-500 resize-y"
                />
              </div>
            )}

            {/* Wi-Fi Mode */}
            {contentType === "wifi" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Network Name (SSID)</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="Office_Wi-Fi_5G"
                    className="w-full bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Security / Encryption</label>
                    <select
                      value={wifiEncryption}
                      onChange={(e) => setWifiEncryption(e.target.value as "WPA" | "WEP" | "nopass")}
                      className="w-full bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="WPA">WPA / WPA2 / WPA3 (Default)</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">None (Open Network)</option>
                    </select>
                  </div>
                  {wifiEncryption !== "nopass" && (
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">Password</label>
                      <input
                        type="text"
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                        placeholder="Network password"
                        className="w-full bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 text-xs font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
                <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={wifiHidden}
                    onChange={(e) => setWifiHidden(e.target.checked)}
                    className="rounded bg-zinc-950 border-zinc-700 text-blue-600 focus:ring-0"
                  />
                  <span>Hidden Network SSID</span>
                </label>
              </div>
            )}

            {/* vCard Contact Mode */}
            {contentType === "vcard" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">First Name</label>
                    <input
                      type="text"
                      value={vcardFirst}
                      onChange={(e) => setVcardFirst(e.target.value)}
                      className="w-full bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={vcardLast}
                      onChange={(e) => setVcardLast(e.target.value)}
                      className="w-full bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      value={vcardOrg}
                      onChange={(e) => setVcardOrg(e.target.value)}
                      className="w-full bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Job Title</label>
                    <input
                      type="text"
                      value={vcardTitle}
                      onChange={(e) => setVcardTitle(e.target.value)}
                      className="w-full bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Mobile Phone</label>
                    <input
                      type="text"
                      value={vcardPhone}
                      onChange={(e) => setVcardPhone(e.target.value)}
                      className="w-full bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 text-xs font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Email</label>
                    <input
                      type="email"
                      value={vcardEmail}
                      onChange={(e) => setVcardEmail(e.target.value)}
                      className="w-full bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 text-xs font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Website URL</label>
                  <input
                    type="text"
                    value={vcardUrl}
                    onChange={(e) => setVcardUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Email Mode */}
            {contentType === "email" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Recipient Email</label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    className="w-full bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Subject</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Message Body</label>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    rows={3}
                    className="w-full bg-zinc-950 text-zinc-100 p-3 rounded-lg border border-zinc-800 text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Phone Mode */}
            {contentType === "phone" && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-300">Telephone Number</label>
                <input
                  type="text"
                  value={phoneNum}
                  onChange={(e) => setPhoneNum(e.target.value)}
                  placeholder="+15551234567"
                  className="w-full bg-zinc-950 text-zinc-100 px-3 py-2.5 rounded-lg border border-zinc-800 text-xs font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {/* SMS Mode */}
            {contentType === "sms" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Recipient Phone Number</label>
                  <input
                    type="text"
                    value={smsNum}
                    onChange={(e) => setSmsNum(e.target.value)}
                    className="w-full bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Pre-filled SMS Text</label>
                  <textarea
                    value={smsText}
                    onChange={(e) => setSmsText(e.target.value)}
                    rows={2}
                    className="w-full bg-zinc-950 text-zinc-100 p-3 rounded-lg border border-zinc-800 text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Crypto Mode */}
            {contentType === "crypto" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Cryptocurrency</label>
                    <select
                      value={cryptoCoin}
                      onChange={(e) => setCryptoCoin(e.target.value as "bitcoin" | "ethereum" | "solana")}
                      className="w-full bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="bitcoin">Bitcoin (BTC)</option>
                      <option value="ethereum">Ethereum (ETH)</option>
                      <option value="solana">Solana (SOL)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Amount ({cryptoCoin.toUpperCase()})</label>
                    <input
                      type="text"
                      value={cryptoAmount}
                      onChange={(e) => setCryptoAmount(e.target.value)}
                      className="w-full bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 text-xs font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Wallet Address</label>
                  <input
                    type="text"
                    value={cryptoAddress}
                    onChange={(e) => setCryptoAddress(e.target.value)}
                    className="w-full bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Payment Memo / Label</label>
                  <input
                    type="text"
                    value={cryptoLabel}
                    onChange={(e) => setCryptoLabel(e.target.value)}
                    placeholder="e.g. Invoice #1024"
                    className="w-full bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Event Mode */}
            {contentType === "event" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Event Title</label>
                    <input
                      type="text"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      className="w-full bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Location</label>
                    <input
                      type="text"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      className="w-full bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Start Time</label>
                    <input
                      type="datetime-local"
                      value={eventStart}
                      onChange={(e) => setEventStart(e.target.value)}
                      className="w-full bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">End Time</label>
                    <input
                      type="datetime-local"
                      value={eventEnd}
                      onChange={(e) => setEventEnd(e.target.value)}
                      className="w-full bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Description / Notes</label>
                  <textarea
                    value={eventDesc}
                    onChange={(e) => setEventDesc(e.target.value)}
                    rows={2}
                    placeholder="Event details or agenda..."
                    className="w-full bg-zinc-950 text-zinc-100 p-3 rounded-lg border border-zinc-800 text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Geo Location Mode */}
            {contentType === "geo" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Latitude</label>
                    <input
                      type="text"
                      value={geoLat}
                      onChange={(e) => setGeoLat(e.target.value)}
                      className="w-full bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 text-xs font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Longitude</label>
                    <input
                      type="text"
                      value={geoLng}
                      onChange={(e) => setGeoLng(e.target.value)}
                      className="w-full bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 text-xs font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Query / Label</label>
                  <input
                    type="text"
                    value={geoQuery}
                    onChange={(e) => setGeoQuery(e.target.value)}
                    className="w-full bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Customization Accordion Section */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden shadow-sm divide-y divide-zinc-800/80">
            {/* Accordion Tabs Header */}
            <div className="grid grid-cols-4 p-1.5 bg-zinc-950/40 text-xs font-medium">
              {[
                { id: "style", label: "Shapes", icon: Sliders },
                { id: "colors", label: "Colors", icon: Palette },
                { id: "logo", label: "Logo", icon: ImageIcon },
                { id: "config", label: "Precision", icon: Shield },
              ].map((sec) => {
                const Icon = sec.icon;
                const active = activeTabSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setActiveTabSection(sec.id as typeof activeTabSection)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition select-none ${
                      active
                        ? "bg-zinc-800 text-blue-400 font-semibold border border-zinc-700/60 shadow-inner"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{sec.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Accordion Content Panel with Motion transition */}
            <div className="p-5">
              <AnimatePresence mode="wait">
                {/* 1. Shapes & Module Style */}
                {activeTabSection === "style" && (
                  <motion.div
                    key="style"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-2">
                        Data Module Pattern
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          { id: "square", name: "Classic Square", desc: "Standard matrix" },
                          { id: "rounded", name: "Smooth Tiles", desc: "Softened corners" },
                          { id: "dots", name: "Circular Dots", desc: "Modern rounded" },
                          { id: "diamond", name: "Diamond", desc: "Rhombus geometric" },
                        ].map((shape) => (
                          <button
                            key={shape.id}
                            type="button"
                            onClick={() => setDotStyle(shape.id as DotStyle)}
                            className={`p-3 rounded-lg border text-left transition flex flex-col justify-between ${
                              dotStyle === shape.id
                                ? "bg-blue-600/10 border-blue-500 text-blue-400"
                                : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                            }`}
                          >
                            <span className="text-xs font-semibold">{shape.name}</span>
                            <span className="text-[10px] text-zinc-500 mt-1">{shape.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-2">
                        Finder Corner Eyes
                      </label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {[
                          { id: "square", name: "Square Eyes" },
                          { id: "rounded", name: "Rounded Eyes" },
                          { id: "circle", name: "Circle Eyes" },
                        ].map((eye) => (
                          <button
                            key={eye.id}
                            type="button"
                            onClick={() => setEyeStyle(eye.id as EyeStyle)}
                            className={`p-2.5 rounded-lg border text-xs font-medium text-center transition ${
                              eyeStyle === eye.id
                                ? "bg-blue-600/10 border-blue-500 text-blue-400"
                                : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                            }`}
                          >
                            {eye.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-zinc-300">Quiet Zone (Margin)</label>
                        <span className="text-xs font-mono text-zinc-400">{margin} blocks</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="6"
                        step="1"
                        value={margin}
                        onChange={(e) => setMargin(Number(e.target.value))}
                        className="w-full accent-blue-500 bg-zinc-800"
                      />
                    </div>
                  </motion.div>
                )}

                {/* 2. Colors & Gradients */}
                {activeTabSection === "colors" && (
                  <motion.div
                    key="colors"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-5"
                  >
                    {/* Palette Presets */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-2">
                        Curated Themes
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {COLOR_PRESETS.map((p) => (
                          <button
                            key={p.name}
                            type="button"
                            onClick={() => {
                              setFgColor(p.fg);
                              if (p.fg2) {
                                setFgColor2(p.fg2);
                                setGradientType("linear");
                              } else {
                                setGradientType("none");
                              }
                              setBgColor(p.bg);
                              setTransparentBg(false);
                            }}
                            className="flex items-center gap-2 p-2 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-950/60 text-left transition"
                          >
                            <div className="w-5 h-5 rounded-md border border-zinc-700 overflow-hidden flex shrink-0">
                              <div className="w-1/2 h-full" style={{ backgroundColor: p.fg }} />
                              <div className="w-1/2 h-full" style={{ backgroundColor: p.bg }} />
                            </div>
                            <span className="text-[11px] text-zinc-300 truncate">{p.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Foreground controls */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1.5">Primary Color (HEX)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={fgColor}
                            onChange={(e) => setFgColor(e.target.value)}
                            className="w-9 h-9 rounded-lg border border-zinc-700 bg-transparent cursor-pointer p-0.5"
                          />
                          <input
                            type="text"
                            value={fgColor}
                            onChange={(e) => setFgColor(e.target.value)}
                            className="flex-1 bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800 text-xs font-mono text-zinc-100 uppercase"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-zinc-400 mb-1.5">Color Gradient Effect</label>
                        <select
                          value={gradientType}
                          onChange={(e) => setGradientType(e.target.value as GradientType)}
                          className="w-full bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 text-xs focus:outline-none focus:border-blue-500"
                        >
                          <option value="none">Solid Color</option>
                          <option value="linear">Linear Diagonal Gradient</option>
                          <option value="radial">Radial Center Glow</option>
                        </select>
                      </div>
                    </div>

                    {gradientType !== "none" && (
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1.5">Secondary Gradient Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={fgColor2}
                            onChange={(e) => setFgColor2(e.target.value)}
                            className="w-9 h-9 rounded-lg border border-zinc-700 bg-transparent cursor-pointer p-0.5"
                          />
                          <input
                            type="text"
                            value={fgColor2}
                            onChange={(e) => setFgColor2(e.target.value)}
                            className="flex-1 bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800 text-xs font-mono text-zinc-100 uppercase"
                          />
                        </div>
                      </div>
                    )}

                    {/* Background controls */}
                    <div className="border-t border-zinc-800/80 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1.5">Background Fill</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={bgColor}
                            disabled={transparentBg}
                            onChange={(e) => setBgColor(e.target.value)}
                            className="w-8 h-8 rounded-lg border border-zinc-700 bg-transparent cursor-pointer p-0.5 disabled:opacity-30"
                          />
                          <span className="text-xs font-mono text-zinc-400 uppercase">
                            {transparentBg ? "Transparent" : bgColor}
                          </span>
                        </div>
                      </div>

                      <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={transparentBg}
                          onChange={(e) => setTransparentBg(e.target.checked)}
                          className="rounded bg-zinc-950 border-zinc-700 text-blue-600 focus:ring-0"
                        />
                        <span>Transparent Canvas</span>
                      </label>
                    </div>
                  </motion.div>
                )}

                {/* 3. Logo & Branding */}
                {activeTabSection === "logo" && (
                  <motion.div
                    key="logo"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-2">
                        Preset Icons
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {PRESET_LOGOS.map((logo) => (
                          <button
                            key={logo.id}
                            type="button"
                            onClick={() => {
                              setSelectedPresetLogo(logo.id);
                              setCustomLogoUrl(null);
                            }}
                            className={`p-2.5 rounded-lg border text-center transition flex flex-col items-center gap-1 ${
                              selectedPresetLogo === logo.id && !customLogoUrl
                                ? "bg-blue-600/10 border-blue-500 text-blue-400 font-semibold"
                                : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                            }`}
                          >
                            <span className="text-base">{logo.icon || "✕"}</span>
                            <span className="text-[11px] truncate w-full">{logo.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Logo Upload */}
                    <div className="border-t border-zinc-800/80 pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-zinc-300">Custom Logo Image</label>
                        {(selectedPresetLogo !== "none" || customLogoUrl) && (
                          <button
                            type="button"
                            onClick={clearLogo}
                            className="flex items-center gap-1 text-[11px] text-rose-400 hover:underline"
                          >
                            <Trash2 className="w-3 h-3" /> Remove Logo
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/svg+xml,image/webp"
                          onChange={handleCustomLogoUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition"
                        >
                          <Upload className="w-3.5 h-3.5" /> Upload File (PNG/SVG)
                        </button>
                        {customLogoUrl && (
                          <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                            <Check className="w-3 h-3" /> Custom image loaded
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Logo Size and Background Padding */}
                    {(selectedPresetLogo !== "none" || customLogoUrl) && (
                      <div className="space-y-4 pt-2">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs text-zinc-400">Logo Scale</label>
                            <span className="text-xs font-mono text-zinc-400">{logoSizePercent}%</span>
                          </div>
                          <input
                            type="range"
                            min="12"
                            max="30"
                            step="1"
                            value={logoSizePercent}
                            onChange={(e) => setLogoSizePercent(Number(e.target.value))}
                            className="w-full accent-blue-500 bg-zinc-800"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="text-xs text-zinc-400">Logo Background Cutout</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={logoBgColor}
                              onChange={(e) => setLogoBgColor(e.target.value)}
                              className="w-7 h-7 rounded border border-zinc-700 bg-transparent cursor-pointer p-0.5"
                            />
                            <span className="text-xs font-mono text-zinc-400 uppercase">{logoBgColor}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 4. Precision & Error Correction */}
                {activeTabSection === "config" && (
                  <motion.div
                    key="config"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-2">
                        Error Correction Level (ECC)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: "L", label: "Level L (~7%)", desc: "Best for clean displays" },
                          { id: "M", label: "Level M (~15%)", desc: "Standard balance" },
                          { id: "Q", label: "Level Q (~25%)", desc: "High redundancy" },
                          { id: "H", label: "Level H (~30%)", desc: "Required for logos" },
                        ].map((lvl) => (
                          <button
                            key={lvl.id}
                            type="button"
                            onClick={() => setEcc(lvl.id as ErrorCorrectionLevel)}
                            className={`p-2.5 rounded-lg border text-left transition flex flex-col justify-between ${
                              effectiveEcc === lvl.id
                                ? "bg-blue-600/10 border-blue-500 text-blue-400"
                                : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                            }`}
                          >
                            <span className="text-xs font-bold">{lvl.label}</span>
                            <span className="text-[10px] text-zinc-500 mt-0.5">{lvl.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-2">
                        Export Resolution Target
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[512, 1024, 2048, 4096].map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setExportSize(sz)}
                            className={`py-2 px-3 rounded-lg border text-xs font-mono text-center transition ${
                              exportSize === sz
                                ? "bg-blue-600/10 border-blue-500 text-blue-400 font-bold"
                                : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                            }`}
                          >
                            {sz} × {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Section: Live Interactive Visualizer & Export Toolbar (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-20">
          {/* Main Visualizer Container */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 shadow-lg flex flex-col items-center">
            {/* Visualizer Mode Header */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-zinc-800 text-xs">
              <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setActivePreviewMode("canvas")}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                    activePreviewMode === "canvas"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Live Code
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewMode("simulator")}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                    activePreviewMode === "simulator"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Scan Simulator
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsScanningActive(!isScanningActive)}
                className={`px-2.5 py-1 rounded-md border text-[11px] font-medium transition flex items-center gap-1.5 ${
                  isScanningActive
                    ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                    : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-300"
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Laser {isScanningActive ? "ON" : "OFF"}</span>
              </button>
            </div>

            {/* QR Canvas / Simulator Display Box */}
            <div className="my-5 relative w-full aspect-square max-w-[340px] flex items-center justify-center rounded-2xl bg-zinc-950 border border-zinc-800/80 shadow-inner overflow-hidden">
              {/* Particle Canvas Overlay for Celebration */}
              <canvas
                ref={particleCanvasRef}
                className="absolute inset-0 pointer-events-none z-30 w-full h-full"
              />

              {activePreviewMode === "canvas" ? (
                <div ref={qrContainerRef} className="relative p-4 flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full max-h-full rounded-lg shadow-sm"
                    style={{ width: "270px", height: "270px" }}
                  />

                  {/* Sleek anime.js scanning beam line */}
                  {isScanningActive && (
                    <div
                      ref={scanBeamRef}
                      className="absolute inset-x-4 top-4 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent pointer-events-none opacity-85 shadow-[0_0_8px_rgba(59,130,246,0.8)] z-10"
                    />
                  )}
                </div>
              ) : (
                /* Scanner Simulator Mode */
                <div className="w-full h-full p-5 flex flex-col justify-between text-left text-xs bg-zinc-950/90 select-none animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-[11px] font-semibold text-blue-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Smartphone Camera Decoded
                    </span>
                    <span className="text-[10px] text-zinc-500 uppercase">{contentType}</span>
                  </div>

                  <div className="my-auto space-y-3 bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                        {TABS.find((t) => t.id === contentType)?.icon ? (
                          (() => {
                            const TIcon = TABS.find((t) => t.id === contentType)!.icon;
                            return <TIcon className="w-4 h-4" />;
                          })()
                        ) : (
                          <Link2 className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 truncate">
                        <p className="text-xs font-semibold text-zinc-100 truncate">
                          {contentType === "wifi"
                            ? `Connect to: ${wifiSsid}`
                            : contentType === "vcard"
                            ? `${vcardFirst} ${vcardLast}`
                            : contentType === "url"
                            ? urlInput
                            : contentType === "email"
                            ? `Email to: ${emailTo}`
                            : contentType === "phone"
                            ? `Call ${phoneNum}`
                            : contentType === "crypto"
                            ? `Send ${cryptoAmount} ${cryptoCoin.toUpperCase()}`
                            : "Decoded Message"}
                        </p>
                        <p className="text-[10px] text-zinc-400 truncate">
                          {contentType === "wifi"
                            ? `Security: ${wifiEncryption} | Password: ${wifiPassword}`
                            : contentType === "vcard"
                            ? `${vcardOrg} · ${vcardEmail}`
                            : encodedPayload}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-800 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyRawPayload}
                        className="flex-1 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs text-center transition"
                      >
                        Simulate Device Action
                      </button>
                    </div>
                  </div>

                  <div className="text-[10px] text-zinc-500 text-center">
                    Simulates iOS Camera & Android Google Lens instant banner
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Buttons Toolbar */}
            <div className="w-full grid grid-cols-2 gap-2">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDownloadPng(exportSize)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow transition"
              >
                <Download className="w-4 h-4" />
                <span>Download PNG</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownloadSvg}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold text-xs border border-zinc-700 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download SVG</span>
              </motion.button>
            </div>

            {/* Secondary Copy / Share row */}
            <div className="w-full grid grid-cols-3 gap-2 mt-2">
              <button
                type="button"
                onClick={handleCopyImage}
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 text-xs border border-zinc-800 transition"
              >
                {copiedState === "image" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedState === "image" ? "Copied!" : "Copy Img"}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyRawPayload}
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 text-xs border border-zinc-800 transition"
              >
                {copiedState === "payload" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Share2 className="w-3.5 h-3.5" />
                )}
                <span>{copiedState === "payload" ? "Copied!" : "Copy Raw"}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 text-xs border border-zinc-800 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Quick Payload Inspector Card */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="font-semibold text-zinc-300">Raw Encoded Stream</span>
              <span className="font-mono text-[10px]">{encodedPayload.length} Chars</span>
            </div>
            <p className="font-mono text-[11px] text-zinc-400 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80 break-all select-all max-h-20 overflow-y-auto">
              {encodedPayload}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
