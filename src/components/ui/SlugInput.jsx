// src/components/ui/SlugInput.jsx

"use client";

import { useState } from "react";
import { Link2, RefreshCw, Copy, Check } from "lucide-react";
import { toast } from "sonner";

/**
 * Utility to convert raw text into a clean URL-friendly slug
 */
export function sanitizeSlug(text = "") {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove non-word characters except hyphen
    .replace(/[\s_-]+/g, "-") // replace spaces and underscores with hyphen
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
}

/**
 * Reusable SlugInput component with prefix, auto-formatting, and sync actions.
 *
 * @param {Object} props
 * @param {string} props.value - Current slug value
 * @param {Function} props.onChange - Change handler (receives sanitized slug string or event)
 * @param {string} [props.sourceValue] - Source title/name to sync from
 * @param {string} [props.prefix="/"] - URL prefix (e.g. "acczora.com/", "/category/", "/")
 * @param {string} [props.label="Slug"] - Label for the input
 * @param {boolean} [props.required=false] - Whether required
 * @param {string} [props.placeholder="e.g. netflix-premium"] - Input placeholder
 * @param {string} [props.helperText] - Helper text below input
 * @param {string} [props.error] - Validation error message
 * @param {boolean} [props.disabled=false] - Disable input
 * @param {string} [props.className] - Additional class names
 */
export default function SlugInput({
  value = "",
  onChange,
  sourceValue = "",
  prefix = "/",
  label = "Slug",
  required = false,
  placeholder = "slug-name",
  error,
  disabled = false,
  className = "",
}) {
  const [copied, setCopied] = useState(false);

  // Handle manual typing
  const handleInputChange = (e) => {
    const rawVal = e.target.value;
    // Allow typing letters, numbers, and hyphens directly in lowercase
    const formatted = rawVal.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    if (typeof onChange === "function") {
      onChange(formatted);
    }
  };

  // On blur, clean up leading or trailing dashes
  const handleBlur = () => {
    const cleaned = sanitizeSlug(value);
    if (cleaned !== value && typeof onChange === "function") {
      onChange(cleaned);
    }
  };

  // Sync / Regenerate from source title
  const handleSyncFromSource = () => {
    if (!sourceValue?.trim()) {
      toast.error("Please enter a name first to generate a slug.");
      return;
    }
    const generated = sanitizeSlug(sourceValue);
    onChange?.(generated);
    toast.success("Slug updated from name!");
  };

  // Copy full slug URL to clipboard
  const handleCopy = () => {
    if (!value) return;
    const fullUrl = `${prefix.replace(/\/+$/, "")}/${value.replace(/^\/+/, "")}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    toast.success("Slug path copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {/* Label & Actions header */}
      <div className="flex items-center justify-between">
        {label && (
          <label className="block text-xs font-semibold text-gray-800">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}

        <div className="flex items-center gap-2">
          {/* Regenerate from name button */}
          {sourceValue && (
            <button
              type="button"
              onClick={handleSyncFromSource}
              disabled={disabled}
              className="text-[11px] text-[#5b52f9] hover:text-[#4f44eb] font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
              title="Regenerate slug from name"
            >
              <RefreshCw size={11} />
              <span>Sync</span>
            </button>
          )}

          {/* Copy full path button */}
          {value && (
            <button
              type="button"
              onClick={handleCopy}
              className="text-[11px] text-gray-400 hover:text-gray-700 font-medium flex items-center gap-1 transition-colors cursor-pointer"
              title="Copy path"
            >
              {copied ? (
                <>
                  <Check size={11} className="text-emerald-500" />
                  <span className="text-emerald-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={11} />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Input Group with Prefix */}
      <div
        className={`flex items-center h-11 w-full rounded-xl border bg-white overflow-hidden transition-all shadow-xs ${error
            ? "border-rose-400 ring-1 ring-rose-400"
            : "border-border hover:border-gray-400 focus-within:border-[#5b52f9] focus-within:ring-1 focus-within:ring-[#5b52f9]/20"
          } ${disabled ? "opacity-50 bg-gray-50 cursor-not-allowed" : ""}`}
      >
        {/* Prefix Pill */}
        <div className="h-full px-3.5 bg-gray-50 border-r border-border text-gray-500 text-xs font-mono select-none flex items-center gap-1 flex-shrink-0">
          <Link2 size={13} className="text-gray-400" />
          <span>{prefix}</span>
        </div>

        {/* Input element */}
        <input
          type="text"
          value={value || ""}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className="flex-1 h-full px-3.5 bg-transparent text-xs sm:text-sm font-mono text-gray-900 placeholder:text-gray-400 focus:outline-none"
        />
      </div>

      {/* Error or Helper text */}
      {error ? (
        <p className="text-[11px] text-rose-500 font-medium">{error}</p>
      ) : null}
    </div>
  );
}

export { SlugInput };
