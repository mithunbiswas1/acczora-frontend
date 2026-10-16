// src/components/ui/CredentialViewer.jsx

"use client";

import { useState } from "react";
import { Eye, EyeOff, Copy, Check, Download, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function CredentialViewer({
  credentials = [],
  productTitle = "Account Credentials",
  orderId = "",
  className = "",
}) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Normalize credentials into array of strings or objects
  const rawList = Array.isArray(credentials)
    ? credentials
    : typeof credentials === "string"
    ? credentials.split("\n").filter(Boolean)
    : [];

  const stringList = rawList.map((item) => {
    if (typeof item === "string") return item;
    if (item && typeof item === "object" && item.credential) return item.credential;
    return JSON.stringify(item);
  });

  const fullText = stringList.join("\n");

  const handleCopySingle = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    toast.success("Credential copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    if (!fullText) return;
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    toast.success("All credentials copied!");
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownload = () => {
    if (!fullText) return;
    const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${productTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${
      orderId || "credentials"
    }.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded credentials (.txt)!");
  };

  if (stringList.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-gray-50 border border-border text-xs text-gray-500 text-center">
        No credentials attached to this order.
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-border">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
          <ShieldCheck size={16} className="text-emerald-600" />
          <span>{stringList.length} Item(s) Delivered</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Reveal / Hide */}
          <button
            type="button"
            onClick={() => setIsRevealed(!isRevealed)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors shadow-2xs"
          >
            {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>{isRevealed ? "Hide" : "Reveal"}</span>
          </button>

          {/* Copy All */}
          <button
            type="button"
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors shadow-2xs"
          >
            {copiedAll ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copiedAll ? "Copied All" : "Copy All"}</span>
          </button>

          {/* Download */}
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6658ff] hover:bg-[#5546f0] text-xs font-semibold text-white transition-colors shadow-2xs"
          >
            <Download size={14} />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Credentials List */}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {stringList.map((cred, idx) => {
          const displayVal = isRevealed
            ? cred
            : cred.length > 12
            ? `${cred.substring(0, 4)}${"•".repeat(16)}${cred.substring(cred.length - 4)}`
            : "••••••••••••••••";

          return (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border bg-gray-50/70 font-mono text-xs group hover:bg-white transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-[10px] font-sans font-bold text-gray-400 select-none w-5">
                  #{idx + 1}
                </span>
                <span className="truncate select-all text-gray-900 font-medium">
                  {displayVal}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopySingle(cred, idx)}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors flex-shrink-0"
                title="Copy this credential"
              >
                {copiedIndex === idx ? (
                  <Check size={14} className="text-emerald-600" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
