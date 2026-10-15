// src/components/ui/ImageUpload.jsx

"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, X, Image as ImageIcon, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

/**
 * Reusable ImageUpload component with Drag & Drop support.
 *
 * @param {Object} props
 * @param {string|File|Array<string|File>} props.value - Single image (string URL or File) or array of images
 * @param {Function} props.onChange - Callback receiving the updated value (File/string or Array<File|string>)
 * @param {boolean} [props.multiple=false] - Whether multiple images can be uploaded
 * @param {number} [props.maxFiles=10] - Maximum number of files allowed in multiple mode
 * @param {number} [props.maxSizeMB=5] - Maximum size allowed per file in MB
 * @param {string} [props.label] - Optional field label
 * @param {string} [props.helperText] - Optional helper text below the dropzone
 * @param {boolean} [props.disabled=false] - Whether the input is disabled
 * @param {string} [props.className] - Additional wrapper class names
 */
export default function ImageUpload({
  value,
  onChange,
  multiple = false,
  maxFiles = 10,
  maxSizeMB = 5,
  label,
  helperText = "SVG, PNG, JPG, or WEBP (max. 5MB)",
  disabled = false,
  className = "",
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Normalize single vs multiple value into preview items: { raw: File|string, previewUrl: string, id: string }
  const [items, setItems] = useState([]);

  // Sync internal items whenever value prop changes
  useEffect(() => {
    if (!value) {
      setItems([]);
      return;
    }

    if (multiple) {
      const list = Array.isArray(value) ? value : [value];
      const normalized = list.map((v, index) => {
        const previewUrl =
          typeof v === "string" ? v : v instanceof File ? URL.createObjectURL(v) : "";
        return {
          id: `${index}-${typeof v === "string" ? v : v.name}`,
          raw: v,
          previewUrl,
          name: typeof v === "string" ? `Image ${index + 1}` : v.name,
        };
      });
      setItems(normalized);
    } else {
      const raw = Array.isArray(value) ? value[0] : value;
      if (!raw) {
        setItems([]);
        return;
      }
      const previewUrl =
        typeof raw === "string"
          ? raw
          : raw instanceof File
          ? URL.createObjectURL(raw)
          : "";
      setItems([
        {
          id: "single",
          raw,
          previewUrl,
          name: typeof raw === "string" ? "Uploaded Image" : raw.name,
        },
      ]);
    }
  }, [value, multiple]);

  // Validate file
  const validateFile = (file) => {
    if (!file.type.startsWith("image/")) {
      toast.error(`"${file.name}" is not a valid image file.`);
      return false;
    }
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast.error(`"${file.name}" exceeds ${maxSizeMB}MB limit.`);
      return false;
    }
    return true;
  };

  // Handle files selected or dropped
  const processFiles = (fileList) => {
    if (disabled || !fileList || fileList.length === 0) return;

    const validFiles = Array.from(fileList).filter(validateFile);
    if (validFiles.length === 0) return;

    if (multiple) {
      const currentList = Array.isArray(value) ? [...value] : value ? [value] : [];
      if (currentList.length + validFiles.length > maxFiles) {
        toast.error(`You can upload a maximum of ${maxFiles} images.`);
        return;
      }
      const nextList = [...currentList, ...validFiles];
      onChange?.(nextList);
    } else {
      // Single mode takes the first valid file
      onChange?.(validFiles[0]);
    }
  };

  // Drag and drop event handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!disabled && e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
    // Reset file input so selecting the same file triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove a single item or specific index in multiple
  const handleRemove = (indexToRemove, e) => {
    e?.stopPropagation();
    if (disabled) return;

    if (multiple) {
      const currentList = Array.isArray(value) ? [...value] : [];
      const updated = currentList.filter((_, idx) => idx !== indexToRemove);
      onChange?.(updated);
    } else {
      onChange?.(null);
    }
  };

  return (
    <div className={`space-y-2 w-full ${className}`}>
      {/* Optional Label */}
      {label && (
        <label className="block text-xs font-semibold text-gray-800">
          {label}
        </label>
      )}

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        disabled={disabled}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* =========================================================================
          MODE 1: SINGLE IMAGE UPLOAD
          If image exists, display full-area preview with hover actions.
          If empty, display full-size dropzone.
         ========================================================================= */}
      {!multiple && (
        <>
          {items.length > 0 && items[0].previewUrl ? (
            <div className="relative w-full h-52 sm:h-60 rounded-2xl border border-gray-200 bg-gray-50/50 overflow-hidden group transition-all shadow-xs">
              {/* Full Image Preview */}
              <img
                src={items[0].previewUrl}
                alt={items[0].name || "Image Preview"}
                className="w-full h-full object-contain p-2"
              />

              {/* Hover Overlay with Change & Remove Actions */}
              <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                  className="px-3.5 py-2 rounded-xl bg-white/90 hover:bg-white text-gray-900 text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw size={14} className="text-[#5b52f9]" />
                  <span>Change</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleRemove(0, e)}
                  disabled={disabled}
                  className="px-3.5 py-2 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>Remove</span>
                </button>
              </div>

              {/* Floating top-right remove badge for touch/mobile devices */}
              <button
                type="button"
                onClick={(e) => handleRemove(0, e)}
                disabled={disabled}
                className="sm:hidden absolute top-3 right-3 w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md cursor-pointer"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            /* Empty Single Dropzone */
            <div
              onClick={() => !disabled && fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`w-full py-9 px-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center ${
                isDragging
                  ? "border-[#5b52f9] bg-[#5b52f9]/5 ring-2 ring-[#5b52f9]/20"
                  : "border-gray-200 hover:border-[#5b52f9]/60 bg-gray-50/40 hover:bg-gray-50/80"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5b52f9] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <UploadCloud size={24} />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-800">
                Click to upload <span className="font-normal text-gray-500">or drag and drop</span>
              </p>
              {helperText && (
                <p className="text-[11px] text-gray-400 mt-1">{helperText}</p>
              )}
            </div>
          )}
        </>
      )}

      {/* =========================================================================
          MODE 2: MULTIPLE IMAGES UPLOAD
          Always shows dropzone at top, and thumbnail cards grid underneath.
         ========================================================================= */}
      {multiple && (
        <div className="space-y-4">
          {/* Multiple Dropzone */}
          <div
            onClick={() => !disabled && fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-full py-7 px-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center ${
              isDragging
                ? "border-[#5b52f9] bg-[#5b52f9]/5 ring-2 ring-[#5b52f9]/20"
                : "border-gray-200 hover:border-[#5b52f9]/60 bg-gray-50/40 hover:bg-gray-50/80"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#5b52f9] flex items-center justify-center mb-2.5">
              <UploadCloud size={22} />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-800">
              Upload multiple images <span className="font-normal text-gray-500">or drag them here</span>
            </p>
            {helperText && (
              <p className="text-[11px] text-gray-400 mt-1">
                {helperText} &bull; Up to {maxFiles} images
              </p>
            )}
          </div>

          {/* Mini Cards Grid for Uploaded Images */}
          {items.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500 px-1">
                <span className="font-semibold text-gray-700">
                  Uploaded Images ({items.length}/{maxFiles})
                </span>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onChange?.([])}
                    disabled={disabled}
                    className="text-rose-500 hover:text-rose-600 font-medium text-xs cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="group relative aspect-square rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden flex flex-col items-center justify-center p-1.5 transition-all hover:border-[#5b52f9]/40"
                  >
                    {/* Thumbnail Image */}
                    {item.previewUrl ? (
                      <img
                        src={item.previewUrl}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        <ImageIcon size={20} />
                      </div>
                    )}

                    {/* Image index badge */}
                    <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-[10px] font-semibold text-white pointer-events-none">
                      #{idx + 1}
                    </div>

                    {/* Delete button (Soft red squircle top-right) */}
                    <button
                      type="button"
                      onClick={(e) => handleRemove(idx, e)}
                      disabled={disabled}
                      className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition-all cursor-pointer opacity-90 group-hover:opacity-100"
                      title="Remove image"
                    >
                      <X size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                ))}

                {/* Quick Add More Tile if under max limit */}
                {items.length < maxFiles && (
                  <button
                    type="button"
                    onClick={() => !disabled && fileInputRef.current?.click()}
                    disabled={disabled}
                    className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-[#5b52f9] hover:bg-[#5b52f9]/5 flex flex-col items-center justify-center text-gray-400 hover:text-[#5b52f9] transition-all cursor-pointer group"
                  >
                    <UploadCloud size={20} className="mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-semibold">Add more</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { ImageUpload };
