// src/components/ui/DeleteModal.jsx

"use client";

import { useEffect } from "react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Confirmation",
  itemName = "",
  itemType = "item",
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
}) {
  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => !isLoading && onClose?.()}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-2xl z-10 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div className="p-6 sm:p-7">
          {/* Danger Icon */}
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mb-5">
            <Trash2 size={22} strokeWidth={2.2} />
          </div>

          {/* Heading */}
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">
            {title || `Delete ${itemType}?`}
          </h3>

          {/* Message / Description */}
          <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
            {message ? (
              message
            ) : itemName ? (
              <>
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900">
                  &ldquo;{itemName}&rdquo;
                </span>
                ? This action cannot be undone.
              </>
            ) : (
              `Are you sure you want to delete this ${itemType}? This action cannot be undone.`
            )}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-7 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs sm:text-sm font-semibold text-gray-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 size={15} className="animate-spin" />}
              <span>{confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { DeleteModal };
