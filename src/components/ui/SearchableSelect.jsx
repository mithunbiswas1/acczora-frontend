// src/components/ui/SearchableSelect.jsx

"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Universal In-Field SearchableSelect component conforming to Acczora UI standards.
 * Features inline direct-in-field searching with instant dropdown filtering,
 * keyboard navigation, and full custom option rendering.
 */
const SearchableSelect = ({
  value,
  onChange = () => {},
  label,
  id,
  name,
  required = false,
  placeholder = "Search or select...",
  options = [],
  error,
  helperText,
  disabled = false,
  clearable = true,
  showDescription = false,
  size = "md",
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Normalize options to { label, value, icon, description, raw }
  const normalizedOptions = useMemo(() => {
    return (Array.isArray(options) ? options : []).map((opt) => {
      const val = opt.value ?? opt._id ?? opt.id ?? opt.method_name ?? opt;
      const lbl = opt.label ?? opt.name ?? opt.method_name ?? String(val);
      const icon = opt.icon || opt.image;
      return {
        label: lbl,
        value: String(val ?? ""),
        icon: icon,
        image: icon,
        description: opt.description,
        cost: opt.cost,
        raw: opt,
      };
    });
  }, [options]);

  // Find currently selected option
  const selectedOption = useMemo(() => {
    if (value === undefined || value === null) return null;
    return normalizedOptions.find((opt) => String(opt.value) === String(value)) || null;
  }, [normalizedOptions, value]);

  // Sync display query with selected option when closed
  useEffect(() => {
    if (!isOpen) {
      setQuery(selectedOption ? selectedOption.label : "");
    }
  }, [selectedOption, isOpen]);

  // Filter options based on typed query in the field
  const filteredOptions = useMemo(() => {
    if (!query.trim()) return normalizedOptions;
    // When query matches the selected option's label exactly, show full list so user can change selection
    if (
      selectedOption &&
      query.trim().toLowerCase() === selectedOption.label.trim().toLowerCase()
    ) {
      return normalizedOptions;
    }
    const cleanQuery = query.toLowerCase().trim();
    return normalizedOptions.filter((opt) =>
      opt.label.toLowerCase().includes(cleanQuery)
    );
  }, [normalizedOptions, query, selectedOption]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        // Revert query to selected option label
        setQuery(selectedOption ? selectedOption.label : "");
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedOption]);

  // Auto-scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedEl = listRef.current.children[highlightedIndex];
      if (highlightedEl) {
        highlightedEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex]);

  const handleSelect = (option) => {
    if (typeof onChange === "function") {
      onChange({
        target: {
          name: name || id,
          value: option.value,
        },
      });
    }
    setQuery(option.label);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (typeof onChange === "function") {
      onChange({
        target: {
          name: name || id,
          value: "",
        },
      });
    }
    setQuery("");
    setIsOpen(true);
    setHighlightedIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
        return;
      }
    }

    if (isOpen) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        } else if (filteredOptions.length === 1) {
          handleSelect(filteredOptions[0]);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        setQuery(selectedOption ? selectedOption.label : "");
      }
    }
  };

  const sizeClasses = {
    sm: "h-9 text-xs px-2.5",
    md: "h-11 text-xs sm:text-sm px-3.5",
    lg: "h-12 text-sm px-4",
  };

  return (
    <div className={cn("space-y-1.5 w-full", className)}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-gray-800"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative w-full" ref={wrapperRef}>
        {/* Main In-Field Search Input Container */}
        <div
          onClick={() => {
            if (!disabled && inputRef.current) {
              inputRef.current.focus();
              setIsOpen(true);
            }
          }}
          className={cn(
            "flex items-center rounded-xl border bg-white transition-all shadow-xs cursor-text",
            sizeClasses[size] || sizeClasses.md,
            isOpen
              ? "border-[#5b52f9] ring-2 ring-[#5b52f9]/20"
              : "border-border hover:border-gray-400",
            error && "border-rose-400 ring-2 ring-rose-400/20",
            disabled && "opacity-50 bg-gray-50 cursor-not-allowed"
          )}
        >
          {/* Leading Icon: Selected Option Image/Icon or Search Icon */}
          {selectedOption?.icon && !isOpen ? (
            typeof selectedOption.icon === "string" ? (
              <img
                src={selectedOption.icon || "/review_avater.jpg"}
                alt={selectedOption.label}
                className="w-5 h-5 rounded-md object-cover flex-shrink-0 mr-2"
                onError={(e) => {
                  e.currentTarget.src = "/review_avater.jpg";
                }}
              />
            ) : (
              <span className="flex-shrink-0 mr-2">{selectedOption.icon}</span>
            )
          ) : (
            <Search
              size={15}
              className={cn(
                "mr-2.5 flex-shrink-0 transition-colors",
                isOpen ? "text-[#5b52f9]" : "text-gray-400"
              )}
            />
          )}

          {/* Direct In-Field Search Input */}
          <input
            ref={inputRef}
            id={id}
            name={name}
            type="text"
            disabled={disabled}
            value={query}
            placeholder={placeholder}
            onClick={() => {
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={(e) => {
              setIsOpen(true);
              e.target.select();
            }}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isOpen) setIsOpen(true);
              setHighlightedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-xs sm:text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none"
            autoComplete="off"
          />

          {/* Right Action Icons: Clear & Toggle Dropdown Chevron */}
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-2 text-gray-400">
            {clearable && (query || selectedOption) && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                title="Clear"
              >
                <X size={13} />
              </button>
            )}
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled) {
                  setIsOpen((prev) => !prev);
                  if (!isOpen && inputRef.current) {
                    inputRef.current.focus();
                  }
                }
              }}
              className="p-1 text-gray-400 hover:text-gray-700 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronDown
                size={15}
                className={cn(
                  "transition-transform duration-200",
                  isOpen && "transform rotate-180 text-[#5b52f9]"
                )}
              />
            </button>
          </div>
        </div>

        {/* Live Filtered Dropdown List Menu */}
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="max-h-60 overflow-y-auto p-1.5">
              {filteredOptions.length > 0 ? (
                <ul className="space-y-0.5" ref={listRef}>
                  {filteredOptions.map((option, index) => {
                    const isSelected = String(option.value) === String(value);
                    const isHighlighted = highlightedIndex === index;

                    return (
                      <li
                        key={String(option.value)}
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevent input blur before click registers
                          handleSelect(option);
                        }}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors",
                          isSelected
                            ? "bg-[#5b52f9]/10 text-[#5b52f9] font-semibold"
                            : isHighlighted
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {option.icon ? (
                            typeof option.icon === "string" ? (
                              <img
                                src={option.icon}
                                alt={option.label}
                                className="w-6 h-6 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                                onError={(e) => {
                                  e.currentTarget.src = "/review_avater.jpg";
                                }}
                              />
                            ) : (
                              <span className="flex-shrink-0">{option.icon}</span>
                            )
                          ) : null}
                          <span className="truncate font-medium text-gray-800">{option.label}</span>
                          {showDescription && option.description && (
                            <span className="text-[11px] text-gray-400 truncate">
                              ({option.description})
                            </span>
                          )}
                        </div>
                        {isSelected && (
                          <Check size={14} className="text-[#5b52f9] flex-shrink-0 ml-2" />
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="px-4 py-5 text-center text-xs text-gray-400">
                  {query ? `No matching options for "${query}"` : "No options available"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Validation Error Message */}
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="text-[11px] text-gray-400 mt-1">{helperText}</p>
      )}
    </div>
  );
};

export default SearchableSelect;
export { SearchableSelect };
